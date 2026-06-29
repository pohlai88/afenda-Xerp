# `@afenda/kernel`

**Architecture layer:** Platform  
**Registry lane:** PKG-010 · `PKGR01_ACCOUNTING` (KV-ACCT seed) · `PKGR01B_ERP_DOMAIN_CATALOG`  
**Authority:** [PAS-001](../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) — Kernel Vocabulary Authority Standard  
**Maturity:** Enterprise Accepted · **Evidence:** runtime proven  
**Dependencies:** none (zero-runtime-deps enforced)

## What this package is

`@afenda/kernel` is the **lowest shared platform vocabulary substrate**. It defines cross-package facts, branded enterprise IDs, wire-safe operating-context contracts, execution-context primitives, and governed registries — without database, HTTP, auth, permission evaluation, UI, or domain runtime behavior.

**Doctrine:** Kernel owns words. Owner packages own decisions. Runtime layers own behavior.

Integration proof lives in [PAS-001A](../../docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) (`apps/erp` — **resolver spine owner**). ERP wire catalog expansion lives in [PAS-001B](../../docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) (`packages/kernel/src/erp-domain/`). Governance family index: [docs/PAS/KERNEL/README.md](../../docs/PAS/KERNEL/README.md).

## Agent read order (PAS-001 §0)

1. This README
2. [PAS-001 composed standard](../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) §0
3. [PAS-001-KERNEL-TREE.md](./PAS-001-KERNEL-TREE.md) — annotated filesystem map
4. Archive [PAS-001 §4](../../docs/PAS/KERNEL/archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md#4-authority-surfaces) when implementing a cited surface
5. Skill: [`.cursor/skills/kernel-authority/SKILL.md`](../../.cursor/skills/kernel-authority/SKILL.md)

## Authority surfaces (composed index)

| Surface | Path under `src/` |
| --- | --- |
| Canonical enterprise identity | `identity/` |
| Business reference identity | `identity/families/` |
| Result and error vocabulary | `result/`, errors contracts |
| Execution context | `execution/` |
| Operating context hierarchy | `context/` (wire triads: contract · assert · parser) |
| Permission / policy vocabulary | `permission/`, `policy/` |
| Domain event envelope | `events/` |
| Async context propagation | `propagation/` |
| ERP wire catalog (PAS-001B) | `erp-domain/` (28 delivered modules + `catalog`) |
| Governance / drift registry | `governance/` |

Full surface spec: PAS-001 §4 · implementation archive §4.

## Public exports

Governed by `package.json` subpaths — root, `./context`, `./erp-domain/{slug}`, `./erp-domain/catalog`, `./propagation`, `./events`, `./policy`, `./permission`, `./governance`. Layout validated by `pnpm check:kernel-package-structure`.

## Required gates (PAS-001 §13.1)

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm quality:kernel-context-surface
pnpm check:kernel-context-wire-triad
pnpm check:kernel-identity-governance
pnpm check:kernel-zero-runtime-deps
pnpm check:accounting-domain-contracts
pnpm check:foundation-disposition
pnpm quality:boundaries
pnpm architecture:cycles
pnpm architecture:drift
pnpm check:kernel-effective-dating-consumer-attestation
pnpm check:erp-auth-actor-protected-path-attestation
pnpm check:erp-tenant-lifecycle-extension-consumer-attestation
```

PAS-001B catalog gates (when touching `erp-domain/**`):

```bash
pnpm check:erp-domain-layout
pnpm check:erp-domain-delivered-vocabulary
```

## Audit status

| Catalog | Verdict |
| --- | --- |
| [PAS-001 audit](../../docs/PAS/KERNEL/audit/PAS-001.md) | 25/25 Pass · 99% confidence |
| [PAS-001A audit](../../docs/PAS/KERNEL/audit/PAS-001A.md) | 25/25 Pass |
| [PAS-001B audit](../../docs/PAS/KERNEL/audit/PAS-001B.md) | 30/30 Pass |

Checkpoints: [`.cursor/audit/checkpoints/PAS-001.json`](../../.cursor/audit/checkpoints/PAS-001.json)

## Hard stops

- No prohibited imports: `@afenda/database`, `@afenda/auth`, `@afenda/permissions`, `@afenda/execution`, `@afenda/observability`, Drizzle, React, Next.js, Zod, HTTP/DB SDKs
- No resolver spine, posting, permission evaluation, or I/O in contract modules — **`resolveOperatingContext` lives in `apps/erp` (PAS-001A)**
- New vocabulary requires PAS-001 amendment — route integration proof to PAS-001A, catalog work to PAS-001B
- Scheduled drift: `src/governance/kernel-boundary-drift.registry.ts`

## Risk mitigations (PAS-001 §14)

| Risk | Gate / artifact |
| --- | --- |
| Kernel conflated with ERP runtime | PAS-001A owns spine · `pnpm check:kernel-prohibited-ownership` · audit fail condition: kernel owns `resolveOperatingContext` |
| Fiscal IDs promoted to platform floor | [ADR-0032](../docs/adr/ADR-0032-fiscal-domain-id-authority.md) — permanent KV-ACCT quarantine · drift entry `accounting-id-forbidden-floor-symbols` closed · `pnpm check:forbidden-platform-ids` |
| Doc drift after slice close | Mirror [kernel-authority skill](../../.cursor/skills/kernel-authority/SKILL.md) · `pnpm check:documentation-drift` · sync [KERNEL family README](../../docs/PAS/KERNEL/README.md) on slice close |

## Related docs

- [Kernel North Star](../../docs/NORTHSTAR/kernel-north-star.md)
- [Kernel Blueprint](../../docs/BLUEPRINT/kernel-blueprint.md)
- [PAS status index](../../docs/PAS/pas-status-index.md)
- [Foundation disposition](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts)
