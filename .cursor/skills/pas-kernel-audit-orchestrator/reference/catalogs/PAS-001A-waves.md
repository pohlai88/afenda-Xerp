# PAS-001A audit wave plan

Authority: `docs/PAS/KERNEL/audit/PAS-001A.md` (AUD-01..AUD-25)

Parent PAS: `docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md`

**25 slices · integration spine proof (not wire catalog expansion)**

---

## Batch type

```text
Batch type: pas-kernel-audit-catalog
Audit catalog: docs/PAS/KERNEL/audit/PAS-001A.md
Authority PAS: docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md
```

Legacy alias: `pas-001a-audit-catalog`

---

## Waves

| Wave | AUD slots | Primary paths | Parallel |
| --- | --- | --- | --- |
| W1 | AUD-01, AUD-02, AUD-03, AUD-04 | docs/PAS, packages/kernel | YES |
| W2 | AUD-05, AUD-06, AUD-07, AUD-08 | permissions, kernel, apps/erp context | YES |
| W3 | AUD-09, AUD-10, AUD-11, AUD-12 | apps/erp, boundaries | YES |
| W4 | AUD-13, AUD-23 | ADR-0027, retired consumers | YES |
| W5 | AUD-14..AUD-19 | slice closure evidence (read-only) | YES |
| W6 | AUD-20, AUD-21 | gate shell runs | YES — parent runs gates once |
| W7 | AUD-22 | §6.1 matrix | NO |
| W8 | AUD-24 | ERP vocabulary scan | YES |
| W9 | AUD-25 | final confidence | NO — after AUD-01..24 |

---

## Repair implementer reads

`coding-consistency-bundle`, `kernel-authority`, `multi-tenancy-erp`

---

## Gate bundle (parent)

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
