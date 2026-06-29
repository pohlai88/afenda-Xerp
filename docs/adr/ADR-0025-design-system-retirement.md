# ADR-0025 — Design-System Retirement and Presentation Consolidation

| Field | Value |
| --- | --- |
| **Status** | **Accepted** |
| **Date** | 2026-06-29 |
| **Owner** | Design Authority / Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |
| **Related PAS** | [PAS-005B](../PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) |

---

## Context

Afenda currently maintains overlapping design layers:

1. **`@afenda/css-authority`** (PAS-005) — constitutional CSS token registry (605 tokens), consumption gates R23–R30, runtime bridge live since B26–B37.
2. **`@afenda/shadcn-studio`** (PAS-005A) — presentation product (theme presets, MCP inventory, blocks); B42p strangler complete.
3. **`@afenda/design-system`** (PKG004) — legacy TS registries (variant/recipe/state/motion) and `--afenda-*` CSS shim (`afenda-tokens.css`) still in the `@afenda/ui` import chain.

PAS-005 §8 explicitly prohibited deleting `@afenda/design-system` in v1 (`do-not-delete-design-system-v1` on `PKGR05_CSS_AUTHORITY`). That prohibition prevented unsafe deletion while css-authority cutover was incomplete. Cutover is now live; dual authority creates drift risk:

- `token.registry.ts` (~2700 lines) duplicates css-authority `afenda-extensions.json`
- `generate-tokens-css.ts` syncs bridge CSS from design-system — circular generator path
- Agents may expand the wrong package when adding tokens

**shadcn/ui upstream alignment:** Official theming uses CSS variables (`tailwind.cssVariables: true`) and Tailwind v4 `@theme inline` mapping — consistent with keeping css-authority as constitutional CSS layer and shadcn-studio as presentation product, not merging them.

---

## Decision

### 1. Adopt PAS-005B as the retirement authority

`docs/PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md` governs all work to retire `@afenda/design-system`. Maturity label: **`retirement_candidate`** (controlled deprecation — not MVP feature work).

### 2. Preserve constitutional split

| Layer | Package | Role |
| --- | --- | --- |
| CSS constitutional | `@afenda/css-authority` | All CSS token truth — **unchanged** |
| Presentation product | `@afenda/shadcn-studio` | Themes, MCP, blocks — **unchanged** |
| Governed shell (v1) | `@afenda/ui` | **Not deleted** in PAS-005B v1 |

**Explicit non-decision:** css-authority is **not** merged into shadcn-studio.

### 3. Lift deletion prohibition only after readiness proof

When **all** are true:

1. ADR-0025 status → **Accepted**
2. `pnpm check:design-system-retirement-readiness` passes (B44)
3. B45 CSS chain has zero `@afenda/design-system/css/*` imports
4. B46 completes (if B44 study = keep `@afenda/ui`) OR study documents shrink path with sign-off
5. `foundation-registry-owner` promotes PKG004 to `deprecated`

…then slice **B47** may delete `packages/design-system/`.

Until then, **`do-not-delete-design-system-v1` remains in force**.

### 4. Hard rules (binding on all agents)

1. css-authority owns all CSS token truth.
2. shadcn-studio owns presentation product/block truth.
3. design-system must not generate CSS after B45.
4. `@afenda/ui` cannot be deleted in PAS-005B v1.
5. Package deletion requires this ADR Accepted + readiness gate + foundation-registry-owner.

### 5. Registry changes (deferred to B47)

- PKG004 `@afenda/design-system` → `deprecated` / superseded by css-authority + shadcn-studio + ui/governance
- Proposed lane `PKGR05B_DESIGN_RETIREMENT` — created by `foundation-registry-owner` when B44 closes
- Remove `do-not-delete-design-system-v1` from PKGR05 prohibited list at B47 only

---

## Consequences

### Positive

- Single CSS authority path — no dual `--afenda-*` generators
- Clear presentation product ownership (shadcn-studio)
- Agents stop editing wrong package for tokens
- Enables PKGR05 Production Candidate promotion (B49)

### Negative / trade-offs

- B46 registry relocation is a large `@afenda/ui` touch — must be serialized
- Short-term doc/skill churn during B43–B47
- Appshell `presentation/blocks/` strangler (B48) is consumer-impacting
- ADR remains **Accepted** — B47 blocked until B44 attestation + foundation-registry-owner

---

## Acceptance Gate

ADR-0025 is **satisfied** when:

| Criterion | Evidence |
| --- | --- |
| PAS-005B B43–B47 delivered | `pas-status-index.md` slice rows |
| Readiness gate green | `pnpm check:design-system-retirement-readiness` |
| No design-system package on disk | `packages/design-system/` deleted |
| PKG004 deprecated in registry | `foundation-disposition.registry.ts` |
| PAS-005 §8 footnote updated | Points to PAS-005B completion |
| Full PAS-005 §13 gates green | CI evidence |

---

## References

- [PAS-005B](../PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md)
- [PAS-005](../PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) §8
- [PAS-005A](../PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md)
- [ADR-0017](ADR-0017-shadcn-studio-ui-delivery-acceleration.md)
- [ADR-0014](ADR-0014-foundation-disposition-registry.md)
- [`.cursor/rules/governed-ui-consumption.mdc`](../../.cursor/rules/governed-ui-consumption.mdc)
- shadcn/ui theming: https://ui.shadcn.com/docs/theming
- shadcn/ui Tailwind v4: https://ui.shadcn.com/docs/tailwind-v4
