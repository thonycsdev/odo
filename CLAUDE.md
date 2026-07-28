# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev                        # Start Postgres (Docker) + Next.js dev server
pnpm build                      # Production build
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

**UI components** — the project uses [GitHub Primer React](https://primer.style/product) (`@primer/react`) as the component library and default style choice; shadcn/ui and Tailwind-based UI were removed during the rebrand (`app/globals.css` is intentionally empty). `app/layout.tsx` wraps the app in `ThemeProvider` + `BaseStyles` and imports `@primer/primitives/dist/css/functional/themes/light.css` for the design tokens (CSS custom properties like `--fgColor-default`, `--bgColor-muted`, `--borderColor-default`).

Notes specific to the installed version (`@primer/react` ^38.34.0):
- There is **no `Box` component** in this version — use `Stack` (props: `direction`, `gap`, `align`, `justify`, `wrap`, `padding`, each accepting a responsive `{narrow, regular, wide}` object) for layout instead of custom CSS/flexbox.
- Page-level structure (header/content/footer regions, max-width containment) comes from `PageLayout` (`containerWidth`, `PageLayout.Header`, `PageLayout.Content`, `PageLayout.Footer`) — avoid hand-rolled container/max-width CSS.
- `Card` and `Blankslate` (used for marketing/empty-state sections, with `.Heading`, `.Description`, `.PrimaryAction`, `.SecondaryAction` subcomponents) are exported from the **`@primer/react/experimental`** subpath, not the main package entry point.
- Prefer components + Primer CSS variables over new CSS files; there was no `Box`/`sx` prop system in this version to reach for, so layout composition happens through `Stack`/`PageLayout` props.
- Check `node_modules/@primer/react/dist/index.d.ts` (and `dist/experimental/index.d.ts`) directly when in doubt — the exported API can differ from older Primer docs/examples found online.

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

## Code style

This project follows the **Google TypeScript Style Guide**. Biome enforces most rules automatically — run `pnpm lint:fix` to auto-fix. The scripts are:

```sh
pnpm lint           # Lint only, report errors
pnpm lint:check     # Lint + format check (no writes)
pnpm lint:fix       # Lint + format, auto-fix everything possible
```

**Biome-enforced rules (automatic):**

- 2-space indentation, 80-character line width, LF line endings
- Single quotes, always semicolons, trailing commas everywhere
- No `var` — use `const` by default, `let` only when reassignment is needed
- Use template literals over string concatenation
- Use `import type` for type-only imports
- Avoid `any` type
- Avoid non-null assertions (`!`)
- Use `===` / `!==`, never `==` / `!=`
- No `debugger` statements
- Unused variables are errors
- Prefer arrow functions for callbacks
- `default` case must be last in switch statements

**Rules enforced manually on commit check:**

- **Explicit return types** — all functions and methods must declare their return type (e.g. `function foo(): string`)
- **Naming conventions**:
  - Variables, parameters, functions, methods: `lowerCamelCase`
  - Classes, interfaces, type aliases, enums: `UpperCamelCase`
  - File names: `lower_snake_case.ts`
  - Database column names, table names, and migration identifiers: `snake_case`
- **No `@ts-ignore`** — do not suppress TypeScript errors silently

## Code quality analysis

When asked to analyze code quality, always cross-reference the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) as the authoritative source.

When a violation is found, explain it deeply:

- **What the rule is** and where it comes from in the Google style guide
- **Why it exists** — the reasoning or problem it prevents
- **What the current code does wrong** — point to the exact line/pattern
- **What the correct version looks like** — show a concrete before/after example
