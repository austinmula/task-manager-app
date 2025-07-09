# Task Manager API

A modern RESTful API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL (Neon). Features JWT authentication with refresh tokens and a well-structured MVC architecture.

## 🏗️ Project Structure

```
src/
├── controllers/     # Business logic
├── middleware/      # Authentication & validation
├── routes/         # API route definitions
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env` and update the values:

   ```bash
   DATABASE_URL="your_neon_postgres_url"
   ACCESS_TOKEN_SECRET="your_access_secret"
   REFRESH_TOKEN_SECRET="your_refresh_secret"
   ```

3. **Database Setup:**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Endpoints

| Method | Endpoint             | Description          | Auth Required |
| ------ | -------------------- | -------------------- | ------------- |
| POST   | `/api/auth/register` | User registration    | ❌            |
| POST   | `/api/auth/login`    | User login           | ❌            |
| POST   | `/api/auth/refresh`  | Refresh access token | ❌            |
| POST   | `/api/auth/logout`   | Logout user          | ❌            |
| GET    | `/api/auth/me`       | Get current user     | ✅            |

## 📝 Task Endpoints

| Method | Endpoint         | Description     | Auth Required |
| ------ | ---------------- | --------------- | ------------- |
| GET    | `/api/tasks`     | Get all tasks   | ✅            |
| GET    | `/api/tasks/:id` | Get task by ID  | ✅            |
| POST   | `/api/tasks`     | Create new task | ✅            |
| PUT    | `/api/tasks/:id` | Update task     | ✅            |
| DELETE | `/api/tasks/:id` | Delete task     | ✅            |

## 🔑 Authentication Flow

1. **Register/Login** → Receive `accessToken` & `refreshToken`
2. **API Requests** → Include `Authorization: Bearer <accessToken>`
3. **Token Refresh** → Use `refreshToken` to get new `accessToken`
4. **Logout** → Invalidate `refreshToken`

## 💡 Features

- ✅ JWT Authentication with Refresh Tokens
- ✅ Input Validation & Sanitization
- ✅ Secure Password Hashing (bcrypt)
- ✅ TypeScript Support
- ✅ MVC Architecture
- ✅ Error Handling
- ✅ Database Migrations with Prisma
- ✅ Environment Configuration
