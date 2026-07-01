# Spot Buddy - Phase 1 Authentication Layer Setup Guide

This is a complete polyglot monorepo for the Spot Buddy fitness tracking application. It includes foundational authentication, database schema, and UI for web and mobile clients.

## 📁 Project Structure

```
spot-buddy/
├── packages/
│   └── database/          # Shared Prisma schema (PostgreSQL via Neon)
├── apps/
│   ├── backend/           # FastAPI + fastapi-users
│   ├── web/               # Next.js + NextAuth.js
│   └── mobile/            # React Native + Expo
├── package.json           # Monorepo workspace configuration
├── turbo.json             # Turborepo configuration
└── README.md              # This file
```

## 🗄️ Database Setup (packages/database)

### Configuration

**File:** `.env`

```
DATABASE_URL="postgresql://user:pass@region.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:pass@region.neon.tech/dbname?sslmode=require"
```

**Steps:**

1. Create a free Neon PostgreSQL database at https://neon.tech
2. Copy your connection string into `.env`
3. Use `DIRECT_URL` for migrations (direct connection) and `DATABASE_URL` for pooled connections

### Schema

The `User` model includes:

- `id` (UUID) - Primary key
- `email` (String, unique) - User email
- `name` (String) - Full name
- `dob` (DateTime) - Date of birth
- `hashedPassword` (String) - Hashed password
- `isActive` (Boolean, default: true) - fastapi-users compatibility
- `isSuperuser` (Boolean, default: false) - fastapi-users compatibility
- `isVerified` (Boolean, default: false) - fastapi-users compatibility
- `createdAt` (DateTime) - Account creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Commands

```bash
cd packages/database

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (visual database browser)
npm run prisma:studio

# Deploy migrations to production
npm run prisma:migrate-prod
```

## 🔧 Backend Setup (apps/backend)

### Configuration

**File:** `.env`

```
DATABASE_URL="postgresql://user:pass@region.neon.tech/dbname?sslmode=require"
JWT_SECRET="super-secret-key-change-me-in-production"
CORS_ORIGINS="http://localhost:3000"
```

### Dependencies

```
fastapi==0.104.1
fastapi-users==12.1.2
sqlalchemy==2.0.23
asyncpg==0.29.0
python-dotenv==1.0.0
```

### Setup & Run

```bash
cd apps/backend

# Install dependencies
pip install -r requirements.txt

# Start development server
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Endpoints

| Method | Endpoint           | Auth | Description         |
| ------ | ------------------ | ---- | ------------------- |
| GET    | `/`                | No   | Welcome message     |
| GET    | `/health`          | No   | Health check        |
| POST   | `/auth/register`   | No   | Register new user   |
| POST   | `/auth/jwt/login`  | No   | Login (returns JWT) |
| POST   | `/auth/jwt/logout` | Yes  | Logout              |
| GET    | `/users/me`        | Yes  | Get current user    |
| PATCH  | `/users/me`        | Yes  | Update current user |

### Authentication

Uses JWT Bearer tokens in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Key Features

- **fastapi-users**: Pre-built user management system
- **SQLAlchemy ORM**: Database access
- **JWT Authentication**: Stateless, scalable auth
- **CORS Middleware**: Allows requests from web frontend

## 🌐 Web Client Setup (apps/web)

### Configuration

**File:** `.env.local`

```
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXTAUTH_SECRET="nextauth-secret-key-change-me-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Setup & Run

```bash
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

The web app will be available at `http://localhost:3000`

### Key Features

- **Next.js 14**: App Router for file-based routing
- **NextAuth.js**: Authentication with Credentials provider
- **next-themes**: System-default dark/light mode toggle
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built, customizable components
- **react-hook-form + zod**: Form validation
- **recharts**: Data visualization (Radar chart for muscle groups)

### Pages & Routes

