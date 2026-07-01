# Environment Configuration Reference

This document provides exact templates for all `.env` files across the Spot Buddy monorepo.

## Database (packages/database/.env)

**Template:**

```
DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
DIRECT_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"

**Notes:**

- Both URLs can be identical
- Use pooled connection for `DATABASE_URL` (used by app)
- Use direct connection for `DIRECT_URL` (used for migrations)
- Neon provides both automatically
- Replace placeholders with actual credentials from Neon console

---

## Backend (apps/backend/.env)

**Template:**

```

DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
JWT_SECRET="[32+ character random string]"
CORS_ORIGINS="http://localhost:3000"

````

**Notes:**

- `JWT_SECRET`: Generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- `CORS_ORIGINS`: Comma-separated list for multiple origins
- Change before production!

**Generate JWT Secret (Python):**

```python
import secrets
print(secrets.token_urlsafe(32))  # Example: yDZJqX9_K2w...
````

---

## Web (apps/web/.env.local)

**Template:**

```
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXTAUTH_SECRET="[32+ character random string]"
NEXTAUTH_URL="http://localhost:3000"
```

**Production Example:**

```
NEXT_PUBLIC_API_URL="https://api.spotbuddy.com"
NEXTAUTH_SECRET="[production secret - generate new]"
NEXTAUTH_URL="https://app.spotbuddy.com"
```

**Notes:**

- `NEXT_PUBLIC_*` variables are exposed to browser (safe for URLs)
- `NEXTAUTH_SECRET`: Must be 32+ characters
- `NEXTAUTH_URL`: Should match your domain exactly
- Change before production!

**Generate NEXTAUTH Secret (JavaScript):**

```javascript
// In Node.js or browser console:
crypto
  .getRandomValues(new Uint8Array(32))
  .reduce((a, b) => a + b.toString(16).padStart(2, 0), "");
```

---

## Mobile (apps/mobile/.env)

**Template:**

```
EXPO_PUBLIC_API_URL="http://10.0.2.2:8000"
```

**Examples by Platform:**

### Android Emulator:

```
EXPO_PUBLIC_API_URL="http://10.0.2.2:8000"
```

(Special IP that routes to host machine)

### iOS Simulator:

```
EXPO_PUBLIC_API_URL="http://localhost:8000"
```

### Physical Device (replace with your IP):

```
EXPO_PUBLIC_API_URL="http://192.168.1.100:8000"
```

(Find your IP: `ipconfig` on Windows, `ifconfig` on Mac/Linux)

### Development Web:

```
EXPO_PUBLIC_API_URL="http://localhost:8000"
```

**Notes:**

- `EXPO_PUBLIC_*` variables are exposed to app (safe for URLs)
- Different values needed for different platforms
- Use your machine's local IP for physical devices

**Find Your Local IP:**

**Windows:**

```powershell
ipconfig
# Look for "IPv4 Address" under "Wireless LAN adapter WiFi"
# Example: 192.168.1.100
```

**Mac/Linux:**

```bash
ifconfig
# Look for "inet" under your active interface
# Example: 192.168.1.100
```

---

## All Environment Variables Summary

| Variable            | Location                 | Required | Type   | Example                                          |
| ------------------- | ------------------------ | -------- | ------ | ------------------------------------------------ |
| DATABASE_URL        | `packages/database/.env` | ✅       | String | `postgresql://user:pass@host/db?sslmode=require` |
| DIRECT_URL          | `packages/database/.env` | ✅       | String | `postgresql://user:pass@host/db?sslmode=require` |
| DATABASE_URL        | `apps/backend/.env`      | ✅       | String | `postgresql://user:pass@host/db?sslmode=require` |
| JWT_SECRET          | `apps/backend/.env`      | ✅       | String | 32+ chars                                        |
| CORS_ORIGINS        | `apps/backend/.env`      | ✅       | String | `http://localhost:3000`                          |
| NEXT_PUBLIC_API_URL | `apps/web/.env.local`    | ✅       | String | `http://localhost:8000`                          |
| NEXTAUTH_SECRET     | `apps/web/.env.local`    | ✅       | String | 32+ chars                                        |
| NEXTAUTH_URL        | `apps/web/.env.local`    | ✅       | String | `http://localhost:3000`                          |
| EXPO_PUBLIC_API_URL | `apps/mobile/.env`       | ✅       | String | `http://10.0.2.2:8000`                           |

