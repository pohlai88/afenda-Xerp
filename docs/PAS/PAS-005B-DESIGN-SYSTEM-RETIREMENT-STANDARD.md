# PAS-005B — Design-System Retirement Standard

> **Derivation:** [PAS-005](PAS-005-CSS-AUTHORITY-STANDARD.md) owns CSS constitutional truth. [PAS-005A](PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) owns the shadcn/studio presentation product. PAS-005B defines the **controlled deprecation and supersession** of `@afenda/design-system` (PKG004) — without amending PAS-005 §1–§16 unless an explicit amendment slice says so.
>
> **Doctrine:**
>
> ```text
> PAS-005 owns CSS token constitutional truth (@afenda/css-authority).
> PAS-005A owns presentation product truth (@afenda/shadcn-studio).
> PAS-005B retires @afenda/design-system — no parallel CSS or registry authority after cutover.
> @afenda/ui is NOT deleted in PAS-005B v1 — governance may internalize (B46) after B44 study.
> ```

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-005B |
| **Document title** | Design-System Retirement Standard |
| **Parent PAS** | PAS-005 · PAS-005A |
| **Document class** | `derived_deprecation_standard` |
| **Document role** | `design_system_retirement` |
| **Canonical filename** | `PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md` |
| **Primary target** | `@afenda/design-system` (PKG004 · `PKGR02` design authority) |
| **Layer** | Design / Deprecation |
| **Maturity** | **`retirement_candidate`** — controlled deprecation/supersession; not MVP feature work |
| **Authority status** | `accepted_for_planning` |
| **Implementation status** | `partial` — B43 doctrine authored; B44–B49 not started |
| **Evidence level** | `planning` — readiness gate not yet wired |
| **Runtime status** | B43 delivered — canonical PAS + ADR-0025 proposed; `@afenda/design-system` still active (amber-lane PKG004); css-authority 605-token registry live; shadcn-studio B42p strangler complete |
| **Remaining slices** | B44 migration study + readiness gate (next) · B45 CSS chain unification · B46 internalize UI registries (conditional) · B47 delete package · B48 appshell consolidation · B49 Production Candidate attestation (optional) |
| **ADR prerequisite** | [ADR-0025](../adr/ADR-0025-design-system-retirement.md) — **Proposed**; must be **Accepted** before B47 package deletion |
| **Agent skills** | `css-authority` · `shadcn-studio-authority` · `/afenda-coding-session` · `/coding-consistency-bundle` |
| **Registry lane (proposed)** | `PKGR05B_DESIGN_RETIREMENT` · delegates PKG004 deprecation to `foundation-registry-owner` at B47 |

#### Required gates (PAS-005B — wired incrementally)

| # | Gate command | When |
| --- | --- | --- |
| 1 | `pnpm check:documentation-drift` | Every slice (B43+) |
| 2 | `pnpm check:foundation-disposition` | Every slice (B43+) |
| 3 | `pnpm check:design-system-retirement-readiness` | **B44+** (to implement) |
| 4 | Inherited PAS-005 §13 gates | B45+ |
| 5 | `pnpm --filter @afenda/ui check:governance` | B46+ |
| 6 | `pnpm quality:boundaries` | B47+ |

> **Maturity is part of authority.** `retirement_candidate` means the **retirement map is governed** — not that `@afenda/design-system` is deleted. Package deletion requires ADR-0025 Accepted + B44 readiness green + `foundation-registry-owner`.

> **Canonical location:** `docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md`
---

# 0. Agent Quick Path

Read **PAS-005 §0** and **PAS-005A §0**, then this §0. Session: `/afenda-coding-session` · Bundle: `/coding-consistency-bundle`.

**One-line definition:** Controlled retirement of `@afenda/design-system` — consolidate CSS truth in `@afenda/css-authority` and presentation truth in `@afenda/shadcn-studio`.

**Five hard rules (non-negotiable):**

| # | Rule |
| --- | --- |
| **1** | **`@afenda/css-authority` owns all CSS token truth** — 605-token registry, authority JSON, R23–R30 gates. No package may define parallel `--afenda-*` or `@theme` authority after B45. |
| **2** | **`@afenda/shadcn-studio` owns presentation product truth** — theme presets, MCP inventory, blocks/primitives, `shadcn-studio.css`. Not merged into css-authority. |
| **3** | **`@afenda/design-system` must not generate CSS after B45** — `generate-tokens-css.ts` bridge sync and `afenda-tokens.css` shim removed from import chain. |
| **4** | **`@afenda/ui` cannot be deleted in PAS-005B v1** — shell governed primitives may remain; B44 study decides internalize vs shrink scope. |
| **5** | **Package deletion requires ADR-0025 Accepted + B44 readiness gate + `foundation-registry-owner`** — no agent deletes `packages/design-system/` without all three. |

