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

## 📖 API Documentation

The complete API documentation with request/response examples is available on Postman:

**[📚 View API Documentation](https://documenter.getpostman.com/view/24559324/2sB34fngNk)**

### Available Endpoints:

- **Authentication**: `/api/auth`

  - POST `/register` - User registration
  - POST `/login` - User login
  - POST `/refresh` - Refresh access token
  - POST `/logout` - User logout
  - GET `/me` - Get current user

- **Tasks**: `/api/tasks`

  - GET `/` - Get all tasks (with filtering)
  - GET `/:id` - Get task by ID
  - POST `/` - Create new task
  - PUT `/:id` - Update task
  - DELETE `/:id` - Delete task

- **Categories**: `/api/categories`
  - GET `/` - Get all categories
  - GET `/:id` - Get category by ID
  - POST `/` - Create new category
  - PUT `/:id` - Update category
  - DELETE `/:id` - Delete category
