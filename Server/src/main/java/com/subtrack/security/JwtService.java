package com.subtrack.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${subtrack.jwt.secret}")
    private String secret;

    @Value("${subtrack.jwt.issuer}")
    private String issuer;

    // Duration in seconds, not a JWT NumericDate timestamp.
    @Value("${subtrack.jwt.expiration}")
    private long expirationSeconds;

    public String create(String userId, String role) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("JWT_SECRET must contain at least 32 characters");
        }
        if (expirationSeconds <= 0) {
            throw new IllegalStateException("subtrack.jwt.expiration must be a positive duration in seconds");
        }

        long expirationTime = Instant.now().plusSeconds(expirationSeconds).getEpochSecond();
        String header = enc("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = enc("{\"iss\":\"" + issuer + "\",\"sub\":\"" + userId
                + "\",\"role\":\"" + role + "\",\"exp\":" + expirationTime + "}");
        String input = header + "." + payload;

        return input + "." + sign(input);
    }

    private String sign(String input) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private String enc(String s) {
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }
}
