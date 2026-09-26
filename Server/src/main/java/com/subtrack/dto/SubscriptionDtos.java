package com.subtrack.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;

import com.subtrack.enums.BillingCycle;

public final class SubscriptionDtos {
    private SubscriptionDtos() {
    }

    public record Create(@NotBlank String name, @PositiveOrZero BigDecimal amount, String category,
            @NotNull BillingCycle billingCycle, Instant nextBillingDate) {
    }

    public record Update(String name, @PositiveOrZero BigDecimal amount, String category, BillingCycle billingCycle,
            Instant nextBillingDate) {
    }
}