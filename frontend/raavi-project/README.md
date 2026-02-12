# Raavi Frontend (Next.js App Router)

## Setup

```bash
npm install
```

## Environment Variables

1. Copy template:

```bash
cp .env.example .env.local
```

2. Configure values:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ENV`
- `NEXT_PUBLIC_SENTRY_DSN` (optional)

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm run start
```

### Bundle Analyze

```bash
npm run analyze
```

## PWA

- Manifest is available at `/manifest.json`.
- Service worker is generated in production build via `next-pwa`.
- PWA is disabled in development mode.

## Deployment

### Vercel

- Set all `NEXT_PUBLIC_*` variables in project settings.
- Use default Next.js build command:

```bash
npm run build
```

### Cloudflare Pages (optional existing workflow)

```bash
npm run cf-build
```

## CI

GitHub Actions workflow: `.github/workflows/frontend.yml`

Pipeline steps:

1. Install dependencies (`npm ci`)
2. Lint (`npm run lint`)
3. Build (`npm run build`)
