# PAS-001C — ERP Module Foundation Standard

> **Platform authority** for ERP runtime module identity, readiness attestation, and foundation bundle serialization. LoB business runtime remains in ERP-MODULES slices.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001C |
| **Document class** | `platform_foundation_standard` |
| **Package** | `@afenda/erp-module-foundation` · `PKGR01C_ERP_MODULE_FOUNDATION` · `PKG-027` |
| **Parent PAS** | [PAS-001](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) (wire vocabulary) · [PAS-001B](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) (KV catalog) |
| **Slice** | ERP-MOD-FDN-003 — [handoff](SLICE/erp-mod-fdn-003-foundation-authority.md) · **Delivered** 2026-06-30 |
| **Runtime stance** | `foundation_authority` — define*/assert* helpers; **zero runtime deps** |
| **Fingerprint** | `ERP_MODULE_FOUNDATION-2026-06-30-v4` (machine: `ERP_MODULE_FOUNDATION_AUTHORITY_FINGERPRINT`) |
| **Reference bundle** | `PROCUREMENT_FOUNDATION_BUNDLE` (KV-PROC wire-phase attestation) |
| **Template** | [ERP runtime module foundation template](../ERP-MODULES/erp-runtime-module-foundation.template.md) |
| **Last reviewed** | 2026-06-30 |

---

## 0. Agent Quick Path

**PAS-001C is platform foundation — not LoB runtime.**

| Do | Don't |
| --- | --- |
| Use `defineErpRuntimeModule`, `defineModuleReadiness`, `assertModuleReadiness` | Create `packages/{module}/` without ADR + slice handoff |
| Build foundation bundles with evidence paths | Implement PO posting, DB schema, or ERP routes under PAS-001C |
| Run `pnpm check:erp-module-*` composite gates | Duplicate KV IDs or permission vocabulary in module packages |
| Reference KV-PROC bundle as exemplar | Claim operational readiness from Foundation Pass alone |

**Hard stops:**

- No `@afenda/erp-module-foundation` runtime dependencies (database, auth, kernel business logic)
- No filesystem for LoB packages without disposition registry + ADR + slice handoff
- Foundation Pass ≠ operational runtime (LAW K6 — PAS-004 atoms permit meaning only)

---

## 1. Purpose

PAS-001B closes **wire vocabulary** per ERP domain (KV-* IDs, kernel contracts-only). ERP-MODULES LoB packages still need a **platform foundation layer** that:

1. Binds runtime module identity to KV catalog parity
2. Declares readiness dimensions (authority, registry, knowledge, ownership, …)
3. Serializes attested foundation bundles for governance gates
4. Separates foundation proof from operational business runtime

PAS-001C delivers that layer in `@afenda/erp-module-foundation`.

---

## 2. Package surface

### 2.1 Identity helpers

| Export | Purpose |
| --- | --- |
| `defineErpRuntimeModule` | Governed module identity (slug, kvId, owners, lifecycle) |
| `defineErpRuntimeModuleRegistry` | Registry of runtime modules with KV catalog parity |
| `ERP_MODULE_FOUNDATION_AUTHORITY_FINGERPRINT` | Bump when PAS registry contracts change materially |

### 2.2 Dimension helpers

| Export | Purpose |
| --- | --- |
| `defineModuleReadiness` | 14-dimension readiness matrix |
| `defineModuleOwnership` | Ownership surfaces and ADR-lock paths |
| `defineModuleKnowledgeMap` | PAS-004 atom alignment |
| `defineModulePermissionBinding` | Kernel permission key parity |
| `defineModuleAuditMap` | Audit action namespace |
| `defineModuleOutboxContract` | Outbox requirement declaration |
| `defineModuleContextSpineConsumer` | IS-002 spine consumer attestation |
| `defineModuleMetadataBinding` | ERP metadata/route binding |
| `defineModuleDatabaseBoundary` | Schema boundary (often deferred) |
| `defineModuleRuntimeContract` | Runtime contract scaffold |
| `defineModuleEventCatalog` | Domain event catalog |
| `defineModuleOperationCatalog` | Operation catalog (operational phase) |
| `defineModulePolicy` | Module policy rules |

