# Spot Buddy - Phase 1: Authentication & Dashboard

A cross-platform fitness tracking application built with a polyglot monorepo. Phase 1 includes foundational authentication, database schema, and UI across web and mobile clients.

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for comprehensive setup instructions.

**TL;DR:**

```bash
# 1. Setup database
cd packages/database
npm run prisma:migrate

# 2. Start backend
cd apps/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# 3. Start web
cd apps/web
npm install && npm run dev

# 4. Start mobile (optional)
cd apps/mobile
npm install && npm start
```

## 📋 What's Included

### Backend (FastAPI + fastapi-users)

- JWT authentication
- User registration & login
- Protected `/users/me` endpoint
- CORS configured for web frontend
- Async SQLAlchemy ORM with PostgreSQL

### Web (Next.js + NextAuth.js)

- System-default dark/light mode
- Login & Register pages
- Protected dashboard route
- User profile with age calculation
- Muscle group performance chart (Recharts)
- Responsive Tailwind CSS design

### Mobile (React Native + Expo)

- Zustand state management
- Secure token storage with expo-secure-store
- Login & Register screens
- Protected dashboard screen
- NativeWind styling
- Native date/time picker

### Database (Prisma + Neon PostgreSQL)

- User model with all auth-required fields
- Connection pooling with Neon
- Migration management

## 🗂️ Project Structure

```
spot-buddy/
├── packages/database/    # Shared Prisma schema
├── apps/
│   ├── backend/         # FastAPI server
│   ├── web/             # Next.js app
│   └── mobile/          # Expo app
├── SETUP.md             # Detailed setup guide
└── package.json         # Monorepo config
```

## 🔐 Security

- ✅ JWT authentication with FastAPI
- ✅ Bcrypt password hashing
- ✅ Secure token storage (mobile)
- ✅ HttpOnly cookies for session (web)
- ✅ CORS configured
- ⚠️ Change secrets in `.env` files before production

## 📱 Features

### Authentication

- User registration with email, password, name, DOB
- Login with JWT tokens
- Logout with state cleanup
- Protected routes

### Dashboard

- Welcome message with user name
- User info cards (email, age, status)
- Muscle group performance chart
- Recent PRs placeholder
- Start workout action

### Styling

- Dark/light mode toggle (web)
- Tailwind CSS
- Responsive design
- System-aware theme selection

## 🛠️ Tech Stack

- **Database**: Neon PostgreSQL + Prisma
- **Backend**: FastAPI + fastapi-users + SQLAlchemy
- **Web**: Next.js 14 + NextAuth.js + Tailwind + shadcn/ui
- **Mobile**: React Native + Expo + Zustand
- **Monorepo**: npm workspaces + Turborepo

## 📖 Documentation

- [Database Setup](./packages/database/README.md)
- [Backend Setup](./apps/backend/README.md)
- [Web Setup](./apps/web/README.md)
- [Mobile Setup](./apps/mobile/README.md)
- [Full Guide](./SETUP.md)

## 🔗 API Reference

See [SETUP.md](./SETUP.md#-api-integration) for detailed API documentation.

## 📝 Environment Files

Copy `.env.example` to `.env` in each app/package and update with your values:

- `packages/database/.env.example` → `.env`
- `apps/backend/.env.example` → `.env`
- `apps/web/.env.example` → `.env.local`
- `apps/mobile/.env.example` → `.env`

## 🚀 Next Steps

1. Complete [SETUP.md](./SETUP.md)
2. Test authentication flow (register → login → dashboard)
3. Customize colors and branding
4. Add workout logging endpoints
5. Deploy to production

## 📧 License

See LICENSE file
