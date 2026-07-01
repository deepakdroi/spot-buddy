# Spot Buddy Backend

FastAPI backend with fastapi-users authentication.

## Setup

1. Install dependencies: `pip install -r requirements.txt`
2. Configure `.env` with DATABASE_URL and JWT_SECRET
3. Run migrations with Prisma from `packages/database`
4. Start server: `python -m uvicorn app.main:app --reload`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /auth/register` - Register new user
- `POST /auth/jwt/login` - Login (returns JWT)
- `POST /auth/jwt/logout` - Logout
- `GET /users/me` - Get current user (protected)
- `PATCH /users/me` - Update current user (protected)

## Authentication

Uses JWT Bearer tokens. Include token in Authorization header:

```
Authorization: Bearer <token>
```
