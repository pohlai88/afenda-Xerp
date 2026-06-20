# Afenda ERP

Monorepo foundation for **Afenda ERP** — a Next.js-first, TypeScript-first, manufacturing-focused ERP platform.

This repository implements **TIP-001: Monorepo + Turborepo Foundation** from the Afenda ERP Master Plan. It establishes the workspace, build pipeline, and package boundaries only. Business modules, auth, database, and AI are intentionally deferred to later TIPs.

## Repository structure

```
afenda/
├── apps/
│   ├── erp/          # Main ERP Next.js application (port 3000)
│   └── docs/         # Documentation site placeholder (port 3001)
├── packages/
│   ├── design-system/   # Design tokens and UI governance
│   ├── ui/                # Shared UI primitives
│   ├── appshell/          # ERP application shell
│   ├── metadata-ui/       # Metadata-driven UI contracts
│   ├── auth/              # Authentication (TIP-004)
│   ├── permissions/       # Permission and policy engine (TIP-005)
│   ├── database/          # Database schema and Drizzle (TIP-003)
│   ├── kernel/            # Platform kernel and shared contracts
│   ├── observability/     # Logging, tracing, and audit (TIP-010)
│   └── testing/           # Shared testing utilities
├── biome.jsonc            # Biome + Ultracite presets
├── tsconfig.base.json     # Shared strict TypeScript baseline
├── tsconfig.library.json  # Library package preset
├── tsconfig.next.json     # Next.js app preset
├── turbo.json             # Turborepo task pipeline
└── vitest.config.ts       # Shared Vitest baseline
```

## Prerequisites

