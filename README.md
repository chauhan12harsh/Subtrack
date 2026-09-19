# 🚀 SubTrack

> **A full-stack subscription management platform for managing subscriptions, billing activity, payments, notifications, and user accounts.**

SubTrack is built with **React + TypeScript** on the frontend and a **single ASP.NET Core Web API** on the backend. The application uses a layered structure where controllers handle HTTP requests, services contain business logic, and Entity Framework Core manages persistence with SQL Server.

## 🏗️ Architecture

The main version of SubTrack is a **single ASP.NET Core Web API application**.

```text
React + TypeScript
        │
        │ HTTP / JSON
        ▼
ASP.NET Core Web API
        │
        ▼
Controllers
        │
        ▼
Service Layer
        │
        ▼
Entity Framework Core
        │
        ▼
SQL Server
```

### Backend request flow

1. React sends an HTTP request to the ASP.NET Core API.
2. A controller receives the request and obtains the authenticated user's identity when required.
3. The controller calls the appropriate service through an interface.
4. The service performs validation and business logic.
5. Entity Framework Core reads or updates SQL Server.
6. DTOs are returned as API responses.
7. Exceptions are handled centrally by the global exception middleware.

## 🔐 Authentication & Authorization

SubTrack uses **JWT bearer authentication** and ASP.NET Core authorization.

| Role | Access examples |
|---|---|
| **User** | Manage profile, subscriptions, payments, and notifications |
| **Admin** | Manage users and access system-wide data |
| **Worker** | Access protected renewal, payment, and notification operations intended for internal processing |

User-specific operations use the authenticated user's ID for ownership checks.

## 💡 Key Features

### Authentication & User Management

- User registration and login
- JWT token generation and validation
- User profile retrieval and updates
- Password changes
- Admin user listing
- Admin role management

### Subscription Management

- Create and update subscriptions
- View individual subscriptions
- View authenticated user's subscriptions
- Admin subscription access
- Subscription status management
- Subscription categories
- Next billing date tracking
- Due-subscription lookup
- Subscription renewal
- Admin subscription deletion

Supported billing cycles:

- Monthly
- Quarterly
- HalfYearly
- Yearly

Supported subscription statuses:

- Active
- Paused
- Cancelled

### Payments

- User-initiated payment processing
- Protected internal payment processing
- Payment lookup by ID
- Payment history by subscription
- User transaction history
- Admin transaction access
- Transaction reference generation
- Balance validation before processing

The current implementation simulates an external payment provider by generating a payment status internally.

### Notifications

- Create notifications through protected internal operations
- View the current user's notifications
- Unread notification count
- Mark individual notifications as read
- Mark all notifications as read
- Admin notification management

## 📡 API Overview

The backend exposes endpoints across authentication, user management, subscriptions, payments, and notifications.

### Authentication — `/auth`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/test` | API connectivity/test endpoint |

### User Management — `/user`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/user/profile` | Get authenticated user's profile |
| PATCH | `/user/update` | Update authenticated user's profile |
| PATCH | `/user/changepassword` | Change authenticated user's password |
| GET | `/user/alluser` | Admin: list users |
| PATCH | `/user/role/{userId}/{role}` | Admin: update a user's role |

### Subscriptions — `/subscription`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/subscription/create` | Create a subscription |
| PATCH | `/subscription/update/{subscriptionid}` | Update a subscription |
| GET | `/subscription/all` | Admin: list subscriptions |
| GET | `/subscription/{subscriptionid}` | Get a subscription by ID |
| GET | `/subscription/user-subscription` | Get authenticated user's subscriptions |
| PUT | `/subscription/status/{subscriptionid}/{status}` | Update subscription status |
| DELETE | `/subscription/{subscriptionid}` | Admin: delete a subscription |
| PATCH | `/subscription/renew/{subscriptionid}` | Renew a subscription |
| GET | `/subscription/due` | Get subscriptions due for renewal |
| GET | `/subscription/categories` | Get subscription categories |

### Payments — `/payment`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/payment/process` | Process a user payment |
| POST | `/payment/processinternal` | Process an internal payment |
| GET | `/payment/{paymentid}` | Get a payment by ID |
| GET | `/payment/subscription/{subscriptionId}` | Get payments for a subscription |
| GET | `/payment/transactions` | Get user's transaction history |
| GET | `/payment/all` | Admin: list all transactions |

### Notifications — `/notification`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/notification/create` | Create a notification through internal processing |
| GET | `/notification/my` | Get authenticated user's notifications |
| PATCH | `/notification/readall` | Mark all notifications as read |
| PATCH | `/notification/read/{notificationId}` | Mark a notification as read |
| GET | `/notification/unreadcount` | Get unread notification count |
| DELETE | `/notification/delete/{notificationId}` | Admin: delete a notification |
| GET | `/notification/all` | Admin: list notifications |

