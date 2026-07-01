# @afenda/shadcn-studio — Source Architecture

> **Authority:** [ADR-0038](../../docs/adr/ADR-0038-shadcn-studio-prefixed-folder-layout.md) (amends ADR-0037) · [ADR-0037](../../docs/adr/ADR-0037-shadcn-studio-src-layered-structure.md) · [PAS-006A](../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) · [P06-011](../../docs/PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md)

This document is the **maintainer map** for `packages/shadcn-studio/src`. Physical paths are frozen for MCP; logical layers explain what each folder owns.

---

## Four layers

```text
L1 AUTHORITY (Zone A)     meta-contracts/  meta-registry/  meta-gates/
        │                      relative imports only — no @/
        ▼
L2 PRODUCT (Zone B)       components-ui/  components-layouts/  components-auth-shell/  components-quarantine/
                          lib/  hooks/  assets/  theme/  styles/
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

**L4 note:** L4 is not production runtime. Package gate tests live in `gate/`; colocated module tests stay in `**/__tests__/` per repo `vitest.shared.ts`.

---

## Directory map

| Path | Layer | Files (approx) | Owns |
| --- | --- | ---: | --- |
| `meta-contracts/` | L1 | 13 | Wire contracts: acceptance, lifecycle, metadata binding, surface templates, block metadata builders |
| `meta-registry/` | L1 | 19 | Inventory SSOT: slots, lifecycle, parity, metadata-binding graphs + `_registry-inventory.registry` |
| `meta-gates/` | L1 | 4 | **One inventory SSOT** (`_governance.registry.ts`) + runtime aggregators + gate barrel |
| `components-ui/` | L2 | 252 | Primitives: adapter `{name}.tsx` + `{name}.contract.ts` |
| `components-layouts/` | L2 | ~70 | MCP Pro blocks (flat or folder per block) |
| `components-app-shell/` | L3 | 3 | App shell (dashboard layout + nav, post ADR-0027) |
| `lib/` | L2 | 5 | `compose-class-name`, `compute-pagination-range`, `governed-primitive-props`, `_lib-inventory.registry` |
| `utils/` | L2 | 1 | `cn()` helper (`utils.ts`) |
| `hooks/` | L2 | 1 | React hooks (`useIsMobile` for sidebar) |
| `components-assets/` | L2 | 13 | Block illustrations and icons |
| `theme/` | L2 | 10 | Presets, ThemeCustomizer, settings context |
| `styles/shadcn-studio.css` | L2 | 1 | Theme CSS source → `dist/shadcn-studio.css` |
| `lab/index.ts` | L4 export | 1 | Public subpath barrel for Storybook parameters |
| `storybook/` | L4 | 11 | Story parameters source, promotion MDX |
| `gate/` | L4 | 29 | Package gate tests (inventory, metadata binding, theme, MCP policy) |
| `**/__tests__/` | L4 | 18 | Colocated render/registry tests (`lib/`, `components-ui/`, `meta-*`, …) |
| `src/storybook/*.stories.tsx` | L4 | 10+ | Storybook lab stories (codegen + curated) |
| `index.ts` | Public | 1 | L2 + L3 + selective L1 wire types (no L4) |

---

## Contract vocabulary

The word **contract** is overloaded. Use these terms in PRs and Phase 0 handoffs:

| Term | Pattern | Layer | Example | Owns |
| --- | --- | --- | --- | --- |
| **Primitive contract** | `components/ui/{name}.contract.ts` | **L2** | `button.contract.ts` | `PRIMITIVE_ID`, slots, cva, variant types |
| **Primitive adapter** | `components/ui/{name}.tsx` | L2 | `button.tsx` | Base UI render, public props, `data-slot` |
| **Block metadata** | `block-metadata.contract.ts` + `block-metadata.builders.ts` | L1 | `buildBlockMetadata()` | Governed block metadata derived from `registry/block-slot.registry.ts` |
| **Wire contract** | `contracts/{topic}.contract.ts` | L1 | `app-shell.contract.ts` | Serializable boundary types (nav, operating context) |
| **L1 envelope** | `_contract-envelope.registry.ts` + `@afenda.l1-contract-envelope` header | L1 | flat-L1 series (2026-07-01) | Inventory SSOT; gate fails on add/delete without registry update |
| **Data contract** | `contracts/block-data.contract.ts` | L1 | — | Column/action wire shapes for datatables |

**Not all `*.contract.ts` files are L1 authority contracts.**

Primitive contracts are **product-local**. They live beside the primitive in L2 because they govern MCP-installed UI adapter behavior. L1 contracts define cross-surface wire, block governance, lifecycle, acceptance, and metadata-binding truth.

Skill: [afenda-primitive-contract](../../.cursor/skills/afenda-primitive-contract/SKILL.md)

---

## registry/ vs governance/

| Folder | Role | Rule |
| --- | --- | --- |
| `registry/` | **Inventory source of truth** | Slots, lifecycle states, MCP parity, metadata-binding registry |
| `governance/` | **CI gate aggregation** | One `_governance.registry.ts` inventory + runtime aggregators (`*.registry.ts` derive from `registry/` + L2) |

`governance/` must not introduce parallel inventory truth — aggregate from `registry/` + `contracts/`.

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

## MCP install paths (do not rename)

`packages/shadcn-studio/components.json`:

```json
{
  "aliases": {
    "components": "@/components/shadcn-studio",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

| MCP target | Physical path | Import alias |
| --- | --- | --- |
| Primitives | `src/components-ui/` | `@/components/ui/*` |
| Pro blocks | `src/components-layouts/` | `@/components/shadcn-studio/*` |

**Never** `shadcn add --overwrite` on existing `components-ui/*`.

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
| `@afenda/shadcn-studio/shadcn-studio.css` | Dist CSS |

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
- [shadcn-studio skill](../../.cursor/skills/shadcn-studio/SKILL.md)
- [P06-SHELL-001](../../docs/PAS/PRESENTATION/SLICE/p06-shell-001-app-shell-authority.md)
