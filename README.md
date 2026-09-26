# SubTrack

SubTrack is a subscription-management application for tracking recurring services, subscription status, payment activity, account balance, and notifications. The repository contains a React + TypeScript frontend and a Java 21 / Spring Boot REST API backed by MySQL.

> **Branch note:** This documentation describes the Java migration on `master`. The `main` branch is intentionally unchanged and retains the original ASP.NET Core implementation.

## Contents
- [Features and current status](#features-and-current-status)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
- [Configuration](#configuration)
- [Java API overview](#java-api-overview)
- [Data model](#data-model)
- [Important implementation notes](#important-implementation-notes)
- [Frontend integration status](#frontend-integration-status)
- [Development checks](#development-checks)
- [Documentation](#documentation)
- [Known gaps and roadmap](#known-gaps-and-roadmap)

## Features and current status

The Java port currently provides:
- Account registration and login endpoints; passwords are hashed with BCrypt.
- JWT creation at login (token verification and authenticated request identity are not yet wired).
- Subscription create, list, update, status change, and delete endpoints.
- Payment processing against a user's stored balance, with a required idempotency-key field and transaction reference.
- Notification create, list, and mark-read endpoints.
- A simple health endpoint.

This is a **migration foundation**, not a production-ready service. See [Important implementation notes](#important-implementation-notes) and [Known gaps and roadmap](#known-gaps-and-roadmap) before deploying or relying on payment behavior.

## Architecture

```text
React 19 + TypeScript + Vite
          | HTTP / JSON
          v
Spring Boot 3 REST API (Java 21)
  Controllers -> DTOs / Entities -> Spring Data JPA
                                      |
                                      v
                                    MySQL
```

The API is organized by feature: controllers expose HTTP routes, DTO records define selected request payloads, JPA entities represent persisted records, repositories provide database access, and `JwtService` creates login tokens.

## Technology stack

| Area | Technologies |
|---|---|
| Backend | Java 21, Spring Boot 3.5.6, Spring Web, Spring Data JPA, Jakarta Validation, Spring Security, Maven |
| Persistence | MySQL Connector/J, Hibernate/JPA |
| Authentication building blocks | BCrypt password hashing, custom HS256 JWT creation |
| Frontend | React 19, TypeScript, Vite 8, React Router, Axios, React Hook Form, Tailwind CSS, Recharts |
| Tests | Spring Boot Starter Test is included; automated test coverage has not yet been established |

## Repository layout

```text
.
├── Client/                         # React + TypeScript app
│   ├── src/Components/             # Dashboard, subscriptions, payments, notifications, profile UI
│   ├── src/Pages/                  # Login and registration pages
│   ├── src/Services/               # Axios API service modules
│   └── package.json
├── Server/
│   ├── pom.xml                     # Maven / Spring Boot configuration
│   └── src/main/
│       ├── java/com/subtrack/
│       │   ├── config/             # Security configuration
│       │   ├── controller/         # REST endpoints
│       │   ├── dto/                # Request/response records
│       │   ├── entity/             # JPA entities and enums
│       │   ├── repository/         # Spring Data repositories
│       │   └── security/            # JWT creation
│       └── resources/application.properties
├── Documentation/                  # Project documentation
├── README.md
└── LICENSE
```

## Prerequisites

Install:
- JDK 21
- Maven 3.9 or newer
- MySQL 8.x (or a compatible MySQL server)
- Node.js and npm compatible with the Vite version in `Client/package.json`

## Local setup

### 1. Clone and select the Java branch

```bash
git clone https://github.com/chauhan12harsh/Subtrack.git
cd Subtrack
git switch master
```

### 2. Create a MySQL database

Create a database named `subtrack` (or configure another JDBC URL). The current Hibernate setting is `ddl-auto=validate`: it validates mappings against an existing schema and **does not create or migrate tables**. No versioned schema migration is currently included. Ensure the schema matches the JPA entity mappings before starting the API.

### 3. Configure the backend

Set the environment variables described below. In particular, set a non-empty `JWT_SECRET` of at least 32 characters for login token creation. Never commit real secrets.

### 4. Start the backend

From the repository root:

```bash
cd Server
mvn spring-boot:run
```

The API listens on port 8080 by default. Verify the process responds at `GET http://localhost:8080/health`.

### 5. Start the frontend

In a second terminal:

```bash
cd Client
npm install
npm run dev
```

The frontend's Axios client currently targets the legacy `https://localhost:7136/` API address. Update its base URL and endpoint contracts as part of frontend/backend integration; see [Frontend integration status](#frontend-integration-status).

## Configuration

The backend reads these environment variables through `Server/src/main/resources/application.properties`:

| Variable | Description | Default |
|---|---|---|
| `SERVER_PORT` | HTTP server port | `8080` |
| `DB_URL` | JDBC connection URL | `jdbc:mysql://localhost:3306/subtrack` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | empty |
| `JWT_SECRET` | HMAC signing secret used when creating tokens; use at least 32 characters | empty (login token creation fails until configured) |
| `JWT_ISSUER` | JWT issuer claim | `subtrack` |
| `JWT_AUDIENCE` | Documented configuration value; currently not emitted/validated by the JWT implementation | `subtrack-client` |

Example (Linux/macOS shell; use your own local values):

```bash
export DB_URL='jdbc:mysql://localhost:3306/subtrack'
export DB_USERNAME='root'
export DB_PASSWORD='your-local-password'
export JWT_SECRET='replace-with-a-long-random-local-development-secret'
export SERVER_PORT=8080
```

## Java API overview

Base URL: `http://localhost:8080` unless `SERVER_PORT` is changed.

| Method | Path | Purpose | Identity requirement |
|---|---|---|---|
| POST | `/auth/register` | Register an account | None |
| POST | `/auth/login` | Authenticate and return a JWT string | None |
| GET | `/health` | Health response | None |
| GET | `/subscriptions` | List subscriptions for supplied user ID | `X-User-Id` header |
| POST | `/subscriptions` | Create a subscription | `X-User-Id` header |
| PUT | `/subscriptions/{id}` | Update a subscription | `X-User-Id` header |
| PATCH | `/subscriptions/{id}/status?status=Active` | Change subscription status | `X-User-Id` header |
| DELETE | `/subscriptions/{id}` | Delete a subscription | `X-User-Id` header |
| GET | `/payments` | List payment records for supplied user ID | `X-User-Id` header |
| POST | `/payments` | Process a balance payment | `X-User-Id` header |
| GET | `/notifications` | List notifications for supplied user ID | `X-User-Id` header |
| POST | `/notifications` | Create a notification | `X-User-Id` header |
| PATCH | `/notifications/{id}/read` | Mark a notification as read | `X-User-Id` header |

**Important:** `X-User-Id` is a temporary caller-supplied identifier, not authentication. Security currently permits requests without validating JWTs. Do not expose this API to untrusted networks or use it with real payment value.

For request examples, enums, current behavior, and caveats, see [Documentation/API.md](Documentation/API.md).

## Data model

The current JPA model includes:

- **User** — UUID identifier, username, email, password hash, balance, created timestamp, and role.
- **Subscription** — UUID identifier, owning user ID, name, amount, category, billing cycle, status, and next billing timestamp.
- **Payment** — UUID identifier, user/subscription IDs, amount, status, payment timestamp, and unique transaction reference.
- **Notification** — notification ownership, title/message/type, and read/creation metadata.

Amounts use `BigDecimal`; timestamps use `Instant` and Hibernate is configured for UTC. Database DDL/migrations are not yet version-controlled; review the entity classes and verify the actual schema before use.

## Important implementation notes

### Authentication and authorization
Registration hashes passwords using BCrypt. Login returns a signed HS256 JWT with subject, role, issuer, and expiration. However, the Spring Security filter chain currently permits all requests and does not verify bearer tokens or establish a trusted authenticated principal. Resource endpoints use `X-User-Id`; this can be spoofed and must be replaced before deployment.

### Payments and idempotency
The payment endpoint checks for a positive amount, requires an `idempotencyKey`, verifies subscription ownership and available balance, subtracts the balance, and records a successful payment in a transaction. The key is stored as a unique transaction reference. The current duplicate lookup is not a complete idempotency design: it does not guarantee safe concurrent retries, does not validate that a repeated key has the same request payload, and is not a dedicated durable idempotency ledger. Do not treat this as production-grade payment processing.

### Error handling and API compatibility
The Java port is not yet guaranteed to match the previous ASP.NET API's routes, DTO shapes, status codes, or frontend expectations. The route list above describes the current Java controllers only.

## Frontend integration status

The frontend source still contains legacy route patterns (for example, `/payment/process`, `/subscription/create`, and `notification/my`) and a legacy API base URL. The Java backend exposes the routes in the API table above. Align `Client/src/Services/*`, authentication token handling, CORS configuration, and response types before expecting the existing UI to work end-to-end with this Java API.

## Development checks

Backend:
```bash
cd Server
mvn test
mvn spring-boot:run
```

Frontend:
```bash
cd Client
npm run lint
npm run build
```

These are suggested local checks; they have **not been reported as passing** for this migration. Add controller, repository, security, payment concurrency/idempotency, and frontend integration tests as part of the port.

## Documentation

- [Java application documentation (PDF)](Documentation/SubTrack_Java_Documentation.pdf)

- [API reference and examples](Documentation/API.md)
- [Architecture, migration notes, and development roadmap](Documentation/DEVELOPMENT.md)
- [Backend-specific notes](Server/README.md)
- [Frontend-specific notes](Client/README.md)

## Known gaps and roadmap

1. Validate JWT bearer tokens and derive user identity from the authenticated principal; remove caller-controlled identity headers.
2. Implement schema migrations and document a reproducible database setup.
3. Design concurrency-safe, payload-aware idempotency and test simultaneous retries and balance updates.
4. Align Java endpoint paths/DTOs with the frontend or update the frontend service layer and response types.
5. Port remaining account/profile/password and billing behavior from the original application as required.
6. Add automated unit, repository, API, security, and integration tests; verify builds against supported Java/MySQL versions.
7. Configure CORS, secrets, logging, monitoring, and deployment-specific hardening.

## License

See [LICENSE](LICENSE).
