# Pattern IDs and editorial doctrines

## Pattern ID rule

**User-facing story names are not registry IDs.** Use registry/preset IDs in plans and completion reports.

| User says | Registry / preset | Storybook path | CSS |
| --- | --- | --- | --- |
| SwissNoirControlRoom | preset `afenda-brand` | `Presentation Lab/Swiss Noir Control Room` | `docs/swiss-noir.css` |
| VerdantMilkNoir | preset `afenda-verdant` | `Presentation Lab/Verdant Milk Noir` | `docs/verdant-noir.css` |
| Swiss Noir Sign In | `swiss-noir-verification-gate` | `Presentation Lab/Auth Login` | `docs/swiss-noir.css` |
| Verdant Milk Sign In | `verdant-milk-identity-vault` | `Presentation Lab/Auth Login` | `docs/verdant-noir.css` |
| Verdant Centered Portal | `verdant-centered-portal` | `Presentation Lab/Auth Login` | `docs/verdant-noir.css` |
| Swiss Noir Operator Rail | `swiss-noir-operator-rail` | `Presentation Lab/Auth Login` | `docs/swiss-noir.css` |
| P1 NoirEditorial | `p1-noir-editorial` | `Shadcn Studio/Auth Pattern Lab` | noir lab CSS + preset |
| P2–P6 | `p2-split-product-proof` … `p6-bento-trust` | Auth Pattern Lab | stock shadcn only — contrast baselines |

## Primary pattern rule

Select one primary editorial doctrine per surface.

Do not blend Swiss Noir and Verdant Milk Noir inside one production surface unless the task is explicitly a comparison story, transition study, or design exploration.

**Allowed:**

- Swiss Noir page
- Verdant Milk Noir page
- side-by-side comparison story

**Not allowed:**

- Swiss grid + Verdant jewel + random hybrid login

## Registry ID ↔ contract slug (login)

Auth registry IDs and login contract slugs **both appear in code** — use the bridge, never treat story titles as IDs.

| Registry ID | Contract slug | Bridge export |
| --- | --- | --- |
| `swiss-noir-verification-gate` | `swiss-noir` | `AUTH_PATTERN_TO_LOGIN_PATTERN` |
| `verdant-milk-identity-vault` | `verdant-milk-noir` | same (in `presentation-lab-login.contract.ts`) |
| `verdant-centered-portal` | `verdant-portal-noir` | same |
| `swiss-noir-operator-rail` | `swiss-noir-operator-rail` | same |

Phase 0 and completion reports: **registry ID** for pattern selection; **contract slug** for `pattern` prop and copy keys.

P1: legacy palette demo on `AuthNoirShell` — superseded for login. P2–P6: never editorial source unless contrast exploration.

## Surface classification

| Surface | Default pattern |
| --- | --- |
| Presentation Lab landing | Swiss Noir or Verdant Milk Noir (preset) |
| Login / sign-in | `verdant-milk-identity-vault` or `swiss-noir-verification-gate` |
| ERP dashboard | Verdant Milk Noir |
| Marketing / investor | Swiss Noir |
| Long-hour operator | Verdant Milk Noir |
| Contrast exploration | P1–P6 with explicit rubric only |

## Swiss Noir doctrine

**Feels like:** private verification chamber · editorial control room · technical authority · brutal Swiss scale · monochrome discipline

**Required:** massive editorial word · hard grid · proof strip (landing only) · mono system text · dark canvas · floating chamber

**Forbidden:** SaaS card grid · playful color · friendly startup panels · generic "welcome back" · decorative gradients without purpose

**CSS:** per-story `docs/swiss-noir.css` · `.theme-afenda-brand` · `--lab-*`

## Verdant Milk Noir doctrine

**Feels like:** long-hour readable · green-black luxury · calm enterprise confidence · ghost hero · gold hairline · jewel panel

**Required:** quiet ghost hero · milk typography · floating jewel · gold hairline · green-black atmosphere · calm verification copy

**Forbidden:** noisy luxury · lifestyle/fashion feel · random gold · proof strip on login (unless requested) · generic SaaS login

**CSS:** per-story `docs/verdant-noir.css` · `.theme-afenda-verdant-milk-noir` · `--afenda-*`
