# Delivery TIP Status Index

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-23 |
| **Authority** | ADR-0012, ADR-0013 |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Delivery sequence** | [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md) |
| **Enforcement** | `pnpm check:documentation-drift` |

> **AI agents:** Read this index before any individual `tip-*.md` delivery doc.  
> If a delivery doc status conflicts with this index or the runtime matrix, **runtime matrix wins**.

---

## Status vocabulary

| Status | Meaning |
| --- | --- |
| **Implemented** | Runtime proof + tests/gates support completion |
| **Partially Implemented** | Some runtime exists; gaps listed |
| **Documented Only** | Planning docs only — no runtime proof |
| **Blocked** | Upstream ADR/TIP/contract missing |
| **Superseded** | Replaced by newer ADR/TIP/roadmap — evidence retained |
| **Obsolete** | Must not guide future coding |

---

## Phase 0 — Documentation truth reset

| TIP | Document | Status | Evidence |
| --- | --- | --- | --- |
| TIP-000A | [`afenda-documentation-drift-audit.md`](../architecture/afenda-documentation-drift-audit.md) | Implemented | Audit published |
| TIP-000B | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) | Implemented | Matrix published |
| TIP-000C | [`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) v5 | Implemented | v5 + stale warnings |
| TIP-000D | This index + delivery sync | Implemented | ADR-0009–0013 Accepted; drift guard |

---

## Platform authority (TIP-001–012)

| TIP | Document | Status | Evidence | Remaining gap |
| --- | --- | --- | --- | --- |
| TIP-001 | [tip-001-architecture-authority.md](tip-001-architecture-authority.md) | Implemented | CI architecture gates | Baseline fingerprint bump |
| TIP-003 | [tip-003-design-system-authority.md](tip-003-design-system-authority.md) | Implemented (authority) | Contracts, token registry | No runtime UI (by design) |
| TIP-004 | [tip-004-design-system-contracts.md](tip-004-design-system-contracts.md) | Implemented (authority) | Contracts + tests | — |
| TIP-004 | [tip-004-ui-consumption.md](tip-004-ui-consumption.md) | Implemented | ui-guard Gates D/F | Policy: governance/tip-004-policy |
| TIP-005 | [tip-005-metadata-authority.md](tip-005-metadata-authority.md) | Implemented (authority) | `@afenda/metadata` | — |
| TIP-006 | [tip-006-appshell-authority.md](tip-006-appshell-authority.md) | Partially Implemented | 92+ `.tsx`, `afenda-appshell.css` | Authority contracts missing |
| TIP-007 | [tip-007-erp-platform-authority.md](tip-007-erp-platform-authority.md) | Partially Implemented | Schemas, kernel contexts | Platform authority map |
| TIP-007/012 | [tip-007-012-enterprise-group-operating-context.md](tip-007-012-enterprise-group-operating-context.md) | Partially Implemented | Multi-tenancy slice + gates | Full route coverage |
| TIP-008A | [tip-008-master-data-authority.md](tip-008-master-data-authority.md) §008A | Partially Implemented | Entity group + ownership schemas | Consolidation resolver |
| TIP-008B | [tip-008-master-data-authority.md](tip-008-master-data-authority.md) §008B | Documented Only | — | Business master data map |
| TIP-009 | [tip-009-ci-cd-preview.md](tip-009-ci-cd-preview.md) | Implemented | Turborepo, `pnpm quality` | — |
| TIP-010 | [tip-010-api-rbac-wiring.md](tip-010-api-rbac-wiring.md) | Partially Implemented | `authorizeApiRoute`, workspace API | All routes + System Admin |
| TIP-010† | [tip-010-observability-audit.md](tip-010-observability-audit.md) | Superseded | TIP-011 observability evidence | Misnumbered — do not use as TIP-010 |
| TIP-011 | [tip-011-execution-foundation.md](tip-011-execution-foundation.md) | Partially Implemented | `@afenda/execution`, Trigger.dev | **Outbox missing** |
| TIP-011† | [tip-012-execution-foundation.md](tip-012-execution-foundation.md) | Superseded | Trigger.dev slice evidence | Misnumbered — see TIP-011 |
| TIP-012 | [tip-012-erp-operating-spine.md](tip-012-erp-operating-spine.md) | Partially Implemented | Context contracts, partial lifecycle | Outbox event publication |

† Misnumbered evidence — retained for audit trail only.

---

## UI implementation (TIP-UI)

| TIP | Document | Status | Evidence | Remaining gap |
| --- | --- | --- | --- | --- |
| TIP-UI-01 | [tip-ui-01-css-pipeline.md](tip-ui-01-css-pipeline.md) | Implemented | `globals.css`, tokens.css | — |
| TIP-UI-02 | [tip-ui-02-component-library.md](tip-ui-02-component-library.md) | Implemented | 58 components, 68+ tests | ADR-0008 batch deferred |
| TIP-UI-03 | [tip-ui-03-appshell-token-migration.md](tip-ui-03-appshell-token-migration.md) | Partially Implemented | `afenda-appshell.css` | TIP-006 + ERP shell |
| TIP-UI-04 | [tip-ui-04-metadata-ui-renderers.md](tip-ui-04-metadata-ui-renderers.md) | Partially Implemented | Section renderers, tests | ERP production wiring |
| TIP-UI-05 | [tip-ui-05-erp-app-surfaces.md](tip-ui-05-erp-app-surfaces.md) | Partially Implemented | `@afenda/ui` auth, globals.css | Module placeholders |
| TIP-UI-06 | [tip-ui-06-react19-ref-as-prop.md](tip-ui-06-react19-ref-as-prop.md) | Blocked | ADR-0008 Proposed | Package-wide batch not started |

---

## Blocked — Accounting Core (ADR-0010)

| TIP | Status | Reason |
| --- | --- | --- |
| TIP-013+ | **Blocked** | Phase 9 Accounting Readiness Gate not passed |
| `@afenda/accounting` | **Blocked** | PKG-R01 not activated |

---

## Maintenance

Update this index when:

1. A foundation TIP changes status (same PR as implementation or matrix update)
2. Runtime matrix is refreshed
3. `pnpm check:documentation-drift` fails on stale markers

*TIP-000D closeout — 2026-06-23*
