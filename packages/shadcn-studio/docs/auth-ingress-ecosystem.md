# Auth ingress ecosystem

> **Authority:** [PAS-006A](../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) · [AGENTS.md](../AGENTS.md) § Auth ingress bucket · ERP [`auth-path.registry.ts`](../../../apps/erp/src/lib/auth/auth-path.registry.ts)

Pre-auth **presentation** lives in `components-auth-shell/`. Sessions, cookies, and Better Auth runtime live in `@afenda/auth`. Route policy lives in `@afenda/permissions` and ERP proxy.

---

## Three-zone boundary

| Zone | Package / path | Owns |
| --- | --- | --- |
| **Runtime** | `@afenda/auth` | Better Auth, OAuth, passkey, SSO, 2FA, email OTP |
| **Presentation** | `components-auth-shell/` | MCP auth blocks, `AuthShell`, resolver |
| **Lab shell** | `storybook/auth-noir-shell.tsx` | L4 only — editorial Noir wrapper for Pattern Lab P1 |
| **Policy** | `@afenda/permissions` + ERP proxy | RBAC, protected routes |

**Hard stop:** no `@afenda/auth` imports inside `@afenda/shadcn-studio`.

---

## Lanes and paths

### Routing lanes (`AuthLane` — 7)

`access` · `verify` · `recover` · `invite` · `workspace` · `security`

SSOT: `AUTH_LANES` and `AUTH_PATH_LANE_MAP` in [`auth-path.registry.ts`](../../../apps/erp/src/lib/auth/auth-path.registry.ts).

### Form lanes (`AuthShellFormLane` — 4)

`access` · `verify` · `recover` · `error`

Mapped by `resolveAuthShell(lane)` in [`resolve-auth-shell.tsx`](../src/components-auth-shell/resolve-auth-shell.tsx).

### Public auth segments (22)

| Path | Lane |
| --- | --- |
| `/sign-in`, `/sign-up`, `/otp` | access |
| `/verify-email/*` | verify |
| `/forgot-password`, `/reset-password/*` | recover |
| `/invite/*` | invite |
| `/workspace/select`, `/organization/select` | workspace |
| `/mfa`, `/mfa/recovery`, `/session-expired`, `/access-denied`, `/security/review`, `/error` | security |

Docs catalog: [`apps/docs/data/auth-routes.catalog.json`](../../../apps/docs/data/auth-routes.catalog.json).

---

## Runtime sign-in configuration

Resolved by [`resolveSignInProviderSurface`](../../../packages/auth/src/auth.sign-in-surface.ts):

| Method | When available |
| --- | --- |
| Email + password | Better Auth default |
| Google OAuth | Env credentials configured |
| GitHub OAuth | Env credentials configured |
| Passkey | `AFENDA_AUTH_PASSKEY !== "disabled"` |
| SSO (SAML/OIDC) | Better Auth SSO plugin |
| 2FA / OTP | Auth package plugins; ERP routes exist, presentation blocks pending |

Social provider ids SSOT: [`auth.social-providers.ts`](../../../packages/auth/src/auth.social-providers.ts) — `google`, `github` only.

Presentation sync rule: [`login-method-manifest.ts`](../src/components-auth-shell/login-method-manifest.ts) must be **manually synchronized** to the runtime sources above. Do not import `@afenda/auth` into `@afenda/shadcn-studio`; copy the method truth deliberately and keep unsupported ids out of the manifest.

---

## Presentation wiring (today)

| ERP path | Block id | Surface template |
| --- | --- | --- |
| `/sign-in` | `login-page-04` | `surface-template.auth-sign-in` |

SSOT: [`auth-ingress-surface.registry.ts`](../../../apps/erp/src/lib/auth/auth-ingress-surface.registry.ts).

WCAG-adjacent auth blocks: `login-page-04` only ([`auth-wcag-adjacent.registry.ts`](../../../apps/erp/src/lib/auth/auth-wcag-adjacent.registry.ts)).

---

## Flat bucket filesystem

```text
components-auth-shell/
  auth-shell.tsx                 ← composer (lane → block)
  resolve-auth-shell.tsx         ← lane map SSOT
  login-page-04.tsx              ← access lane block (50/50 split canvas)
  {future-block-id}.tsx          ← promoted MCP blocks (flat kebab-case)
```

