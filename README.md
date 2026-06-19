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
pnpm check           # lint + typecheck + test
pnpm lint            # ultracite check (Biome lint + format)
pnpm typecheck
pnpm test
pnpm test:coverage   # vitest with v8 coverage
pnpm format          # ultracite fix (auto-fix)
pnpm format:check    # read-only format/lint check
pnpm clean           # remove build outputs across workspace
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
| **Ultracite + Biome** | Unified lint, format, and import organization |
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
- Scripts: `build`, `dev`, `lint`, `typecheck`, `test`, `format`, `clean`

Packages are scoped as `@afenda/<name>` and compiled to `dist/` via TypeScript.

Next.js apps extend `tsconfig.next.json` and list `@afenda/*` packages in `transpilePackages` for workspace imports in TIP-002+.

## Testing (Vitest)

| Layer | Config | Environment |
|-------|--------|-------------|
| Root | `vitest.config.ts` — shared pool, mock hygiene, CI reporters | orchestrates all projects |
| Shared | `vitest.shared.ts` — `createNodeProject` / `createReactProject` | node vs jsdom |
| Types | `tsconfig.vitest.json` per workspace | typechecks `__tests__` without emitting |
| Package / app | `vitest.config.ts` | one project per workspace |
| Setup | `@afenda/testing/setup/node` or `/setup/react` | jest-dom + RTL cleanup for React |
| Mocks | `@afenda/testing/mocks/next-link` | aliased as `next/link` in React projects |

**File layout:** co-locate tests under `src/__tests__/**/*.{test,spec}.{ts,tsx}` — never mix test files beside production modules.

```bash
pnpm check                             # lint + typecheck (prod + tests) + test
pnpm test                              # all projects
pnpm test:watch                        # watch all projects
pnpm test:coverage                     # v8 coverage (per-project reports)
pnpm --filter @afenda/kernel test      # single workspace
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