---

## Secret Generation

### JWT_SECRET (Backend)

**Python:**

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**OpenSSL:**

```bash
openssl rand -base64 32
```

**Output Example:**

```
yDZJqX9_K2w-L3m4N5o6P7q8R9s0T1u2V3w4X5y6Z7a8b9c0d1e2f3g4h5i6j7k
```

### NEXTAUTH_SECRET (Web)

**Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**JavaScript (browser console):**

```javascript
Array.from(crypto.getRandomValues(new Uint8Array(32)))
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");
```

**Output Example:**

```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

---

## Neon PostgreSQL Setup

1. **Sign up** at https://neon.tech (free tier available)
2. **Create project** with default settings
3. **Copy connection string** from "Connection Details" → "Connection string"
4. **In `.env` files**, use this string for both `DATABASE_URL` and `DIRECT_URL`

**Neon Connection String Format:**

```
postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
```

**Example from Neon:**

```
postgresql://spotbuddy_owner:abC123DeF456@ep-cool-penguin-abc123.us-east-1.neon.tech/spot_buddy?sslmode=require
```

**Neon Tips:**

- Each project comes with default user and database
- Rename database/user for clarity if desired
- Connection pooling automatically enabled
- Free tier: 10 GB storage, no usage limits

---

## Development vs Production

### Development (.env)

- Localhost URLs: `http://localhost:3000`, `http://localhost:8000`
- Plain text secrets (for local testing only)
- Debug logging enabled
- Relaxed CORS

### Production (.env)

- HTTPS URLs: `https://app.domain.com`, `https://api.domain.com`
- Secure, randomly generated secrets
- Log only errors
- Strict CORS with specific origins
- Environment-specific API endpoints

**Production Checklist:**

- [ ] Change all secrets
- [ ] Update URLs to production domains
- [ ] Enable HTTPS (not HTTP)
- [ ] Restrict CORS to specific origins
- [ ] Set `NODE_ENV=production` (web)
- [ ] Set appropriate JWT expiration
- [ ] Enable database backups
- [ ] Configure error monitoring
- [ ] Set up logging

---

## Troubleshooting

### "Cannot connect to database"

1. Check DATABASE_URL syntax
2. Verify credentials are correct
3. Check if IP is whitelisted in Neon
4. For Neon: Ensure `?sslmode=require` is present

### "JWT decode error"

1. Verify JWT_SECRET is the same in all copies
2. JWT_SECRET must be 32+ characters
3. Change won't affect existing tokens

### "NextAuth error"

1. Verify NEXTAUTH_SECRET is set and is 32+ chars
2. Verify NEXTAUTH_URL matches your domain exactly
3. Check if NEXT_PUBLIC_API_URL points to correct backend

### "Mobile can't connect to API"

1. Android emulator: Use `10.0.2.2` not `localhost`
2. iOS simulator: Can use `localhost`
3. Physical device: Use your machine's local IP (not `localhost`)
4. Verify firewall allows port 8000

### "CORS error"

1. Check backend CORS_ORIGINS includes frontend URL
2. Multiple origins separated by comma: `http://localhost:3000,http://localhost:3001`
3. No trailing slash in origins

---

## Quick Setup Script

**Linux/Mac:**

```bash
# Database
cd packages/database
cp .env.example .env
# Edit .env with Neon credentials
npm run prisma:generate
npm run prisma:migrate

# Backend
cd apps/backend
cp .env.example .env
# Edit .env with secrets
pip install -r requirements.txt
python -m uvicorn app.main:app --reload &

# Web
cd apps/web
cp .env.example .env.local
# Edit .env.local (should be fine as-is for localhost)
npm install
npm run dev
```

**Windows PowerShell:**

```powershell
# Same commands, use 'Copy-Item' instead of 'cp'
Copy-Item .env.example .env
```

---

## Notes

- ⚠️ **Never commit `.env` files** to git
- ⚠️ **Each developer** should have their own `.env` with their secrets
- ✅ **Commit `.env.example`** as template for other developers
- ✅ **Use `.env.local`** for Next.js (automatically ignored by git)
- ✅ **Use environment variables** in CI/CD pipelines

---

## More Information

- [SETUP.md](./SETUP.md) - Full setup guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What was created
- Package READMEs for specific setup instructions
