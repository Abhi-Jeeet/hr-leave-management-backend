# HR Leave Management Backend

A RESTful API backend system for managing employee leave requests with role-based access control (RBAC). Built with Node.js, Express, MongoDB, and JWT authentication.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## ✨ Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Role-Based Access Control**: Two user roles - Employee and Manager
- **Leave Management**: Create, view, update, and delete leave requests
- **Status Management**: Managers can approve/reject leave requests
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Input Validation**: Joi schema validation for all requests
- **Error Handling**: Centralized error handling middleware
- **Unit Testing**: Comprehensive test suite with Jest and Supertest

## 🏗 Architecture

### System Architecture

The application follows a **3-tier MVC (Model-View-Controller)** architecture pattern:

```
┌─────────────────┐
│   Client/API    │
│   (HTTP/REST)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controllers    │ ◄─── Request validation (Joi)
│  (Business      │ ◄─── Authentication (JWT)
│   Logic)        │ ◄─── Authorization (RBAC)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Models      │
│  (Mongoose)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│   (Database)    │
└─────────────────┘
```

### Component Breakdown

#### **1. Routes Layer**
- Defines API endpoints and HTTP methods
- Maps requests to appropriate controllers
- Applies middleware for authentication and authorization

#### **2. Middleware Layer**
- **Authentication**: Verifies JWT tokens
- **Authorization**: Role-based permission checking (employee/manager)
- **Error Handling**: Catches and formats errors
- **Validation**: Input validation using Joi schemas

#### **3. Controller Layer**
- Handles business logic
- Validates request data
- Interacts with models
- Returns formatted responses

#### **4. Model Layer**
- Defines data schemas (Mongoose)
- Handles database operations
- Includes pre/post hooks (e.g., password hashing)

### Authentication Flow

```
1. User Login
   ├─► Validate credentials
   ├─► Generate JWT token
   └─► Return token + user data

2. Protected Request
   ├─► Extract token from Authorization header
   ├─► Verify token signature
   ├─► Decode user info (id, role)
   ├─► Check role permissions
   └─► Execute request
```

## 🛠 Technology Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs |
| **Validation** | Joi |
| **Documentation** | Swagger UI, YAML |
| **Testing** | Jest, Supertest, MongoDB Memory Server |
| **Dev Tools** | Nodemon, dotenv |

## 📁 Project Structure

```
hr-leave-management-backend/
│
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
├── jest.config.js               # Jest test configuration
├── swagger.yaml                 # API documentation
│
├── src/
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic (register, login, me)
│   │   └── leaveController.js   # Leave management logic
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── role.js              # Role-based authorization middleware
│   │   └── error.js             # Error handling middleware
│   │
│   ├── models/
│   │   ├── User.model.js        # User schema and methods
│   │   └── Leave.model.js       # Leave request schema
│   │
│   └── routes/
│       ├── auth.js              # Authentication routes
│       └── leaves.js            # Leave management routes
│
└── tests/
    └── routes.test.js           # Unit tests for API routes
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhi-Jeeet/hr-leave-management-backend.git
   cd hr-leave-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   ```

4. **Configure environment variables** (see below)

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

6. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Access the API**
   - API Base URL: `http://localhost:5000`
   - API Documentation: `http://localhost:5000/api-docs`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/hr-leave-management
# Or use MongoDB Atlas
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hr-leave-db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Test Database (optional)
MONGO_URI_TEST=mongodb://localhost:27017/hr-leave-test
```

### Security Notes
- **Never commit** the `.env` file to version control
- Use strong, random values for `JWT_SECRET` in production
- Use environment-specific MongoDB URIs

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Interactive Documentation
Visit `http://localhost:5000/api-docs` for full interactive Swagger documentation.

---

### 🔑 Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee"
  }
}
```

---

#### 2. Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee"
  }
}
```

---