- [Node.js](https://nodejs.org/) 22+ (see `.node-version`)
- [pnpm](https://pnpm.io/) 9+

## First commands

Install dependencies:

```bash
pnpm install
```

Run all packages in development mode:

```bash
pnpm dev
```

Build the entire monorepo:

```bash
pnpm build
```

Run quality checks:

```bash
pnpm check           # ci:biome + typecheck + test
pnpm lint            # ultracite check (local read-only)
pnpm ci:biome        # biome ci (CI Gate 2 — format + lint + imports)
pnpm typecheck
pnpm test
pnpm test:coverage   # vitest with v8 coverage
pnpm format          # ultracite fix (local auto-fix)
pnpm format:check    # alias for ci:biome
pnpm fix             # ultracite fix
pnpm clean           # remove build outputs across workspace
turbo run //#lint    # root ultracite check via Turborepo
turbo run //#fix     # root ultracite fix via Turborepo
```

Run a single app:

```bash
pnpm --filter @afenda/erp dev
pnpm --filter @afenda/docs dev
```

## Tooling

| Tool | Role |
|------|------|
| **pnpm** | Workspace + dependency catalog (`pnpm-workspace.yaml`) |
| **Turborepo** | Cached build/typecheck pipeline with global config deps |
| **Ultracite + Biome** | Local hygiene (`ultracite fix` / `ultracite check`); CI hygiene (`biome ci`) |
| **TypeScript** | Strict mode via shared `tsconfig.*` presets |
| **Vitest** | Unit tests with optional coverage (`@vitest/coverage-v8`) |

Install the recommended editor extensions: [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) and [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) (see `.vscode/extensions.json`).

## Package conventions

Every package under `packages/` follows the same baseline:

- `package.json` with explicit `exports`, `sideEffects: false`, and `files: ["dist"]`
- `src/index.ts` placeholder export (no business logic)
- `src/__tests__/` for Vitest files (kept out of library builds)
- `tsconfig.vitest.json` typechecks tests and mocks separately from production `tsconfig.json`
- `vitest.config.ts` extending shared monorepo presets from `vitest.shared.ts`
- `tsconfig.json` extending `tsconfig.library.json`
- Scripts: `build`, `dev`, `typecheck`, `test`, `clean` (lint/format run from repo root)

Packages are scoped as `@afenda/<name>` and compiled to `dist/` via TypeScript.

Next.js apps extend `tsconfig.next.json` and list `@afenda/*` packages in `transpilePackages` for workspace imports in TIP-002+.

## Testing (Vitest)

| Layer | Config | Environment |
|-------|--------|-------------|
| Root | `vitest.config.ts` — shared pool, mock hygiene, CI reporters | orchestrates all projects |
| Shared | `vitest.shared.ts` — `createNodeProject` / `createUiProject` / `createReactProject` / `createDatabaseProject` | node vs jsdom vs DB forks |
| Types | `tsconfig.vitest.json` per workspace | typechecks `__tests__` without emitting |
| Package / app | `vitest.config.ts` | one project per workspace |
| Setup | `@afenda/testing/setup/node` or `/setup/react` | jest-dom + RTL cleanup for React/jsdom |
| Mocks | `@afenda/testing/mocks/next-link` | aliased as `next/link` in Next.js app projects |

**Environment split:**

| Factory | Packages |
|---------|----------|
| `createNodeProject` | auth, kernel, permissions, observability, storage, entitlements, feature-flags, testing |
| `createDatabaseProject` | database (forks pool, serial files) |
| `createUiProject` | design-system, ui, metadata-ui (jsdom, no Next mock) |
| `createReactProject` | appshell, erp, docs (jsdom + `next/link` mock) |

**File layout:** co-locate tests under `src/__tests__/**/*.{test,spec}.{ts,tsx}` — never mix test files beside production modules.

**Test naming (team convention):**

| Suffix | Purpose |
|--------|---------|
| `*.unit.test.ts` | Pure functions, schemas, contracts |
| `*.contract.test.ts` | API/event/schema contract stability |
| `*.service.test.ts` | Domain/service behavior |
| `*.permission.test.ts` | Permission and policy rules |
| `*.integration.test.ts` | Database, auth, API bridges |
| `*.migration.test.ts` | Drizzle journal / migration integrity |
| `*.live.test.ts` | Env-gated real infra (`AFENDA_LIVE_DB_TEST=yes`) |
| `*.ui.test.tsx` | React component behavior |

Vitest `include` stays broad (`*.test.ts` / `*.spec.ts`); suffixes are conventions, not config filters.

**Quality stack (TIP-009):**

| Tool | Role |
|------|------|
| Vitest | Unit + integration + contract tests (Gate 3) |
| Playwright | Full browser E2E (future) |
| TypeScript | Type correctness (Gate 1) |
| Biome | Lint/format (Gate 2) |
| Turbo | Build + typecheck orchestration (Gates 1, 4) |
| Custom scripts | Boundaries, migrations, exports (Gates 5–7) |

```bash
pnpm check                             # ci:biome + typecheck + test
pnpm test                              # all projects
pnpm test:watch                        # watch all projects
pnpm test:coverage                     # v8 coverage (per-project reports)
pnpm test:ui                           # Vitest UI (local)
pnpm --filter @afenda/kernel test      # single workspace (node)
pnpm --filter @afenda/design-system test  # UI package (jsdom)
pnpm --filter @afenda/erp test         # Next.js app (jsdom + React)
```

## What is intentionally not included (TIP-001 scope)

- HRM, CRM, MRP, Accounting modules
- Supabase / Drizzle database connection
- Better Auth integration
- AI Copilot
- Business logic or domain models

These are planned in TIP-002 through TIP-042 per the master plan.

## Phase 1 critical path

| TIP     | Work item                         | Status   |
| ------- | --------------------------------- | -------- |
| TIP-001 | Monorepo + Turborepo Foundation   | Complete |
| TIP-002 | Next.js ERP App Shell             | Planned  |
| TIP-003 | Supabase Postgres + Drizzle       | Planned  |
| TIP-004 | Better Auth                       | Planned  |
| TIP-005 | Permission and Policy Engine      | Planned  |

## License

Private — Afenda ERP.
