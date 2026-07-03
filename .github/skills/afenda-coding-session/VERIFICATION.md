# Verification Command Reference

All quality gates for the Afenda monorepo. Run the narrowest gate that covers your change.

---

## Quick decision matrix

| Changed files | Minimum gate |
|---------------|-------------|
| `packages/shadcn-studio/**` | `pnpm --filter @afenda/shadcn-studio typecheck` + `pnpm check:studio-metadata-binding` |
| `apps/erp/src/lib/metadata/**` | `pnpm check:erp-metadata-pas006-consumer` + `pnpm --filter @afenda/erp typecheck` |
| `apps/erp/src/**` | `pnpm --filter @afenda/erp typecheck` + `pnpm --filter @afenda/erp test:run` |
| `packages/database/**` | `pnpm --filter @afenda/database typecheck` + `pnpm --filter @afenda/database test:run` |
| Any TypeScript | `pnpm typecheck` (full tree) |
| Any file | `pnpm ci:biome` (Biome format + lint CI check) |
| Before PR | `pnpm check` (biome + typecheck + all tests) |

---

## TypeScript

```bash
# Single package (fast)
pnpm --filter @afenda/shadcn-studio typecheck
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
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/database test:run
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

## ERP presentation gates (PAS-006 · ADR-0027)

```bash
# Studio manufacturing + metadata binding
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers

# ERP IS-003 consumer parity
pnpm check:erp-metadata-pas006-consumer

# Type safety
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/erp typecheck

# CSS dist sync (after studio CSS src edits)
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
pnpm check:package-css-dist-sync
```

**Removed for ERP:** `pnpm ui:guard*` — scripts removed per ADR-0027. Use PAS-006 gates in the ERP presentation section above.

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
