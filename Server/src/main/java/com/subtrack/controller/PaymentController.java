package com.subtrack.controller;

import com.subtrack.entity.*;
import com.subtrack.enums.PaymentStatus;
import com.subtrack.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentRepository payments;
    private final UserRepository users;
    private final SubscriptionRepository subs;

    public PaymentController(PaymentRepository p, UserRepository u, SubscriptionRepository s) {
        payments = p;
        users = u;
        subs = s;
    }

    @GetMapping
    public List<Payment> list(@RequestHeader("X-User-Id") UUID userId) {
        return payments.findAll().stream().filter(p -> p.getUserId().equals(userId)).toList();
    }

    @PostMapping
    @Transactional
    public Payment process(@RequestHeader("X-User-Id") UUID userId, @RequestBody Request r) {
        if (r.amount() == null || r.amount().signum() <= 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");

        if (r.idempotencyKey() == null || r.idempotencyKey().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Idempotency-Key is required");

        if (payments.existsByTransactionReference(r.idempotencyKey()))
            return payments.findAll().stream().filter(p -> p.getTransactionReference().equals(r.idempotencyKey()))
                    .findFirst().orElseThrow();

        User user = users.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Subscription sub = subs.findByIdAndUserId(r.subscriptionId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (user.getBalance().compareTo(r.amount()) < 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient balance");

        user.setBalance(user.getBalance().subtract(r.amount()));
        users.save(user);
        
        return payments.save(new Payment(userId, sub.getId(), r.amount(), PaymentStatus.SUCCESS, r.idempotencyKey()));
    }

    public record Request(UUID subscriptionId, BigDecimal amount, String idempotencyKey) {
    }
}