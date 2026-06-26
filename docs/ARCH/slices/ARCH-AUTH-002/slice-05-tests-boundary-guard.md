# ARCH-AUTH-002 · Slice 5 — Tests and governance guard

> **Historical slice handoff** — superseded for coding by consolidation (2026-06-26). Boundary guard enforces single `(auth)` segment only.

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-002`](../../%5BComplete%5D%20ARCH-AUTH-002-auth-shell.md) |
| **Prerequisite** | Slices 2–4 ✓ |
| **Slice** | 5 |
| **Status** | Not started |
| **Type** | Implementation + Governance |
| **Risk** | Low · **Clean Core:** B |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-002/slice-05-tests-boundary-guard.md

1. Objective    — Add/update package tests for AuthShell, error surface, status surface;
                  implement scripts/governance/check-auth-shell-boundary.mts;
                  wire pnpm check:auth-shell-boundary in root package.json.
2. Allowed layer— packages/appshell/src/auth-shell/__tests__/**
                  · scripts/governance/** · package.json (root)
3. Files        —
                  packages/appshell/src/auth-shell/__tests__/auth-shell.test.tsx
                  packages/appshell/src/auth-shell/__tests__/auth-shell-error-surface.test.tsx
                  packages/appshell/src/auth-shell/__tests__/auth-shell-status-surface.test.tsx
                  scripts/governance/check-auth-shell-boundary.mts
                  package.json (check:auth-shell-boundary script)
                  docs/ARCH/slices/ARCH-AUTH-002/slice-index.md
4. Prohibited   — weakening existing tests · skipping guard failures · apps/** unless guard targets app paths read-only
5. Authority    — ARCH-AUTH-002 §10 · ARCH-TEST-001 vitest patterns · governed-ui-consumption patterns
6. Gates        —
                  pnpm --filter @afenda/appshell test:run
                  pnpm check:auth-shell-boundary
                  pnpm quality:boundaries (if script exists)
7. Closes       — P1 anti-drift guard + test coverage
8. Evidence     — test files · guard exit 0 · boundary checks listed in ARCH §11
9. Attestation  — Test · Governance · Security copy
```

---

## Test expectations

```text
[ ] renders one main landmark
[ ] renders title as h1
[ ] renders lane data attribute
[ ] renders children inside form frame
[ ] renders alternate action when supplied
[ ] renders legal notice when supplied
[ ] error surface does not expose raw technical error by default
[ ] status surface supports info/positive/warning/neutral tones
[ ] shell does not import app route constants
```

---

## Boundary guard checks

```text
[ ] apps/erp/(auth) does not define shell-level CSS classes (.login-*, .auth-wrapper, .auth-card, .auth-shell-*)
[ ] apps/erp/(auth) does not import auth-shell internal files (deep paths)
[ ] packages/appshell/auth-shell does not import apps/erp
[ ] packages/appshell/auth-shell does not import better-auth or @supabase/*
[ ] auth pages consume exported auth-shell components only (public export path)
```

---

## Acceptance

```text
[ ] All new tests pass
[ ] check:auth-shell-boundary exits 0 on clean tree
[ ] Guard fails when intentional violation injected (manual verify or guard self-test)
```