### 2.3 Assertion and reporting

| Export | Purpose |
| --- | --- |
| `assertModuleReadiness` | Fail-fast readiness assertion |
| `assertErpRuntimeModuleRegistry` | Registry parity assertion |
| `renderModuleReadinessReport` | Human-readable readiness report |
| `parseAndValidateErpModuleFoundationBundle` | Bundle ingress validation |

### 2.4 Reference exemplar

| Export | Purpose |
| --- | --- |
| `PROCUREMENT_FOUNDATION_BUNDLE` | KV-PROC reference bundle (gate-attested evidence) |
| `buildProcurementFoundationBundle` | Builder for procurement foundation dimensions |

---

## 3. Readiness dimensions

Required matrix dimensions (`READINESS_DIMENSIONS`):

| Dimension | Typical foundation level | Notes |
| --- | --- | --- |
| authority | required | ADR + disposition |
| registry | required | KV catalog + module registry |
| knowledge | required | PAS-004 atoms |
| ownership | required | Gap report / ADR-lock |
| database | deferred | Schema boundary slice |
| contextSpine | required | IS-002 consumer proof |
| permissions | required | Wire keys (enforcement operational) |
| audit | required | Wire actions (writers operational) |
| outbox | required | Contract declaration |
| metadata | required | Template / binding path |
| ui | partial / deferred | PAS-006 surfaces |
| operations | deferred | Operation catalog runtime |
| tests | required | Package + gate tests |
| gates | required | Composite check scripts |

Verdict resolution: `resolveModuleReadinessVerdict` — **Foundation Pass** requires attested evidence paths; **operational** rows may remain Fail per gap report honesty.

---

## 4. Gates

### 4.1 Composite

```bash
pnpm check:erp-module-foundation      # 9 sub-gates
pnpm quality:erp-module-foundation    # typecheck + test:run + composite
```

### 4.2 Sub-gates (live)

| Gate | Purpose |
| --- | --- |
| `check:erp-module-ownership` | Ownership ADR-lock paths |
| `check:erp-module-knowledge-alignment` | PAS-004 atom alignment |
| `check:erp-module-context-spine-consumer` | IS-002 consumer |
| `check:erp-module-permission-binding` | Permission parity |
| `check:erp-module-audit-outbox` | Audit/outbox contracts |
| `check:erp-module-metadata-binding` | Metadata binding |
| `check:erp-module-database-boundary` | DB boundary (may defer) |
| `check:erp-module-no-kernel-leak` | No kernel business logic in foundation |
| `check:erp-module-readiness` | Readiness report parity |

### 4.3 LoB-specific (when authorized)

| Gate | Module |
| --- | --- |
| `check:procurement-runtime-foundation` | PKG-R05 / ADR-0031 |
| `check:procurement-domain-contracts` | KV-PROC wire |

---

## 5. Relationship to ERP-MODULES

| Layer | PAS | Path law |
| --- | --- | --- |
| Platform foundation | PAS-001C | `@afenda/erp-module-foundation` |
| LoB runtime authority | ERP-MODULES slices + ADR | `@afenda/{module}` · `packages/procurement` (PKG-R05) |
| Features implementation (future) | Authorized slice handoff | `packages/features/erp-modules/src/{slug}/` per template |

**Sequence:** PAS-001C Delivered → ERP-PROC-FDN-001 (authority ADR) → TBD operational slices per [SLICE/README](../ERP-MODULES/SLICE/README.md).

---

## 6. Verification

| # | Command |
| --- | --- |
| 1 | `pnpm --filter @afenda/erp-module-foundation typecheck` |
| 2 | `pnpm --filter @afenda/erp-module-foundation test:run` |
| 3 | `pnpm check:erp-module-foundation` |
| 4 | `pnpm quality:erp-module-foundation` |
| 5 | `pnpm check:documentation-drift` |
| 6 | `pnpm check:foundation-disposition` |

---

## References

- [ERP Module Runtime North Star](../../NORTHSTAR/erp-module-runtime-north-star.md)
- [Procurement runtime readiness report](../ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md)
- [ADR-0031](../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
- [ERP-PROC-FDN-001](../ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md)
