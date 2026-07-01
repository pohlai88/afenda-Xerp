# @afenda/shadcn-studio

Governed presentation product for Afenda ERP — shadcn/studio MCP install target, theme surface, primitives, blocks, and inventory pipeline.

**Architecture map:** [ARCHITECTURE.md](./ARCHITECTURE.md)  
**Authority:** [PAS-006A](../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) · [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) · [ADR-0037](../../docs/adr/ADR-0037-shadcn-studio-src-layered-structure.md)

---

## Quick start

```bash
# From repo root
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build

# MCP / CLI install cwd
cd packages/shadcn-studio
pnpm dlx shadcn@latest info
```

Add a primitive (safe wrapper — no overwrite):

```bash
pnpm studio:shadcn add button --yes
```

Storybook lab:

```bash
pnpm storybook generate
pnpm storybook dev
```

---

## Source layers (summary)

| Layer | Paths |
| --- | --- |
| L1 Authority | `src/contracts/`, `src/registry/`, `src/governance/` |
| L2 Product | `src/components/ui/`, `src/components-layouts/`, `src/lib/`, `src/hooks/`, `src/theme/`, `src/styles/` |
| L3 Surfaces | `src/components/app-shell/` |
| L4 Lab | `src/storybook/`, `src/__tests__/`, `src/*.stories.tsx` |

Detail: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Public exports

| Import | Use |
| --- | --- |
| `@afenda/shadcn-studio` | Blocks, primitives, theme types (ERP) |
| `@afenda/shadcn-studio/shadcn-studio.css` | Theme CSS in `apps/erp/globals.css` |
| `@afenda/shadcn-studio/governance` | CI/gate assert helpers only |
| `@afenda/shadcn-studio/lab` | Storybook parameters (not ERP) |

---

## Commands

| Command | Description |
| --- | --- |
| `pnpm --filter @afenda/shadcn-studio typecheck` | TS project references + vitest/stories configs |
| `pnpm --filter @afenda/shadcn-studio test:run` | Package unit tests |
| `pnpm --filter @afenda/shadcn-studio build` | `dist/` + CSS copy |
| `pnpm check:studio-import-zones` | Zone A/B import policy |
| `pnpm check:studio-metadata-binding` | Metadata binding coverage |
| `pnpm check:studio-block-slot-markers` | DOM slot marker parity |
| `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio` | CSS src → dist |

---

## Hard stops

- Do not rename `src/components/ui/` or `src/components-layouts/` (MCP cwd).
- Do not `shadcn add --overwrite` on existing primitives.
- Do not import `@afenda/kernel` in this package.
- Do not revive `@afenda/ui`, `@afenda/appshell`, or PAS-005 ERP gates.

---

## Agent skills

- [shadcn-studio](../../.cursor/skills/shadcn-studio/SKILL.md) — MCP workflows
- [afenda-primitive-contract](../../.cursor/skills/afenda-primitive-contract/SKILL.md) — ui/* contract split