**Hard stops:**

- Delete `@afenda/design-system` before B44 readiness green
- Merge `@afenda/css-authority` into `@afenda/shadcn-studio`
- Expand `token.registry.ts` or design-system CSS during retirement
- Delete `@afenda/ui` without explicit post-PAS-005B ADR
- Edit `foundation-disposition.registry.ts` from implementer slices (delegate registry-owner)

**Execution rule:** B43 (doctrine) → B44 (study gate) → B45 (CSS unify) → B46 (internalize, conditional) → B47 (delete) → B48 (appshell) → B49 (attestation).

---

# 1. Why PAS-005B Exists

After PAS-005 B26–B37 and PAS-005A B38–B42p, three design layers overlap:

| Layer | Package | Status today | PAS-005B target |
| --- | --- | --- | --- |
| CSS constitutional | `@afenda/css-authority` | **Live** — 605 tokens | **Keep** — sole CSS authority |
| Presentation product | `@afenda/shadcn-studio` | **Live** — B42p | **Keep** — expand as sole presentation product |
| Legacy design + TS registries | `@afenda/design-system` | **Shim + registries** | **Retire** — delete at B47 |
| Governed shell primitives | `@afenda/ui` | **Live** — TIP-004 | **Keep v1** — optional internalize B46 |

PAS-005 §8 deferred design-system deletion (`do-not-delete-design-system-v1`). PAS-005B + ADR-0025 define the **safe path** to lift that prohibition.

---

# 2. One-Sentence Boundary

**PAS-005B governs the retirement of `@afenda/design-system`; it never owns CSS token registry edits (PAS-005), presentation MCP inventory (PAS-005A), or ERP business behavior.**

---

# 3. End-State Architecture

```txt
tailwindcss
  → @afenda/ui/afenda-ui.css
      → @afenda/css-authority/css/afenda-css-authority.css   (all --afenda-* + @theme — no design-system shim)
  → @afenda/shadcn-studio/shadcn-studio.css                  (shadcn vocabulary + presets)
  → @afenda/appshell/afenda-appshell.css
  → @afenda/metadata-ui/afenda-metadata-ui.css
  → apps/erp/globals.css
```

**Upstream alignment (shadcn/ui Tailwind v4):** `:root` / `.dark` CSS variables + `@theme inline` mapping — owned by css-authority bridge; shadcn-studio base theme aligns vocabulary without duplicating registry rows.

---

# 4. What Gets Retired vs Relocated

| Asset (today in design-system) | Action | Destination |
| --- | --- | --- |
| `afenda-tokens.css` / `--afenda-*` generation | **Retire shim** | `@afenda/css-authority` authority JSON (already 465 afenda-extensions) |
| `afenda-design-system.css` monolith | **Already deprecated** (B30) | Delete with package B47 |
| `token.registry.ts` TS mirror | **Retire** | css-authority JSON is source of truth; no TS duplicate |
| `recipe.registry.ts` | **Relocate** (if B44 = keep ui) | `packages/ui/src/governance/registries/` (B46) |
| `variant.registry.ts` | **Relocate** (if B44 = keep ui) | same |
| `state.registry.ts` | **Relocate** (if B44 = keep ui) | same |
| `motion.registry.ts` | **Relocate** (if B44 = keep ui) | same |
| `accessibility.registry.ts` | **Relocate** (if B44 = keep ui) | same |
| Governance scripts (`check-governance.ts`, etc.) | **Relocate or fold** | `@afenda/ui` governance gates |

---

# 5. Consumer Impact

| Consumer | Current dependency | B45 impact | B47 impact |
| --- | --- | --- | --- |
| `@afenda/ui` | `@afenda/design-system` via `governance/design-system.ts` | CSS import chain only | TS bridge → local registries (B46) |
| `apps/erp` | CSS via `@afenda/ui/afenda-ui.css` | No TS change | No TS change |
| `apps/storybook` | package.json dep + vite alias | Alias removal | package.json dep removal |
| `@afenda/ui-composition` | Contract references | Doc sync | Import updates |
| `@afenda/ai-governance` | Test fixtures | None until B47 | Fixture path updates |

**Primary runtime TS consumer:** 6 files under `packages/ui/src/governance/**` and tests.

---

# 6. Prohibited Overlap After Retirement

| Package | Must NOT define after B47 |
| --- | --- |
| `@afenda/design-system` | **Package deleted** |
| `@afenda/shadcn-studio` | CSS-TOKEN registry; `--afenda-*` source |
| `@afenda/ui` | New token/recipe authority (consume css-authority CSS only) |
| `apps/erp` | Token authority in globals |

---

# 7. Decision Matrix

