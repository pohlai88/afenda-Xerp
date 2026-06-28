# PAS-005 — CSS Authority Standard

> **Constitutional sentence:** CSS truth is proven through authority sources, a generated CSS Authority Registry, and validation gates — not developer memory or ad-hoc custom properties.

> **One sentence:** PAS-005 defines how Afenda owns **CSS token authority** — vendored shadcn theme, registered extensions, generated registry with `CSS-TOKEN-*` identity, and fail-fast consumption gates — while `@afenda/design-system` retains Governed UI variant/recipe governance until explicitly migrated.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-005 |
| **Document class** | `package_authority_standard` |
| **Document role** | `constitutional_css_authority` |
| **Canonical filename** | `PAS-005-CSS-AUTHORITY-STANDARD.md` |
| **Package** | `@afenda/css-authority` |
| **Package ID** | `PKG-025` |
| **Layer** | Design |
| **Package role** | Owns CSS Authority Registry, vendored shadcn theme, extension CSS, and consumption validation contracts |
| **Runtime stance** | `contracts-and-generated-css` |
| **Registry lane** | `PKGR05_CSS_AUTHORITY` |
| **Package owner** | CSS Authority / Design Authority |
| **Agent skill** | `css-authority` · `.cursor/skills/css-authority/SKILL.md` |
| **Maturity** | MVP Authority (`mvp_authority`) |
| **Authority status** | `accepted_for_boundary` |
| **Implementation status** | `mvp_delivered` — B26–B37 slice sequence complete (2026-06-28) |
| **Evidence level** | `runtime` — `afenda-ui.css` cutover live; 569-token JSON-backed registry; R23–R30 + domain-sync + bridge-sync + visual contract + docs pixel baselines pass |
| **Runtime status** | B26–B37 delivered — 569-token registry (465 afenda + 44 appshell + 14 auth-editorial + 46 shadcn); consumption R23–R30 + domain-sync + bridge + visual contract + docs pixel baselines pass |
| **Remaining slices** | none — optional enhancements only |
| **Consumers** | `@afenda/ui`, `@afenda/appshell`, `apps/erp`, `apps/storybook` |
| **Change model** | `serialized-slices` |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | none |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/css-authority typecheck` |
| 2 | `pnpm --filter @afenda/css-authority test:run` |
| 3 | `pnpm --filter @afenda/css-authority build` |
| 4 | `pnpm check:css-authority-conformance` |
| 5 | `pnpm check:css-authority-consumption` |
| 6 | `pnpm check:css-authority-domain-sync` |
| 7 | `pnpm check:css-authority-bridge-sync` |
| 8 | `pnpm check:css-visual-regression` |
| 9 | `pnpm check:css-governance` |
| 10 | `pnpm check:foundation-disposition` |
| 11 | `pnpm quality:boundaries` |

> **Maturity is part of authority.**
> MVP Authority is delivered for B26–B37 (569-token registry; consumption + domain-sync + bridge + visual contract + docs pixel baselines). Do not claim Enterprise Accepted — optional Production Candidate attestation remains out of scope.

> **Canonical location:** `docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md`
> **Package-local pointer:** [`packages/css-authority/PAS-005-CSS-AUTHORITY-STANDARD.md`](../../packages/css-authority/PAS-005-CSS-AUTHORITY-STANDARD.md)
> **Operational derived view:** [`docs/architecture/css-authority.md`](../architecture/css-authority.md)
> **shadcn/studio delivery:** [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md)
> **Legacy Governed UI TS governance:** `@afenda/design-system` (CSS surface deprecated — not deleted in v1)

---

# 0. Agent Quick Path

**Boundary:** `@afenda/css-authority` **owns CSS token authority — authority JSON sources, generated CSS Authority Registry (`CSS-TOKEN-*`), vendored shadcn theme, Afenda extension CSS, and consumption validation; it never owns Governed UI variant/recipe/state registries (remain in `@afenda/design-system` v1), React UI primitives, AppShell block TSX, or app composition beyond CSS exports.**

**Hard stops:**

- **Prohibited imports:** `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `apps/erp`, React, database, kernel wire parsers.
- **Must never own:** variant/recipe registries (v1), governed primitive components, studio block TSX, ERP business logic.
- **Must never hand-edit:** `src/generated/css-authority-registry.*` — generator only.
- **Must never refactor in place:** legacy `packages/design-system` token CSS — strangler-deprecate via import cutover.

**Authority hierarchy:**

```txt
PAS-005 (this document)
  → authority JSON sources (packages/css-authority/src/authorities/*.json)
  → pnpm generate:css-authority-registry
  → generated CSS Authority Registry
  → check:css-governance (R22–R27)
  → runtime CSS (afenda-css-authority.css)
```

**Registry:** `PKGR05_CSS_AUTHORITY` · `PKG-025`

**Required gates:** see §13.

**Slice entrypoint:** `docs/PAS/slice/` · Closure registry: [`pas-status-index.md`](pas-status-index.md) · Session: `/afenda-coding-session`

