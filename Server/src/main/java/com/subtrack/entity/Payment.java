package com.subtrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.subtrack.enums.PaymentStatus;

@Entity
@Table(name = "Payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "subscription_id", nullable = false)
    private UUID subscriptionId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    @Column(name = "payment_date", nullable = false)
    private Instant paymentDate = Instant.now();

    @Column(name = "transaction_reference", nullable = false, unique = true)
    private String transactionReference;

    protected Payment() {}

    public Payment(UUID userId, UUID subscriptionId, BigDecimal amount,
                   PaymentStatus status, String transactionReference) {
        this.userId = userId;
        this.subscriptionId = subscriptionId;
        this.amount = amount;
        this.status = status;
        this.transactionReference = transactionReference;
    }

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public UUID getSubscriptionId() { return subscriptionId; }
    public BigDecimal getAmount() { return amount; }
    public PaymentStatus getStatus() { return status; }
    public Instant getPaymentDate() { return paymentDate; }
    public String getTransactionReference() { return transactionReference; }
    public void setStatus(PaymentStatus status) { this.status = status; }
}
