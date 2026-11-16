# TodoNestJSBackendDevelopment

A full-stack todo application with a React and TypeScript frontend and a NestJS REST API. Users can register and sign in, then create, edit, complete, filter, and delete their own tasks. The API uses JWT authentication and Prisma to store users and todos in PostgreSQL.

## Requirements

- Node.js and npm
- A running PostgreSQL database

## Run locally

### 1. Configure the backend

Create `backend/.env` with your PostgreSQL connection string and a private JWT signing key:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3000
```

Replace the connection string values with your PostgreSQL credentials and database name. `PORT` is optional; the API defaults to `3000`.

### 2. Install dependencies and prepare the database

In a terminal, from the repository root:

```bash
cd backend
npm install
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
```

The database named in `DATABASE_URL` must already exist.

### 3. Start the API

In the `backend` directory:

```bash
npm run start:dev
```

The API is available at `http://localhost:3000/api`.

### 4. Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The frontend is configured to send API requests to `http://localhost:3000/api`.

## Main API routes

- `POST /api/auth/register` and `POST /api/auth/login` — create an account and sign in
- `GET /api/auth/profile` — get the signed-in user's profile
- `/api/todo` — list and create the signed-in user's todos
- `/api/todo/:id` — update or delete a todo

Todo routes and the profile route require a JWT bearer token. The frontend stores the token after sign-in and attaches it to API requests.