---

# 1. Package Definition

`@afenda/css-authority` is Afenda's **CSS Authority** package — greenfield replacement for the CSS/token surface historically embedded in `@afenda/design-system`.

It answers:

- Which CSS custom properties may exist and be consumed
- Which files may define CSS
- Which packages may define which namespaces
- How shadcn default theme is vendored and upgraded

It does **not** answer variant meaning, recipe styling, or primitive behavior (Foundation phase 04 — `@afenda/design-system` + `@afenda/ui`).

---

# 2. One-Sentence Boundary

**`@afenda/css-authority` owns CSS Authority Registry truth and generated runtime CSS; it never owns Governed UI variant/recipe governance or UI primitive behavior.**

---

# 3. Dependency Rules

## 3.1 Allowed

- Zero runtime dependencies (Platform/Design authority pattern)
- `@afenda/typescript-config` (dev)
- Consumed by `@afenda/ui`, `@afenda/appshell`, applications (CSS imports only)

## 3.2 Prohibited

- `@afenda/design-system` (sibling — no circular CSS authority)
- Downstream UI packages as runtime deps
- Hand-maintained generated registry files

---

# 4. CSS Identity (`CSS-TOKEN-*`)

Every registered custom property has a stable ID:

| Field | Purpose |
| ----- | ------- |
| `id` | `CSS-TOKEN-001` — documentation and AI traceability |
| `name` | `--background` (runtime unprefixed for shadcn compatibility) |
| `owner` | `shadcn` \| `@afenda/css-authority` \| `@afenda/appshell` |
| `authority` | Source JSON domain file |
| `lifecycle` | `experimental` · `preview` · `accepted` · `stable` · `deprecated` · `removed` |
| `category` | `surface` · `text` · `border` · `interactive` · `feedback` · `chart` · `layout` · `motion` · `spacing` · `radius` · `shadow` · `typography` · `accessibility` · `density` |
| `editable` | `false` for vendored shadcn vars |
| `parentId` | Optional lineage for AI/docs |

**Registry ≠ Authority.** Authority owns truth in JSON sources; registry stores generated rows.

---

# 5. Authority Sources (human-edited only)

| File | Domain |
| ---- | ------ |
| `shadcn-theme.json` | Vendored shadcn `:root` vars (regen from CLI) |
| `afenda-extensions.json` | Density, charts 6–8, ERP status, sidebar |
| `appshell.json` | `--app-shell-*`, `--app-shell-studio-*` |
| `auth-editorial.json` | Override zone `--auth-editorial-*` |
| `css-files.json` | CSS file inventory metadata |
| `id-sequence.json` | Next `CSS-TOKEN-*` counter |

---

# 6. Generator Contract

**Command:** `pnpm --filter @afenda/css-authority generate:css-authority-registry`

**Outputs:**

- `src/generated/css-authority-registry.ts`
- `src/generated/css-authority-registry.json`

Nobody edits generated output. CI fails if sources change without regen.

---

# 7. Validation Gates

Multi-step consumption proof (target R22–R27 in `check-css-governance`):

```txt
Unknown var(--foo)
  → CSS-TOKEN row present?
  → authority source exists?
  → owner package permitted?
  → lifecycle allows use?
  → PASS or FAIL
```

---

# 8. Relationship to `@afenda/design-system`

| Surface | Owner (v1) | Status (2026-06-28) |
| ------- | ---------- | ------------------- |
| CSS tokens + `@theme` runtime | `@afenda/css-authority` | **Live** — via `afenda-ui.css` |
| `--afenda-*` raw tokens | `@afenda/design-system` | **Shim** — `afenda-tokens.css`; monolith deprecated (B30) |
| Variant / recipe / state / motion | `@afenda/design-system` | TS registries only (Governed UI) |
| `afenda-ui.css` import | `@afenda/ui` | **Cutover complete** (B29) — tokens + css-authority bundle |

**Do not delete `@afenda/design-system` in v1.**

---

# 9. Runtime Composition (live — B29/B30)

```txt
tailwindcss
  → @afenda/ui/afenda-ui.css
      → @afenda/design-system/css/afenda-tokens.css      (--afenda-* shim)
      → @afenda/css-authority/css/afenda-css-authority.css (bridge + @theme)
  → @afenda/appshell/afenda-appshell.css
  → @afenda/metadata-ui/afenda-metadata-ui.css
  → shadcn/tailwind.css
  → apps/erp/globals.css
```

Storybook composed spot-check: `apps/storybook/stories/governance-integration-composed.stories.tsx`

---

# 10. Prohibited Overlap

| Package | Must NOT define |
| ------- | ---------------- |
| `@afenda/design-system` | New CSS token authority after cutover (shim only) |
| `@afenda/ui` | `--afenda-*` or `@theme` |
| `@afenda/appshell` | `--afenda-*`; unregistered `--app-shell-*` |
| `apps/erp` | Token authority in globals |

---

# 11. Slice Sequence

