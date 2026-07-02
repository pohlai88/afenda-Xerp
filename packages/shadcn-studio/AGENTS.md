# @afenda/shadcn-studio — Agent Guide

Governed presentation product for Afenda ERP (PAS-006 / ADR-0027). This file is the **package-local agent entry** — read before MCP install, promotion, or barrel edits.

---

## Authority chain (read order)

1. [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) — sole ERP frontend presentation chain
2. [ADR-0038](../../docs/adr/ADR-0038-shadcn-studio-prefixed-folder-layout.md) — prefixed folders + quarantine inbox
3. [PAS-006A](../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) — product standard
4. [PAS-006B](../../docs/PAS/PRESENTATION/PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) — lifecycle / promotion
5. [ARCHITECTURE.md](./ARCHITECTURE.md) — L1–L4 layer map
6. [components-quarantine/README.md](./src/components-quarantine/README.md) — inbox → production pipeline

**Retired (do not restore):** `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, PAS-005, `ui:guard*` — replacement map: [`.cursor/skills/NATIVE-EVALUATION.md`](../../.cursor/skills/NATIVE-EVALUATION.md).

---

## Skill routing

Start from [`.cursor/skills/using-afenda-skills/SKILL.md`](../../.cursor/skills/using-afenda-skills/SKILL.md):

| Task | Skill |
| --- | --- |
| What exists / imports | `afenda-presentation-atlas` (`/afenda-presentation-atlas`) |
| MCP install / promotion | `shadcn-studio` |
| ERP presentation merge gates | `afenda-presentation-quality` |
| `components-ui/*` contract split | `afenda-primitive-contract` |
| Storybook lab | `afenda-storybook` |
| Phase 1 CSS | `afenda-tailwind` |
| Any code edit | `coding-consistency-bundle` + `afenda-coding-session` |

---

## Quarantine → promotion pipeline

```text
MCP / CLI (pnpm studio:shadcn:quarantine)
  → src/components-quarantine/     ← components.json install aliases (overwrite OK)
  → normalize: naming, contract split, slot map, props
  → components-ui/ | components-layouts/ | components-auth-shell/
  → meta-registry lifecycle + PAS-006C acceptance
  → @afenda/shadcn-studio barrel → apps/erp | Storybook (production paths only)
```

| Command | Target | Overwrite |
| --- | --- | --- |
| `pnpm studio:shadcn:quarantine add …` | `components-quarantine/` | **Allowed** (inbox) |
| `pnpm studio:shadcn add …` | `components-ui/` (production) | **Blocked** on existing files |

**Three-layer imports:** install (`components.json`) vs production (`tsconfig.paths.json`) vs Vite (`apps/storybook/.storybook/main.ts`) — [`.cursor/rules/studio-import-path-aliases.mdc`](../../.cursor/rules/studio-import-path-aliases.mdc).

---

## Hard stops

- **No** direct imports from `components-quarantine/` in ERP, Storybook, or production buckets
- **No** `shadcn add --overwrite` on existing `components-ui/*`
- **No** pointing `components.json` install aliases at production paths
- **No** `@afenda/kernel` import in this package
- **No** resurrecting retired presentation packages without new ADR
- **No** exporting quarantine contents from `src/index.ts`

---

## Gates

```bash
pnpm check:studio-install-paths
pnpm check:studio-quarantine-isolation
pnpm check:studio-tsconfig-paths
pnpm check:studio-import-zones
pnpm check:studio-paths
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm check:studio-primitive-contracts
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
pnpm check:package-css-dist-sync
```

After promotion + ERP wiring:

```bash
pnpm check:erp-metadata-pas006-consumer
pnpm --filter @afenda/erp typecheck && pnpm --filter @afenda/erp build
```

---

## Related

- [README.md](./README.md) — commands and quick start
- [shadcn-studio skill](../../.cursor/skills/shadcn-studio/SKILL.md)
- [figma-mcp-afenda.md](../../.cursor/skills/shadcn-studio/figma-mcp-afenda.md)
