# ARCH-AUTH-002 · Slice 6 — Visual QA and Storybook

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-002`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-002-auth-shell-v2.md) |
| **Prerequisite** | Slices 2–5 ✓ |
| **Slice** | 6 |
| **Status** | Not started |
| **Type** | Implementation + Evidence |
| **Risk** | Low · **Clean Core:** B |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-002/slice-06-storybook-visual-qa.md

1. Objective    — Add/update auth-shell.stories.tsx for all lanes and tones;
                  include mobile narrow viewport story; mocked form children only;
                  evidence-sync ARCH index + runtime matrix; promotion readiness review.
2. Allowed layer— packages/appshell/src/auth-shell/auth-shell.stories.tsx
                  · docs/ARCH/** · docs/architecture/afenda-runtime-truth-matrix.md
3. Files        —
                  packages/appshell/src/auth-shell/auth-shell.stories.tsx
                  docs/ARCH/slices/ARCH-AUTH-002/slice-index.md
                  docs/ARCH/arch-status-index.md (status promotion if gates pass)
                  docs/architecture/afenda-runtime-truth-matrix.md
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-002-auth-shell-v2.md (rename if promoted)
4. Prohibited   — real auth provider calls in stories · apps/erp form imports in stories
5. Authority    — afenda-storybook skill · ARCH-AUTH-002 §6 · ADR-0017 promotion pipeline
6. Gates        —
                  pnpm --filter @afenda/appshell test:run
                  pnpm --filter @afenda/appshell typecheck
                  pnpm check:auth-shell-boundary
                  pnpm check:documentation-drift
                  pnpm check:foundation-disposition
7. Closes       — P1 visual fixtures + promotion evidence
8. Evidence     — Storybook stories list · matrix row · DoD table in parent ARCH
9. Attestation  — Visual · Documentation · Promotion
```

---

## Required stories

```text
[ ] Access / Sign in
[ ] Access / Sign up
[ ] Verify / Email sent
[ ] Recover / Forgot password
[ ] Recover / Reset password
[ ] Error / Expired link
[ ] Error / Forbidden
[ ] Mobile narrow viewport
```

---

## Promotion checklist (Slice 6 close)

```text
[ ] All ARCH-AUTH-002 DoD rows satisfied or waived
[ ] Enterprise score ≥ 29/30 documented
[ ] Filename promoted to [Complete] if accepted
[ ] arch-status-index row updated
```
