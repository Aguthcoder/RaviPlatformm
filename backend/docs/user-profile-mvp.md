# User Profile MVP (Group/Event Matching Only)

This profile model is intentionally limited to **group/event matching** use-cases.
No chat-specific fields are stored.

## 1) DB Schema

### TypeORM Entity
Implemented in `ProfileEntity` with these columns:
- `avatar_url` (nullable `varchar`)
- `bio` (nullable `text`)
- `interests` (nullable `text[]`)
- `city` (nullable `varchar`)
- `age` (nullable `smallint`)
- `gender` (nullable `varchar(32)`)
- `education` (nullable `varchar(120)`)
- `user_id` (one-to-one with `users.id`)

### SQL (example migration)
```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_url varchar,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS age smallint,
  ADD COLUMN IF NOT EXISTS gender varchar(32),
  ADD COLUMN IF NOT EXISTS education varchar(120);
```

## 2) APIs (Auth-protected)

`JwtAuthGuard` protects both routes (cookie-based access token).

### GET `/api/user/profile`
Returns current user's profile:
```json
{
  "avatarUrl": "https://cdn.example.com/a.jpg",
  "bio": "I like startup events",
  "interests": ["tech", "hiking"],
  "city": "Tehran",
  "age": 26,
  "gender": "female",
  "education": "BSc Computer Engineering"
}
```

### PUT `/api/user/profile`
Creates or updates current user's profile:
```json
{
  "avatarUrl": "https://cdn.example.com/a.jpg",
  "bio": "MVP bio",
  "interests": ["tech", "board-games"],
  "city": "Tehran",
  "age": 25,
  "gender": "female",
  "education": "MBA"
}
```

Response includes persisted profile and usage marker:
```json
{
  "id": "uuid",
  "avatarUrl": "...",
  "bio": "...",
  "interests": ["..."],
  "city": "...",
  "age": 25,
  "gender": "female",
  "education": "...",
  "usage": "matching_only"
}
```

## 3) Avatar Upload Approach (MVP)

For MVP, keep upload out of backend binary pipeline:
1. Client uploads avatar file directly to object storage (e.g. S3/R2/Firebase Storage) using pre-signed URL.
2. Storage returns public/served URL.
3. Client saves URL through `PUT /api/user/profile` in `avatarUrl`.

This keeps backend simple and avoids storing image blobs in DB.

## 4) Frontend Form Example

A sample editable form is implemented in:
- `frontend/raavi-project/src/app/dashboard/profile/page.tsx`

It fetches `GET /user/profile` on load and submits `PUT /user/profile`.

## 5) Validation Rules

Server-side DTO validation for `PUT /user/profile`:
- `avatarUrl`: optional, must be URL.
- `bio`: optional string, max 500 chars.
- `interests`: optional array, max 15 items, each tag length 2..30.
- `city`: optional string, length 1..80.
- `age`: optional integer, range 18..99.
- `gender`: optional, one of `male|female|non-binary|prefer-not-to-say`.
- `education`: optional string, length 2..120.

All unknown fields are rejected by global validation pipe (`forbidNonWhitelisted`).
