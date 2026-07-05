# @afenda/shadcn-studio

Governed presentation product for Afenda ERP — shadcn/studio MCP install target, theme surface, primitives, blocks, and inventory pipeline.

**Agent guide:** [AGENTS.md](./AGENTS.md)  
**Architecture map:** [ARCHITECTURE.md](./ARCHITECTURE.md)  
**Quarantine inbox:** [src/components-quarantine/README.md](./src/components-quarantine/README.md)  
**Authority:** [PAS-006A](../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) · [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) · [ADR-0037](../../docs/adr/ADR-0037-shadcn-studio-src-layered-structure.md) · [ADR-0038](../../docs/adr/ADR-0038-shadcn-studio-prefixed-folder-layout.md)

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

MCP / block install (quarantine inbox — overwrite OK):

```bash
pnpm studio:shadcn:quarantine add @ss-blocks/<registry-name> --overwrite --yes
```

Add a primitive to production (safe wrapper — no overwrite on existing files):

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
| L1 Authority | `src/meta-contracts/`, `src/meta-registry/`, `src/meta-gates/` |
| L2 Product | `src/components-ui/`, `src/components-layouts/`, `src/components-quarantine/` (inbox), `src/lib/`, `src/hooks/`, `src/theme/`, `src/styles/` |
| L3 Surfaces | `src/components-app-shell/` |
| L4 Lab | `src/storybook/`, `src/__tests__/`, `src/*.stories.tsx` |

Detail: [ARCHITECTURE.md](./ARCHITECTURE.md) · [AGENTS.md](./AGENTS.md)

---

## Public exports

| Import | Use |
| --- | --- |
| `@afenda/shadcn-studio` | Blocks, primitives, theme types (ERP) |
| `@afenda/shadcn-studio/shadcn-default.css` | Default theme CSS in `apps/erp/globals.css` |
| `@afenda/shadcn-studio/governance` | CI/gate assert helpers only |
| `@afenda/shadcn-studio/lab` | Storybook parameters (not ERP) |

Quarantine contents are **not** exported — promote first.

Theme CSS governance: [src/styles/THEME-GOVERNANCE.md](./src/styles/THEME-GOVERNANCE.md)

---

## Commands

| Command | Description |
| --- | --- |
| `pnpm studio:shadcn:quarantine add …` | MCP/CLI install to `components-quarantine/` |
| `pnpm studio:shadcn add …` | Production primitive add (no overwrite) |
| `pnpm --filter @afenda/shadcn-studio typecheck` | TS project references + vitest/stories configs |
| `pnpm --filter @afenda/shadcn-studio test:run` | Package unit tests |
| `pnpm --filter @afenda/shadcn-studio build` | `dist/` + CSS copy |
| `pnpm check:studio-install-paths` | `components.json` quarantine aliases |
| `pnpm check:studio-quarantine-isolation` | No quarantine leaks in barrel/production |
| `pnpm check:studio-import-zones` | Zone A/B import policy |
| `pnpm check:studio-metadata-binding` | Metadata binding coverage |
| `pnpm check:studio-block-slot-markers` | DOM slot marker parity |
| `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio` | CSS src → dist |

---

## Hard stops

- Do not rename `src/components-ui/`, `src/components-layouts/`, or `src/components-quarantine/`.
- MCP installs land in `components-quarantine/` first — promote before ERP export.
- Do not `shadcn add --overwrite` on existing primitives in `components-ui/`.
- Do not import `@afenda/kernel` in this package.
- Do not revive `@afenda/ui`, `@afenda/appshell`, or PAS-005 ERP gates.

---

## Agent skills

- [AGENTS.md](./AGENTS.md) — package agent entry (authority, pipeline, gates)
- [shadcn-studio](../../.cursor/skills/shadcn-studio/SKILL.md) — MCP workflows
- [afenda-primitive-contract](../../.cursor/skills/afenda-primitive-contract/SKILL.md) — `components-ui/*` contract split + M1–M10 mismatch frame
