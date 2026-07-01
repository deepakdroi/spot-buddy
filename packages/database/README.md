# Spot Buddy Database

Shared Prisma database schema for Spot Buddy monorepo.

## Setup

1. Configure your Neon PostgreSQL connection in `.env`
2. Run migrations: `npm run prisma:migrate`
3. Generate Prisma client: `npm run prisma:generate`

## Schema

The `User` model includes:

- `id` (UUID)
- `email` (unique)
- `name`
- `dob` (Date of Birth)
- `hashedPassword`
- `isActive`, `isSuperuser`, `isVerified` (fastapi-users compatibility)
- `createdAt`, `updatedAt`

## Environment Variables

- `DATABASE_URL`: Pooled connection string (for app access)
- `DIRECT_URL`: Direct connection string (for migrations)