| Slice | Scope | Status |
| ----- | ----- | ------ |
| B26 | Greenfield scaffold + PAS-005 | **Delivered · 2026-06-28** |
| B27 | [Vendored shadcn theme + generator](slice/b27-pas005-shadcn-theme.md) | **Delivered · 2026-06-28** |
| B28 | [R23–R27 consumption gates + baseline scan](slice/b28-pas005-consumption-gates.md) | **Delivered · 2026-06-28** |
| B29 | [Strangler cutover `afenda-ui.css`](slice/b29-pas005-ui-cutover.md) | **Delivered · 2026-06-28** |
| B30 | [Deprecate design-system CSS monolith (shim)](slice/b30-pas005-deprecate-ds-css.md) | **Delivered · 2026-06-28** |
| B33 | [Visual regression contract gate](slice/b33-pas005-visual-regression.md) | **Delivered · 2026-06-28** |
| B37 | [Playwright pixel baselines](slice/b37-pas005-pixel-baselines.md) | **Delivered · 2026-06-28** |

---

# 12. Enterprise Readiness

| Criterion | MVP (now) | Target |
| --------- | ----------- | ------ |
| Constitutional PAS | Yes | — |
| Package scaffold | Yes | — |
| Generated registry | **569 tokens** (465 afenda + 44 appshell + 14 auth-editorial + 46 shadcn) — B34/B36 | Post-v1 shim removal only |
| Consumption gates | **R23–R30 pass** (B28/B36) + domain-sync + bridge-sync | R15 studio raw-value cleanup (appshell scope) |
| Runtime cutover | **Yes** — B29/B30 shim (B29) | Remove design-system CSS shim (post-v1) |
| Visual contract gate | **Yes** — B33 import-chain contract + B37 docs pixel baselines | ERP pixel baselines (optional future) |
| Enterprise attestation | Not started | Production Candidate scorecard (future B34+) |
| Disposition lane | `amber-lane` (`PKGR05`) | Production Candidate promotion |

---

# 13. Required Gates

## 13.1 Package gates

```bash
pnpm --filter @afenda/css-authority typecheck
pnpm --filter @afenda/css-authority test:run
pnpm --filter @afenda/css-authority build
```

## 13.2 Workspace gates (B28–B33 — wired)

```bash
pnpm check:css-authority-conformance
pnpm check:css-authority-consumption
pnpm check:css-authority-domain-sync
pnpm check:css-authority-bridge-sync
pnpm check:css-visual-regression
pnpm check:css-governance
pnpm check:foundation-disposition
pnpm quality:boundaries
```

---

# 14. Remaining Work (post-MVP)

MVP slice sequence (B26–B35) is **closed**. Remaining items are enhancements or Production Candidate promotion — not blockers for current runtime CSS.

| Priority | Item | Owner slice (proposed) | Notes |
| -------- | ---- | ---------------------- | ----- |
| P1 | ~~Register `--app-shell-*`, `--auth-editorial-*`, Afenda extension tokens in authority JSON~~ | B34 registry expansion | **Delivered** — 568-token merged registry |
| P2 | ~~Close `PKGR02` knownGap `css-token-authority-migrating-to-PKGR05_CSS_AUTHORITY`~~ | B35 disposition sync | **Delivered** — PKG004_DESIGN knownGaps cleared; design-system retains Governed UI TS |
| P3 | Enterprise Accepted attestation + lane promotion | B36 scorecard | Mirror PAS-004A B30 pattern; target `production_candidate` maturity |
| P4 | ~~Playwright pixel baselines (docs use-erp CSS theme)~~ | B37 visual proof | **Delivered** — `docs-pixel-baseline.spec.ts` + baselines under `apps/docs/e2e/visual-proof/` |
| P5 | R15 raw visual values in `afenda-appshell-studio.css` | appshell slice | 3 governance warnings — not css-authority package scope |
| P6 | ~~Define missing `--app-shell-content-padding-inline`~~ | B36 risk mitigation | **Delivered** — defined on `.app-shell-root`; 569-token registry |
| P7 | ~~Domain-sync drift gate + R28–R30 consumption rules~~ | B36 risk mitigation | **Delivered** — `check:css-authority-domain-sync`; R28–R30 wired |
| Deferred | Delete `@afenda/design-system` CSS exports | post-v1 | Prohibited in PAS-005 v1 (`do-not-delete-design-system-v1`) |
| Out of scope (v1) | Governed UI variant/recipe/state registries | `@afenda/design-system` | Intentionally retained per §8 |
| P8 | shadcn/studio presentation product (standalone) | [PAS-005A](PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) B38–B42 | Derived PAS — theme presets, MCP seed, lab verification; Afenda bridge deferred to B42 |

**Next sequence item:** none for PAS-005 MVP — continuation work lives under [PAS-005A](PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) (B38 scaffold next).

---

# 15. References

- [css-authority.md](../architecture/css-authority.md) — operational derived view
- [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) — studio promotion pipeline
- [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) — registry-first governance pattern reference
