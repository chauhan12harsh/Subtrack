package com.subtrack.repository;

import com.subtrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsernameIgnoreCase(String username);
    Optional<User> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);
}
