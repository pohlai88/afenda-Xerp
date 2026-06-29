# PAS-006A — shadcn/studio Product Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-006A |
| **Document class** | `package_authority_standard` |
| **Document role** | `presentation_product_runtime` |
| **Parent charter** | [PAS-006](PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| **Package** | `@afenda/shadcn-studio` |
| **Layer** | Design |
| **Blueprint box** | shadcn/studio Presentation |
| **Registry lane** | `PKGR05A_SHADCN_STUDIO` |
| **Agent skill** | `shadcn-studio` · `.cursor/skills/shadcn-studio/SKILL.md` |
| **Maturity** | Production Candidate |
| **Runtime status** | Theme presets, MCP block seed, CSS dist chain, Storybook lab, ERP globals composition live |
| **Remaining slices** | none for P06 family — operator-surface route expansion in ERP |
| **Consumers** | `apps/erp`, `apps/storybook` |
| **Slice directory** | `docs/PAS/PRESENTATION/SLICE/` |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/shadcn-studio typecheck` |
| 2 | `pnpm --filter @afenda/shadcn-studio test:run` |
| 3 | `pnpm --filter @afenda/shadcn-studio build` |
| 4 | `pnpm --filter @afenda/erp typecheck` |
| 5 | `pnpm --filter @afenda/erp build` |
| 6 | `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio` |
| 7 | `pnpm check:package-css-dist-sync` |
| 8 | `pnpm quality:boundaries` |
| 9 | `pnpm check:foundation-disposition` |

> **Maturity is part of authority.** Product baseline is live; block **Accepted** lifecycle and ACPA gates require [PAS-006C](PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md).

---

# 0. Agent Quick Path

1. Read [ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md) — no legacy UI packages.
2. MCP install cwd: **`packages/shadcn-studio`** ([ADR-0017](../../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md)).
3. Export blocks via `@afenda/shadcn-studio` public barrel only.
4. ERP CSS: three-layer chain in `apps/erp/src/app/globals.css` (theme → tailwindcss → shadcn/tailwind.css).
5. Run §13 gates before claiming product work done.

**Boundary:** `@afenda/shadcn-studio` **owns** theme presets, stock primitives, MCP-installed blocks, CSS export, public barrel, Storybook lab parameters; **never owns** Acceptance Record enforcement (006C), relational lifecycle registry (006B), metadata templates (006D), kernel, or ERP routes.

**Hard stops:** no kernel import · no legacy UI · sync CSS dist after `src/styles/` edits · no ERP wiring of **Imported** blocks as Accepted (006C).

---

# 1. Package Definition

Presentation **product runtime** — the install target for shadcn/studio MCP, theme surface, and block exports consumed by ERP and Storybook.

---

# 2. Authority Surfaces

| Surface | Path | Contract rule |
| --- | --- | --- |
| Public barrel | `packages/shadcn-studio/src/index.ts` | Explicit block + theme exports |
| Theme presets | `src/theme/theme-presets.ts` | JSON-serializable |
| CSS source | `src/styles/shadcn-studio.css` | Authoring only |
| CSS dist | `dist/shadcn-studio.css` | App import target |
| Primitives | `src/components/ui/` | shadcn CLI targets |
| Blocks | `src/components/shadcn-studio/blocks/` | MCP install targets |
| Block parity registry | `src/registry/studio-block-parity.registry.ts` | Inventory seed — extended by 006B |
| Storybook lab | `apps/storybook/stories/shadcn-studio-*.stories.tsx` | Pre-ERP verification |

---

# 3. Dependency Rules

## 3.1 Allowed

- React 19 · Next 16 peer deps · Radix · Tailwind merge · vendor block deps listed in package.json
- Zero `@afenda/*` runtime dependencies

## 3.2 Prohibited imports

`@afenda/kernel` · `@afenda/database` · `@afenda/auth` · `@afenda/ui` · `@afenda/appshell` · `@afenda/metadata-ui` · `@afenda/css-authority` · `apps/erp`

---

# 4. CSS Authority

Single sync target per `scripts/governance/package-css-dist-policy.mjs`:

- Source: `packages/shadcn-studio/src/styles/shadcn-studio.css`
- Dist: `packages/shadcn-studio/dist/shadcn-studio.css`

ERP composition order (immutable without ADR):

```txt
1. @afenda/shadcn-studio/shadcn-studio.css
2. tailwindcss
3. shadcn/tailwind.css
```

Tailwind utilities **boost** theme tokens — must not redefine primitive semantics (NS I8).

---

# 5. MCP Install Doctrine

```text
MCP / shadcn CLI (cwd: packages/shadcn-studio)
  → src/components/ui/ | src/components/shadcn-studio/blocks/
  → index.ts export
  → Storybook story
  → (006C) Acceptance Record before ERP route
```

Skill: `.cursor/skills/shadcn-studio/SKILL.md` · Rule: `.cursor/rules/shadcn-studio.instructions.mdc`

---

# 6. Public Contract Rules

- Theme presets and registry entries **JSON-serializable** at boundaries.
- No circular imports between shadcn-studio and ERP.
- No business logic or permission evaluation in presentation package.
- ERP `proxy.ts` — correlation-id only (CSP follow-up ADR when third-party scripts return).

---

# 7. Decision Matrix

| Question | If yes → | In 006A? |
| --- | --- | --- |
| Theme or CSS export? | 006A | **Yes** |
| MCP block file on disk? | 006A intake | **Yes** (Imported state) |
| Block lifecycle Accepted? | 006B + 006C | **No** |
| Acceptance Record schema? | 006C | **No** |
| Metadata template? | 006D | **No** |
| Kernel branded ID? | kernel | **No** |

---

# 12. Slice Catalog

| Slice | Title | Status |
| --- | --- | --- |
| P06-001 | Product baseline (theme, CSS, MCP seed, lab, ERP globals) | **Delivered** (legacy B38–B42f) |

See [presentation-slice-catalog.md](SLICE/presentation-slice-catalog.md).

---

# 13. Gates

See metadata **Required gates** table §0. Family gates from 006C apply when claiming block **Accepted**.

---

# Related

- [PAS-006B](PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) · [PAS-006C](PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md)
- [North star](../../NORTHSTAR/shadcn-studio-presentation-north-star.md) · [Blueprint](../../BLUEPRINT/shadcn-studio-presentation-blueprint.md)
