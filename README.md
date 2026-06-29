# Afenda ERP

Monorepo for **Afenda ERP** — a Next.js-first, TypeScript-first, manufacturing-focused ERP platform.

Foundation work is governed by [Package Authority Standards (PAS)](docs/PAS/README.md) and the [Foundation Disposition Registry](packages/architecture-authority/src/data/foundation-disposition.registry.ts). ERP frontend presentation follows [ADR-0027](docs/adr/ADR-0027-frontend-presentation-reset.md) and [PAS-006](docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md).

## Repository structure

```
afenda/
├── apps/
│   ├── erp/                    # ERP Next.js skeleton (auth + health + shell)
│   ├── storybook/              # shadcn-studio block lab
│   └── docs/                   # Documentation delivery surface
├── packages/
│   ├── architecture-authority/ # Architecture maps, validators, governance (PAS-002)
│   ├── shadcn-studio/          # Sole ERP presentation package (PAS-006)
│   ├── accounting-standards/   # Accounting standards authority (PAS-003)
│   ├── enterprise-knowledge/   # Enterprise knowledge atoms (PAS-004)
│   ├── ai-governance/          # AI-assisted development governance
│   ├── auth/                   # Identity foundation
│   ├── permissions/            # Authorization and policy engine
│   ├── database/               # Persistence and schema authority
│   ├── observability/          # Logging, tracing, audit authority
│   ├── execution/              # Durable execution registry
│   ├── storage/                # Tenant-scoped storage abstraction
│   ├── kernel/                 # Platform kernel and execution contracts (PAS-001)
│   ├── entitlements/           # Entitlements, limits, access gates
│   ├── feature-flags/          # Deployment flags and rollout evaluation
│   ├── testing/                # Shared test utilities and mock providers
│   └── typescript-config/      # Shared TypeScript presets
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   ├── PAS/                    # Package Authority Standards (canonical)
│   ├── NORTHSTAR/              # Domain north stars
│   └── BLUEPRINT/              # Domain blueprints
├── biome.jsonc                 # Biome + Ultracite presets
├── turbo.json                  # Turborepo task pipeline
└── vitest.config.ts            # Shared Vitest baseline
```

**Retired (ADR-0027):** `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/css-authority` — removed from the filesystem. Do not restore without a new ADR.

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
pnpm --filter @afenda/storybook storybook
pnpm --filter @afenda/docs dev
```

## Tooling

| Tool                  | Role                                                                         |
| --------------------- | ---------------------------------------------------------------------------- |
| **pnpm**              | Workspace + dependency catalog (`pnpm-workspace.yaml`)                       |
| **Turborepo**         | Cached build/typecheck pipeline with global config deps                      |
| **Ultracite + Biome** | Local hygiene (`ultracite fix` / `ultracite check`); CI hygiene (`biome ci`) |
| **TypeScript**        | Full strict baseline via `@afenda/typescript-config`                         |
| **Vitest**            | Unit tests with optional coverage (`@vitest/coverage-v8`)                    |

Install the recommended editor extensions: [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) and [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) (see `.vscode/extensions.json`).

## TypeScript strictness

Shared presets live in `@afenda/typescript-config`. All workspaces extend one of the **strict** presets below.

| Preset                      | Used by                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| `strict-node.json`          | Node/library packages (kernel, auth, database, storage, …)            |
| `strict-react-library.json` | React packages (`@afenda/shadcn-studio`, `@afenda/testing`)         |
| `nextjs.json`               | Next.js apps (`apps/erp`, `apps/docs`)                                |
| `test.json`                 | Vitest `tsconfig.vitest.json` overlays                                |

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

| Layer         | Config                                                                                                        | Environment               |
| ------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Root          | `vitest.config.ts` — shared pool, mock hygiene, CI reporters                                                  | orchestrates all projects |
| Shared        | `vitest.shared.ts` — factories per workspace pattern                                                          | node · jsdom · DB forks   |
| Package / app | `vitest.config.ts`                                                                                            | one project per workspace |

**File layout:** co-locate tests under `src/__tests__/**/*.{test,spec}.{ts,tsx}`.

```bash
pnpm check
pnpm test:run
pnpm quality                    # architecture + AI governance + release gates
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/storybook storybook:build
```

## Architecture governance

Human-readable registries live in [`docs/PAS/`](docs/PAS/README.md). Machine enforcement runs through `@afenda/architecture-authority` and CI quality gates.

```bash
pnpm quality:architecture
pnpm quality:architecture-drift
pnpm quality:ai-governance
pnpm architecture:report
pnpm check:downstream-integration   # ADR-0027 presentation chain
```

See [`packages/architecture-authority/src/data/package-registry.data.ts`](packages/architecture-authority/src/data/package-registry.data.ts).

## Foundation status (PAS)

Ongoing package work uses [Package Authority Standards (PAS)](docs/PAS/README.md) and the [slice closure registry](docs/PAS/pas-status-index.md).

ERP frontend presentation: [ADR-0027](docs/adr/ADR-0027-frontend-presentation-reset.md) · [PAS-006](docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md).

Accounting runtime (`PKGR01_ACCOUNTING`) requires ADR-0010 **and** registry gap closure.

## What is intentionally deferred

- ERP business domains (Accounting, Inventory, HRM, CRM, Procurement) — rebuild on shadcn-studio post-reset
- Metadata workspace UI — greenfield on PAS-006, not legacy package revival
- Accounting Core ledger runtime — ADR-0010 gate

## Documentation

Full index: [`docs/README.md`](docs/README.md) — architecture registries, governance gates, delivery evidence, AI policy.

Presentation skill: [`.cursor/skills/shadcn-studio/SKILL.md`](.cursor/skills/shadcn-studio/SKILL.md)

## License

Private — Afenda ERP.
