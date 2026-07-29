# Kallipgur Coalition Aboriginal Corporation Website

A full-stack web application for the Kallipgur Coalition Aboriginal Corporation.

## Tech Stack
- **Frontend:** Next.js App Router (React), Tailwind CSS / Vanilla CSS, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL, Docker

---

## Database Development Setup

Follow these instructions to set up the local PostgreSQL database and database access layers.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker](https://www.docker.com/products/docker-desktop/) (must be running on your system)

### 2. Environment Variables
1. Copy the example environment template:
   ```bash
   cp .env.example .env
   ```
2. The default variables in `.env` are pre-configured for local Docker development:
   - `POSTGRES_USER`: Database user credentials
   - `POSTGRES_PASSWORD`: Secure password
   - `POSTGRES_DB`: Name of the development database
   - `DATABASE_URL`: Connection string used by Prisma

---

### 3. Docker PostgreSQL CLI Operations

Use Docker Compose to manage the database container:

* **Start PostgreSQL**:
  ```bash
  docker compose up -d postgres
  ```
* **Stop PostgreSQL**:
  ```bash
  docker compose down
  ```
* **Check PostgreSQL status**:
  ```bash
  docker compose ps
  ```

---

### 4. Prisma CLI Database Operations

Once your PostgreSQL database is running, manage schema changes and client generation using the following Prisma commands:

* **Run Migrations (Apply schema changes to DB)**:
  ```bash
  npx prisma migrate dev
  ```
* **Generate Prisma Client (Update TS types after schema change)**:
  ```bash
  npx prisma generate
  ```
* **Inspect the Database (Prisma Studio GUI interface)**:
  ```bash
  npx prisma studio
  ```

---

### 5. Project Architecture & Structure
- **`docker-compose.yml`**: Configures the PostgreSQL Docker container service.
- **`prisma/schema.prisma`**: The single source of truth for the database schema models.
- **`prisma.config.ts`**: Prisma 7 configuration file mapping the connection credentials.
- **`lib/prisma.ts`**: A singleton Prisma Client wrapper to avoid connection exhaustion in Next.js hot reloads.
