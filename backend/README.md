# Ravi Backend (NestJS)

## Setup

```bash
cp .env.example .env
npm install
```

## Environment variables

Required values:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `CORS_ORIGIN`
- `RATE_LIMIT_TTL`
- `RATE_LIMIT_LIMIT`

Optional values:

- `REDIS_URL`

Additional variables are documented in `.env.example`.

## Local run

```bash
npm run start:dev
```

Production build/run:

```bash
npm run build
npm run start:prod
```

## Docker

From repository root:

```bash
docker compose up --build
```

## Migrations

```bash
npm run migration:generate -- src/database/migrations/AddSomething
npm run migration:run
npm run migration:revert
npm run migrate:deploy
```

## Swagger

After app starts:

- Swagger UI: `http://localhost:4000/api/docs`
- OpenAPI JSON: `http://localhost:4000/api/docs-json`
