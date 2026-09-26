package com.subtrack.repository;

import com.subtrack.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    boolean existsByTransactionReference(String transactionReference);
}
