package com.subtrack.controller;

import com.subtrack.entity.*;
import com.subtrack.enums.NotificationType;
import com.subtrack.repository.NotificationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final NotificationRepository repo;

    public NotificationController(NotificationRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Notification> list(@RequestHeader("X-User-Id") UUID userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping
    public Notification create(@RequestHeader("X-User-Id") UUID userId, @RequestBody Request r) {
        return repo.save(new Notification(userId, r.title(), r.message(), r.type()));
    }

    @PatchMapping("/{id}/read")
    public Notification markRead(@RequestHeader("X-User-Id") UUID userId, @PathVariable UUID id) {
        Notification n = repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        n.markRead();
        return repo.save(n);
    }

    public record Request(String title, String message, NotificationType type) {
    }
}