No nested `login-page-04/` folders — vendor slug is in the **filename stem**, not a subfolder.

---

## Auth Pattern Lab (Phase A — Storybook L4)

**Eight patterns** — two **primary login candidates** plus six reference layouts for the access lane only. Verify, recover, and error lanes are **not** Pattern Lab patterns — they remain future block work mapped by `resolveAuthShell`.

Four **orthogonal** layers — do not conflate:

| Layer | Count | What it is |
| --- | ---: | --- |
| **Auth lanes** | 4 form lanes | access · verify · recover · error — composer routing, not design count |
| **Login patterns (primary)** | **2** | Swiss Noir Sign In · Verdant Milk Sign In — Phase B candidates |
| **Reference sign-in patterns** | **6** | P1–P6 layout/atmosphere compositions for contrast |
| **P1 presets** | 2 (P1 only) | Legacy palette sub-stories on AuthNoirShell — not login authority |

```text
Login Pattern Lab (primary — Phase B candidates)
├── Swiss Noir Sign In      → Control Room orb + editorial scale + credential jewel
└── Verdant Milk Sign In    → ghost hero + floating jewel + gold hairline (no proof strip)

Auth Pattern Lab (reference layouts P1–P6)
├── P1 NoirEditorial          → legacy hero + floating jewel (palette sub-stories only)
├── P2 SplitProductProof      → 50/50 marketing preview + form (production baseline)
├── P3 CenteredMonolith       → single centered card on quiet canvas
├── P4 OperatorConsole        → narrow form + governance readout column
├── P5 ImmersiveBrand         → full-bleed brand image + bottom sheet
└── P6 BentoTrust             → asymmetric bento + trust/KPI tiles
```

**Visual authority recommendation (lab only until Phase C):**

| Surface | Pattern | CSS / theme |
| --- | --- | --- |
| ERP long-hour sign-in (candidate) | Verdant Milk Sign In | `verdant-noir.css` · `.theme-afenda-verdant-milk-noir` |
| Marketing / launch / investor | Swiss Noir Sign In | `swiss-noir.css` · `.theme-afenda-brand` |
| Workspace dashboard (existing) | Verdant Milk Noir | `verdant-noir.css` · `.theme-afenda-verdant-milk-noir` |
| Control room / editorial (existing) | Swiss Noir Control Room | `swiss-noir.css` · `.theme-afenda-brand` |

