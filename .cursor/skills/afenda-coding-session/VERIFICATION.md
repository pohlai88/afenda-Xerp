# Verification Command Reference

All quality gates for the Afenda monorepo. Run the narrowest gate that covers your change.

---

## Quick decision matrix

| Changed files | Minimum gate |
|---------------|-------------|
| `packages/ui/src/components/**` | `pnpm --filter @afenda/ui check:governance` + `pnpm --filter @afenda/ui test:run` |
| `packages/appshell/**` | `pnpm ui:guard:scan` + `pnpm --filter @afenda/appshell test:run` |
| `apps/erp/src/**` | `pnpm --filter @afenda/erp typecheck` + `pnpm --filter @afenda/erp test:run` |
| `packages/database/**` | `pnpm --filter @afenda/database typecheck` + `pnpm --filter @afenda/database test:run` |
| Any TypeScript | `pnpm typecheck` (full tree) |
| Any file | `pnpm ci:biome` (Biome format + lint CI check) |
| Before PR | `pnpm check` (biome + typecheck + all tests) |

---

## TypeScript

```bash
# Single package (fast)
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/appshell typecheck
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/database typecheck
pnpm --filter @afenda/kernel typecheck

# Full monorepo
pnpm typecheck
```

---

## Biome (format / lint)

```bash
pnpm format           # auto-fix formatting + lint
pnpm fix              # alias for format
pnpm lint             # check only (no fix)
pnpm ci:biome         # strict CI mode — exits non-zero on any violation
```

---

## Tests

```bash
# Full suite (watch mode)
pnpm test

# Single run (CI)
pnpm test:run

# Single package
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/appshell test:run
pnpm --filter @afenda/database test:run
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/kernel test:run

# Interaction tests only
pnpm test:interaction

# Storybook tests
pnpm test:run:storybook

# All tests (CI)
pnpm test:run:all

# With coverage
pnpm test:coverage

# Vitest UI (browser)
pnpm test:ui
```

---

## UI governance (Foundation phase 04 gates)

```bash
# Gate D — fastest: full-tree in-process scan, < 2 s
pnpm ui:guard:scan

# All gates A–F
pnpm ui:guard

# With remediation hints
pnpm ui:guard:hints

# Gate F only (React ERP quality)
pnpm ui:guard:erp

# Strict mode (Gate F as hard failure)
pnpm ui:guard:strict

# Primitive author layer only (when editing packages/ui)
pnpm --filter @afenda/ui check:governance
```

**Gate map:**

| Gate | Checks | Command |
|------|--------|---------|
| A | `@afenda/ui` author layer | `pnpm --filter @afenda/ui check:governance` |
| B | `@afenda/appshell` consumer | `pnpm --filter @afenda/appshell check:governance` |
| C | ERP consumer (governed-ui subset) | `pnpm --filter @afenda/erp test:run` |
| D | Full-tree in-process scan + anti-slop | `governed-ui-consumption.mjs` |
| E | CSS token authority | `pnpm quality:css` |
| F | React ERP quality | `react-erp-policy.mjs` |

---

## Architecture & boundary checks

```bash
# Package boundaries
pnpm quality:boundaries

# Public exports surface
pnpm quality:exports

# Database migration consistency
pnpm quality:migrations

# Architecture rules
pnpm quality:architecture

# Architecture drift detection
pnpm quality:architecture-drift

# AI governance surface
pnpm quality:ai-governance

# Multi-tenancy compliance (all sub-checks)
pnpm quality:multi-tenancy-dependency-rules
pnpm quality:multi-tenancy-context-contracts
pnpm quality:multi-tenancy-tests

# Full quality suite (all gates)
pnpm quality
```

---

## Database

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations
pnpm migrate

# Validate migration journal integrity
pnpm --filter @afenda/database db:validate-journal

# Open Drizzle Studio
pnpm --filter @afenda/database db:studio

# Seed environments
pnpm db:seed:dev
pnpm db:seed:test
```

---

## Security & CSP

```bash
# Check third-party script CSP compliance
pnpm check:csp-third-party

# ERP observability compliance
pnpm check:erp-observability

# Kernel context surface compliance
pnpm check:kernel-context-surface
```

---

## Full CI gate (run before merge)

```bash
# This is what CI runs:
pnpm ci:biome && pnpm typecheck && pnpm test:run:all && pnpm build && pnpm quality

# Shorthand for local pre-PR check:
pnpm check
```

---

## Environment

```bash
# Sync env vars
pnpm env:sync

# Diagnose env issues
pnpm env:doctor
```

---

## Storybook

```bash
# Start Storybook dev server
pnpm storybook:ui

# Build Storybook
pnpm storybook:build

# Run Storybook tests (CI)
pnpm test:run:storybook
```