| Route        | Auth Required | Description                                           |
| ------------ | ------------- | ----------------------------------------------------- |
| `/`          | No            | Landing page (redirects to `/dashboard` if logged in) |
| `/login`     | No            | Login form                                            |
| `/register`  | No            | Registration form                                     |
| `/dashboard` | Yes           | Protected dashboard with user profile and charts      |

### UI Components

All shadcn/ui components are in `components/ui/`:

- **Button**: Customizable button with variants (default, destructive, outline, secondary, ghost, link)
- **Input**: Text input with validation styling
- **Label**: Form label
- **Card**: Container component with header/footer
- **DatePicker**: HTML5 date input
- **Skeleton**: Loading placeholder
- **Toast**: Notification system

### NextAuth.js Integration

The Credentials provider:

1. Sends email/password to FastAPI `/auth/jwt/login`
2. Receives JWT access token
3. Fetches user details from `/users/me`
4. Stores token and user data in session

The `jwt()` callback extracts the token, and the `session()` callback makes it available in the frontend.

### Dashboard Features

- **Welcome Message**: "Welcome back, [Name]!"
- **User Info Cards**: Email, Age (calculated from DOB), Status
- **Start Workout Button**: Triggers toast notification
- **Muscle Group Chart**: Recharts RadarChart showing sets per muscle group (Chest, Back, Shoulders, Legs, Arms, Core)
- **Recent PRs Skeleton**: Placeholder for future PRs display
- **Sign Out Button**: Clears session and redirects to login

## 📱 Mobile Client Setup (apps/mobile)

### Configuration

**File:** `.env`

```
# For Android emulator:
EXPO_PUBLIC_API_URL="http://10.0.2.2:8000"

# For iOS simulator:
EXPO_PUBLIC_API_URL="http://localhost:8000"

# For physical device (replace with your machine's IP):
EXPO_PUBLIC_API_URL="http://192.168.x.x:8000"
```

### Setup & Run

```bash
cd apps/mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on web
npm run web
```

### Key Features

- **Expo**: React Native framework with built-in tooling
- **expo-router**: File-based routing (similar to Next.js)
- **Zustand**: Lightweight state management
- **expo-secure-store**: Secure token storage
- **NativeWind**: Tailwind CSS for React Native
- **DateTimePicker**: Native date/time selection

### State Management

**Zustand Store** (`store/authStore.ts`):

```typescript
{
  user: User | null,
  token: string | null,
  isLoading: boolean,
  error: string | null,
}
```

Actions:

- `setUser()` - Update user info
- `setToken()` - Update JWT token
- `setIsLoading()` - Toggle loading state
- `setError()` - Set error message
- `reset()` - Clear all auth state

### Secure Token Storage

**expo-secure-store** (`lib/secureStorage.ts`):

- `saveToken()` - Store JWT securely
- `getToken()` - Retrieve JWT
- `clearToken()` - Remove JWT on logout
- `createAuthenticatedClient()` - Axios client with Authorization header

### Auth Hooks

**useAuth** (`hooks/useAuth.ts`):

```typescript
const {
  login, // (email, password) => boolean
  register, // (email, password, name, dob) => boolean
  logout, // () => boolean
  fetchUserProfile, // (token) => User | null
  user,
  token,
  isLoading,
  error,
  setUser,
  setToken,
  reset,
} = useAuth();
```

**useInitializeAuth** (`hooks/useInitializeAuth.ts`):

- Runs on app startup
- Retrieves stored token from secure storage
- Restores auth state if token exists

### Screens

| Route               | Auth Required | Description                                     |
| ------------------- | ------------- | ----------------------------------------------- |
| `/(auth)/login`     | No            | Login with email/password                       |
| `/(auth)/register`  | No            | Register with email, password, name, DOB        |
| `/(auth)/dashboard` | Yes           | User profile, age, workout button, muscle chart |

### Dashboard Features

- **Welcome Message**: "Welcome back, [Name]!"
- **User Info**: Email, Age (calculated), Status
- **Start Workout Button**: Console log placeholder
- **Muscle Group Performance**: Text placeholder with stats (can be replaced with recharts-native or custom chart)
- **Recent PRs**: Placeholder section
- **Sign Out**: Clears secure storage, resets state, redirects to login