| Question | If yes → | Owner |
| --- | --- | --- |
| Is it a CSS-TOKEN or `--afenda-*` fact? | css-authority | PAS-005 |
| Is it shadcn theme / preset / MCP block? | shadcn-studio | PAS-005A |
| Is it governed primitive recipe/variant? | ui/governance | TIP-004 (until post-005B ADR) |
| Is it retiring design-system TS/CSS? | PAS-005B slice | This PAS |
| Is it deleting the package? | B47 + ADR-0025 + registry-owner | Hard stop |

---

# 8. B44 Migration Study (mandatory gate)

Before B45, B44 must produce:

1. **`check:design-system-retirement-readiness`** — assert every `--afenda-*` in generated `afenda-tokens.css` exists in css-authority JSON; assert import allowlist for `@afenda/design-system`.
2. **Study table** — Migrate / Internalize / Retire per registry file.
3. **Appshell parity inventory** — `presentation/blocks/` vs shadcn-studio block inventory gaps.

**B44 study outcomes for `@afenda/ui`:**

| Outcome | B46 action |
| --- | --- |
| **KEEP ui** (default) | Internalize registries into `packages/ui/src/governance/registries/` |
| **SHRINK ui** | Document shell-only primitive set; expand delegating-flip policy — requires separate ADR |

---

# 9. Slice Sequence

| Slice | Scope | Status |
| --- | --- | --- |
| B43 | Author PAS-005B + ADR-0025 + skill sync | **Delivered** |
| B44 | Migration study + `check:design-system-retirement-readiness` | Not started |
| B45 | CSS chain unification — remove design-system shim from `afenda-ui.css` | Not started |
| B46 | Internalize governance registries (conditional on B44) | Not started |
| B47 | Delete `@afenda/design-system`; PKG004 → deprecated | Not started |
| B48 | Appshell `presentation/blocks/` → delegating-only strangler | Not started |
| B49 | PKGR05 green-lane + Production Candidate attestation (optional) | Not started |

**Next sequence item:** B44 — migration study + readiness gate.

---

# 10. Relationship to Parent PAS Documents

| Concern | PAS-005 | PAS-005A | PAS-005B |
| --- | --- | --- | --- |
| CSS-TOKEN registry | **Owns** | Must not edit | Preserves |
| Vendored shadcn theme | **Owns** | Derives aligned copy | Preserves |
| Theme presets / MCP | — | **Owns** | Preserves |
| design-system retirement | Deferred §8 | — | **Owns** |
| Delete design-system | Prohibited v1 | — | **Plans B47** |

---

# 11. Required Gates

## 11.1 B43 (doctrine only)

```bash
pnpm check:documentation-drift
pnpm check:foundation-disposition
```

## 11.2 B44+ (cumulative)

```bash
pnpm check:design-system-retirement-readiness   # B44 implement
pnpm check:css-authority-domain-sync
pnpm check:css-governance
pnpm --filter @afenda/ui check:governance       # B46+
pnpm quality:boundaries                         # B47+
```

---

# 12. Enterprise Readiness

| Criterion | B43 (now) | Target (B49) |
| --- | --- | --- |
| Retirement PAS canonical | Yes | — |
| ADR-0025 proposed | Yes | Accepted before B47 |
| Readiness gate | No | B44 |
| Zero design-system CSS in chain | No | B45 |
| Package deleted | No | B47 |
| Single presentation product | Partial (B42p) | B48 |
| Enterprise score | **9.1** | **9.5** after B44 gate green |

---

# 13. References

- [PAS-005](PAS-005-CSS-AUTHORITY-STANDARD.md)
- [PAS-005A](PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md)
- [ADR-0025](../adr/ADR-0025-design-system-retirement.md)
- [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md)
- [ADR-0014](../adr/ADR-0014-foundation-disposition-registry.md)
- [governed-ui-policy.md](../governance/governed-ui-policy.md)
- [pas-status-index.md](pas-status-index.md)

---

## Appendix A — Prohibited surface (audit baseline)

| Finding | Severity | Evidence | Correct home |
| --- | --- | --- | --- |
| Dual token authority (TS registry + css-authority JSON) | BLOCK | `packages/design-system/src/registries/token.registry.ts` | css-authority JSON only |
| Generator circularity (DS → bridge sync) | BLOCK | `packages/design-system/scripts/generate-tokens-css.ts` | css-authority generator only |
| Shim in ui CSS chain | BLOCK | `packages/ui/src/styles/afenda-ui.css` | B45 cutover |
| Registry prohibition | BLOCK | PKGR05 `do-not-delete-design-system-v1` | ADR-0025 + B47 |

**Blind-spot:** `quality:boundaries` does not detect dual token authority — B44 gate closes this gap.
