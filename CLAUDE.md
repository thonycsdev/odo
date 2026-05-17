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
pnpm jest tests/api/v1/user/user.integration.test.ts
```

## Architecture

**Next.js App Router** — all pages and API routes live under `app/`. API routes follow the `app/api/v1/<name>/route.ts` convention and use `NextResponse.json()`.

**Database** — `infra/database.ts` exports a singleton `pg.Pool` instance via `Database.getInstance()`. All server-side code imports from there. Credentials come from `DATABASE_URL` in `.env.development`. Schema is managed with `node-pg-migrate`; migration files live in `migrations/`.

**Models** — live in `models/`. Each model file handles DB queries for a resource. Business logic (validation, hashing) lives here, not in the route.

**Schemas** — live in `schemas/`. Each file mirrors one database table and exports Zod schemas used for request validation and response parsing. Models import from here — routes never call Zod directly. Each table schema file exports: the full table schema (e.g. `UserSchema`), request/response schemas (e.g. `CreateUserRequestSchema`, `CreateUserResponseSchema`), and their inferred types. Models accept `data: unknown` and call `Schema.parse(data)` at the top of the function; responses are parsed with the response schema before returning.

**Auth** — `models/auth.ts` handles password hashing via bcrypt.

**Error handling** — `infra/error-handler.ts` defines `AppError` subclasses (`BadRequestError`, `NotFoundError`, etc.) and a `handle()` function that maps them to `{ success, status, message }`. Routes catch errors and forward the status: `return NextResponse.json(data, { status: data.status })`.

**UI components** — shadcn/ui components are generated into `components/ui/`. The `cn()` helper in `lib/utils.ts` (clsx + tailwind-merge) is the standard way to compose classNames.

**Infrastructure** — `infra/compose.yml` defines the Postgres service. `infra/scripts/wait-for-postgres.js` polls `localhost:POSTGRES_PORT` via TCP until the database accepts connections; it is called by `db:start`.

**Integration tests** — live in `tests/` and are named `*.integration.test.ts`. They hit the live Next.js server at `http://localhost:3000`. Run via `pnpm test:integration`, which starts Postgres and the server first using `concurrently`.

## Testing conventions

- Test data is generated with `@faker-js/faker`.
- Each test suite calls `orchestrator.resetDatabase()` in `beforeAll` to start from a clean schema.
- `tests/common/orchestrator.ts` exposes `dropSchema`, `runMigrations`, and `resetDatabase`. Migrations are run programmatically via `node-pg-migrate`'s `runner`.
- Pool teardown is centralized in `jest.setup.ts` via `afterAll` using a dynamic import to ensure `.env.development` is loaded before the pool is created. Do not close the pool in individual test files.
- `jest.setup.ts` loads `.env.development` via `dotenv` before any test runs. The database import must be dynamic inside `afterAll` — a top-level import would be hoisted before `config()` runs, leaving `DATABASE_URL` undefined.

## Environment

`.env.development` is the development env file (gitignored). It sets `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`, and `DATABASE_URL`.
