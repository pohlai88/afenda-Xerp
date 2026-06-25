# ARCH-USER-001 · Slice 10 — Evidence-sync + Complete promotion

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-USER-001`](../../%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) |
| **Status** | **Partial sync delivered — 2026-06-25** |
| **Prerequisite** | Slice 8 ✓ · Slice 9 ✓ · ARCH-AUTH-001 Slice 8 delivered or waived |
| **Slice type** | Evidence-sync |
| **Runtime owner** | `docs/` only |
| **Closes** | DoD #1–20 (remaining) · AC index all Yes · Enterprise score ≥ 29/30 · promotion §16 |

---

## Design (internal-guide)

- Rename ARCH filename prefix `[Partially Implemented]` → `[Complete]` only when all promotion rules §16 pass.
- Set runtime matrix User Settings row to `implemented`.
- Update `arch-status-index.md` sequence — ARCH-USER-001 moves to delivered catalog.
- Sync ADR-0017 Appendix D if user-settings block rows missing.
- Enterprise score table in ARCH §8 populated with evidence paths.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-USER-001/slice-10-evidence-sync-complete.md

1. Objective    — Sync documentation evidence for ARCH-USER-001 Complete promotion: matrix, index, ARCH status prefix, enterprise score table, DoD checkboxes.
2. Allowed layer— docs/ only
3. Files        — docs/ARCH/[Partially Implemented] ARCH-USER-001-user-settings-self-service.md (Modified — rename to [Complete] if gates pass)
                  docs/ARCH/slices/ARCH-USER-001/slice-10-evidence-sync-complete.md (Modified — status)
                  docs/ARCH/arch-status-index.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md (Modified — Appendix D if gap)
4. Prohibited   — packages/* · apps/* · registry mutations
5. Authority    — ADR-0012 · documentation-drift policy · ARCH-USER-001 §16
6. Gates        — pnpm check:documentation-drift
                  pnpm check:foundation-disposition
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | matrix row |
| 9–11 | Registry/index/matrix aligned | drift gates |
| 20 | Peer review if required | Architecture Authority waiver note if applicable |

---

## Known debt

- Email change UI (ARCH-AUTH-001) may remain v2 — document as remaining gap §15, not Complete blocker if waived in §13.

---

## Delivery note

**Status:** Partial sync delivered (2026-06-25)

**Complete promotion blocked** — §16 requires DoD #20 Architecture Authority peer review; row remains `[Partially Implemented]` until sign-off. Email change UI deferred to ARCH-AUTH-001 (§15 v2 gap).

**Evidence synced:** runtime matrix User Settings row · `arch-status-index.md` · ARCH-USER-001 §8 enterprise score · §11 DoD rows · delivery phases F–H · ADR-0017 Appendix D user-settings row.
