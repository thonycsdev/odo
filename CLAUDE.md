# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev                        # Start Postgres (Docker) + Next.js dev server
pnpm build                      # Production build
pnpm lint                       # Run ESLint

pnpm test                       # Run all Jest tests
pnpm test:watch                 # Jest in watch mode
pnpm test:integration           # Start Postgres + Next.js, then run tests in tests/

pnpm db:start                   # Start Postgres container and wait for readiness
pnpm migrate:create <name>      # Generate a new migration file
pnpm migrate:up                 # Run pending migrations
pnpm migrate:down               # Roll back last migration
```

To run a single test file:
```sh
pnpm jest tests/health.integration.test.ts
```

## Architecture

**Next.js App Router** — all pages and API routes live under `app/`. API routes follow the `app/api/<name>/route.ts` convention and use `NextResponse.json()`.

**Database** — `lib/db.ts` exports a shared `pg.Pool` instance. All server-side code (API routes, Server Components) imports from there. Credentials come from `DATABASE_URL` in `.env.development`. Schema is managed with `node-pg-migrate`; migration files live in `migrations/`.

**UI components** — shadcn/ui components are generated into `components/ui/`. The `cn()` helper in `lib/utils.ts` (clsx + tailwind-merge) is the standard way to compose classNames.

**Infrastructure** — `infra/compose.yml` defines the Postgres service. `infra/scripts/wait-for-postgres.js` polls `localhost:POSTGRES_PORT` via TCP until the database accepts connections; it is called by `db:start`.

**Integration tests** — live in `tests/` and are named `*.integration.test.ts`. They hit the live Next.js server at `BASE_URL` (default `http://localhost:3000`). They are run via `pnpm test:integration`, which starts Postgres and the server first using `concurrently`.

## Environment

`.env.development` is the development env file (gitignored). It sets `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`, and `DATABASE_URL`.
