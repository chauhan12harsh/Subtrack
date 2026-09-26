# Java backend migration

The Spring Boot application is being introduced under this directory using Java 21, Spring Web, Spring Data JPA, Bean Validation, Spring Security, and MySQL.

This is an incremental migration commit. The existing .NET backend is intentionally retained until the Java controllers, services, authentication, payment consistency/idempotency, tests, and schema migration are implemented and verified. Do not run both applications against the same schema until the database mapping is reconciled.

Configuration is supplied through environment variables: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_ISSUER`, `JWT_AUDIENCE`, and `JWT_SECRET`. No credentials are committed.