## 🧰 Tech Stack

### Backend

- C#
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Bearer Authentication
- Role-Based Authorization
- Dependency Injection
- DTOs
- Service Interfaces
- Custom Exceptions
- Global Exception Middleware
- EF Core Migrations

### Frontend

- React 19
- TypeScript
- Vite
- Axios
- React Hook Form
- React Router
- Tailwind CSS
- Recharts

### Development & Testing

- Visual Studio / VS Code
- Postman
- EF Core CLI / Migrations
- ESLint

## 📁 Project Structure

```text
Subtrack/
├── Client/
│   ├── src/
│   │   ├── Components/
│   │   ├── Config/
│   │   ├── Layouts/
│   │   ├── Pages/
│   │   ├── Routes/
│   │   ├── Services/
│   │   ├── Types/
│   │   └── Utils/
│   ├── package.json
│   └── vite.config.ts
│
├── Server/
│   ├── Controllers/
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── Dtos/
│   ├── Entities/
│   ├── Enums/
│   ├── Exceptions/
│   ├── Interfaces/
│   ├── Middlewares/
│   ├── Migrations/
│   ├── Services/
│   ├── Program.cs
│   └── Server.csproj
│
└── README.md
```

The backend remains one deployable application. Feature-specific folders organize responsibilities without creating separate deployed services.

## 🗄️ Database

The application uses **SQL Server through Entity Framework Core**.

`ApplicationDbContext` contains the main application data sets:

- User
- Subscription
- Payment
- Notification

The repository also contains an EF Core initial migration and model snapshot.

## 🔄 Payment & Renewal Flow

```text
User requests payment
        │
        ▼
Validate authenticated user
        │
        ▼
Check available balance
        │
   ┌────┴────┐
   │         │
  No        Yes
   │         │
   ▼         ▼
Error   Create payment
             │
             ▼
       Payment completed?
          │        │
         No       Yes
          │        │
          ▼        ▼
     Store result  Deduct balance
                     │
                     ▼
              Renew subscription
                     │
                     ▼
                Store result
```

The current implementation uses an internally generated payment status to simulate the result of an external payment provider. Successful payments deduct the user's balance and trigger subscription renewal.

## ⚠️ Error Handling

SubTrack uses custom exceptions and centralized middleware to translate application errors into HTTP responses.

| Exception | HTTP status |
|---|---:|
| `BadRequestException` | 400 Bad Request |
| `NotFoundException` | 404 Not Found |
| `AlreadyExistsException` | 409 Conflict |
| `AlreadyUpdatedException` | 409 Conflict |
| `InsufficientBalanceException` | 402 Payment Required |
| Unexpected exception | 500 Internal Server Error |

## 🚀 Getting Started

### Prerequisites

- .NET SDK 10
- Node.js and npm
- SQL Server
- Git
- Postman (optional)

### 1. Clone the repository

```bash
git clone https://github.com/chauhan12harsh/Subtrack.git
cd Subtrack
```

### 2. Configure the backend

Create the appropriate local configuration from the provided example configuration file and configure:

- SQL Server connection string
- JWT issuer
- JWT audience
- JWT signing key

Do not commit secrets or local connection strings to the repository.

### 3. Run the backend

```bash
dotnet restore Server/Server.csproj
dotnet run --project Server/Server.csproj
```

For HTTPS:

```bash
dotnet run --project Server/Server.csproj --launch-profile https
```

If required:

```bash
dotnet dev-certs https --trust
```

### 4. Run the frontend

```bash
cd Client
npm install
npm run dev
```

### 5. Apply database migrations

```bash
dotnet ef database update --project Server/Server.csproj
```

## 🧭 What to Explore First

1. **`Server/Program.cs`** — dependency injection, database, JWT, CORS, and middleware configuration.
2. **Controllers** — API surface and authorization rules.
3. **Service interfaces and implementations** — business logic.
4. **`ApplicationDbContext` and entities** — persistence model.
5. **`GlobalExceptionMiddleware`** — centralized error handling.
6. **`Client/src/Services`** — frontend API communication.
7. **Subscription and payment services** — core business workflow.

## 🎯 Engineering Highlights

- RESTful API design
- Layered application structure
- Dependency injection
- JWT authentication
- Role-based authorization
- User-resource ownership checks
- DTO-based API contracts
- Entity Framework Core
- SQL Server persistence
- Database migrations
- Custom exception handling
- Centralized middleware
- Subscription lifecycle management
- Payment transaction tracking
- Notification management
- React-to-API integration
- TypeScript frontend development
- API testing with Postman

## 📌 Project Status

SubTrack is an actively developed portfolio project focused on demonstrating **practical full-stack development, backend fundamentals, authentication/authorization, database integration, and business logic** in a maintainable single-application architecture.

## 📄 License

MIT
