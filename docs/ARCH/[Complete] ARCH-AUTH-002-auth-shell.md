# ARCH-AUTH-002 — Governed Authentication Experience Shell

> **Filename history:** Renamed from `ARCH-AUTH-002-auth-shell-v2.md` → `ARCH-AUTH-002-auth-shell.md` (2026-06-26 consolidation). **Current runtime:** single auth shell — `@afenda/appshell/auth-shell`, `(auth)`, canonical URLs.

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Slices:** [`slices/ARCH-AUTH-002/slice-index.md`](slices/ARCH-AUTH-002/slice-index.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-AUTH-002 |
| **Work ID** | ARCH-AUTH-002 · paired [`fdr-001-shell-composition`](../delivery/FDR/[Partially%20Implemented]%20fdr-001-shell-composition.md) |
| **Status** | **Complete — enterprise 9.5 accepted** (29/30) — Slices 1–6 delivered 2026-06-26 · **consolidated 2026-06-26** |
| **Date** | 2026-06-26 |
| **Owner** | Platform Authority (`@afenda/appshell` shell · `apps/erp` consumer) |
| **Package** | PKG-001 · `@afenda/appshell/auth-shell` · `apps/erp` `(auth)` consumer |
| **Registry entry ID** | `PKG001_APPSHELL` |
| **Runtime owner** | `packages/appshell/src/auth-shell` · `apps/erp/src/app/(auth)` (composition) |
| **Lane** | amber-lane |
| **Risk class** | Medium (UX drift, accessibility, security copy leakage) |
| **Change class** | Refactor + Extension |
| **Clean Core target** | B — shell is replaceable presentation layer; Afenda owns lane contracts |
| **Enterprise score target** | 29/30 enterprise 9.5 |

> **Scope:** Package-owned **authentication experience system** — viewport shell, lane contracts, form frame, error/status surfaces, dedicated visual system, anti-drift gates, Storybook fixtures.  
> **Not in scope:** Better Auth plugin config, credential algorithms, session cookies, MFA policy, invitation persistence — [ARCH-AUTH-001](%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md) owns identity runtime.  
> **Relationship:** ARCH-AUTH-001 delivers identity; ARCH-AUTH-002 delivers **how unauthenticated users experience auth routes** without app-level layout drift.

> **Consolidation (2026-06-26):** Parallel delivery used `(auth-v2)`, `/v2/*` URLs, `@afenda/appshell/auth-shell-v2`, and `AFENDA_AUTH_SHELL_V2_DEFAULT`. **Legacy v1 shell decommissioned.** V2 implementation promoted to canonical naming: `@afenda/appshell/auth-shell`, `(auth)`, flat URLs. Slice handoffs below retain historical paths for audit — do **not** implement from them without reading this banner.

---

## Current runtime (authoritative for coding — 2026-06-26)

| Concern | Owner | Path |
| --- | --- | --- |
| Shell export | `@afenda/appshell/auth-shell` | `packages/appshell/src/auth-shell/` |
| App consumer | `apps/erp` | `apps/erp/src/app/(auth)/` |
| Path/copy registries | `apps/erp` | `apps/erp/src/lib/auth/*` |
| Form rhythm CSS | `apps/erp` | `apps/erp/src/app/(auth)/auth.css` |
| Canonical URLs | — | `/sign-in`, `/mfa`, `/verify-email/*`, … (no `/v2/` prefix) |
| Boundary guard | `scripts/governance` | `check:auth-shell-boundary.mts` — single `(auth)` segment only |
| Tenant branding | `apps/erp` | `resolve-tenant-auth-brand.server.ts` in `lib/auth/` |

---

# 1. Execution instruction

You are executing an enterprise architecture delivery slice for **ARCH-AUTH-002 (AUTH-SHELL-V2)**.

You must produce implementation and evidence that meets:

- Architecture authority (ADR-0014 · PKG001_APPSHELL · ADR-0017 shadcn-studio promotion pipeline)
- Runtime truth ([`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md))
- Package ownership ([`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts))
- TIP-004 governed UI consumption ([`tip-004-policy.md`](../governance/tip-004-policy.md))
- Enterprise acceptance criteria (§7)
- Automated gate proof (§10)
- Documentation sync (slice evidence + index row)

Every completion claim must map to file path, test path, command exit code, documentation row, or explicit waiver (§13).

**One slice per invocation.** Copy **one** §Handoff block from [`slices/ARCH-AUTH-002/`](slices/ARCH-AUTH-002/). Executor: `afenda-governed-implementer` or `fdr-slice-implementer`.

**Agent command (paste-ready):**

```text
/auth-shell /afenda-ui-quality /react-erp-quality /nextjs /shadcn-studio

Execute ARCH-AUTH-002 slice <N> as one bounded enterprise architecture slice.
Use the authority chain, architecture requirements, acceptance criteria, DoD, gates,
owner paths, prohibitions, waiver policy, and output format defined in
docs/ARCH/[Complete] ARCH-AUTH-002-auth-shell.md.

Do not expand scope. Do not start unrelated FDRs/TIPs.
Do not mark Complete unless promotion rules (§16) are satisfied.
Stop after the slice completion report.
```

---

# 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-AUTH-002 |
| Title | Governed authentication experience shell |
| Status | Complete — enterprise 9.5 accepted · consolidated 2026-06-26 |
| Package | `@afenda/appshell` (owner) · `apps/erp` (consumer) |
| Registry entry ID | PKG001_APPSHELL |
| Runtime owner | `packages/appshell/src/auth-shell` · `apps/erp/src/app/(auth)` |
| Lane | amber-lane |
| Risk class | Medium |
| Change class | Refactor + Extension |
| Clean Core target | B |
| Enterprise score target | 29/30 enterprise 9.5 |

**Purpose (one sentence):** Replace ad-hoc ERP auth page styling with one package-owned, lane-based authentication shell that is visually excellent, accessibility-safe, test-covered, and impossible to drift through local page CSS.

---

# 3. Authority chain

Read in this order before touching code:

```text
1. docs/ARCH/arch-status-index.md
2. docs/delivery/fdr-status-index.md
3. packages/architecture-authority/src/data/foundation-disposition.registry.ts (PKG001_APPSHELL)
4. docs/architecture/afenda-runtime-truth-matrix.md
5. docs/delivery/FDR/[Partially Implemented] fdr-001-shell-composition.md
6. docs/ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md (identity — reference only)
7. docs/ARCH/[Partially Implemented] ARCH-AUTH-002-auth-shell.md (this document)
8. docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md
9. docs/governance/tip-004-policy.md
10. .cursor/rules/figma-afenda-design-system-rules.mdc
11. packages/appshell/src/auth-shell-V2/** (V2 implementation — isolated)
12. apps/erp/src/app/(auth-v2)/** (V2 consumer — isolated; `/v2/*` routes)
13. Legacy reference only (do not modify for V2): `packages/appshell/src/auth-shell/**` · `apps/erp/src/app/(auth)/**`
```

| Concern | ARCH-AUTH-001 | ARCH-AUTH-002 |
| --- | --- | --- |
| Identity / mirror / MFA policy | Owner | No |
| Better Auth hooks / session | Owner | No |
| Auth route copy / hrefs | Consumer (app registries) | Consumer contract |
| Viewport shell / lanes / surfaces | No | Owner |
| Auth form mutation / provider calls | Consumer (app forms) | No |
| Boundary guard / anti-drift | No | Owner |

---

# 4. Problem statement

## Current risk / gap

```text
Partial auth-shell exists in @afenda/appshell (AuthShellEntryPage, AuthShellErrorSurface,
brand panel compounds, Storybook, contract tests) but:

- No lane model (access | verify | recover | error) on shell root
- No AuthShell root, AuthShellFormFrame, AuthShellStatusSurface, or escape/legal helpers
- Visual system split across afenda-appshell-studio.css §L and app auth.css — no dedicated
  packages/appshell/src/auth-shell/auth-shell.css with .af-auth-shell BEM namespace
- App error surface wraps package with erp-auth-error-page shell classes (boundary drift)
- Package contract embeds route-ish copy ("/sign-in" in default eyebrow)
- No check:auth-shell-boundary governance script
- Status/verify/recover lanes lack governed AuthShellStatusSurface
- ARCH-AUTH-001 Complete — identity works; presentation layer still drifts per route
```

## Business / architecture impact

```text
- UX: Inconsistent auth screens undermine enterprise ERP trust at the first touchpoint.
- Maintainability: App-owned shell CSS duplicates package intent; every new auth route risks drift.
- Security: Ad-hoc error rendering can leak provider strings without governed surfaces.
- Accessibility: Multiple h1/landmark patterns across routes without single shell contract.
- Governance: TIP-004 consumer rules fail when apps add layout className on shell wrappers.
- Clean Core: Without lane contracts, auth UI cannot be reused by Storybook, email preview, or future apps.
```

---

# 5. Architecture requirement

## 5.1 Ownership

> **Historical — parallel V2 delivery phase.** Paths below used `(auth-v2)` / `auth-shell-v2` during slices 1–6. **Current paths:** see **Current runtime** table at document top (2026-06-26 consolidation).

| Concern | Owner | Allowed path (historical) |
| --- | --- | --- |
| V2 shell contracts + lane types | `@afenda/appshell/auth-shell-v2` | `packages/appshell/src/auth-shell-V2/auth-shell-v2.types.ts` |
| V2 shell components | `@afenda/appshell/auth-shell-v2` | `packages/appshell/src/auth-shell-V2/*.tsx` |
| V2 shell visual system | `@afenda/appshell/auth-shell-v2` | `packages/appshell/src/auth-shell-V2/auth-shell-v2.css` |
| V2 public exports | `@afenda/appshell/auth-shell-v2` | `packages/appshell/src/auth-shell-V2/index.ts` |
| V2 package tests | `@afenda/appshell/auth-shell-v2` | `packages/appshell/src/auth-shell-V2/__tests__/` |
| V2 Storybook fixtures | `@afenda/appshell/auth-shell-v2` | `packages/appshell/src/auth-shell-V2/auth-shell-v2.stories.tsx` |
| V2 route copy + hrefs | `apps/erp` | `apps/erp/src/lib/auth-v2/**` · `(auth-v2)/_components/**` |
| V2 form composition | `apps/erp` | `apps/erp/src/app/(auth-v2)/_components/` |
| V2 form rhythm CSS only | `apps/erp` | `apps/erp/src/app/(auth-v2)/auth-v2.css` |
| V2 app shell adapter | `apps/erp` | `apps/erp/src/app/(auth-v2)/_components/auth-v2-entry-page.tsx` |
| Boundary guard | `scripts/governance` | `scripts/governance/check-auth-shell-boundary.mts` |
| Governed primitives | `@afenda/ui` | `packages/ui/src/components/` — **no edits without approval** |
| Design tokens | `@afenda/design-system` | token registry — map shell CSS vars only |
| **Legacy (frozen)** | `@afenda/appshell/auth-shell` | `packages/appshell/src/auth-shell/**` — **not modified by ARCH-AUTH-002** |
| **Legacy (frozen)** | `apps/erp` | `apps/erp/src/app/(auth)/**` — **not modified by ARCH-AUTH-002** |

### Strategic layer stack

```text
apps/erp/(auth-v2)/v2/* pages
        ↓ consume only @afenda/appshell/auth-shell-v2
packages/appshell/src/auth-shell-V2
        ↓ owns auth experience contracts + layout + state surfaces (isolated from legacy auth-shell)
@afenda/ui governed primitives
        ↓ owns primitive behavior
@afenda/design-system
        ↓ owns tokens, recipes, visual grammar
```

**App route may provide:** lane type, page title, description, form children, legal links, alternate action, error/recovery children, route hrefs, copy constants.

**App route must not own:** background visuals, card layout, auth shell spacing, auth panel styling, visual hierarchy, status surface styling, form frame styling, responsive shell behavior.

---

## 5.2 Boundary rules

The implementation must:

1. Keep V2 shell ownership in `packages/appshell/src/auth-shell-V2` — apps compose via `@afenda/appshell/auth-shell-v2` only.
2. **Do not modify** legacy `packages/appshell/src/auth-shell` or `apps/erp/src/app/(auth)` for V2 work.
3. Avoid duplicated copy constants — V2 app registries under `lib/auth-v2/` are single source for hrefs/copy.
4. Avoid private/deep imports — consumers use `@afenda/appshell/auth-shell-v2` only.
4. Preserve public API compatibility — deprecate, do not delete, until Slice 4 migration complete.
5. Keep auth provider logic out of shell components.
6. Keep route constants out of package contracts (remove `/sign-in` from package defaults).
7. Derive lane visual motif from `lane` prop — not hardcoded per page.
8. Keep security decisions server-side — shell shows safe copy only.
9. Sync documentation on each slice delivery.
10. Shell CSS scoped to `.af-auth-shell*` — no global primitive overrides.

---

## 5.3 Prohibited actions

```text
- Create one-off login page styling inside apps/erp/(auth-v2) beyond auth-v2.css form rhythm
- Import or re-export from legacy `packages/appshell/src/auth-shell` or `apps/erp/(auth)`
- Add neon AI gradients, glassmorphism soup, decorative blobs, dashboard-in-a-card brand panel
- Import apps/erp routes into packages/appshell
- Import Better Auth / Supabase provider logic into auth-shell
- Duplicate copy constants across auth pages
- Override governed Button / Field / Card styling in shell CSS
- Display raw provider error messages, tokens, callback URLs, or stack traces in UI
- Hide failing tests or suppress boundary guard failures
- Rename auth routes without ARCH-AUTH-001 coordination
- Introduce new auth behavior while only improving shell presentation
- Mark Complete without gate evidence
- Edit packages/ui/components without explicit approval
- Pollute globals.css with auth-shell layout (use package CSS export)
- Use vague timeline language without P0/P1/P2/P3 classification
```

---

## 5.4 Production classification vocabulary

| Bucket | Capability | Status |
| --- | --- | --- |
| **P0 — Production mandatory** | Lane model + AuthShell root + EntryPage migration + error surface safe copy + boundary guard | Open |
| **P0** | App routes thin composition (sign-in, sign-up, verify, recover, error) | Partial — AuthEntryPage exists |
| **P1 — Production hardening** | AuthShellStatusSurface + dedicated auth-shell.css + a11y tests + Storybook all lanes | Open |
| **P1** | Remove package route strings from default copy | Open |
| **P1** | Remove app shell wrapper classes (`erp-auth-error-page`) | Open |
| **P2 — Excluded from current release** | Per-tenant auth branding / white-label shell | Not in current production release scope. Requires separate ARCH/FDR approval. |
| **P2** | Auth shell i18n / locale switching | Not in current production release scope. Requires separate ARCH/FDR approval. |
| **P3 — Enhancement backlog** | Animated brand artifact transitions beyond reduced-motion fallback | Post-9.5 only |

---

# 6. Required implementation scope

## 6.1 Auth lanes

```ts
export const AUTH_SHELL_LANES = [
  "access",
  "verify",
  "recover",
  "error",
] as const;

export type AuthShellLane = (typeof AUTH_SHELL_LANES)[number];
```

| Lane | Pages |
| --- | --- |
| `access` | sign-in, sign-up, OTP, MFA challenge |
| `verify` | verify email, pending verification, verify sent/success/expired |
| `recover` | forgot password, reset password, reset success |
| `error` | auth error, expired token, invalid callback, access denied, session expired |

Each lane supports: title, eyebrow, description, tone, primary visual motif, support action, back/sign-in escape, optional secondary panel.

## 6.2 Required package exports

```ts
export {
  AuthShell,
  AuthShellEntryPage,
  AuthShellFormFrame,
  AuthShellErrorSurface,
  AuthShellStatusSurface,
  AuthShellLegalNotice,
  AuthShellAlternateAction,
  AuthShellEscapeAction,
  AuthShellBrandPanel,
  AuthShellVisualPanel,
} from "./auth-shell";
```

### Component contracts

#### `AuthShell`

Owns full viewport shell. No auth business logic, Next.js routes, Better Auth, Supabase, server actions, or hardcoded ERP route constants.

```ts
export interface AuthShellProps {
  readonly lane: AuthShellLane;
  readonly title: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly visual?: ReactNode;
  readonly support?: ReactNode;
  readonly footer?: ReactNode;
  readonly className?: string; // layout-only, validated if governance exists
}
```

#### `AuthShellEntryPage`

Convenience wrapper for form pages (`access` | `verify` | `recover` lanes).

```ts
export interface AuthShellEntryPageProps {
  readonly lane: Extract<AuthShellLane, "access" | "verify" | "recover">;
  readonly title: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly alternateAction?: ReactNode;
  readonly legalNotice?: ReactNode;
  readonly support?: ReactNode;
}
```

#### `AuthShellFormFrame`

Form card surface using governed Card/Surface primitives where available. Forms as children only. Never imports concrete sign-in/sign-up forms.

#### `AuthShellErrorSurface`

```ts
export type AuthShellErrorTone =
  | "neutral"
  | "warning"
  | "critical"
  | "expired"
  | "forbidden";

export interface AuthShellErrorSurfaceProps {
  readonly title: string;
  readonly description?: string;
  readonly tone?: AuthShellErrorTone;
  readonly reason?: string;
  readonly actions?: ReactNode;
}
```

Must avoid leaking raw provider errors. Safe user-facing copy. Optional diagnostic ID when server provides one.

#### `AuthShellStatusSurface`

```ts
export type AuthShellStatusTone =
  | "info"
  | "positive"
  | "warning"
  | "neutral";

export interface AuthShellStatusSurfaceProps {
  readonly title: string;
  readonly description?: string;
  readonly tone?: AuthShellStatusTone;
  readonly actions?: ReactNode;
}
```

## 6.3 Visual strategy

**Design direction:** *Quiet Interfaces, Loud Decisions*

| Token | Value |
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

Dedicated CSS: `packages/appshell/src/auth-shell/auth-shell.css` — expose via package CSS export after `pnpm sync:package-css-dist`.

**BEM namespace (required):**

```css
.af-auth-shell
.af-auth-shell__viewport
.af-auth-shell__brand
.af-auth-shell__brand-mark
.af-auth-shell__visual
.af-auth-shell__panel
.af-auth-shell__frame
.af-auth-shell__footer
.af-auth-shell__support
.af-auth-shell__status
.af-auth-shell__error
```

**Prohibited CSS names:** `.login-box`, `.auth-wrapper`, `.cool-card`, `.left-side`, `.blob`

Shell CSS may define: layout, visual panel, surface, responsive layout, decorative backgrounds, package-scoped CSS variables.

Shell CSS must not define: Button, Field, Badge, Card internals (unless no governed Card exists), route-specific selectors, provider-specific selectors.

### Layout regions

**Desktop:**

```text
┌──────────────────────────────────────────────┐
│ Brand / proof / trust panel │ Form frame      │
│ Enterprise visual message   │ Auth action     │
└──────────────────────────────────────────────┘
```

**Mobile:**

```text
┌────────────────────┐
│ Compact brand      │
│ Form frame         │
│ Alternate/legal    │
└────────────────────┘
```

## 6.4 App integration pattern

```tsx
<AuthShellEntryPage
  lane="access"
  eyebrow="Secure access"
  title="Sign in to Afenda"
  description="Continue to your operating workspace."
  alternateAction={<SignUpLink />}
  legalNotice={<AuthLegalNotice />}
>
  <SignInForm />
</AuthShellEntryPage>
```

```tsx
<AuthErrorSurface
  title="We could not complete this sign-in"
  description="The link may have expired or the request could not be verified."
  tone="warning"
>
  <AuthErrorSignInEscape />
</AuthErrorSurface>
```

App helpers (`AuthErrorSurface`, `AuthErrorSignInEscape`, `AuthEntryPage`) remain in app space but wrap package surfaces only — **no shell layout classes on wrappers**.

## 6.5 Copy system (app-owned)

Central app copy via existing registries (normalize, do not duplicate):

- `apps/erp/src/lib/auth/auth-copy.registry.ts`
- `apps/erp/src/lib/auth/auth-route.registry.ts`
- Re-export surface: `apps/erp/src/app/(auth)/_components/auth-form.copy.ts`

Required route href constants (app-owned):

```ts
export const AUTH_FORM_SIGN_IN_LINK = "/sign-in";
export const AUTH_FORM_SIGN_UP_LINK = "/sign-up";
export const AUTH_FORM_FORGOT_PASSWORD_LINK = "/forgot-password";
```

## 6.6 Accessibility requirements

| Requirement | Verification |
| --- | --- |
| Correct `<main>` landmark | Component test |
| One visible `<h1>` per auth page | Component test |
| Keyboard navigable | Interaction test |
| Focus states preserved | Visual + a11y test |
| Form labels/descriptions preserved | Form tests (app) |
| Error/status meaningful text + icon | Surface tests |
| Descriptive links | Copy review |
| `prefers-reduced-motion` | CSS + test |
| WCAG AA contrast | Token review |
| No color-only state communication | Surface tests |

## 6.7 Security / privacy requirements

Auth UI must **not** display: raw provider errors, tokens, callback URLs, stack traces, email enumeration signals, tenant membership in unauthenticated UI, secrets in client code.

Allowed: generic recovery guidance, safe diagnostic ID from server error handling, generic "Return to sign in".

---

## In scope

```text
- packages/appshell/src/auth-shell/** (contracts, components, CSS, tests, stories)
- packages/appshell/src/index.ts (export surface if needed)
- apps/erp/src/app/(auth)/** (thin composition migration)
- apps/erp/src/lib/auth/auth-copy.registry.ts · auth-route.registry.ts (normalize)
- scripts/governance/check-auth-shell-boundary.mts
- docs/ARCH/slices/ARCH-AUTH-002/**
- docs/ARCH/arch-status-index.md
- docs/architecture/afenda-runtime-truth-matrix.md (evidence row)
```

## Out of scope

```text
- Better Auth plugin configuration (ARCH-AUTH-001 / better-auth-erp skill)
- New auth routes or identity behavior
- packages/ui primitive changes
- Accounting runtime
- Per-tenant white-label auth branding (P2)
- Auth shell i18n (P2)
```

## Expected files touched

| File | Package | Change type | Required? |
| --- | --- | --- | --- |
| `packages/appshell/src/auth-shell/auth-shell.tsx` | appshell | new/modified | Yes |
| `packages/appshell/src/auth-shell/auth-shell.types.ts` | appshell | new | Yes |
| `packages/appshell/src/auth-shell/auth-shell.constants.ts` | appshell | new | Yes |
| `packages/appshell/src/auth-shell/auth-shell.css` | appshell | new | Yes |
| `packages/appshell/src/auth-shell/index.ts` | appshell | modified | Yes |
| `packages/appshell/src/auth-shell/__tests__/auth-shell.test.tsx` | appshell | new | Yes |
| `packages/appshell/src/auth-shell/__tests__/auth-shell-error-surface.test.tsx` | appshell | modified | Yes |
| `packages/appshell/src/auth-shell/__tests__/auth-shell-status-surface.test.tsx` | appshell | new | Yes |
| `packages/appshell/src/auth-shell/auth-shell.stories.tsx` | appshell | modified | Yes |
| `apps/erp/src/app/(auth)/_components/auth-entry-page.tsx` | erp | modified | Yes |
| `apps/erp/src/app/(auth)/_components/auth-error-surface.client.tsx` | erp | modified | Yes |
| `apps/erp/src/app/(auth)/sign-in/page.tsx` (+ peer routes) | erp | modified | Yes |
| `scripts/governance/check-auth-shell-boundary.mts` | root | new | Yes |
| `package.json` (root script) | root | modified | Optional |

---

# 7. Enterprise acceptance criteria

```gherkin
Feature: Governed authentication experience shell

  Scenario: Access lane sign-in page composes package shell only
    GIVEN AUTH_ROUTE_REGISTRY provides sign-in copy and hrefs
    AND AuthShellEntryPage is exported from @afenda/appshell/auth-shell
    WHEN apps/erp sign-in page renders
    THEN one main landmark and one h1 are present
    AND lane data attribute is "access"
    AND form children render inside AuthShellFormFrame
    AND no erp-auth-shell layout classes own viewport chrome

  Scenario: Error surface does not leak provider details
    GIVEN a Better Auth callback error with technical message
    WHEN AuthShellErrorSurface renders with governed props
    THEN raw provider string is not visible in DOM
    AND safe title and description are shown
    AND optional diagnostic ID appears only when server supplies it

  Scenario: Boundary guard detects app shell CSS drift
    GIVEN apps/erp/(auth) adds .login-box or .auth-wrapper selectors
    WHEN pnpm check:auth-shell-boundary runs
    THEN exit code is non-zero
    AND drift location is reported

  Scenario: Package shell excludes provider imports
    GIVEN packages/appshell/src/auth-shell source tree
    WHEN boundary guard scans imports
    THEN no imports from apps/erp, better-auth, or @supabase/*
    AND no hardcoded /sign-in route strings in package defaults

  Scenario: Status surface supports verification lane
    GIVEN verify-email sent page composes AuthShellStatusSurface
    WHEN rendered with tone "info"
    THEN title is h1 inside main
    AND actions slot renders escape links from app children
```

---

# 8. Enterprise quality benchmark

Target score:

```text
Minimum acceptable: 28/30 foundation acceptable
Enterprise 9.5: 29/30 and no dimension below 4/5
```

| Dimension | Target | Evidence required |
| --- | ---: | --- |
| Contract stability | 5/5 | Typecheck exit 0, contract tests, lane types exported |
| Test coverage | 5/5 | Shell, error, status surface tests + boundary guard |
| Observability + audit | 4/5 | Safe error copy path; diagnostic ID slot documented |
| Security + RBAC + RLS | 5/5 | No provider leak tests; enumeration-safe copy |
| Documentation + BRD traceability | 5/5 | ARCH + slice-index + matrix row |
| Maintainability + Clean Core | 5/5 | Boundary guard, no duplicate constants, BEM namespace |

---

# 9. Non-functional requirements

| Characteristic | Requirement | Verification |
| --- | --- | --- |
| Functional suitability | All four lanes render correctly | Storybook + unit tests |
| Security | No client-trusted authority; safe error copy | Surface tests + guard |
| Compatibility | Public exports stable; deprecations documented | Typecheck + consumer tests |
| Reliability | Deterministic layout for same lane props | Snapshot/structure tests |
| Maintainability | Single shell owner; boundary guard | `check:auth-shell-boundary` |
| Performance | No unnecessary client bundles in shell | Import audit |
| Accessibility | Landmarks, h1, keyboard, reduced motion | a11y tests |
| Documentation | ARCH slices + index synced | `check:documentation-drift` |

---

# 10. Required gates

```bash
pnpm --filter @afenda/appshell typecheck
pnpm --filter @afenda/appshell test:run
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm sync:package-css-dist -- --package @afenda/appshell
pnpm check:package-css-dist-sync
pnpm check:auth-shell-boundary
pnpm ui:guard:scan
pnpm check:documentation-drift
pnpm check:foundation-disposition
```

Add after Slice 5 wires script:

```json
{
  "check:auth-shell-boundary": "tsx scripts/governance/check-auth-shell-boundary.mts"
}
```

Gate report format:

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm --filter @afenda/appshell typecheck` | — | Pending |
| `pnpm --filter @afenda/appshell test:run` | — | Pending |
| `pnpm check:auth-shell-boundary` | — | Pending |

---

# 11. Definition of Done

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Auth shell package-owned | `packages/appshell/src/auth-shell/` | [ ] |
| 2 | All lanes: access, verify, recover, error | Storybook + route mapping | [ ] |
| 3 | App auth pages thin composition | `(auth)/**/page.tsx` | [ ] |
| 4 | Dedicated auth-shell.css + BEM namespace | `auth-shell.css` | [ ] |
| 5 | Auth form behavior preserved | Existing form tests pass | [ ] |
| 6 | Error surfaces no raw provider errors | error surface tests | [ ] |
| 7 | TypeScript strict passes | typecheck exit 0 | [ ] |
| 8 | Package tests cover shell/error/status | `__tests__/` | [ ] |
| 9 | Boundary guard exists and passes | `check-auth-shell-boundary.mts` | [ ] |
| 10 | Storybook major states | `auth-shell.stories.tsx` | [ ] |
| 11 | No provider logic in auth-shell | boundary guard | [ ] |
| 12 | No route constants in package | contract review | [ ] |
| 13 | No app imports in package | boundary guard | [ ] |
| 14 | No global CSS pollution | CSS scope review | [ ] |
| 15 | Runtime matrix updated | `afenda-runtime-truth-matrix.md` | [ ] |
| 16 | ARCH index row synced | `arch-status-index.md` | [ ] |
| 17 | Impact analysis completed | §12 below | [ ] |
| 18 | Rollback strategy documented | §14 below | [ ] |
| 19 | Clean Core level B declared | §2 target item | [x] |
| 20 | Peer review if required | Slice 6 promotion | [ ] |

---

# 12. Impact analysis

| Consumer | Import surface / runtime dependency | Breaking change? | Required action |
| --- | --- | --- | --- |
| `apps/erp` | `@afenda/appshell/auth-shell` | Minor — new props on EntryPage | Migrate pages in Slice 4 |
| `apps/storybook` | auth-shell stories | No | Verify after Slice 6 |
| ARCH-AUTH-001 | Identity runtime | No | None — orthogonal |
| fdr-001-shell-composition | PKG001 evidence | No | Evidence-sync row |

```text
Breaking change: Minor (additive exports; deprecate legacy compound names)
Migration required: Yes — app pages adopt lane prop + remove wrapper shell CSS
Runtime risk: Low — presentation only; identity unchanged
Rollback safe: Yes — revert package + app composition commits
```

---

# 13. Waiver policy

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

No waiver may hide broken P0 runtime (lane shell, safe errors, boundary guard).

---

# 14. Rollback strategy

| Change area | Rollback method | Risk |
| --- | --- | --- |
| Package shell components | `git revert` slice commits | Low |
| auth-shell.css | Revert + `pnpm sync:package-css-dist` | Low |
| App page composition | Revert app commits | Low |
| Boundary guard | Remove script + package.json entry | Low |
| Documentation | Revert ARCH + index + matrix | Low |

Rollback must preserve registry authority, package boundaries, and public API compatibility for non-auth appshell consumers.

---

# 15. Slice 1 — Inventory and boundary map (delivered 2026-06-26)

Internal implementation map for executor context:

```text
Existing package auth-shell exports:
  AuthShellEntryPage, AuthShellEntry, AuthShellErrorSurface, AuthShellError,
  AuthShellEntryBrandPanel, AuthShellEntryBrand, AuthShellBrandArtifactImage,
  AuthShellPreviewImage, contract constants, deprecated AppShellAuth* aliases
  Path: packages/appshell/src/auth-shell/index.ts

Existing app auth routes:
  sign-in, sign-up, forgot-password, reset-password, verify-email (+ sent/success/expired),
  mfa, otp, invite, workspace/select, organization/select, access-denied,
  session-expired, security/review, error.tsx
  Adapter: AuthEntryPage → AuthShellEntryPage
  Error: AuthErrorSurface → AuthShellErrorSurface (with erp-auth-error-page wrapper — VIOLATION)

Existing CSS entrypoints:
  packages/appshell/src/styles/afenda-appshell.css
  packages/appshell/src/styles/afenda-appshell-studio.css §L (.app-shell-studio-auth-login-page-04__*)
  apps/erp/src/app/(auth)/auth.css (form rhythm — ALLOWED)
  apps/erp/src/app/(auth)/layout.tsx imports auth.css
  NO packages/appshell/src/auth-shell/auth-shell.css yet

Existing auth copy/constants:
  apps/erp/src/lib/auth/auth-copy.registry.ts
  apps/erp/src/lib/auth/auth-route.registry.ts
  apps/erp/src/app/(auth)/_components/auth-form.copy.ts (re-exports)
  Package defaults include route-ish eyebrow "/sign-in" — VIOLATION

Existing tests:
  auth-shell.contract.test.ts, auth-shell.compound.test.ts,
  auth-shell-entry-layout.test.tsx, auth-shell-error-surface.test.tsx,
  auth-shell-brand-panel.test.tsx, auth-shell-preview-image.test.tsx,
  auth-shell.a11y.test.tsx
  App: auth-entry-page.test.tsx, auth-error-surface.test.tsx, auth-page-chrome.test.tsx

Boundary violations found:
  1. erp-auth-error-page wrapper owns shell layout in app
  2. Package default copy references /sign-in route
  3. Visual system in studio.css §L not dedicated auth-shell.css
  4. No AUTH_SHELL_LANES / lane data attributes
  5. No AuthShellStatusSurface for verify/recover success states
  6. No check:auth-shell-boundary script

Recommended modifications:
  Slices 2–6 per slice-index.md — contracts first, CSS second, app migration third,
  tests/guard fourth, Storybook fifth
```

---

# 16. Implementation slices

Execute in order. **One slice per coding session.**

| Slice | Title | Doc |
| ---: | --- | --- |
| 1 | Inventory and boundary map | [slice-01-inventory-boundary-map.md](slices/ARCH-AUTH-002/slice-01-inventory-boundary-map.md) |
| 2 | Package contracts and components | [slice-02-package-contracts-components.md](slices/ARCH-AUTH-002/slice-02-package-contracts-components.md) |
| 3 | Dedicated auth visual system (CSS) | [slice-03-auth-visual-system.md](slices/ARCH-AUTH-002/slice-03-auth-visual-system.md) |
| 4 | App route consumption | [slice-04-app-route-consumption.md](slices/ARCH-AUTH-002/slice-04-app-route-consumption.md) |
| 5 | Tests and governance guard | [slice-05-tests-boundary-guard.md](slices/ARCH-AUTH-002/slice-05-tests-boundary-guard.md) |
| 6 | Visual QA and Storybook | [slice-06-storybook-visual-qa.md](slices/ARCH-AUTH-002/slice-06-storybook-visual-qa.md) |

---

# 17. Promotion rule

Do not promote to **Complete — enterprise 9.5 accepted** unless all are true:

```text
- Slices 1–6 delivered with evidence
- Required gates exit 0
- Runtime evidence at stated paths
- ARCH index + runtime matrix synchronized
- Known P0/P1 gaps closed or waived with expiry
- Enterprise score ≥ 29/30
- Peer review completed if DoD #20 required
```

Allowed status labels:

```text
Not started
Partially Implemented
Complete — foundation acceptable
Complete — enterprise 9.5 accepted
Blocked
```

---

# 18. Required output from IDE / agent

Final slice response must include:

```markdown
# AUTH-SHELL-V2 Completion Report

## Enterprise Score
<score>/10 or /30

## Summary
<what changed>

## Architecture Boundary
| Boundary | Status | Evidence |
|---|---:|---|
| Package owns shell | ✅/❌ | <files> |
| App owns composition only | ✅/❌ | <files> |
| Provider logic excluded | ✅/❌ | <files> |
| Route constants excluded from package | ✅/❌ | <files> |

## Visual Quality
| Area | Status | Notes |
|---|---:|---|
| Desktop shell | ✅/❌ | |
| Mobile shell | ✅/❌ | |
| Error state | ✅/❌ | |
| Verify/recover state | ✅/❌ | |
| Reduced motion | ✅/❌ | |

## Files Changed
- <file>

## Gates Run
<actual commands>

## Gate Results
| Gate | Result |
|---|---:|
| typecheck | pass/fail |
| tests | pass/fail |
| boundary guard | pass/fail |

## Risks / Follow-ups
* <only real remaining risks>

## Final Verdict
Accepted / Not accepted for enterprise 9.5.
```

---

# 19. Command to execute

```text
Execute ARCH-AUTH-002 Slice <N> as one bounded enterprise architecture slice.

Use the authority chain, architecture requirements, acceptance criteria, DoD, gates,
owner paths, prohibitions, waiver policy, and output format defined in
docs/ARCH/[Partially Implemented] ARCH-AUTH-002-auth-shell.md.

Do not expand scope.
Do not start unrelated FDRs/TIPs.
Do not mark Complete unless promotion rules (§17) are satisfied.
Stop after the slice completion report.
```
