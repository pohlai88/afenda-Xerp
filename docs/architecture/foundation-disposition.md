# Foundation Disposition Registry (FDR)

| Field | Value |
| --- | --- |
| **Authority** | ADR-0014 |
| **Workflow** | [`foundation-delivery-authority.md`](foundation-delivery-authority.md) — **read before implementation** |
| **Source of truth** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| **Fingerprint** | `FOUNDATION-DISPOSITION-2026-06-26-v11` |
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

| ID | Package | Lane | Required before accounting | FDR gaps |
| --- | --- | --- | --- | --- |
| PKG007_ADMIN | `@afenda/erp` | green-lane | yes | — |
| PKG007_CONTEXT | `@afenda/erp` | green-lane | yes | — |
| PKG013_AUDIT | `@afenda/observability` | green-lane | yes | see fdr-013-audit-coverage |
| PKG013_LOGGING | `@afenda/observability` | green-lane | yes | see fdr-013-logging-tracing |
| PKG003_DATABASE | `@afenda/database` | green-lane | yes | — |
| PKG006_ENTITLEMENTS | `@afenda/entitlements` | green-lane | yes | see fdr-006-entitlements |
| PKG006_FEATURE_MANIFEST | `@afenda/entitlements` | green-lane | yes | see fdr-006-feature-manifest |
| PKG010_KERNEL | `@afenda/kernel` | green-lane | yes | — |
| PKG014_PERMISSIONS | `@afenda/permissions` | green-lane | yes | — |
| PKG015_STORAGE | `@afenda/storage` | green-lane | yes | see fdr-015-tenant-storage |
| PKG008_EXECUTION | `@afenda/execution` | green-lane | yes | — |
| PKG005_DOCS | `@afenda/docs` | blue-lane | no | see fdr-005-docs-app |
| PKG011_METADATA | `@afenda/metadata` | green-lane | yes | see fdr-011-metadata-authority |
| PKG012_METADATA_UI | `@afenda/metadata-ui` | amber-lane | no | see fdr-012-metadata-renderers |
| PKG016_TESTING | `@afenda/testing` | blue-lane | no | see fdr-016-test-utilities |
| PKG017_TS_CONFIG | `@afenda/typescript-config` | blue-lane | no | see fdr-017-ts-config |
| PKG018_UI | `@afenda/ui` | amber-lane | no | see fdr-018-governed-primitives |
| PKG001_APPSHELL | `@afenda/appshell` | amber-lane | no | see fdr-001-shell-composition |
| PKG002_AUTH | `@afenda/auth` | amber-lane | yes | see fdr-002-auth-disposition |
| PKG009_FEATURE_FLAGS | `@afenda/feature-flags` | blue-lane | no | see fdr-009-rollout-flags |
| PKGR01_ACCOUNTING | `@afenda/accounting` | green-lane | no | see fdr-r01-accounting-contracts |
| TIP_ARCHIVE | `docs/delivery/tips` | archive-lane | no | — |

> Registry `knownGaps` deprecated (always `[]`). Gap detail lives in FDR `§Remaining gaps` under [`docs/delivery/FDR/`](../delivery/FDR/).

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

## TIP quarantine (archive-lane)

TIP delivery docs under `docs/delivery/tips/` are **archive-lane** historical evidence only (`TIP_ARCHIVE`). They are **not** package authority and **must not** be used for new foundation or package implementation handoffs.

**New work:** follow [`foundation-delivery-authority.md`](foundation-delivery-authority.md) — FDR delivery doc → registry entry → `afenda-coding-session` §0 → gates → runtime matrix. Index: [`fdr-status-index.md`](../delivery/fdr-status-index.md).
