# Editorial compose — templates

## Design plan (required before first edit)

```txt
Surface:
Selected pattern / preset:
Reason:
Layout invariant: (from registry thesis)
Typography roles: (display / editorial / mono from contract)
Signature element: (orb | ghost hero | jewel panel | proof strip)
Proof element: (landing yes / login no)
Form treatment:
CSS source: (swiss-noir.css | verdant-noir.css — per-story import at story/module boundary)
Contract source:
Storybook target: (title path)
Promotion stage: (A-lab | B-auth-shell | C-erp | none)
Risks:
```

**CSS import rule:** CSS must be imported at the story/module boundary, not inside shared production TSX, unless the promoted package explicitly owns that CSS import.

## Pattern selection

| Pattern id | Use when |
| --- | --- |
| `swiss-noir-verification-gate` | Login — drama, authority, control-room |
| `verdant-milk-identity-vault` | Login — long-hour calm; ERP default candidate |
| preset `afenda-brand` + landing | Presentation / marketing / control room |
| preset `afenda-verdant` + landing | Presentation / dashboard calm luxury |
| `p1-noir-editorial` | AuthNoirShell palette exploration only |
| `p2`–`p6` | Contrast lab only — never editorial source |

## Copy register

Edit contract files — never inline copy in TSX. SSOT: `presentation-lab-login.contract.ts`.

**Avoid (new copy):** Welcome back · Sign in to your account · Enter your credentials

**Preferred (aspirational):** Verify access · Operator identity · Session proof · Workspace sealed

## Completion report template

```txt
Pattern:
Preset:
Surface:
Promotion stage: (A-lab | B-auth-shell | C-erp | none)
Design plan: written yes
Files changed:
Preview evidence (mandatory): Storybook URL or Storybook MCP preview-stories result
Gates run:
Acceptance checklist:
Known gaps:
Promotion status:
```

## Example — Verdant Milk sign-in

```txt
Pattern: verdant-milk-identity-vault
Preset: afenda-verdant
Surface: login
Promotion stage: A-lab
Design plan: written yes — ghost hero, jewel panel, no proof strip

Files changed:
- packages/shadcn-studio/src/storybook/presentation-lab/presentation-lab-login.tsx
- packages/shadcn-studio/src/storybook/presentation-lab/presentation-lab-login.contract.ts
- packages/shadcn-studio/src/storybook/presentation-lab-login.stories.tsx

Preview evidence (mandatory): Storybook MCP preview-stories → Presentation Lab/Auth Login/VerdantMilkNoir

Gates run:
- pnpm --filter @afenda/shadcn-studio typecheck
- pnpm test:run presentation-lab-login.contract
- pnpm sync:package-css-dist -- --package @afenda/shadcn-studio (if CSS touched)

Acceptance checklist: 9/9 pass
Known gaps: ERP /sign-in still login-page-04 (by design); copy v1 vs aspirational v2 (separate PR)
Promotion status: none — A-lab only
```

## Visual acceptance checklist

| Check | Required |
| --- | --- |
| Editorial poster hierarchy | yes |
| Login form secondary to atmosphere | yes |
| Floating chamber/jewel intentional | yes |
| No SaaS card grid | yes |
| No random decoration | yes |
| Typography role separation | yes |
| Contract class names used | yes |
| Preview evidence in completion report | yes |
| `pnpm sync:package-css-dist` if CSS edited | yes |

## Known gaps (dry-run backlog)

Do not silently "fix" these during unrelated slices — copy applicable rows into completion report `Known gaps:`.

| Gap | Action |
| --- | --- |
| Copy v1 (`Sign in`, `Forgot password?`) vs aspirational v2 | Separate intentional copy PR; tests lock v1 today |
| Lab login lacks OAuth (production `login-page-04` has Google/GitHub) | B-auth-shell / C-erp promotion; wire `auth-access-form-fields` then |
| ERP `login-page-04-form` P2-class copy / stray fields | C-erp promotion only |
| Dual noir CSS at story module top | resolved — one static CSS import per story file (`presentation-lab-login-*-stories.tsx`); gate `pnpm check:storybook-noir-css-imports` |
| Inline placeholders in TSX | resolved — contract fields `emailPlaceholder`, `passwordPlaceholder` |

Full checklist: [using-afenda-skills/reference/editorial-login-quality.md](../../using-afenda-skills/reference/editorial-login-quality.md)
