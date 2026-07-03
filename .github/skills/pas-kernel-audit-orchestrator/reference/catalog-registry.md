# PAS kernel audit catalog registry

Maps audit catalog → authority, waves, gates, mandatory repair skills.

| PAS ID | Audit catalog | Authority PAS | AUD count | Final AUD | Wave plan |
| --- | --- | --- | --- | --- | --- |
| PAS-001 | `docs/PAS/KERNEL/audit/PAS-001.md` | `docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md` | 25 | AUD-25 | [PAS-001-waves.md](catalogs/PAS-001-waves.md) |
| PAS-001A | `docs/PAS/KERNEL/audit/PAS-001A.md` | `docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md` | 25 | AUD-25 | [PAS-001A-waves.md](catalogs/PAS-001A-waves.md) |
| PAS-001B | `docs/PAS/KERNEL/audit/PAS-001B.md` | `docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md` | 30 | AUD-30 | [PAS-001B-waves.md](catalogs/PAS-001B-waves.md) |

---

## PAS-001 — primary owner and scope

| Field | Value |
| --- | --- |
| Primary owner | `packages/kernel/` (vocabulary substrate) |
| Registry lane | `PKGR01_KERNEL` |
| Derived PAS | PAS-001A (integration spine) · PAS-001B (ERP wire catalog) |
| Parent PAS | none — constitutional kernel vocabulary authority |

**Audit principle:** verify PAS-001 is fully developed, enforced, and consumer-attested — not integration spine proof (001A) and not wire catalog expansion (001B).

---

## PAS-001 gate bundle (parent runs once per repair round)

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
pnpm check:documentation-drift
```

Gate-heavy waves: W5 (AUD-20), W6 (AUD-21). Parent runs full bundle before W6 worker.

---

## PAS-001B — primary owner and scope

| Field | Value |
| --- | --- |
| Primary owner | `packages/kernel/src/erp-domain/` |
| Layout contract | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| Registry lane | `PKGR01B_ERP_DOMAIN_CATALOG` |
| Parent PAS | PAS-001 (doctrine) · PAS-001A (runtime integration — must not own new wire vocab) |

**Audit principle:** verify wire catalog completeness — not domain runtime, not business glossary (PAS-004).

---

## PAS-001B gate bundle (parent runs once per repair round)

```bash
pnpm check:erp-domain-layout
pnpm check:erp-domain-delivered-vocabulary
pnpm check:accounting-domain-contracts
pnpm check:inventory-domain-contracts
pnpm check:procurement-domain-contracts
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm check:foundation-disposition
pnpm check:documentation-drift
pnpm quality:boundaries
pnpm architecture:cycles
pnpm architecture:drift
```

Gate-heavy waves: W5 (AUD-20), W9 (AUD-29). Parent runs layout + domain contract gates before W5 workers.

---

## PAS-001A gate bundle (parent runs once per repair round)

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm quality:kernel-context-surface
pnpm check:kernel-context-wire-triad
pnpm --filter @afenda/permissions typecheck
pnpm --filter @afenda/permissions test:run
pnpm check:foundation-disposition
pnpm check:documentation-drift
pnpm quality:boundaries
```

Gate-heavy waves: W6 (AUD-20, AUD-21).

---

## Repair skill bundles by PAS

| PAS | Implementer mandatory reads |
| --- | --- |
| PAS-001 | `coding-consistency-bundle`, `kernel-authority`, `architecture-authority` (+ `multi-tenancy-erp` when context/tenant attestation clusters) |
| PAS-001A | `coding-consistency-bundle`, `kernel-authority`, `multi-tenancy-erp` |
| PAS-001B | `coding-consistency-bundle`, `kernel-authority`, `architecture-authority` |

---

## Cluster signatures (common)

| Signature | Typical AUD sources (001) | Owner |
| --- | --- | --- |
| `doc-status-drift` | AUD-01, AUD-24 | documentation-drift or implementer (docs-only) |
| `boundary-runtime-leak` | AUD-02, AUD-20 | implementer `@afenda/kernel` |
| `export-rule-drift` | AUD-03 | implementer `packages/kernel/package.json` |
| `identity-vocab-drift` | AUD-04, AUD-05, AUD-06 | implementer kernel contracts |
| `context-hierarchy-drift` | AUD-07, AUD-08, AUD-09 | implementer + `multi-tenancy-erp` when ERP consumers |
| `tenant-actor-attestation-gap` | AUD-11, AUD-12, AUD-23 | implementer + attestation scripts |
| `wire-delegation-breach` | AUD-18 | implementer — route expansion to PAS-001B |
| `gate-stale-label` | AUD-21 | implementer docs + scripts |
| `slice-closure-drift` | AUD-22 | implementer docs + pas-status-index |
| `doctrine-routing-breach` | AUD-25 | implementer + hard stop review |

| Signature | Typical AUD sources (001B) | Owner |
| --- | --- | --- |
| `doc-status-drift` | AUD-01, AUD-28 | documentation-drift or implementer (docs-only) |
| `layout-ssot-drift` | AUD-04, AUD-05, AUD-20 | implementer `@afenda/kernel` |
| `kv-id-parity` | AUD-09, AUD-10 | implementer erp-domain modules |
| `export-rule-drift` | AUD-08 | implementer `packages/kernel/package.json` |
| `scaffold-gap` | AUD-06, AUD-07 | implementer erp-domain |
| `boundary-runtime-leak` | AUD-03, AUD-12 | implementer + hard stop review |
| `gate-stale-label` | AUD-29 | implementer docs + scripts |
| `registry-lane-drift` | AUD-27 | foundation-registry-owner |

---

## Checkpoint path

`.cursor/audit/checkpoints/PAS-001.json`, `PAS-001A.json`, or `PAS-001B.json`
