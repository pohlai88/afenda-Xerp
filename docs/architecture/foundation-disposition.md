# Foundation Disposition Registry

| Field | Value |
| --- | --- |
| **Authority** | ADR-0014 |
| **Workflow** | [`foundation-delivery-authority.md`](foundation-delivery-authority.md) — **read before implementation** |
| **Source of truth** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| **Fingerprint** | `FOUNDATION-DISPOSITION-2026-06-30-v32` |
| **Enforcement** | `pnpm check:foundation-disposition` |

> **Read-only view.** This document is synced from the typed registry. Do not treat this file as authority — edit the registry (via `foundation-registry-owner`) and re-sync this view.

---

## Lane vocabulary

| Lane | Meaning |
| --- | --- |
| `red-lane` | Must be resolved before accounting agents run |
| `amber-lane` | Incomplete but bounded; safe if scope is not expanded |
| `green-lane` | Stable and consumable |
| `blue-lane` | Incubating; no production dependency |
| `black-lane` | ADR-gated; do not touch |
| `archive-lane` | Historical delivery evidence only |

---

## Registry entries

| ID | Package | Lane | Required before accounting | Remaining gaps |
| --- | --- | --- | --- | --- |
| PKG007_ADMIN | `@afenda/erp` | green-lane | yes | — |
| PKG007_CONTEXT | `@afenda/erp` | green-lane | yes | — |
| PKG013_AUDIT | `@afenda/observability` | green-lane | yes | see pas-status-index (PKG registry) |
| PKG013_LOGGING | `@afenda/observability` | green-lane | yes | see pas-status-index (PKG registry) |
| PKG003_DATABASE | `@afenda/database` | green-lane | yes | — |
| PKG006_ENTITLEMENTS | `@afenda/entitlements` | green-lane | yes | see pas-status-index (PKG registry) |
| PKG006_FEATURE_MANIFEST | `@afenda/entitlements` | green-lane | yes | see pas-status-index (PKG registry) |
| PKG010_KERNEL | `@afenda/kernel` | green-lane | yes | — |
| PKG014_PERMISSIONS | `@afenda/permissions` | green-lane | yes | — |
| PKG015_STORAGE | `@afenda/storage` | green-lane | yes | see pas-status-index (PKG registry) |
| PKG008_EXECUTION | `@afenda/execution` | green-lane | yes | — |
| PKG005_DOCS | `@afenda/docs` | blue-lane | no | see pas-status-index (PKG registry) |
| PKG011_METADATA | `@afenda/ui-composition` | green-lane | yes | see pas-status-index (PKG registry) |
| PKG012_METADATA_UI | `@afenda/metadata-ui` | amber-lane | no | see pas-status-index (PKG registry) |
| PKG016_TESTING | `@afenda/testing` | blue-lane | no | see pas-status-index (PKG registry) |
| PKG017_TS_CONFIG | `@afenda/typescript-config` | blue-lane | no | see pas-status-index (PKG registry) |
| PKG018_UI | `@afenda/ui` | amber-lane | no | see pas-status-index (PKG registry) |
| PKG001_APPSHELL | `@afenda/appshell` | amber-lane | no | see pas-status-index (PKG registry) |
| PKG002_AUTH | `@afenda/auth` | amber-lane | yes | see pas-status-index (PKG registry) |
| PKG009_FEATURE_FLAGS | `@afenda/feature-flags` | blue-lane | no | see pas-status-index (PKG registry) |
| PKGR01_ACCOUNTING | `@afenda/kernel` | green-lane | no | see pas-status-index (PKG registry) |
| PKGR01B_ERP_DOMAIN_CATALOG | `@afenda/kernel` | green-lane | no | see PAS-001B · B76–B106 |
| PKGR01C_ERP_MODULE_FOUNDATION | `@afenda/erp-module-foundation` | green-lane | no | see PAS-001C · ERP-MOD-FDN-003 |
| PKGR02_INVENTORY | `@afenda/database` | green-lane | no | see pas-status-index (PKG registry) |
| PKG004_DESIGN | `@afenda/ui` | amber-lane | no | see ADR-0025 · PAS-005B |
| PKGR05B_DESIGN_RETIREMENT | `@afenda/design-system` | archive-lane | no | retired for ERP frontend — ADR-0027 |
| PKG020_AI_GOVERNANCE | `@afenda/ai-governance` | green-lane | no | see ADR-0007 |
| PKG021_STORYBOOK | `@afenda/storybook` | blue-lane | no | — |
| PKG022_EMAIL | `@afenda/email` | blue-lane | no | — |
| PKGR02_ARCHITECTURE_AUTHORITY | `@afenda/architecture-authority` | green-lane | yes | see PAS-002A |
| PKGR03_ACCOUNTING_STANDARDS | `@afenda/accounting-standards` | blue-lane | no | see PAS-003 |
| PKGR04_ENTERPRISE_KNOWLEDGE | `@afenda/enterprise-knowledge` | green-lane | no | see PAS-004D |
| PKGR05_CSS_AUTHORITY | `@afenda/css-authority` | archive-lane | no | retired for ERP frontend — ADR-0027 |
| PKGR05A_SHADCN_STUDIO | `@afenda/shadcn-studio` | green-lane | no | sole ERP frontend design authority — PAS-006 · PKG-026 |
| PAS_AUTHORITY | `docs/PAS` | archive-lane | no | — |

> Registry `knownGaps` deprecated (always `[]`). Gap detail lives in PAS slice handoffs under [`docs/PAS/`](../PAS/README.md).

---

## Subagent contract

1. Read `foundation-disposition.registry.ts` before implementation.
2. Touch only packages assigned to your agent in `allowedAgents`.
3. Never create duplicate constants.
4. Never invent package IDs.
5. Never use markdown TIP status as runtime truth.
6. Never edit the registry unless you are `foundation-registry-owner`.
7. Output evidence paths only.

---

## Legacy delivery quarantine

Legacy delivery trees were **retired 2026-06-27**. Do not recreate them.

**New work:** follow [`foundation-delivery-authority.md`](foundation-delivery-authority.md) — PAS parent standard → registry entry → `docs/PAS/CSS-AUTHORITY/SLICE/` handoff → `afenda-coding-session` §0 → gates → runtime matrix. Index: [`PAS/README.md`](../PAS/README.md).
