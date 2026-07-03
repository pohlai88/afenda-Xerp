# Editorial login — quality gates (dry-run SSOT)

Use with **`afenda-editorial-bundle`** when touching Presentation Lab login, auth patterns, or noir CSS. Derived from Verdant Milk / Swiss Noir lab dry run — not generic UI checklist.

## Pattern ID bridge (mandatory in plans)

Registry IDs and contract slugs **differ by design**. Never conflate them in Phase 0 or completion reports.

| Registry ID (`auth-pattern-lab.registry.ts`) | Contract slug (`presentation-lab-login.contract.ts`) |
| --- | --- |
| `swiss-noir-verification-gate` | `swiss-noir` |
| `verdant-milk-identity-vault` | `verdant-milk-noir` |
| `verdant-centered-portal` | `verdant-portal-noir` |
| `swiss-noir-operator-rail` | `swiss-noir-operator-rail` |

Bridge constants: `AUTH_PATTERN_TO_LOGIN_PATTERN` / `LOGIN_PATTERN_TO_AUTH_PATTERN` in the login contract.

**Plans and reports:** use registry ID for pattern selection; use contract slug for `pattern` prop and copy keys.

## Surface boundaries

| Surface | Pattern | Proof strip | Production |
| --- | --- | --- | --- |
| Control Room landing | preset `afenda-brand` | yes | N/A (lab) |
| Verdant landing | preset `afenda-verdant` | yes | N/A (lab) |
| Auth Login (Swiss) | `swiss-noir-verification-gate` | **no** | Stage A only |
| Auth Login (Verdant vault) | `verdant-milk-identity-vault` | **no** | Stage A only |
| Auth Login (Verdant portal) | `verdant-centered-portal` | **no** | Stage A only |
| Auth Login (Swiss rail) | `swiss-noir-operator-rail` | **no** | Stage A only |
| ERP `/sign-in` | `login-page-04` (P2-class) | n/a | **production today** |
| P2–P6 | contrast baselines | varies | never editorial SSOT |

## Pre-edit confusion stops

Stop and surface — do not guess:

1. **Registry ID vs contract slug** — map via bridge table above.
2. **Lab vs ERP** — lab login edits do not change `/sign-in` unless Stage C + explicit promotion request.
3. **Copy v1 vs v2** — contract still uses human labels (`Sign in`, `Forgot password?`); aspirational copy (`Verify access`) is a **separate intentional PR** — do not silently rewrite while tests lock v1.
4. **OAuth gap** — lab login is email/password only; production `login-page-04` has Google/GitHub. OAuth belongs in **Stage B/C promotion**, not ad-hoc lab patches unless spec says so.
5. **CSS scope** — one noir CSS file per story loader; dual import only for `SideBySideComparison`.

## Visual acceptance (login)

| Check | Pass criteria |
| --- | --- |
| Editorial poster hierarchy | Hero dominates; form is secondary jewel |
| No proof strip | No metric tiles, PAS counts, or `07`-style strips |
| Contract class names | Inputs/labels/submit from `presentation-lab-login.contract.ts` |
| Copy from contract | No inline strings in TSX (including placeholders) |
| Per-story CSS | `swiss-noir.css` OR `verdant-noir.css` — static import in dedicated story file; not dynamic loaders | comparison |
| Storybook preview evidence | Mandatory in completion report (URL or MCP `preview-stories` result) |
| Pattern ID in report | Registry ID + contract slug both stated |

## Known gaps (track; do not hide)

| Gap | Status | Owner slice |
| --- | --- | --- |
| Pattern ID bridge | resolved | `AUTH_PATTERN_TO_LOGIN_PATTERN` in contract + skill refs |
| Inline placeholders / dual CSS import | resolved | contract fields + per-story loaders |
| Copy v2 (`Verify access`, editorial recovery) | backlog | intentional copy PR |
| OAuth in lab login | backlog | Stage B auth-shell |
| `login-page-04-form` stray fields / P2 copy | production debt | Stage C promotion |
| Editorial bundle Cursor hook (V002) | infra backlog | hooks / governance |
| `docs-editorial-design` catalog ghost | docs | Fumadocs-only or remove |

## Gates (when paths touched)

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm test -- presentation-lab-login.contract
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio   # if noir CSS edited
pnpm check:package-css-dist-sync                                 # after CSS sync
```

Storybook: MCP `preview-stories` for `Presentation Lab/Auth Login/*` (or literal Storybook URL) before marking complete.

## Anti-routes

| Do not | Use instead |
| --- | --- |
| shadcn `/iui` as aesthetic SSOT | `afenda-editorial-lab` + lab registries |
| OSS `frontend-design` | `afenda-editorial-bundle` |
| Merge editorial into `afenda-presentation-quality` | keep separate bundle |
| Edit ERP `/sign-in` during Stage A lab work | `afenda-presentation-promotion` Stage C only |
