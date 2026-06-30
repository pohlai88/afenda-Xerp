# @afenda/shadcn-studio — Source Architecture

> **Authority:** [ADR-0037](../../docs/adr/ADR-0037-shadcn-studio-src-layered-structure.md) · [PAS-006A](../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) · [P06-011](../../docs/PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md)

This document is the **maintainer map** for `packages/shadcn-studio/src`. Physical paths are frozen for MCP; logical layers explain what each folder owns.

---

## Four layers

```text
L1 AUTHORITY (Zone A)     contracts/  registry/  governance/
        │                      relative imports only — no @/
        ▼
L2 PRODUCT (Zone B)       components/ui/  components/shadcn-studio/blocks/
                          lib/  hooks/  assets/  theme/  styles/
        │                      @/components/ui  @/lib/utils OK
        ▼
L3 SURFACES (Afenda)      components/erp-shell/
        ▼
L4 VERIFICATION (internal) _storybook/  __tests__/  *.stories.tsx
```

| Layer | You edit here when… | Must not |
| --- | --- | --- |
| **L1 Authority** | Defining cross-surface wire shapes, inventory, lifecycle, gate matrices | Import `@/` · render React in L1 contracts |
| **L2 Product** | MCP primitives/blocks, theme, CSS, utilities, **primitive contracts** | Import `@/contracts` or `@/registry` |
| **L3 Surfaces** | ERP operator shell composition | Run `shadcn --overwrite` on ui/* |
| **L4 Verification** | Storybook params, package gate tests, MDX docs | Export from main `@afenda/shadcn-studio` barrel |

**L4 note:** L4 is not production runtime. Gate tests under `__tests__/` remain authoritative verification artifacts.

---

## Directory map

| Path | Layer | Files (approx) | Owns |
| --- | --- | ---: | --- |
| `contracts/` | L1 | 21 | Wire contracts: acceptance, lifecycle, metadata binding, surface templates |
| `contracts/blocks/` | L1 | 11 | Block governance metadata (`*.block.contract.ts`) |
| `registry/` | L1 | 18 | Inventory SSOT: slots, lifecycle, parity, metadata-binding graphs |
| `governance/` | L1 | 4 | Gate aggregators — metadata registries for `pnpm check:*` |
| `components/ui/` | L2 | 252 | Primitives: adapter `{name}.tsx` + `{name}.contract.ts` |
| `components/shadcn-studio/blocks/` | L2 | ~70 | MCP Pro blocks (flat or folder per block) |
| `components/erp-shell/` | L3 | 3 | ERP dashboard shell + nav (post ADR-0027) |
| `lib/` | L2 | 4 | `utils`, `compose-class-name`, governed prop helpers |
| `hooks/` | L2 | 2 | Shared hooks (e.g. pagination) |
| `assets/svg/` | L2 | 13 | Block illustrations and icons |
| `theme/` | L2 | 10 | Presets, ThemeCustomizer, settings context |
| `styles/shadcn-studio.css` | L2 | 1 | Theme CSS source → `dist/shadcn-studio.css` |
| `lab/index.ts` | L4 export | 1 | Public subpath barrel for Storybook parameters |
| `_storybook/` | L4 | 11 | Story parameters source, promotion MDX |
| `__tests__/` | L4 | 27 | Package gate tests |
| `*.stories.tsx` (src root) | L4 | 7+ | Storybook lab stories (codegen + curated) |
| `index.ts` | Public | 1 | L2 + L3 + selective L1 wire types (no L4) |

---

## Contract vocabulary

The word **contract** is overloaded. Use these terms in PRs and Phase 0 handoffs:

| Term | Pattern | Layer | Example | Owns |
| --- | --- | --- | --- | --- |
| **Primitive contract** | `components/ui/{name}.contract.ts` | **L2** | `button.contract.ts` | `PRIMITIVE_ID`, slots, cva, variant types |
| **Primitive adapter** | `components/ui/{name}.tsx` | L2 | `button.tsx` | Base UI render, public props, `data-slot` |
| **Block contract** | `contracts/blocks/{id}.block.contract.ts` | L1 | `login-page-04.block.contract.ts` | Block metadata for governance gates |
| **Wire contract** | `contracts/{topic}.contract.ts` | L1 | `acceptance-record.contract.ts` | Serializable boundary types |
| **Data contract** | `contracts/block-data.contract.ts` | L1 | — | Column/action wire shapes for datatables |

**Not all `*.contract.ts` files are L1 authority contracts.**

Primitive contracts are **product-local**. They live beside the primitive in L2 because they govern MCP-installed UI adapter behavior. L1 contracts define cross-surface wire, block governance, lifecycle, acceptance, and metadata-binding truth.

Skill: [afenda-primitive-contract](../../.cursor/skills/afenda-primitive-contract/SKILL.md)

---

## registry/ vs governance/

| Folder | Role | Rule |
| --- | --- | --- |
| `registry/` | **Inventory source of truth** | Slots, lifecycle states, MCP parity, metadata-binding registry |
| `governance/` | **CI gate aggregation** | Combines contract metadata for `check:studio-metadata-binding` and related gates |

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
| **A** | `contracts/**`, `registry/**`, `governance/**` | Relative (`../contracts/...`) | `@/`, `@afenda/shadcn-studio` self-import |
| **B** | `components/**`, `lib/**`, `hooks/**` | `@/components/ui/*`, `@/lib/utils` | `@/contracts/*`, `@/registry/*` |
| **C** | `apps/erp`, Storybook | `@afenda/shadcn-studio` barrel | Deep `src/...` paths |

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

| MCP target | Path |
| --- | --- |
| Primitives | `src/components/ui/` |
| Pro blocks | `src/components/shadcn-studio/blocks/` |

**Never** `shadcn add --overwrite` on existing `components/ui/*`.

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
| `@afenda/shadcn-studio` | L2 blocks/primitives/theme + L3 erp-shell + selective L1 wire types |
| `@afenda/shadcn-studio/lab` | L4 Storybook parameters — **not for ERP** |
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
pnpm check:studio-import-zones
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build
```

---

## Related

- [README.md](./README.md) — commands and quick start
- [shadcn-studio skill](../../.cursor/skills/shadcn-studio/SKILL.md)
- [P06-SHELL-001](../../docs/PAS/PRESENTATION/SLICE/p06-shell-001-erp-operator-shell-authority.md)
