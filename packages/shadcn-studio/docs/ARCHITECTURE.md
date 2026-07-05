# @afenda/shadcn-studio — Source Architecture

> **Authority:** [ADR-0038](../../docs/adr/ADR-0038-shadcn-studio-prefixed-folder-layout.md) (amends ADR-0037) · [ADR-0037](../../docs/adr/ADR-0037-shadcn-studio-src-layered-structure.md) · [PAS-006A](../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) · [P06-011](../../docs/PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md)

This document is the **maintainer map** for `packages/shadcn-studio/src`. Physical paths are frozen for MCP; logical layers explain what each folder owns.

---

## Four layers

```text
L1 AUTHORITY (Zone A)     meta-contracts/  meta-registry/  meta-gates/
        │                      relative imports only — no @/
        ▼
L2 PRODUCT (Zone B)       components-ui/  components-layouts/  components-auth-shell/
                          components-assets/  components-quarantine/
                          lib/  hooks/  theme/  styles/
        │                      @/components/ui  @/lib/utils OK
        ▼
L3 SURFACES (Afenda)      components-app-shell/
        ▼
L4 VERIFICATION (internal) storybook/  gate/  *.stories.tsx
```

| Layer | You edit here when… | Must not |
| --- | --- | --- |
| **L1 Authority** | Defining cross-surface wire shapes, inventory, lifecycle, gate matrices | Import `@/` · render React in L1 contracts |
| **L2 Product** | MCP primitives/blocks, theme, CSS, utilities, **primitive contracts** | Import `@/contracts` or `@/registry` |
| **L3 Surfaces** | App shell composition | Run `shadcn --overwrite` on ui/* |
| **L4 Verification** | Storybook params, package gate tests, MDX docs | Export from main `@afenda/shadcn-studio` barrel |

**L4 note:** L4 is not production runtime. All package tests live under `src/__tests__/` (repo convention); `vitest.config.ts` uses `src/__tests__/**/*.{test,spec}.{ts,tsx}`.

---

## Directory map

| Path | Layer | Files (approx) | Owns |
| --- | --- | ---: | --- |
| `meta-contracts/` | L1 | 13 | Wire contracts: acceptance, lifecycle, metadata binding, surface templates, block metadata builders |
| `meta-registry/` | L1 | 19 | Inventory SSOT: slots, lifecycle, parity, metadata-binding graphs + `_registry-inventory.registry` |
| `meta-gates/` | L1 | 4 | **One inventory SSOT** (`_governance.registry.ts`) + runtime aggregators + gate barrel |
| `components-ui/` | L2 | 252 | Primitives: adapter `{name}.tsx` + `{name}.contract.ts` |
| `components-layouts/` | L2 | ~70 | MCP Pro blocks (flat or folder per block) |
| `components-auth-shell/` | L2 | 3+ | Auth ingress: MCP blocks + `auth-shell.tsx` composer + `resolve-auth-shell.tsx` lane map — see [AGENTS.md § Auth ingress bucket](./AGENTS.md#auth-ingress-bucket-l2) |
| `components-quarantine/` | L2 | varies | MCP blocks pending promotion — see README |
| `components-app-shell/` | L3 | 3+ | App shell composers (flat bucket — see Naming) |
| `lib/` | L2 | 5 | `compose-class-name`, `compute-pagination-range`, `governed-primitive-props`, `_lib-inventory.registry` |
| `utils/` | L2 | 1 | `cn()` helper (`utils.ts`) |
| `hooks/` | L2 | 1 | React hooks (`useIsMobile` for sidebar) |
| `components-assets/` | L2 | 7 | Brand/monochrome SVG icons (`icon-*.tsx`, `LogoSvg`) — L4 gallery default |
| `theme/` | L2 | 10 | Presets, ThemeCustomizer, settings context |
| `styles/shadcn-default.css` | L2 | 1 | Default theme CSS source → `dist/shadcn-default.css` |
| `styles/theme-template.css` · `styles/theme-manifest.json` · `styles/THEME-GOVERNANCE.md` | L2 | 3 | Theme CSS authoring template, registry, and governance |
| `styles/themes/` | L2 | varies | Future token-only theme overlays |
| `lab/index.ts` | L4 export | 1 | Public subpath barrel for Storybook parameters |
| `storybook/` | L4 | 11 | Story parameters source, promotion MDX |
| `src/__tests__/` | L4 | 157 | All package tests: gate, primitive contracts, interactions, inventory, theme, MCP policy |
| `src/storybook/*.stories.tsx` | L4 | 10+ | Storybook lab stories (codegen + curated) |
| `index.ts` | Public | 1 | L2 + L3 + selective L1 wire types (no L4) |

---

## Naming

L3 shell file stems, reference→Afenda mapping, multi-shell recipe, and anti-patterns are authoritative in [AGENTS.md § Naming convention (reference-aligned)](./AGENTS.md#naming-convention-reference-aligned). Do not duplicate the full rules table here.

---

## Contract vocabulary

The word **contract** is overloaded. Use these terms in PRs and Phase 0 handoffs:

| Term | Pattern | Layer | Example | Owns |
| --- | --- | --- | --- | --- |
| **Block metadata** | `block-metadata.contract.ts` + `block-metadata.builders.ts` | L1 | `buildBlockMetadata()` | Governed block metadata derived from `meta-registry/block-slot.registry.ts` |
| **Wire contract** | `meta-contracts/{topic}.contract.ts` | L1 | `app-shell.contract.ts` | Serializable boundary types (nav, operating context) |
| **L1 envelope** | `_contract-envelope.registry.ts` + `@afenda.l1-contract-envelope` header | L1 | flat-L1 series (2026-07-01) | Inventory SSOT; gate fails on add/delete without registry update |
| **Data contract** | `meta-contracts/block-data.contract.ts` | L1 | — | Column/action wire shapes for datatables |
| **Primitive contract** | `components-ui/{name}.contract.ts` | **L2** | `button.contract.ts` | `PRIMITIVE_ID`, slots, cva, variant types |
| **Primitive adapter** | `components-ui/{name}.tsx` | L2 | `button.tsx` | Base UI render, public props, `data-slot` |

**Not all `*.contract.ts` files are L1 authority contracts.**

Primitive contracts are **product-local**. They live beside the primitive in L2 because they govern MCP-installed UI adapter behavior. L1 contracts define cross-surface wire, block governance, lifecycle, acceptance, and metadata-binding truth.

Skill: [afenda-primitive-contract](../../.cursor/skills/afenda-primitive-contract/SKILL.md) · Mismatch frame: [reference/mismatch-inspection-frame.md](../../.cursor/skills/afenda-primitive-contract/reference/mismatch-inspection-frame.md) · Rule: [ui-primitive-mismatch-frame.mdc](../../.cursor/rules/ui-primitive-mismatch-frame.mdc)

---

## meta-registry/ vs meta-gates/

| Folder | Role | Rule |
| --- | --- | --- |
| `meta-registry/` | **Inventory source of truth** | Slots, lifecycle states, MCP parity, metadata-binding, acceptance records, surface templates |
| `meta-gates/` | **CI gate aggregation** | One `_governance.registry.ts` inventory + runtime aggregators (`*.registry.ts` derive from `meta-registry/` + L2) |

`meta-gates/` must not introduce parallel inventory truth — aggregate from `meta-registry/` + `meta-contracts/`.

**Quarantine:** `components-quarantine/` holds MCP inbox artifacts pending promotion review. Its corrected inbox buckets are `blocks/` and `components/`; older `components-layouts/`, `components-ui/`, and `components-auth-shell/` inbox names are retired. See [`components-quarantine/README.md`](src/components-quarantine/README.md) for the pipeline.

---

## Import zone matrix

Enforced by `pnpm check:studio-import-zones` plus layer direction rules.

| From | May import | Must not import |
| --- | --- | --- |
| **L1 Authority** | L1 relative modules, approved pure helpers | L2 Product, L3 Surfaces, L4 Verification, React components |
| **L2 Product** | Local product modules, `@/lib`, `@/hooks`, co-located primitive contracts | L3 Surfaces, L4 Verification, governance aggregators |
| **L3 Surfaces** | L2 Product, selective L1 wire contracts/types | L4 Verification, governance aggregators as runtime dependencies |
| **L4 Verification** | L1, L2, L3 for testing/storying | Must not be exported by main package barrel |

```text
L4 may observe all
L3 may compose L2 + selected L1
L2 may use product-local contracts/helpers
L1 must not depend on product rendering
```

Legacy Zone shorthand:

| Zone | Paths | Allowed | Forbidden |
| --- | --- | --- | --- |
| **A** | `meta-contracts/**`, `meta-registry/**`, `meta-gates/**` | Relative (`../meta-contracts/...`) | `@/`, `@afenda/shadcn-studio` self-import |
| **B** | `components-ui/**`, `components-layouts/**`, `lib/**`, `hooks/**` | `@/components/ui/*`, `@/components/shadcn-studio/*`, `@/lib/utils` | `@/components-ui/*`, `@/components-layouts/*`, `@/contracts/*`, `@/registry/*` |
| **C** | `apps/erp`, Storybook | `@afenda/shadcn-studio` barrel | Deep `src/...` paths · studio internal `@/` in docs |

---

## MCP install paths (three-layer model)

### Layer 1 — Install (`components.json`)

MCP/CLI **writes** land in quarantine only (ADR-0038):

```json
{
  "aliases": {
    "components": "@/components-quarantine/blocks",
    "ui": "@/components-quarantine/components",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

| Install command | Physical path | Overwrite |
| --- | --- | --- |
| `pnpm studio:shadcn:quarantine` | `src/components-quarantine/{blocks,components}/` | **OK** (inbox) |
| `pnpm studio:shadcn` | `src/components-ui/` (production) | **Blocked** on existing primitives |

Inbox registry: `src/components-quarantine/quarantine-inbox.registry.json` · commands: `studio:quarantine:sync`, `studio:promote`

Gate: `pnpm check:studio-install-paths` · `pnpm check:studio-quarantine-isolation`

Promotion: [`components-quarantine/README.md`](src/components-quarantine/README.md) · agent guide: [AGENTS.md](./AGENTS.md)

### Layer 2 — Production (`tsconfig.paths.json`)

Source **reads** use virtual MCP aliases — not physical folder names:

| MCP virtual alias | Physical path |
| --- | --- |
| `@/components/ui/*` | `src/components-ui/*` |
| `@/components/shadcn-studio/*` | `src/components-layouts/*` |

**Never** `shadcn add --overwrite` on existing `components-ui/*`.

### Layer 3 — Vite runtime

`apps/storybook/.storybook/main.ts` must mirror layer 2. Rule: [`.cursor/rules/studio-import-path-aliases.mdc`](../../.cursor/rules/studio-import-path-aliases.mdc)

---

## Import path SSOT and prevention

Physical folder names (ADR-0038) differ from MCP virtual import aliases (ADR-0017).

| SSOT | Role |
| --- | --- |
| `tsconfig.paths.json` | Canonical TypeScript path map |
| `scripts/governance/studio-import-path-policy.mjs` | Shared forbidden patterns + hook reminders |
| `.cursor/rules/studio-import-path-aliases.mdc` | Agent rule |

```bash
pnpm check:studio-tsconfig-paths   # tsconfig drift + legacy tree
pnpm check:studio-import-zones     # source import vocabulary
pnpm check:studio-paths            # both
```

Diagnosis (read-only): `@studio-import-path-auditor`

---

## Block layout convention

| Block shape | Layout |
| --- | --- |
| Single file, no sub-regions | `blocks/statistics-card-01.tsx` |
| Tabs, steps, or `content/` regions | `blocks/account-settings-01/` + root export |

Folder name = registry `mcpBlockId`.

**Migration rule:** Do not migrate existing blocks for layout consistency alone. Apply to **new blocks** and blocks **materially refactored**.

---

## Public exports

| Export path | Contents |
| --- | --- |
| `@afenda/shadcn-studio` | L2 blocks/primitives/theme + L3 app-shell + selective L1 wire types |
| `@afenda/shadcn-studio/lab` | L4 Storybook parameters — **not for ERP** |

**In-package stories** import `./lab/index.js` (not `@afenda/shadcn-studio/lab`) — same-package import zone gate.
| `@afenda/shadcn-studio/theme` | Theme preset surface |
| `@afenda/shadcn-studio/governance` | Server/gate-only assert helpers |
| `@afenda/shadcn-studio/shadcn-default.css` | Dist CSS |

---

## MVC vocabulary (docs only)

| MVC | Maps to |
| --- | --- |
| **Model** | L1 wire/block/data contracts + L2 primitive contracts |
| **View** | L2 + L3 components |
| **Controller** | L1 validators, lifecycle mutation, `assert-*-coverage`, `build-*-from-*` |

---

## Production pipeline (context)

```text
MCP import (L2, Imported)
  → normalize + stabilize (primitive contract split, slots)
  → registry lifecycle (L1)
  → acceptance seal (PAS-006C)
  → ERP wire (apps/erp)
```

Full lifecycle: [PAS-006B](../../docs/PAS/PRESENTATION/PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md).

---

## Gates (structure-related)

```bash
pnpm check:studio-install-paths
pnpm check:studio-quarantine-isolation
pnpm check:studio-l1-contracts
pnpm check:studio-registry-inventory
pnpm check:studio-tsconfig-paths
pnpm check:studio-import-zones
pnpm check:studio-paths
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm check:studio-blocks
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build
```

---

## Related

- [README.md](./README.md) — commands and quick start
- [AGENTS.md](./AGENTS.md) — agent authority chain, quarantine pipeline, gates
- [shadcn-studio skill](../../.cursor/skills/shadcn-studio/SKILL.md)
- [P06-SHELL-001](../../docs/PAS/PRESENTATION/SLICE/p06-shell-001-app-shell-authority.md)
