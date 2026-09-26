# SubTrack Java backend

Spring Boot 3 / Java 21 backend. Run with `cd Server && mvn spring-boot:run`.

Configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` (at least 32 characters), plus optional `JWT_ISSUER`, `JWT_AUDIENCE`, `SERVER_PORT`. A MySQL database/schema must be created and mapped to the entities.

**Migration status:** endpoints and persistence are being ported from the former ASP.NET implementation. This initial Java API is not yet production-ready: bearer-token verification/security principal integration, exact legacy response contracts, schema migrations, payment idempotency persistence/locking, and automated tests still require completion.