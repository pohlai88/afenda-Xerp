# MCP quarantine — raw install inbox

**Layer:** L2 Product (Zone B) · **Status:** inbox only — not exported from `@afenda/shadcn-studio`

This folder is the **first landing zone** for shadcn/studio MCP and CLI output. Vendor-generated UI must pass through quarantine before it can live in production buckets (`components-ui/`, `components-layouts/`, `components-auth-shell/`).

---

## Why quarantine first?

shadcn/studio installs are **vendor-shaped**, not Afenda-shaped. A fresh MCP or CLI run typically delivers:

- Hard-coded demo copy, placeholder data, and inline mock state
- Stock Tailwind classes that may bypass Afenda token semantics
- Missing or stripped `data-slot` DOM markers (required for block slot parity gates)
- Base UI patterns that conflict with governed adapter splits (`{name}.tsx` + `{name}.contract.ts`)
- Imports and file layout that match the vendor registry, not PAS-006 inventory

Production folders in this package are **governed inventory**. They carry primitive contracts, lifecycle registry entries, metadata binding, acceptance records, and ERP export contracts. Dropping raw vendor files directly into those paths creates three expensive problems:

1. **Silent regression** — `shadcn add --overwrite` on existing primitives destroys Afenda contract/adapter splits that took manual hardening to establish.
2. **False readiness** — files in `components-layouts/` look “done” to gates, Storybook, and ERP importers even when lifecycle is still **Imported**.
3. **Irreversible coupling** — ERP and Storybook consume the public barrel; once raw UI is reachable, teams wire against demo props instead of wire contracts.

Quarantine isolates **“what the vendor gave us”** from **“what Afenda ships.”** It makes the stabilization boundary explicit and reversible.

---

## What belongs here

| Source | Examples | Overwrite on re-install? |
| --- | --- | --- |
| shadcn CLI (`pnpm dlx shadcn@latest add …`) | Primitives, hooks, utilities | **Yes** — this folder is disposable |
| shadcn/studio MCP (`/cui`, `/ftc`, block registries) | Pro blocks, composed sections | **Yes** |
| Exploratory kit frames (`@shadcncraft/*`) | Candidate layouts before slot review | **Yes** |
| Manual scratch copies of vendor output | Diff review before promotion | **Yes** |

**Does not belong here:** Afenda app shell, auth ingress surfaces, stabilized blocks, or anything already registered in `meta-registry/` with lifecycle beyond **Imported**.

---

## What must never land here directly into production

Do **not** skip quarantine and install into:

| Production bucket | Path alias | Why protected |
| --- | --- | --- |
| Primitives | `src/components-ui/` → `@/components/ui/*` | Each primitive has a governed `{name}.contract.ts` split |
| Pro blocks | `src/components-layouts/` → `@/components/shadcn-studio/*` | Slot markers, block metadata, and Storybook fixtures depend on stable shapes |
| Auth shell | `src/components-auth-shell/` | WCAG-adjacent ingress surfaces with acceptance contracts |

**Hard stop:** never run `shadcn add --overwrite` against existing files in those production buckets.

---

## Promotion pipeline (quarantine → production)

Raw UI in quarantine is lifecycle state **Imported** only. Promotion follows PAS-006B:

```text
components-quarantine/     ← MCP/CLI inbox (this folder)
        │
        ▼  normalize: naming, exports, slot map, prop extraction
components-ui/ | components-layouts/ | components-auth-shell/
        │
        ▼  stabilize: a11y, responsive, theme tokens, DOM markers
        ▼  registry: lifecycle → Normalized → Stabilized → Theme-bound → Metadata-bound
        ▼  accept: PAS-006C Acceptance Record
        ▼  wire: apps/erp imports via @afenda/shadcn-studio barrel
```

Minimum checklist before moving a file out of quarantine:

- [ ] Demo/mock data replaced with typed props or wire-contract shapes
- [ ] Theme uses `@afenda/shadcn-studio` CSS variables — no one-off hex or local `:root` blocks
- [ ] `blockSlotDomMarkerProps` / `data-slot` markers restored where block gates require them
- [ ] Primitive updates preserve `{name}.contract.ts` + `{name}.tsx` adapter split
- [ ] Block registered in `meta-registry/` with correct lifecycle stage (not **Accepted** until 006C)
- [ ] Storybook fixture or lab story added for visual verification
- [ ] Gates pass: `pnpm check:studio-import-zones`, `pnpm check:studio-metadata-binding`, `pnpm check:studio-block-slot-markers`

Until those steps complete, the artifact stays in quarantine or is deleted — **quarantine contents are not public API**.

---

## Operational rules

### Overwrite is OK here

Unlike production buckets, re-running MCP/CLI against quarantine **may overwrite freely**. Treat this directory as a scratch inbox:

- Safe to blow away and re-import when vendor output drifts
- Safe to diff against production when reconciling `--overwrite` damage
- Not referenced by the package barrel, ERP, or CI inventory gates by default

### Do not export from quarantine

Consumers (`apps/erp`, `apps/storybook`) import from `@afenda/shadcn-studio` — never from `components-quarantine/`. If code needs the component, promote it first.

### Do not rename this folder

MCP install targets and ADR-0038 bucket layout depend on the physical path `src/components-quarantine/`. Renaming breaks CLI cwd conventions and agent routing.

---

## Related authority

| Document | Relevance |
| --- | --- |
| [ADR-0038](../../../docs/adr/ADR-0038-shadcn-studio-prefixed-folder-layout.md) | Declares `components-quarantine/` as MCP inbox |
| [ARCHITECTURE.md](../../ARCHITECTURE.md) | L2 bucket map and import zone matrix |
| [PAS-006B](../../../docs/PAS/PRESENTATION/PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) | Block lifecycle — no skip from **Imported** to **Accepted** |
| [shadcn-studio skill](../../../.cursor/skills/shadcn-studio/SKILL.md) | MCP workflows, `--overwrite` recovery, post-install marker restore |

---

## Summary

**Quarantine exists because vendor UI and Afenda product UI are not the same artifact.** Raw installs are fast, overwrite-friendly, and disposable; production buckets are slow, governed, and ERP-facing. Keeping that separation prevents accidental overwrite of hardened primitives, stops premature ERP wiring on demo blocks, and makes the stabilization-first pipeline auditable.
