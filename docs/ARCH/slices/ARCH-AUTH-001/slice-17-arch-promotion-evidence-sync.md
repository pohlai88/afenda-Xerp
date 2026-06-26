# ARCH-AUTH-001 · Slice 17 — §16 promotion evidence-sync

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 16 ✓ (DoD #15 · AC-02) |
| **Slice** | 17 |
| **Status** | **Delivered** 2026-06-26 |
| **Type** | Evidence-sync |
| **Risk** | Low · **Clean Core:** B→B |
| **Closes** | §16 promotion · ARCH status → Complete — enterprise 9.5 accepted |

---

## Design (internal-guide)

- Single owner of shared sync files: this slice only.
- Rename parent ARCH doc prefix to `[Complete]` when §16 gates satisfied.
- Update `arch-status-index.md`, `afenda-runtime-truth-matrix.md`, `slice-index.md`, `fdr-status-index.md` note row.
- Refresh §7 AC-02 to Delivered; DoD #15 to Delivered; §5.6 invitation.sent to Delivered.
- Record Slice 16 gate exit codes in evidence table.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-17-arch-promotion-evidence-sync.md

1. Objective    — Promote ARCH-AUTH-001 to Complete — enterprise 9.5 accepted: sync matrix, arch-status-index, fdr-status-index note, rename ARCH doc, close §16 promotion checklist after Slice 16 gate evidence.
2. Allowed layer— docs-only
3. Files        —
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md
                  docs/ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md
                  docs/ARCH/arch-status-index.md
                  docs/architecture/afenda-runtime-truth-matrix.md
                  docs/delivery/fdr-status-index.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-17-arch-promotion-evidence-sync.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-16-dod15-rbac-attestation.md
4. Prohibited   — packages/*; apps/*; foundation-disposition.registry.ts; promote without Slice 16 gate exit 0
5. Authority    — ARCH-AUTH-001 §16 · ADR-0012 · enterprise-erp-standards §3
6. Gates        —
                  pnpm check:documentation-drift
                  pnpm check:foundation-disposition
                  pnpm check:auth-user-id-rbac-boundary
                  pnpm --filter @afenda/auth test:run
7. Closes       — §16 promotion · DoD #15 refresh · AC-02 Delivered · Program DoD complete
8. Evidence     — gate exit codes · renamed ARCH path · matrix Auth row Complete · arch-status-index row
9. Attestation  — Documentation · Enterprise readiness
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 9–12 | Registry/index/matrix/FDR sync refresh | `pnpm check:documentation-drift` |
| — | §16 promotion label | doc rename + index |

---

## Known debt (documented, not blocking promotion)

| Item | Tracking |
| --- | --- |
| IdP secret rotation UX | Slice 18 backlog |
| Sign-in OAuth/passkey/SAML polish | Slice 19 backlog (optional) |
| SAML SP private keys / KMS | Env/KMS follow-up |
| FR-A01.4 deactivate → revoke sessions | Future ARCH amendment |
| FR-A05.3 workspace MFA override | Deferred |

---

## §16 promotion assessment (2026-06-26)

| §16 criterion | Status | Evidence |
| --- | --- | --- |
| Slices 1–9 delivered | ✓ | Slice 9 evidence-sync |
| FR-A05.2.1 persistence | ✓ | Slice 8a |
| FR-A05.2 ERP resolver | ✓ | Slice 8b |
| Required gates exit 0 | ✓ | Gate log below |
| Runtime evidence at Appendix A paths | ✓ | Matrix Auth row |
| Known gaps closed or waived | ✓ | AUTH-PHASE3-001 closed (13d) · SAML debt closed (15) · DoD #15 closed (16) |
| Enterprise score ≥ 95/100 | ✓ | **97/100** §8 weighted |

**Promotion decision:** Rename to `[Complete] ARCH-AUTH-001-enterprise-authentication.md` — **Approved** (Slice 17).

---

## Gate log (2026-06-26)

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm check:auth-user-id-rbac-boundary` | 0 | Prerequisite Slice 16 |
| `pnpm --filter @afenda/auth test:run` | 0 | 134/134 pass |
| `pnpm check:documentation-drift` | 0 | Pass |
| `pnpm check:foundation-disposition` | 0 | Pass |
