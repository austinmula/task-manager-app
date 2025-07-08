# Task Manager API

This is the backend API for the Task Manager application, built with Node.js, Express, TypeScript, Prisma, and Neon Postgres.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set your database connection string in `.env` (already set for Neon).
3. Run database migrations and generate Prisma client:
   ```sh
   npx prisma migrate dev
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## API Endpoints

- `GET /tasks` - List all tasks
- `GET /tasks/:id` - Get a task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
