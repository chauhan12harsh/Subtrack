package com.subtrack.controller;
import com.subtrack.dto.SubscriptionDtos; import com.subtrack.entity.*; import com.subtrack.repository.SubscriptionRepository; import jakarta.validation.Valid; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException; import java.util.*; import java.time.Instant;
@RestController @RequestMapping("/subscriptions")
public class SubscriptionController {
private final SubscriptionRepository repo; public SubscriptionController(SubscriptionRepository repo){this.repo=repo;}
@GetMapping public List<Subscription> list(@RequestHeader("X-User-Id") UUID userId){return repo.findByUserId(userId);}
@PostMapping public Subscription create(@RequestHeader("X-User-Id") UUID userId,@Valid @RequestBody SubscriptionDtos.Create r){return repo.save(new Subscription(userId,r.name(),r.amount(),r.category(),r.billingCycle(),r.nextBillingDate()==null?Instant.now():r.nextBillingDate()));}
@PutMapping("/{id}") public Subscription update(@RequestHeader("X-User-Id") UUID userId,@PathVariable UUID id,@RequestBody SubscriptionDtos.Update r){Subscription s=repo.findByIdAndUserId(id,userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));s.update(r.name(),r.amount(),r.category(),r.billingCycle(),r.nextBillingDate());return repo.save(s);}
@PatchMapping("/{id}/status") public Subscription status(@RequestHeader("X-User-Id") UUID userId,@PathVariable UUID id,@RequestParam BillingStatus status){Subscription s=repo.findByIdAndUserId(id,userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));s.setStatus(status);return repo.save(s);}
@DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@RequestHeader("X-User-Id") UUID userId,@PathVariable UUID id){Subscription s=repo.findByIdAndUserId(id,userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));repo.delete(s);}
}