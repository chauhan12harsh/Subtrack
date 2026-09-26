# SubTrack

A full-stack subscription management application with a React + TypeScript frontend and a Java Spring Boot backend.

> **Backend migration status:** The `master` branch now contains the Java backend in place of the former ASP.NET Core backend. The Java API is an in-progress port; see limitations below.

## Architecture

```text
React + TypeScript (Vite) -> Java 21 + Spring Boot REST API -> Spring Data JPA -> MySQL
```

## Current Java backend features
- Registration/login with BCrypt password hashing and JWT creation
- User, subscription, payment, and notification JPA entities
- Subscription CRUD/status endpoints
- Payment processing with balance checks and an idempotency-key input
- Notification create/list/read endpoints
- `GET /health` health check

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login and return JWT |
| GET | `/health` | Health check |
| GET/POST | `/subscriptions` | List/create subscriptions |
| PUT | `/subscriptions/{id}` | Update subscription |
| PATCH | `/subscriptions/{id}/status?status={status}` | Change status |
| DELETE | `/subscriptions/{id}` | Delete subscription |
| GET/POST | `/payments` | List/process payments |
| GET/POST | `/notifications` | List/create notifications |
| PATCH | `/notifications/{id}/read` | Mark notification read |

Subscription, payment, and notification routes currently use an `X-User-Id` header for scoping. This is transitional plumbing, **not authentication**. Do not expose this API publicly; JWT validation and authenticated-principal ownership checks remain to be implemented.

## Stack

**Backend:** Java 21, Spring Boot 3, Spring Web, Spring Data JPA, Jakarta Validation, Spring Security/BCrypt, MySQL Connector/J, Maven.

**Frontend:** React 19, TypeScript, Vite, Axios, React Router, React Hook Form, Tailwind CSS, Recharts.

## Project structure

```text
Subtrack/
├── Client/                       # React + TypeScript
├── Server/
│   ├── pom.xml
│   └── src/main/java/com/subtrack/
│       ├── config/ controller/ dto/ entity/ repository/ security/
│       └── (src/main/resources/application.properties)
└── README.md
```

## Prerequisites
- Java 21
- Maven 3.9+
- MySQL
- Node.js and npm for the frontend

## Configuration

Set environment variables:

| Variable | Purpose |
|---|---|
| `DB_URL` | JDBC URL; default `jdbc:mysql://localhost:3306/subtrack` |
| `DB_USERNAME` | Database username; default `root` |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Signing secret; at least 32 characters for token creation |
| `JWT_ISSUER` | Issuer; default `subtrack` |
| `JWT_AUDIENCE` | Audience; default `subtrack-client` |
| `SERVER_PORT` | Port; default `8080` |

Create the MySQL database first. Hibernate uses `ddl-auto=validate`, so the schema must match the entity mappings. A versioned database migration is not yet included. Do not commit secrets.

## Run locally

Backend:

```bash
cd Server
mvn spring-boot:run
```

Frontend, in another terminal:

```bash
cd Client
npm install
npm run dev
```

## Known migration gaps

This is a migration foundation, not yet a complete feature-equivalent or production-ready replacement. Remaining work includes JWT bearer validation and authorization, removal of `X-User-Id` identity headers, user profile/password/role API parity, schema migrations and real-MySQL verification, durable concurrency-safe idempotency, payment/renewal transactional parity, frontend response-contract alignment, automated tests, and a verified Maven build. Use locally for development only until these are addressed.

## License
MIT