## 🔗 API Integration

### Authentication Flow

**Web & Mobile**:

```
1. User enters credentials
2. POST /auth/jwt/login with email & password
3. Backend returns JWT access_token
4. Frontend fetches /users/me with Bearer token
5. User object + token stored in session (web) or secure storage (mobile)
```

### JWT Token Extraction

**Web** (NextAuth.js):

- The `jwt()` callback in `[...nextauth]/route.ts` extracts the token
- The `session()` callback passes it to the frontend
- Available via `useSession()` hook

**Mobile** (Zustand + axios):

- Token stored in `expo-secure-store`
- Automatically added to Authorization header
- Available via `useAuth()` hook

## 🚀 Getting Started

### 1. Clone & Install Monorepo

```bash
cd spot-buddy
npm install
```

### 2. Setup Database

```bash
cd packages/database
# Update .env with Neon credentials
npm run prisma:generate
npm run prisma:migrate
```

### 3. Start Backend

```bash
cd apps/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 4. Start Web

```bash
cd apps/web
npm install
npm run dev
```

Visit `http://localhost:3000`

### 5. Start Mobile (Optional)

```bash
cd apps/mobile
npm install
npm start
```

Then press `a` for Android or `i` for iOS

## 🔐 Security Considerations

### Environment Variables

- **JWT_SECRET**: Change in production
- **NEXTAUTH_SECRET**: Change in production
- **Never commit `.env` files**
- Use `.env.example` as template

### CORS

Backend allows requests from `http://localhost:3000` by default. Update `CORS_ORIGINS` in `.env` for production.

### Password Storage

- Backend: Uses `passlib[bcrypt]` for hashing
- Mobile: JWT stored in `expo-secure-store` (encrypted)
- Web: JWT stored in NextAuth session (HttpOnly cookie by default)

## 📚 Technology Stack Summary

| Layer        | Technology               | Purpose              |
| ------------ | ------------------------ | -------------------- |
| Database     | Neon PostgreSQL + Prisma | Serverless DB + ORM  |
| Backend      | FastAPI + fastapi-users  | REST API + Auth      |
| Web          | Next.js + NextAuth.js    | Full-stack framework |
| Web UI       | Tailwind + shadcn/ui     | Styling              |
| Mobile       | Expo + React Native      | Cross-platform app   |
| Mobile State | Zustand                  | State management     |
| Mobile Auth  | expo-secure-store        | Secure token storage |

## 🛠️ Troubleshooting

### Database Connection Issues

- Verify Neon credentials in `.env`
- Check if your IP is whitelisted in Neon network settings
- Use `DIRECT_URL` for migrations, `DATABASE_URL` for app

### Backend Not Responding

- Ensure FastAPI is running on port 8000
- Check `CORS_ORIGINS` includes your frontend URL
- Verify `JWT_SECRET` is set

### Web Can't Login

- Check backend health: `http://localhost:8000/health`
- Verify `NEXT_PUBLIC_API_URL` points to backend
- Check browser console for CORS errors

### Mobile Can't Connect

- Android emulator: Use `10.0.2.2:8000` (special IP for host)
- iOS simulator: Use `localhost:8000`
- Physical device: Use your machine's local IP (e.g., `192.168.x.x:8000`)

## 📝 Next Steps

1. **Frontend Polish**: Add more components, improve styling
2. **Backend Expansion**: Add workout logging, PRs, user settings
3. **Mobile Features**: Implement chart visualization, workout tracking
4. **Testing**: Unit, integration, and E2E tests
5. **Deployment**: Deploy to Azure, AWS, or Vercel
6. **Analytics**: Add tracking, error monitoring

## 📧 Notes

For questions about specific implementations:

- **Database**: Check `packages/database/README.md`
- **Backend**: Check `apps/backend/README.md`
- **Web**: Check `apps/web/README.md`
- **Mobile**: Check `apps/mobile/README.md`
