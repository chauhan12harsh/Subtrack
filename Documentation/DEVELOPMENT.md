# Development and Migration Notes

## Current architecture

The Java backend uses Spring Boot 3.5.6 and Java 21. Feature controllers are in `Server/src/main/java/com/subtrack/controller`; JPA entities and enums are in `entity`; Spring Data repositories are in `repository`; request records are in `dto`. `JwtService` currently creates signed tokens, while `SecurityConfig` configures stateless requests but currently permits every request.

The React application is under `Client/`. Its service modules use Axios and were originally written against the former API routes. The frontend and Java API are not yet contract-aligned.

## Persistence and schema

Entities currently model User, Subscription, Payment, and Notification. IDs are UUIDs. Monetary values use `BigDecimal`; event/date fields use `Instant`. Hibernate is configured with `spring.jpa.hibernate.ddl-auto=validate`, so it expects an existing schema and does not create/update it. There are no committed Flyway/Liquibase migrations yet. Before testing, provision a schema that matches the entity mappings and verify against the intended MySQL version.

## Security work required

1. Add JWT bearer authentication and signature/expiry/issuer validation.
2. Populate a trusted Spring Security principal from the validated token.
3. Remove `X-User-Id` as an authorization source; derive user ownership from the principal.
4. Configure and test CORS for the frontend origin.
5. Add consistent unauthorized/forbidden responses and security tests.

## Payment correctness work required

Current payment processing is a starter implementation: it checks balance, subtracts funds, and inserts a payment within a transactional method. It uses a unique transaction reference for the supplied idempotency key and checks for an existing reference before processing.

For reliable payment semantics, design and test:
- A dedicated idempotency record scoped to the authenticated user and operation.
- A unique database constraint on the idempotency scope/key.
- Request-payload fingerprinting and deterministic replay of the stored outcome.
- Safe behavior for concurrent duplicate requests and concurrent balance deductions (locking or optimistic concurrency with retry).
- Atomic balance/payment/idempotency updates and explicit failure semantics.
- Integration tests using the real database engine, including simultaneous retries.

Do not represent the current implementation as production-grade idempotency or use real monetary value.

## Frontend/API alignment

The current client Axios base URL is hard-coded to the former HTTPS development API. Client service paths also differ from Java controller paths (examples: `/payment/process` versus `POST /payments`; `/subscription/create` versus `POST /subscriptions`). Update the API base URL through environment configuration, align routes and payload/response types, and verify login/session behavior after backend authentication is implemented.

## Suggested verification commands

Backend:
```bash
cd Server
mvn test
```

Frontend:
```bash
cd Client
npm ci
npm run lint
npm run build
```

These are recommended checks, not a claim that they have passed. Add unit, persistence, controller, security, contract, and end-to-end tests.

## Migration checklist

- [ ] Schema migrations and repeatable local database setup
- [ ] JWT validation and principal-based authorization
- [ ] Remove user identity headers
- [ ] Match frontend routes and response DTOs
- [ ] Complete profile/password/account parity as needed
- [ ] Durable, concurrency-safe idempotency and balance consistency
- [ ] Renewal/billing behavior and transaction boundaries
- [ ] API documentation/OpenAPI and consistent errors
- [ ] Backend/frontend automated tests and CI build verification
- [ ] Production configuration, secret management, CORS, logging, and deployment hardening