Figma visual reference (when captured): **Auth Login Lab** page in [Afenda Brand Tokens (AdminCN)](https://www.figma.com/design/LsmtG4KiaTUi3KpjxZXHwH/Afenda-Brand-Tokens-AdminCN).

SSOT registry: [`storybook/auth-pattern-lab.registry.ts`](../src/storybook/auth-pattern-lab.registry.ts).

Storybook:
- **Primary craft:** `Presentation Lab/Auth Login` — [`presentation-lab-login.stories.tsx`](../src/storybook/presentation-lab-login.stories.tsx)
- **Full lab:** `Shadcn Studio/Auth Pattern Lab` — [`shadcn-studio-auth-pattern-lab.stories.tsx`](../src/storybook/shadcn-studio-auth-pattern-lab.stories.tsx)

Login CSS reuses workspace noir files (`swiss-noir.css` / `verdant-noir.css`) — **not** ERP `globals.css`. Login omits hero proof strips; copy stays minimal (one panel line + form).

Shared lab form (OAuth Google/GitHub + fields): [`storybook/auth-access-form-fields.tsx`](../src/storybook/auth-access-form-fields.tsx) — **does not** replace the production canonical login form from [`login-method-manifest.ts`](../src/components-auth-shell/login-method-manifest.ts) and [`login-form-v1.tsx`](../src/components-auth-shell/login-form-v1.tsx). Login Pattern Lab uses presentation-native fields until ERP promotion.

### Pattern inventory

| ID | Name | Composition invariant | Tone | CSS allowance |
| --- | --- | --- | --- | --- |
| **Swiss login** | Sign In | Editorial hero + credential jewel (no proof strip) | Cinematic calm | `swiss-noir.css` |
| **Verdant login** | Sign In | Ghost hero + floating jewel (no proof strip) | Premium, long-hour calm | `verdant-noir.css` |
| **P1** | NoirEditorial | Hero typography + floating jewel panel | Editorial, cinematic | Legacy noir lab CSS + presets |
| **P2** | SplitProductProof | 50/50 marketing preview + form | Classic enterprise SaaS | Stock shadcn/Tailwind |
| **P3** | CenteredMonolith | Single centered card on quiet canvas | Refined minimal | Stock shadcn/Tailwind |
| **P4** | OperatorConsole | Form + live system readout column | Industrial ERP operator | Stock shadcn/Tailwind |
| **P5** | ImmersiveBrand | Full-bleed imagery + anchored sheet | Bold brand immersion | Stock shadcn/Tailwind |
| **P6** | BentoTrust | Bento grid: form + trust/KPI tiles | Calm confidence | Stock shadcn/Tailwind |

**P1 preset note:** Swiss vs Verdant on P1 (`P1NoirEditorialSwiss`, `P1NoirEditorialVerdant`) are **legacy palette demos** on a shared AuthNoirShell — superseded for login authority by the dedicated Login Pattern Lab compositions.

**Differentiation rubric:** Each pattern must differ on at least 3 of 4 — grid topology, primary focal element, typography hierarchy, atmosphere. Registry `thesis` field is the one-sentence proof.

**Retired taxonomy:** The former “1 Noir + 5 ecosystems (E1–E5)” model is removed. E4/E5 lane placeholders are **not** Pattern Lab patterns.

Presentation Lab reference stories (workspace palette craft, orthogonal to login pattern count):

| Theme preset | Storybook path |
| --- | --- |
| Swiss Noir Control Room | `Presentation Lab/Swiss Noir Control Room` |
| Verdant Milk Noir | `Presentation Lab/Verdant Milk Noir` |
| Auth Login (Swiss + Verdant) | `Presentation Lab/Auth Login` |

---

## Phase C — ERP pattern selection (documented only)

**No ERP implementation until a Pattern Lab winner is chosen.** Phase A keeps `/sign-in` on `login-page-04`.

When promoting a winner:

1. **`AuthPatternId` → component map** — promote **Verdant Milk Identity Vault** (recommended ERP default) or Swiss Noir Verification Gate to flat `components-auth-shell/{pattern-id}.tsx`.
2. **Optional ERP env flag** — e.g. `AFENDA_AUTH_SIGN_IN_PATTERN=verdant-milk-identity-vault` read on sign-in page; **default remains `login-page-04`** until explicitly overridden in deployment config.
3. **Update ingress registry** — [`auth-ingress-surface.registry.ts`](../../../apps/erp/src/lib/auth/auth-ingress-surface.registry.ts) maps `/sign-in` block id when promoting.
4. **Hard stop:** no `@afenda/auth` imports in `@afenda/shadcn-studio`; OAuth labels remain Google + GitHub only.

---

## Gaps (tracked)

1. **21 of 22** auth routes lack a dedicated presentation block — composer falls back to `access`.
2. Auth-shell methods must stay synchronized to runtime truth (Google + GitHub only for social OAuth; passkey and SSO are capability surfaces, not ad-hoc page inventions).
3. Branding panel should use local assets (`/auth/auth-entry-preview.png`, `LogoSvg`) — not CDN PNGs.
4. Browser icons: canonical paths under `apps/erp/public/icons/` — see [`apps/erp/public/README.md`](../../../apps/erp/public/README.md).
5. **Verify / recover / error** lanes need dedicated MCP blocks — explicit gap, not Pattern Lab placeholders.

---

## Promotion checklist (new auth block)

1. `pnpm studio:shadcn:quarantine add @ss-blocks/<id> --overwrite --yes`
2. Register the page block and its allowed methods in `login-method-manifest.ts`
3. Promote to flat `components-auth-shell/<block-id>.tsx`
4. Map lane in `LOGIN_METHOD_LANE_DEFAULT_PAGE_MAP`
5. Restore `blockSlotDomMarkerProps`, local OAuth icons, metadata binding
6. Storybook Pattern Lab or Auth Shell story + gates
