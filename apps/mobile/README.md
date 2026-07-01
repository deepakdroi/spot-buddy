# Spot Buddy Mobile

React Native mobile app built with Expo and Zustand for state management.

## Setup

1. Install dependencies: `npm install`
2. Configure `.env` with your API URL
   - For Android emulator: `EXPO_PUBLIC_API_URL="http://10.0.2.2:8000"`
   - For iOS simulator: `EXPO_PUBLIC_API_URL="http://localhost:8000"`
   - For physical device: Use your machine's local IP address
3. Start development: `npm start`

## Features

- JWT authentication with secure token storage
- Zustand state management
- Expo Router for navigation
- NativeWind for Tailwind CSS styling
- DateTimePicker for date of birth selection
- Secure token storage with expo-secure-store
- Protected navigation routes

## Architecture

- `hooks/useAuth.ts` - Authentication hook with login, register, logout
- `hooks/useInitializeAuth.ts` - Initialize auth on app startup
- `store/authStore.ts` - Zustand auth state
- `lib/secureStorage.ts` - Token management with secure storage
- `app/(auth)/` - Protected auth screens
