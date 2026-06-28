# Slice B74 — Metadata Context Authorization Bridge (PAS-001A §1.2 D6)

**Status:** Delivered (2026-06-29)

**Objective:** Prove metadata workspace and metadata-ui authorization paths consume verified `OperatingContext` from the ERP spine — no parallel scope resolution or untrusted client authority fields.

**Authority:** PAS-001A · TIP-004 / metadata-ui governance

**Prerequisite:** B72 Delivered

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B74 |
| **PAS** | PAS-001A |
| **Objective** | Metadata surfaces use ERP operating-context spine for RBAC |
| **Allowed layer** | `apps/erp/src/app/(protected)/metadata-workspace/**`, `apps/erp/src/lib/metadata/**`, `packages/metadata-ui/**` (consumer wiring only) |
| **Prohibited** | New kernel contracts; metadata-local tenant/company ID parsing |
| **Files (expected)** | Metadata route loaders; optional `check-metadata-context-authorization-bridge.mts` |
| **Authority** | Metadata UI · ERP Context |
| **Gates** | `pnpm check:metadata-context-authorization-bridge` (new) · `pnpm --filter @afenda/erp test:run` · `pnpm ui:guard:scan` if metadata-ui touched |

---

## Acceptance

| Check | Required |
| --- | --- |
| `metadata-workspace/page.tsx` delegates to `resolveOperatingContextFromHeaders` | Yes |
| Metadata actions reject untrusted authority fields | Yes |
| No `@afenda/database` deep imports in metadata ERP lib | Yes |
| Integration test or gate proves spine linkage | Yes |
