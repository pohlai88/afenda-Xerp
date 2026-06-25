# ARCH-AUTH-001 Slice 10 — Waiver review + promotion assessment

**Status:** Delivered 2026-06-25  
**Type:** Evidence-sync  
**Prerequisite:** Slices 1–9 + 8a + 8b ✓ · Slice 11–12 optional before promotion  
**Risk:** Low · **Clean Core:** B→B

## Design (internal-guide)

- Reconcile §13 waivers against runtime evidence after Slice 11/12 or document accepted debt.
- Do **not** rename ARCH to `[Complete]` while AUTH-INV-001 or AUTH-MFA-UI-001 remain open unless waivers are explicitly re-attested.
- Single owner of shared sync files: this slice only (`afenda-runtime-truth-matrix.md`, `arch-status-index.md`, parent ARCH).

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-10-waiver-review-promotion.md

1. Objective    — Reconcile AUTH-INV-001, AUTH-MFA-UI-001, AUTH-PHASE3-001 waivers; update ARCH §13/§16 promotion readiness; sync matrix + arch-status-index; attest enterprise score ≥95/100.
2. Allowed layer— docs/ARCH/ · docs/architecture/ · docs/delivery/fdr-status-index.md (note row only)
3. Files        —
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md
                  docs/ARCH/arch-status-index.md
                  docs/architecture/afenda-runtime-truth-matrix.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-10-waiver-review-promotion.md
4. Prohibited   — packages/*; apps/*; foundation-disposition.registry.ts; mark Complete without §16 gates; SSO/passkey/OAuth
5. Authority    — ADR-0012 · ARCH-AUTH-001 §13 · §16 · enterprise-erp-standards §3
6. Gates        —
                  pnpm check:documentation-drift
                  pnpm check:foundation-disposition
                  pnpm --filter @afenda/auth test:run
7. Closes       — ARCH promotion assessment · DoD #9–#12 refresh · AC-11
8. Evidence     — gate exit codes · updated waiver table · matrix Auth row
9. Attestation  — Documentation · Enterprise readiness
```

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 9 | Registry/index aligned | `pnpm check:foundation-disposition` |
| 10 | Documentation drift clean | `pnpm check:documentation-drift` |
| 11 | Runtime matrix updated | matrix row edit |
| 12 | FDR cross-ref current | fdr-002 note |

## Known debt

- AUTH-PHASE3-001 remains until future ARCH amendment (explicit out-of-scope).
