# ARCH-AUTH-002 · Slice 2 — Package contracts and components

> **Historical slice handoff** — superseded for coding by consolidation (2026-06-26). See parent ARCH **Current runtime** table.

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-002`](../../%5BComplete%5D%20ARCH-AUTH-002-auth-shell.md) |
| **Prerequisite** | Slice 1 ✓ |
| **Slice** | 2 |
| **Status** | Not started |
| **Type** | Implementation |
| **Risk** | Medium · **Clean Core:** B |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-002/slice-02-package-contracts-components.md

1. Objective    — Implement package-owned AUTH-SHELL-V2 contracts and components:
                  AuthShell, AuthShellEntryPage (lane prop), AuthShellFormFrame,
                  AuthShellErrorSurface (tone), AuthShellStatusSurface,
                  AuthShellLegalNotice, AuthShellAlternateAction, AuthShellEscapeAction,
                  AuthShellBrandPanel, AuthShellVisualPanel; AUTH_SHELL_LANES type.
                  Preserve working compound behavior via deprecation shims.
2. Allowed layer— packages/appshell/src/auth-shell-V2/**
3. Files        —
                  packages/appshell/src/auth-shell-V2/auth-shell-v2.tsx
                  packages/appshell/src/auth-shell-V2/auth-shell-v2.types.ts
                  packages/appshell/src/auth-shell-V2/auth-shell-v2.constants.ts
                  packages/appshell/src/auth-shell-V2/index.ts
                  packages/appshell/src/auth-shell-V2/__tests__/auth-shell-v2.contract.test.ts
                  packages/appshell/package.json (auth-shell-v2 export)
                  docs/ARCH/slices/ARCH-AUTH-002/slice-index.md
4. Prohibited   — packages/appshell/src/auth-shell/** (legacy) · apps/erp/** · packages/ui/components/**
                  · hardcoded ERP route constants in package · auth-shell.css (Slice 3)
5. Authority    — ARCH-AUTH-002 §5–§6 · TIP-004 consumer · govern-primitive skill (reference only)
6. Gates        —
                  pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
7. Closes       — P0 contract + component surface
8. Evidence     — exported types · readonly props · no provider imports · lane data attribute on root
9. Attestation  — Contract · TypeScript · Boundary
```

---

## Acceptance

```text
[ ] All props readonly on new interfaces
[ ] AUTH_SHELL_LANES exported with AuthShellLane type
[ ] AuthShell renders lane data attribute
[ ] AuthShellEntryPage accepts lane: access | verify | recover
[ ] AuthShellErrorSurface supports tone union
[ ] AuthShellStatusSurface supports tone union
[ ] No Better Auth / Supabase / apps/erp imports in auth-shell tree
[ ] No /sign-in or route href strings in package default copy
[ ] Legacy exports deprecated, not removed
[ ] typecheck exit 0
```

---

## Notes

- Refactor existing compounds (`auth-shell-entry.compound.tsx`, `auth-shell-error.compound.tsx`) to delegate to new root where practical — minimize duplicate layout logic.
- `AuthShellFormFrame` may wrap existing `AuthShellEntry.FormInner` structure initially; unify in Slice 3 when CSS lands.
