# ARCH-AUTH-002 · Slice 3 — Dedicated auth visual system (CSS)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-002`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-002-auth-shell-v2.md) |
| **Prerequisite** | Slice 2 ✓ |
| **Slice** | 3 |
| **Status** | Not started |
| **Type** | Implementation |
| **Risk** | Medium · **Clean Core:** B |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-002/slice-03-auth-visual-system.md

1. Objective    — Implement dedicated auth-shell.css with .af-auth-shell BEM namespace,
                  package-scoped CSS variables (canvas/surface/ink/brand tones),
                  responsive desktop/mobile layouts, error/status surface styling,
                  prefers-reduced-motion. Wire into package CSS export chain.
                  Migrate applicable rules from afenda-appshell-studio.css §L without breaking dist sync.
2. Allowed layer— packages/appshell/src/auth-shell-V2/** · packages/appshell/src/styles/** (import only)
3. Files        —
                  packages/appshell/src/auth-shell-V2/auth-shell-v2.css
                  packages/appshell/src/styles/afenda-appshell.css (import auth-shell-v2.css)
                  packages/appshell/package.json (export path if needed)
                  packages/appshell/src/auth-shell/*.tsx (className hooks to BEM)
                  docs/ARCH/slices/ARCH-AUTH-002/slice-index.md
4. Prohibited   — apps/erp/** · globals.css · Button/Field/Card primitive overrides
                  · .login-box / .auth-wrapper naming · neon gradients / glass soup
5. Authority    — ARCH-AUTH-002 §6.3 · package-css-dist-sync skill · figma-afenda-design-system-rules
6. Gates        —
                  pnpm sync:package-css-dist -- --package @afenda/appshell
                  pnpm check:package-css-dist-sync
                  pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
7. Closes       — P1 dedicated visual system
8. Evidence     — auth-shell.css · dist sync · responsive layout · reduced-motion media query
9. Attestation  — Visual · CSS governance · Dist sync
```

---

## Visual tokens (required)

| Variable / token | Value |
| --- | --- |
| auth canvas | `#F7F6F1` |
| auth surface | `#EFEEE9` |
| auth elevated | `#FFFFFF` |
| auth ink | `#151515` |
| auth muted | `#6E6A62` |
| auth line | `rgba(21, 21, 21, 0.10)` |
| auth brand | `#324038` |
| auth brand soft | `#DCE2DA` |
| auth warning | `#8A5A14` |
| auth critical | `#8A1F1F` |
| auth positive | `#2F5D46` |

---

## Acceptance

```text
[ ] .af-auth-shell* BEM namespace only — no prohibited class names
[ ] No Button/Input/Card styling overrides in auth-shell.css
[ ] Desktop two-panel + mobile stack layouts
[ ] Error and status surface classes present
[ ] prefers-reduced-motion respected
[ ] Package dist CSS synced and check passes
[ ] No layout jump on load
```
