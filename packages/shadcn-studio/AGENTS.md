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

---

## Command console

Quick reference for agents — full detail in [components-quarantine/README.md](./src/components-quarantine/README.md).

### Install → inbox

```bash
# From repo root
pnpm studio:shadcn:quarantine add @ss-blocks/<registry-name> --overwrite --yes
pnpm studio:quarantine sync
pnpm studio:quarantine list
```

### Promote (preflight always first)

```bash
pnpm studio:promote --block <blockId>              # sync + verify + verdict (no writes)
pnpm studio:promote --block <blockId> --apply      # only when READY_TO_PROMOTE
```

### Inbox hygiene

```bash
pnpm studio:quarantine discard --block <blockId>   # remove one entry
pnpm studio:quarantine reset                       # dry-run origin restore
pnpm studio:quarantine reset --apply               # execute origin restore
```

### Verdict → action

| Verdict | Agent action |
| --- | --- |
| `BLOCKED_DUPLICATE` | Never `--apply`. Show diff in preflight. Run `discard` or leave for review. |
| `BLOCKED_CHECKLIST` / `INBOX` | Fix normalization in quarantine. Re-run preflight. |
| `READY_TO_PROMOTE` | Run `--apply`, then manual PAS-006B tail (lifecycle, barrel, storybook). |
| `BLOCKED_MISSING` | Run `sync` + `list`; re-install if needed. |

### Post-apply manual steps (never auto-run)

1. Restore `blockSlotDomMarkerProps` if MCP stripped them
2. Lifecycle: imported → normalized → stabilized → theme-bound → metadata-bound
3. Barrel export in `src/index.ts`
4. `pnpm storybook generate`
5. Gates: `check:studio-block-slot-markers`, `check:studio-metadata-binding`

---

## Quarantine → promotion pipeline

```text
MCP / CLI (pnpm studio:shadcn:quarantine)
  → src/components-quarantine/          ← mirrored buckets (overwrite OK)
      components-layouts/ | components-ui/ | components-auth-shell/
  → pnpm studio:promote --block <id>    ← preflight (verdict label)
  → pnpm studio:promote --block <id> --apply   ← only when READY_TO_PROMOTE
  → meta-registry lifecycle + PAS-006C acceptance
  → @afenda/shadcn-studio barrel → apps/erp | Storybook (production paths only)
```

| Command | Purpose |
| --- | --- |
| `pnpm studio:quarantine sync` | Regenerate inbox registry |
| `pnpm studio:quarantine list [--json]` | Inbox table |
| `pnpm studio:quarantine reset [--apply]` | Restore empty origin inbox |
| `pnpm studio:quarantine discard --block <id>` | Remove one inbox entry |
| `pnpm studio:promote --block <id>` | **Preflight** — sync, verify paths, verdict label |
| `pnpm studio:promote --block <id> --apply` | Promote only when verdict is `READY_TO_PROMOTE` |

**Verdict labels:** `BLOCKED_DUPLICATE` · `BLOCKED_CHECKLIST` · `BLOCKED_MISSING` · `INBOX` · `READY_TO_PROMOTE`

Legacy aliases (`studio:quarantine:sync`, etc.) still work.

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
pnpm check:quarantine-registry-sync
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
