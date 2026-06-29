# ADR-0028 — Business Reference Document and Asset Authority Promotion

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-29 |
| **Owner** | Architecture Authority |
| **Related** | ADR-0020, ADR-0021, PAS-001 §4.7 |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

PAS-001-AUD-05 found **Conditional Pass** on business reference identity: kernel already registers seven families (`customer`, `supplier`, `product`, `employee`, `warehouse`, `document`, `asset`), but `document` and `asset` remained in `TBD_BUSINESS_MASTER_DATA_ENTITIES` without wire triads or architecture-authority registry rows.

Kernel owns **reference ID vocabulary only**; domain packages own lifecycle. Document and asset require the same split as the five core BMD entities promoted under ADR-0020.

---

## Decision

1. **Promote** `document` and `asset` into `BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY` with `runtimeStatus: "authority_only"`.
2. **Assign reserved packages** (no filesystem scaffold until dedicated ADR):
   - Document → `@afenda/document-management` (Document Management Authority)
   - Asset → `@afenda/asset-management` (Asset Management Authority)
3. **Add kernel wire triads** — `DocumentWireReference`, `AssetWireReference` with parse-at-ingress branding (PAS-001 §4.7).
4. **ERP ingress attestation** — all seven BMD families expose `parseRoute*Id` helpers validated by governance gate.
5. **Database consumer attestation** — warehouse master-data contracts remain aligned with kernel `WarehouseWireReference` (ADR-0020 contract-first model).

---

## Consequences

- `TBD_BUSINESS_MASTER_DATA_ENTITIES` is empty; all seven families are governed.
- Domain packages for document/asset remain **unscaffolded** until a future ADR activates PKG-R06/R07 runtime.
- No kernel CRUD, persistence, or business lifecycle code is introduced.

---

## Verification

- `pnpm --filter @afenda/architecture-authority test:run`
- `pnpm --filter @afenda/kernel test:run`
- `pnpm check:erp-business-reference-ingress-attestation`
- `pnpm check:kernel-identity-governance`
