# ARCH-EMAIL-001 · Slice 14 — Complete promotion (DoD #20 closed)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-EMAIL-001`](../../%5BComplete%5D%20ARCH-EMAIL-001-resend-transactional-email.md) |
| **Slice** | 14 |
| **Status** | **Delivered** (2026-06-26) |
| **Prerequisite** | Slice 13 ✓ · **DoD #20 sign-off Approved** (Architecture Authority · 2026-06-26) |
| **Slice type** | Evidence-sync |
| **Runtime owner** | `docs/` only |
| **Closes** | DoD #20 · §10 Complete promotion · EMAIL-P1-PEER · matrix gap row |

---

## Design (internal-guide)

- Record §10 sign-off: Reviewer **Architecture Authority**, Date **2026-06-26**, Result **Approved**.
- Rename `docs/ARCH/[Partially Implemented] ARCH-EMAIL-001-resend-transactional-email.md` → `[Complete]`.
- Sync runtime matrix, arch-status-index, fdr-status-index.
- Mark DoD #20 `[x]`; status → **Complete — enterprise 9.5 accepted** (29/30).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-EMAIL-001/slice-14-complete-promotion.md

1. Objective    — Promote ARCH-EMAIL-001 and fdr-002-email-delivery to Complete; close DoD #20 and DMARC gap row.
2. Allowed layer— docs-only
3. Files        —
   docs/ARCH/[Partially Implemented] ARCH-EMAIL-001-resend-transactional-email.md (Renamed → [Complete])
   docs/ARCH/arch-status-index.md (Modified)
   docs/architecture/afenda-runtime-truth-matrix.md (Modified)
   docs/delivery/FDR/[Partially Implemented] fdr-002-email-delivery.md (Renamed → [Complete])
   docs/delivery/fdr-status-index.md (Modified)
   docs/ARCH/slices/ARCH-EMAIL-001/slice-index.md (Modified)
   docs/ARCH/slices/ARCH-EMAIL-001/slice-14-complete-promotion.md (Modified — status)
4. Prohibited   — packages/* · apps/* · foundation-disposition.registry.ts
5. Authority    — ARCH-EMAIL-001 §10 · ADR-0014 · Architecture Authority sign-off (Approved 2026-06-26)
6. Gates        — pnpm check:documentation-drift
                  pnpm check:foundation-disposition
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp test:run -- src/app/api/webhooks/resend
```

**Sign-off record (mandatory):**

```text
DoD #20 peer review — ARCH-EMAIL-001
Reviewer: Architecture Authority
Date: 2026-06-26
PR: —
Result: Approved
Notes: Slices 1–12 reviewed; DMARC p=none published; apps/email preview deferred P3.
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 8 | DoD #20 peer review | Sign-off Approved · `[Complete]` rename |
| — | EMAIL-P1-PEER | Closed |
| — | DMARC DNS evidence | `_dmarc.nexuscanon.com` TXT attached Slice 13 |

---

## Known debt (post-Complete)

- `apps/email` preview app (P3)
- `@afenda/notifications` tenant mail (P2 separate FDR)
- DMARC policy tighten `p=none` → `quarantine` (ops advisory)
