# ARCH-USER-001 · Slice 12 — Complete promotion (DoD #20 closed)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-USER-001`](../../%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) |
| **Slice** | 12 |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 11 ✓ · **DoD #20 sign-off Approved** (Architecture Authority · 2026-06-25) |
| **Slice type** | Evidence-sync |
| **Runtime owner** | `docs/` only |
| **Closes** | DoD #20 · §16 Complete promotion · matrix `implemented` |

---

## Design (internal-guide)

- Record §16 sign-off: Reviewer **Architecture Authority**, Date **2026-06-25**, Result **Approved**.
- Rename `docs/ARCH/[Partially Implemented] ARCH-USER-001-user-settings-self-service.md` → `docs/ARCH/[Complete] ARCH-USER-001-user-settings-self-service.md`.
- Update all inbound links (arch-status-index, runtime matrix, slice files, README, ADR-0017, fdr cross-refs if any).
- Set runtime matrix User Settings status → **implemented**.
- Mark DoD #20 `[x]`; status header → **Complete — enterprise 9.5 accepted** (29/30).
- Re-run Slice 11 gate matrix before promotion claim.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-USER-001/slice-12-complete-promotion.md

1. Objective    — Promote ARCH-USER-001 to Complete: record DoD #20 Approved sign-off, rename ARCH filename prefix, sync matrix/index/slice-index, close DoD #20 row.
2. Allowed layer— docs/ only
3. Files        — docs/ARCH/[Partially Implemented] ARCH-USER-001-user-settings-self-service.md (Renamed → [Complete] ARCH-USER-001-user-settings-self-service.md)
                  docs/ARCH/arch-status-index.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/ARCH/slices/ARCH-USER-001/slice-12-complete-promotion.md (Modified — status)
                  docs/ARCH/slices/ARCH-USER-001/slice-index.md (Modified)
                  docs/ARCH/slices/ARCH-USER-001/slice-08-integration-ac-closure.md (Modified — parent link)
                  docs/ARCH/slices/ARCH-USER-001/slice-09-typescript-governance.md (Modified — parent link)
                  docs/ARCH/slices/ARCH-USER-001/slice-10-evidence-sync-complete.md (Modified — parent link)
                  docs/ARCH/slices/ARCH-USER-001/slice-11-dod20-peer-review-evidence.md (Modified — parent link)
                  docs/ARCH/README.md (Modified)
                  docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md (Modified — if ARCH path cited)
                  docs/architecture/monorepo-feature-inventory.md (Modified — if ARCH-USER-001 row exists)
4. Prohibited   — packages/* · apps/* · foundation-disposition.registry.ts · fake sign-off (must use Approved 2026-06-25 record below)
5. Authority    — ARCH-USER-001 §16 · ADR-0012 · Architecture Authority sign-off (Approved 2026-06-25)
6. Gates        — pnpm check:documentation-drift
                  pnpm check:foundation-disposition
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
```

**Sign-off record (mandatory — pre-approved):**

```text
DoD #20 peer review — ARCH-USER-001
Reviewer: Architecture Authority
Date: 2026-06-25
PR: —
Result: Approved
Notes: Slice 11 gate evidence reviewed; email change UI deferred §15 v2.
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 20 | Peer review | Sign-off Approved · `[Complete]` rename |
| All §16 | Complete promotion | matrix `implemented` · drift exit 0 |

---

## Known debt (post-Complete)

- Profile email change UI — ARCH-AUTH-001 v2 (§15; documented gap, not blocker)
