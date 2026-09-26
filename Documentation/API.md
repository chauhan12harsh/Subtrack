# SubTrack API Reference (Java master)

This document describes the current Java Spring Boot controllers in the `master` branch. It is an implementation snapshot, not a promise of compatibility with the former ASP.NET API.

## Base URL

Default: `http://localhost:8080`. Configure with `SERVER_PORT`.

## Authentication caveat

Registration and login are public. Login creates a JWT, but JWT bearer validation is not implemented in the current security filter chain. Subscription, payment, and notification routes instead require a caller-supplied `X-User-Id` UUID header. This header is not trustworthy authentication and must not be used in a public or production deployment.

## Health

### `GET /health`

Returns a simple status object.

Example response:
```json
{"status":"ok"}
```

## Authentication

### `POST /auth/register`

Request:
```json
{
  "username": "sampleuser",
  "email": "user@example.com",
  "password": "a-local-password"
}
```

Current validation: username 5–50 characters, valid email, password 8–100 characters. Duplicate email/username returns HTTP 409. Password is stored as a BCrypt hash.

Response contains `id`, `username`, `email`, `balance`, and `role`; it does not return the password.

### `POST /auth/login`

Request:
```json
{
  "emailOrUsername": "user@example.com",
  "password": "a-local-password"
}
```

Response:
```json
{"token":"<signed-jwt>"}
```

Invalid credentials return HTTP 401. Token creation requires `JWT_SECRET` to contain at least 32 characters. The generated token has an expiration of 24 hours and includes issuer, subject (user UUID), and role claims. Current implementation does not include audience validation.

## Subscriptions

All routes below require `X-User-Id: <user-uuid>`.

### `GET /subscriptions`

Returns subscriptions owned by the supplied user ID.

### `POST /subscriptions`

Request:
```json
{
  "name": "Music plan",
  "amount": 199.00,
  "category": "Entertainment",
  "billingCycle": "Monthly",
  "nextBillingDate": "2026-10-26T00:00:00Z"
}
```

Required: nonblank `name`, `billingCycle`, and non-negative `amount`. `category` is optional and defaults to `Other`; `nextBillingDate` defaults to the current instant when omitted. Supported billing cycles: `Monthly`, `Quarterly`, `HalfYearly`, `Yearly`. New subscriptions start with `Active` status.

### `PUT /subscriptions/{id}`

Updates the matching subscription belonging to the supplied user. The request may contain `name`, `amount`, `category`, `billingCycle`, and `nextBillingDate`; null fields are left unchanged. A missing or non-owned ID returns 404.

### `PATCH /subscriptions/{id}/status?status=Paused`

Supported statuses: `Active`, `Paused`, `Cancelled`. The `status` query parameter is required.

### `DELETE /subscriptions/{id}`

Deletes the matching user's subscription. Success returns HTTP 204. Missing/non-owned IDs return 404.

## Payments

All routes require `X-User-Id: <user-uuid>`.

### `GET /payments`

Returns payment records for the supplied user ID.

### `POST /payments`

Request:
```json
{
  "subscriptionId": "00000000-0000-0000-0000-000000000000",
  "amount": 199.00,
  "idempotencyKey": "client-generated-unique-request-key"
}
```

The amount must be greater than zero and the key must be nonblank. The subscription must belong to the supplied user and the user's balance must cover the amount. Insufficient balance returns HTTP 409; a missing user/subscription returns 404. A successful request deducts the balance and creates a `SUCCESS` payment with the key saved as its transaction reference.

**Idempotency limitation:** repeated keys are looked up as transaction references and return the existing matching payment. The current implementation is not safe against all concurrent duplicate requests and does not compare request payloads for key reuse. Treat as incomplete; use no real funds.

## Notifications

All routes require `X-User-Id: <user-uuid>`.

### `GET /notifications`

Returns notifications for the user, newest first.

### `POST /notifications`

Request:
```json
{
  "title": "Payment complete",
  "message": "Your payment was recorded.",
  "type": "PaymentSuccess"
}
```

Supported types: `PaymentSuccess`, `PaymentFailed`, `SubscriptionRenewed`, `SubscriptionPaused`, `SubscriptionCancelled`, `General`.

### `PATCH /notifications/{id}/read`

Marks the specified owned notification as read. Missing/non-owned IDs return 404.

## Current API limitations

- No JWT verification or trusted principal-based authorization.
- Identity header is caller-controlled.
- No OpenAPI/Swagger contract or standardized error envelope.
- Database migrations/schema bootstrap are not included; Hibernate validates mappings only.
- Route and response compatibility with the existing frontend has not been completed.
- Automated API and persistence tests are still required.
