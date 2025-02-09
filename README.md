# Microservices API Documentation

## Project Overview
This project implements a microservices architecture using NestJS and MongoDB, featuring authentication and business logic services. The system uses TCP for inter-service communication and HTTP for external client interactions.

## Architecture

### Microservices
1. **Auth Service** (HTTP + TCP Client)
   - Handles user authentication and registration
   - Port: 3000 (HTTP)
   - Exposes public endpoints

2. **Business Service** (TCP Only)
   - Handles user management and business logic
   - Port: 3001 (TCP)
   - Internal service, not directly accessible

## Technical Stack
- **Framework**: NestJS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Transport**: TCP (inter-service), HTTP (external)

## Endpoints

### Auth Service (`localhost:3000`)

#### 1. Register User
```http
POST /register
```
- **Description**: Register a new user
- **Auth Required**: No
- **Request Body**:
  ```typescript
  {
    email: string;    // Valid email format
    password: string; // Minimum 6 characters
  }
  ```
- **Response**:
  ```typescript
  {
    message: string;
    userId: string;
  }
  ```

#### 2. Login
```http
POST /login
```
- **Description**: Authenticate user and get JWT token
- **Auth Required**: No
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response**:
  ```typescript
  {
    token: string; // JWT token
  }
  ```

#### 3. List Users
```http
GET /users
```
- **Description**: Get paginated list of users
- **Auth Required**: Yes (JWT)
- **Query Parameters**:
  ```typescript
  {
    page?: number;    // Default: 1
    limit?: number;   // Default: 10
    search?: string;  // Optional email search
  }
  ```
- **Response**:
  ```typescript
  {
    users: Array<{
      id: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }
  ```

## Data Models

### User Schema
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Project Structure
```
api/
├── apps/
│   ├── auth/                    # Auth Microservice
│   │   ├── src/
│   │   │   ├── dto/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── main.ts
│   │   └── test/
│   └── business/               # Business Microservice
│       ├── src/
│       │   ├── dto/
│       │   ├── business.controller.ts
│       │   ├── business.service.ts
│       │   └── main.ts
│       └── test/
├── libs/
│   └── common/                 # Shared code
│       ├── guards/
│       ├── pipes/
│       └── services/
└── prisma/
    └── schema.prisma
```

## Testing
Tests are implemented using Jest and include:
- Unit tests for controllers and services
- Integration tests for endpoints
- Mocked microservice communication

Run tests with:
```bash
# Run all tests
npm run test

# Run with coverage
npm run test:cov

# Run specific tests
npm run test apps/auth
npm run test apps/business
```

## Configuration

### Environment Variables
```env
DATABASE_URL="mongodb://localhost:27017/api"
JWT_SECRET="your_jwt_secret"
```

### TypeScript Path Aliases
```json
{
  "compilerOptions": {
    "paths": {
      "@/apps/*": ["apps/*"],
      "@/libs/*": ["apps/libs/*"]
    }
  }
}
```

## Running the Project

1. Get a MongoDB database in Atlas:

2. Install dependencies:
```bash
pnpm install
```

3. Generate Prisma client:
```bash
pnpm prisma generate
```

4. Start microservices:
```bash
# Start Business Service (TCP)
pnpm run start:dev business

# Start Auth Service (HTTP)
pnpm run start:dev auth
```

## API Documentation
Swagger documentation is available at:
```
http://localhost:3000/docs
```

## Security Considerations
- JWT authentication for protected endpoints
- Password hashing using bcrypt
- Rate limiting (if implemented)
- Input validation using Zod
- Microservices isolation