#### 3. Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee"
}
```

---

### 📝 Leave Management Endpoints

#### 1. Create Leave Request (Employee)
```http
POST /api/leaves
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "startDate": "2025-12-20",
  "endDate": "2025-12-25",
  "reason": "Family vacation"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employee": "507f1f77bcf86cd799439011",
  "startDate": "2025-12-20T00:00:00.000Z",
  "endDate": "2025-12-25T00:00:00.000Z",
  "reason": "Family vacation",
  "status": "pending",
  "managerComment": "",
  "createdAt": "2025-12-12T10:00:00.000Z",
  "updatedAt": "2025-12-12T10:00:00.000Z"
}
```

---

#### 2. Get My Leaves (Employee)
```http
GET /api/leaves/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "employee": "507f1f77bcf86cd799439011",
    "startDate": "2025-12-20T00:00:00.000Z",
    "endDate": "2025-12-25T00:00:00.000Z",
    "reason": "Family vacation",
    "status": "pending",
    "managerComment": "",
    "createdAt": "2025-12-12T10:00:00.000Z"
  }
]
```

---

#### 3. Get All Leaves (Manager)
```http
GET /api/leaves
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected)

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "employee": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee"
    },
    "startDate": "2025-12-20T00:00:00.000Z",
    "endDate": "2025-12-25T00:00:00.000Z",
    "reason": "Family vacation",
    "status": "pending",
    "managerComment": "",
    "createdAt": "2025-12-12T10:00:00.000Z"
  }
]
```

---

#### 4. Update Leave Status (Manager)
```http
PATCH /api/leaves/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "approved",
  "managerComment": "Approved for the requested dates"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employee": "507f1f77bcf86cd799439011",
  "startDate": "2025-12-20T00:00:00.000Z",
  "endDate": "2025-12-25T00:00:00.000Z",
  "reason": "Family vacation",
  "status": "approved",
  "managerComment": "Approved for the requested dates",
  "updatedAt": "2025-12-12T11:00:00.000Z"
}
```

---

#### 5. Delete Leave (Employee - Pending Only)
```http
DELETE /api/leaves/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Deleted"
}
```

**Note:** Only the employee who created the leave can delete it, and only if status is "pending"

---

### 🔒 Authorization Rules

| Endpoint | Role Required | Notes |
|----------|--------------|-------|
| `POST /api/auth/register` | None | Public |
| `POST /api/auth/login` | None | Public |
| `GET /api/auth/me` | Authenticated | Any role |
| `POST /api/leaves` | Employee | Creates leave for self |
| `GET /api/leaves/me` | Authenticated | Views own leaves |
| `GET /api/leaves` | Manager | Views all leaves |
| `PATCH /api/leaves/:id/status` | Manager | Approve/reject leaves |
| `DELETE /api/leaves/:id` | Employee | Delete own pending leaves |

---

### ❌ Error Responses

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `400 Bad Request` - Invalid input/validation error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Email already registered
- `500 Internal Server Error` - Server error

**Example Error Response:**
```json
{
  "message": "\"email\" must be a valid email"
}
```

## 🧪 Testing

The project includes comprehensive unit tests for all API routes.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

Tests are located in the `tests/` directory and include:

1. **POST /api/auth/login** - Authentication and token generation
2. **POST /api/leaves** - Leave creation with employee role
3. **GET /api/leaves** - Fetching all leaves with manager role

### Test Features

- Uses **MongoDB Memory Server** for isolated, fast testing
- No external MongoDB instance required
- Automatic database cleanup between tests
- Full request/response validation
- JWT token verification

### Test Output Example

```
 PASS  tests/routes.test.js
  Route Tests
    POST /api/auth/login
      ✓ should return token when login is successful (267 ms)
    POST /api/leaves
      ✓ should create a leave when authenticated as employee (151 ms)
    GET /api/leaves
      ✓ should return all leaves when authenticated as manager (207 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## 📝 Development Workflow

### Adding New Features

1. **Create/Update Model** in `src/models/`
2. **Create Controller** logic in `src/controllers/`
3. **Define Routes** in `src/routes/`
4. **Add Middleware** if needed in `src/middleware/`
5. **Write Tests** in `tests/`
6. **Update Swagger** documentation in `swagger.yaml`

### Code Standards

- Use async/await for asynchronous operations
- Validate all inputs using Joi schemas
- Use `express-async-errors` for automatic error handling
- Follow RESTful API conventions
- Add JSDoc comments for complex functions


## 👤 Author

**Abhi-Jeeet**

- GitHub: [@Abhi-Jeeet](https://github.com/Abhi-Jeeet)
- Repository: [hr-leave-management-backend](https://github.com/Abhi-Jeeet/hr-leave-management-backend)



---

**Happy Coding! 🚀**