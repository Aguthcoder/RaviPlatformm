# Real OTP Authentication (MVP + Persian UX)

## 1) User & OTP DB Schema

```sql
-- users: add mobile login identity
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(20) UNIQUE;

-- otp_codes: one-time code store (hashed OTP only)
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number VARCHAR(20) NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_mobile_created ON otp_codes(mobile_number, created_at DESC);
```

## 2) OTP flow (request → verify)

1. **POST `/api/auth/request-otp`**
   - validates Persian mobile (`fa-IR`)
   - normalizes to `+98xxxxxxxxxx`
   - blocks resend for 60s
   - generates 6-digit OTP
   - stores only HMAC hash + expiration (2 minutes)
2. **POST `/api/auth/verify-otp`**
   - checks latest unconsumed OTP
   - checks expiry + attempt limit (max 5)
   - if valid: mark consumed, create user if needed, issue JWT cookies
3. **POST `/api/auth/logout`**
   - clears auth cookies

## 3) APIs

### `POST /auth/request-otp`
Request:
```json
{
  "mobileNumber": "09123456789"
}
```
Response:
```json
{
  "message": "کد تایید ارسال شد.",
  "expiresInSeconds": 120
}
```

### `POST /auth/verify-otp`
Request:
```json
{
  "mobileNumber": "09123456789",
  "otp": "123456"
}
```
Response:
```json
{
  "message": "ورود با موفقیت انجام شد.",
  "user": {
    "id": "uuid",
    "mobileNumber": "+989123456789",
    "subscriptionPlan": "free"
  }
}
```

### `POST /auth/logout`
Response:
```json
{
  "message": "با موفقیت خارج شدید."
}
```

## 4) JWT cookie strategy

- `accessToken` cookie:
  - HttpOnly
  - `SameSite=Lax`
  - `Secure=true` in production
  - path `/`
  - TTL: 15 min
- `refreshToken` cookie:
  - HttpOnly
  - `SameSite=Lax`
  - `Secure=true` in production
  - path `/api/auth`
  - TTL: 30 days

No `localStorage` or JS-readable token is used.

## 5) Next.js 14 middleware example (App Router)

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/events', '/profile'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const accessToken = req.cookies.get('accessToken')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/events/:path*', '/profile/:path*'],
};
```

## 6) Frontend usage example (RTL/Persian-friendly)

```ts
// app/login/actions.ts
'use server';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3000/api';

export async function requestOtp(mobileNumber: string) {
  const res = await fetch(`${API_BASE}/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber }),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('ارسال کد تایید ناموفق بود');
  return res.json();
}

export async function verifyOtp(mobileNumber: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, otp }),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('کد تایید اشتباه یا منقضی است');
  return res.json();
}

export async function logout() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
```

UX notes:
- Persian microcopy: `کد تایید ارسال شد` / `زمان کد تمام شد` / `ارسال مجدد تا ۶۰ ثانیه دیگر`.
- OTP input should be **LTR** but page remains **RTL**.
- Show resend countdown timer for better trust and conversion.

## Environment variables

```env
OTP_SECRET=replace_with_a_long_random_secret
JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
```
