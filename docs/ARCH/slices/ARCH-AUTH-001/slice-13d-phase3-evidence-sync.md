# ARCH-AUTH-001 · Slice 13d — Phase 3 evidence-sync + Complete assessment

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Amendment** | [`slice-13-phase3-amendment-draft.md`](./slice-13-phase3-amendment-draft.md) — **Accepted 2026-06-25** |
| **Prerequisite** | Slices 13a ✓ · 13b ✓ · 13a-debt ✓ · 13c ✓ |

**Prerequisite evidence:** All Phase 3 implementation slices Delivered; runtime matrix Auth row lists SSO + passkey + OAuth paths.
| **Slice** | 13d |
| **Status** | **Not started** |
| **Type** | Evidence-sync |
| **Risk** | Low · **Clean Core:** A |
| **Closes** | FR-A06.5 · AUTH-PHASE3-001 waiver |

---

## Design (internal-guide)

- Sync `afenda-runtime-truth-matrix.md` Auth row — SSO, passkey, OAuth evidence paths.
- Update parent ARCH: FR-A06.5 ✓; AUTH-PHASE3-001 **Closed**; slice catalog 13a–13d Delivered; §Remaining gaps trimmed.
- Update `docs/ARCH/arch-status-index.md` — next step off AUTH-AUTH-001 Phase 3 or promotion note.
- Update `slice-index.md` — all Phase 3 slices Delivered.
- **Complete assessment:** Run enterprise readiness score (target ≥95/100 per Slice 9 pattern). ARCH filename stays **`[Partially Implemented]`** unless §16 DoD + waiver table fully green — **do not rename to `[Complete]`** without Architecture Authority sign-off on all ARCH DoD rows.
- Reconcile SAML claim vs evidence — if SAML admin UI still deferred, document explicitly in §Known debt (not closed as FR-A06.1 SAML).
- Gate consolidation table citing 13a–13c + 13a-debt gate results.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-13d-phase3-evidence-sync.md

1. Objective    — Close AUTH-PHASE3-001 waiver with evidence-sync: matrix, ARCH parent, slice index, arch-status-index, and enterprise readiness attestation for Phase 3 (SSO, passkey, OAuth) — docs-only.
2. Allowed layer— docs/ARCH/ · docs/architecture/afenda-runtime-truth-matrix.md
3. Files        —
                  docs/ARCH/slices/ARCH-AUTH-001/slice-13d-phase3-evidence-sync.md (Modified — status)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md (Modified)
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md (Modified — FR-A06.5 · waiver closure · Phase 3 evidence table)
                  docs/ARCH/arch-status-index.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — Auth Phase 3 row)
                  docs/delivery/FDR/[Complete] fdr-002-auth-disposition.md (Modified — cross-ref only if required by drift guard)
4. Prohibited   — packages/*; apps/*; foundation-disposition.registry.ts; rename ARCH to [Complete] without full §16 DoD pass; @afenda/accounting; ADR-0010 Accounting Core
5. Authority    — ADR-0012 · ARCH-AUTH-001 Slice 13 amendment · enterprise-erp-standards §3 · documentation-drift guard
6. Gates        —
                  pnpm check:documentation-drift
                  pnpm check:foundation-disposition
7. Closes       — FR-A06.5 · AUTH-PHASE3-001
8. Evidence     — matrix Auth row · ARCH waiver table · consolidated gate table in slice-13d doc
9. Attestation  — Documentation · Enterprise readiness score
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| FR-A06.5 | Phase 3 evidence-sync; AUTH-PHASE3-001 closed | `check:documentation-drift` |

---

## Known debt (carry forward post-13d)

- SAML admin UI + upsert (explicit deferral — not FR-A06.1 complete for SAML)
- IdP secret rotation UX
- Sign-in page passkey autofill / OAuth buttons (optional polish)
- ARCH `[Complete]` filename — separate promotion slice if §16 gaps remain outside Phase 3
