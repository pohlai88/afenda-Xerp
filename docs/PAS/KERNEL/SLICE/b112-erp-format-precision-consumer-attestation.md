# Slice B112-ERP — Format Precision Consumer Attestation (PAS-001A)

> **Position:** PAS-001A consumer closure for B112 kernel vocabulary · Blueprint box: `ERP Integration Spine` · closes G-AUD13-02 consumer gap

**Prerequisite:** [B112 kernel vocabulary](./b112-rounding-decimal-precision-vocabulary-amendment.md) Delivered · [ADR-0029](../../adr/ADR-0029-rounding-decimal-precision-vocabulary.md) Accepted

**Status:** Delivered (2026-06-30)

**Type:** Consumer attestation (mirror PAS-001-AUD-13 localization ingress pattern)

**Risk class:** Low — ERP trust boundary only; no kernel vocabulary expansion

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b112-erp-format-precision-consumer-attestation.md

1. Objective    — ERP company/workspace settings persistence path parses kernel RoundingMode + DecimalPrecision at explicit ingress; governance gate attests wiring registry.
2. Allowed layer— apps/erp/src/lib/format-precision/** · scripts/governance/check-erp-format-precision-ingress-attestation.mts · package.json (gate registration)
3. Files        —
   apps/erp/src/lib/format-precision/parse-format-precision.server.ts
   apps/erp/src/lib/format-precision/format-precision-ingress.contract.ts
   apps/erp/src/lib/format-precision/persist-company-format-precision-settings.server.ts
   apps/erp/src/lib/format-precision/__tests__/parse-format-precision.server.test.ts
   apps/erp/src/lib/format-precision/__tests__/format-precision-persistence.server.test.ts
   scripts/governance/check-erp-format-precision-ingress-attestation.mts
   scripts/governance/__tests__/check-erp-format-precision-ingress-attestation.test.ts
   package.json
4. Prohibited   — packages/kernel/src/** · Intl/NumberFormat/rounding arithmetic in kernel · direct DB I/O in persistence helpers · full API route handlers
5. Authority    — PAS-001 §4.5 · ADR-0029 · B112 kernel handoff · PAS-001-AUD-13 ingress pattern · kernel-authority
6. Gates        —
   pnpm check:erp-format-precision-ingress-attestation
   pnpm --filter @afenda/erp test:run -- src/lib/format-precision
   pnpm --filter @afenda/erp typecheck
   pnpm check:documentation-drift
7. Closes       — G-AUD13-02 ERP consumer gap (company rounding mode + decimal scale ingress)
8. Evidence     — format-precision __tests__ · check:erp-format-precision-ingress-attestation PASS
9. Attestation  — Contract · Gate · Integration
```

## Wiring registry

`ERP_FORMAT_PRECISION_INGRESS_WIRING` attests one surface:

| id | Ingress delegate | Persistence delegate | Kernel delegates |
| --- | --- | --- | --- |
| company-settings | `parseCompanyFormatPrecisionSettingsAtIngress` | `persistCompanyFormatPrecisionSettings` | `parseUnknownRoundingModeVocabulary` · `parseUnknownDecimalPrecisionVocabulary` |

Both kernel delegates are invoked via `parse-format-precision.server.ts` at the company settings trust boundary.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Company wire uses kernel-aligned rounding mode + decimal precision shapes | ERP format-precision tests |
| 2 | Persistence returns wire-safe serialized vocabulary | ERP format-precision tests |
| 3 | Governance gate verifies registry + modules + tests | `pnpm check:erp-format-precision-ingress-attestation` |
| 4 | Gate registered in quality chain | `pnpm quality:erp-format-precision-ingress-attestation` |

## Deferred

- Wire into live system-admin company settings server actions when those modules exist on disk
- API route handlers for format precision settings (separate API track)
