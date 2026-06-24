# Afenda ERP

Monorepo for **Afenda ERP** — a Next.js-first, TypeScript-first, manufacturing-focused ERP platform.

Phase 1 is governed by [ADR-0001](docs/adr/ADR-0001-phase-1-foundation-redefinition.md). Foundation Phases 0–9 are complete; ongoing package work uses the [Foundation Disposition Registry (FDR)](docs/architecture/foundation-delivery-authority.md) (ADR-0014). Accounting runtime requires ADR + FDR gap closure — not new TIP docs.

## Repository structure

```
afenda/
├── apps/
│   ├── erp/                    # Primary ERP Next.js application (port 3000)
│   └── docs/                   # Documentation delivery surface (port 3001)
├── packages/
│   ├── architecture-authority/ # Architecture maps, validators, governance (TIP-001)
│   ├── ai-governance/          # AI-assisted development governance (TIP-002)
│   ├── design-system/          # Design tokens and UI governance (TIP-003/004)
│   ├── metadata/               # Metadata architecture authority (TIP-005)
│   ├── metadata-ui/            # Metadata UI implementation (post-TIP-005)
│   ├── ui/                     # Shared UI primitives
│   ├── appshell/               # ERP application shell (TIP-006)
│   ├── auth/                   # Identity foundation (TIP-010)
│   ├── permissions/            # Authorization and policy engine (TIP-010)
│   ├── database/               # Persistence and schema authority (TIP-011)
│   ├── observability/          # Logging, tracing, audit authority (TIP-011)
│   ├── execution/              # Durable execution registry (TIP-011)
│   ├── storage/                # Tenant-scoped storage abstraction (TIP-011)
│   ├── kernel/                 # Platform kernel and execution contracts (TIP-012)
│   ├── entitlements/           # Entitlements, limits, access gates
│   ├── feature-flags/          # Deployment flags and rollout evaluation
│   ├── testing/                # Shared test utilities and mock providers
│   └── typescript-config/      # Shared TypeScript presets
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   ├── architecture/           # Human-readable registries (source of truth)
│   ├── ai/                     # AI development governance docs
│   └── delivery/               # TIP completion reports
├── biome.jsonc                 # Biome + Ultracite presets
├── turbo.json                  # Turborepo task pipeline
└── vitest.config.ts            # Shared Vitest baseline
```

Each package declares its role in its own `README.md`. Governance packages are authority-only; implementation packages consume them.

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
pnpm check           # ci:biome + typecheck + test:run
pnpm ci              # full CI pipeline including quality gates
pnpm lint            # ultracite check (local read-only)
pnpm ci:biome        # biome ci (CI Gate 2 — format + lint + imports)
pnpm typecheck
pnpm test            # vitest watch (local)
pnpm test:run        # vitest run (CI gate)
pnpm format          # ultracite fix (local auto-fix)
pnpm fix             # ultracite fix
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
| **Ultracite + Biome** | Local hygiene (`ultracite fix` / `ultracite check`); CI hygiene (`biome ci`) |
| **TypeScript** | Full strict baseline via `@afenda/typescript-config` |
| **Vitest** | Unit tests with optional coverage (`@vitest/coverage-v8`) |

Install the recommended editor extensions: [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) and [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) (see `.vscode/extensions.json`).

## TypeScript strictness

Shared presets live in `@afenda/typescript-config`. All workspaces extend one of the **strict** presets below.

| Preset | Used by |
|--------|---------|
| `strict-node.json` | Node/library packages (kernel, auth, database, storage, …) |
| `strict-react-library.json` | React UI packages (design-system, ui, appshell, metadata-ui, testing) |
| `nextjs.json` | Next.js apps (`apps/erp`, `apps/docs`) |
| `test.json` | Vitest `tsconfig.vitest.json` overlays |

**Export rule:** build from `src/`, publish from `dist/`, import through package `exports` only — never consume another package's `src/`.

## Package conventions

Every package under `packages/` follows the same baseline:

- `package.json` with explicit `exports`, `sideEffects: false`, and `files: ["dist"]`
- `src/index.ts` as the curated public API surface
- `src/__tests__/` for Vitest files (kept out of library builds)
- `tsconfig.vitest.json` typechecks tests separately from production `tsconfig.json`
- Scripts: `build` (`tsc -b`), `dev`, `typecheck`, `test`, `test:run`, `clean`

Packages are scoped as `@afenda/<name>` and compiled to `dist/` via TypeScript project builds.

## Testing (Vitest)

| Layer | Config | Environment |
|-------|--------|-------------|
| Root | `vitest.config.ts` — shared pool, mock hygiene, CI reporters | orchestrates all projects |
| Shared | `vitest.shared.ts` — `createNodeProject` / `createUiProject` / `createReactProject` / `createDatabaseProject` | node vs jsdom vs DB forks |
| Package / app | `vitest.config.ts` | one project per workspace |

**File layout:** co-locate tests under `src/__tests__/**/*.{test,spec}.{ts,tsx}`.

**Quality stack (TIP-009):**

| Tool | Role |
|------|------|
| Vitest | Unit + integration + contract tests |
| TypeScript | Type correctness |
| Biome | Lint/format |
| Turbo | Build + typecheck orchestration |
| Custom scripts | Architecture, boundaries, migrations, exports, AI governance |

```bash
pnpm check
pnpm test:run
pnpm quality                    # architecture + AI governance + release gates
pnpm --filter @afenda/design-system test:run
```

## Architecture governance

Human-readable registries live in [`docs/architecture/`](docs/architecture/README.md). Machine enforcement runs through `@afenda/architecture-authority` and CI quality gates.

```bash
pnpm quality:architecture
pnpm quality:architecture-drift
pnpm quality:ai-governance
pnpm architecture:report
```

**20 active workspace packages** are registered (PKG-001–PKG-020). See [`docs/architecture/package-registry.md`](docs/architecture/package-registry.md).

## Phase 1 critical path (ADR-0001)

| TIP | Work item | Status |
| --- | --- | --- |
| TIP-001 | Architecture Authority | Complete |
| TIP-002 | AI Development Governance | Complete |
| TIP-003 | Design System Authority | Complete |
| TIP-004 | Design System Contracts | Complete |
| TIP-005 | Metadata Authority | Complete |
| TIP-006 | AppShell Authority | In progress |
| TIP-007 | ERP Platform Authority | In progress |
| TIP-008 | Master Data Authority | Planned |
| TIP-009 | Monorepo & Delivery Foundation | In progress |
| TIP-010 | Identity & Authorization Foundation | In progress |
| TIP-011 | Execution Foundation | In progress |
| TIP-012 | ERP Operating Spine | In progress |

TIP-013 Accounting Core is the first business-domain TIP and requires TIP-001–012 complete.

## What is intentionally deferred

- ERP business domains (Accounting, Inventory, HRM, CRM, Procurement) — TIP-013+
- AppShell authority contract closeout — TIP-006 (implementation in `packages/appshell` is underway)
- Complete ERP operating spine wiring — pending TIP-012

## Documentation

Full index: [`docs/README.md`](docs/README.md) — architecture registries, governance gates, delivery evidence, AI policy.

UI guard (gates A–F): [`docs/governance/ui-guard.md`](docs/governance/ui-guard.md)

## License

Private — Afenda ERP.
