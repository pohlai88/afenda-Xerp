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
pnpm studio:shadcn:quarantine add …     ← install to mirrored inbox
pnpm studio:quarantine sync             ← quarantine-inbox.registry.json
pnpm studio:promote --block <id>          ← preflight (always run first)
pnpm studio:promote --block <id> --apply ← only when verdict = READY_TO_PROMOTE
        │
        ▼  meta-registry lifecycle (manual): Normalized → … → Metadata-bound
        ▼  accept: PAS-006C Acceptance Record
        ▼  wire: apps/erp via @afenda/shadcn-studio barrel
```

**Hard stop:** `--apply` never runs when verdict is `BLOCKED_DUPLICATE` (production file already exists).

### Promote preflight (4 steps)

Every `pnpm studio:promote --block <id>` runs:

1. Registry sync
2. Block lookup in `quarantine-inbox.registry.json`
3. Path verify (quarantine file + production target + bucket)
4. Verdict label

| Verdict | Meaning | `--apply`? |
| --- | --- | --- |
| `BLOCKED_DUPLICATE` | Production already has this block | **Never** — use `discard` |
| `BLOCKED_CHECKLIST` | Hard checklist fail (e.g. slot markers) | No — fix in quarantine |
| `BLOCKED_MISSING` | Not registered or file missing on disk | No — run `sync` + `list` |
| `INBOX` | Needs normalization before promote | No |
| `READY_TO_PROMOTE` | Production slot free, checklist passes | **Yes** |

Preflight prints a single **Next:** line — the only command to run after the report.

Minimum checklist before `--apply`:

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

### Mirrored inbox layout

```text
src/components-quarantine/
  README.md
  quarantine-inbox.registry.json    ← generated (`pnpm studio:quarantine sync`)
  components-layouts/               ← blocks (flat .tsx or <slug>/ dirs)
  components-ui/                    ← install-time primitive deps
  components-auth-shell/            ← auth ingress blocks (e.g. login-page-04)
```

Install aliases in `components.json`:

```json
"components": "@/components-quarantine/components-layouts",
"ui": "@/components-quarantine/components-ui"
```

### Command reference

**Inbox** (`pnpm studio:quarantine …`):

| Command | Effect |
| --- | --- |
| `sync` | Regenerate `quarantine-inbox.registry.json` from disk |
| `list [--json]` | Human table or JSON for tooling |
| `reset` | Dry-run: show paths to delete + origin layout to restore |
| `reset --apply` | Wipe inbox to origin (README + empty buckets + empty registry) |
| `discard --block <id>` | Remove one block from inbox |

**Promote** (`pnpm studio:promote …`):

| Command | Effect |
| --- | --- |
| `--block <id>` | Full preflight — no filesystem writes |
| `--block <id> --apply` | Move to production when verdict is `READY_TO_PROMOTE` |
| `list [--json]` | Same as `studio:quarantine list` |

**Install** (from repo root):

```bash
pnpm studio:shadcn:quarantine add @ss-blocks/<registry-name> --overwrite --yes
pnpm studio:quarantine sync
pnpm studio:promote --block <blockId>
```

**Typical outcomes:**

| Situation | Verdict | Next command |
| --- | --- | --- |
| Re-import of existing production block | `BLOCKED_DUPLICATE` | `pnpm studio:quarantine discard --block <id>` |
| Net-new block, missing slot markers | `BLOCKED_CHECKLIST` or `INBOX` | Fix in quarantine, re-run preflight |
| Net-new block, checklist green | `READY_TO_PROMOTE` | `pnpm studio:promote --block <id> --apply` |
| Clean slate before new install | — | `pnpm studio:quarantine reset --apply` |

Legacy aliases (`studio:quarantine:sync`, `studio:quarantine:list`, etc.) forward to the same scripts.

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
| [AGENTS.md](../../AGENTS.md) | Agent command console + gates |
| [shadcn-studio skill](../../../.cursor/skills/shadcn-studio/SKILL.md) | MCP install, marker restore |
| [using-afenda-skills](../../../.cursor/skills/using-afenda-skills/SKILL.md) | Skill routing — `studio:quarantine` · `studio:promote` |

---

## Summary

**Quarantine exists because vendor UI and Afenda product UI are not the same artifact.** Raw installs are fast, overwrite-friendly, and disposable; production buckets are slow, governed, and ERP-facing. Keeping that separation prevents accidental overwrite of hardened primitives, stops premature ERP wiring on demo blocks, and makes the stabilization-first pipeline auditable.
