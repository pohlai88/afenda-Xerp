# Figma MCP + Afenda ERP (PAS-006) — **No Code Connect**

Authority: [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) · [ADR-0017](../../docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · [Figma MCP docs](https://developers.figma.com/docs/figma-mcp-server/)

**Mandatory for all agents:** Afenda does **not** use Figma Code Connect. Do **not** call `get_code_connect_suggestions`, `add_code_connect_map`, or block work on an Organization/Enterprise Figma license. Component mapping is **repo-owned** (registry + manifests + primitive contracts).

---

## Surface vocabulary (use in docs and code)

| Term | Meaning | Code / path |
| --- | --- | --- |
| **App shell** | Protected operator chrome — sidebar, header, nav, tenant context | `@afenda/shadcn-studio` → `AppShell`, `components/app-shell/`, `contracts/app-shell.contract.ts` |
| **Auth shell** | Sign-in, verify, recover, error lanes | `apps/erp` auth routes · `AuthShellFormLane` in auth registry |
| **Retired `@afenda/appshell`** | Legacy package (ADR-0027) — **do not restore** or call "ERP shell" | Archive-lane only |

Do **not** invent `erp-shell`, `ErpDashboardShell`, or `ERP Shell` in Storybook titles — use **App Shell** / `AppShell`.

---

## What Code Connect would do (and why we skip it)

Code Connect tells Figma MCP: *“this Figma `Button` = this file in your repo”* so generated snippets import your real component instead of inventing raw Tailwind.

That is **optional glue**. Afenda replaces it with registry-first install, in-repo manifests, MCP + skills, and Storybook design links. **FULL PASS** on the Afenda design system file does **not** require Code Connect.

---

## Required stack (pick one path per task)

```text
Unmodified shadcn/studio block in Figma  →  /ftc (shadcn-studio MCP) → @ss-blocks/*
shadcncraft kit frame                    →  registry match + shadcn add @shadcncraft/*
Custom / auth / one-off frame            →  Figma MCP get_design_context + shadcncraft-generate-code
Tokens only                              →  get_variable_defs + shadcncraft-import-variables
Visual QA (not codegen)                  →  Storybook addon-designs + STORYBOOK_FIGMA_* env vars
```

| Task | Required path | Never |
| --- | --- | --- |
| Stock studio block | `/ftc` or `pnpm studio:shadcn:quarantine add @ss-blocks/<id>` | Regenerate block JSX from scratch |
| shadcncraft kit frame | Name / `data-slot` → `registry-index.json` → `@shadcncraft/<name>` | Match by Figma node ID alone |
| Custom screen | Figma MCP + explicit `@afenda/shadcn-studio` primitive list in prompt | Raw Tailwind buttons/inputs in `apps/erp` |
| Design tokens | `tokens-complete.json` + CSS SSOT; optional Figma variable import skill | Duplicate STRING collections in Figma |
| Primitive identity | `ui-primitive-metadata.registry.ts` + `{name}.contract.ts` | Invent props/variants not in contract |

---

## Repo wiring

| Item | Value |
| --- | --- |
| Remote MCP | `.cursor/mcp.json` → `figma` → `https://mcp.figma.com/mcp` |
| Desktop MCP (optional) | `.cursor/mcp.json` → `figma-desktop` → `http://127.0.0.1:3845/mcp` |
| Studio MCP | `shadcn-studio` — `/cui`, `/rui`, `/iui`, `/ftc` |
| **Design system file (tokens + v1 primitives)** | [Afenda Brand Tokens (AdminCN)](https://www.figma.com/design/LsmtG4KiaTUi3KpjxZXHwH/Afenda-Brand-Tokens-AdminCN) · file key `LsmtG4KiaTUi3KpjxZXHwH` |
| Auth / login reference file | `2ZNqNOxyNb5TwCTBIaMVPD` (loginauth) — legacy reference; prefer studio blocks + `@afenda/shadcn-studio` |
| Install cwd | **`packages/shadcn-studio`** |
| MCP workflow rule | `.cursor/rules/shadcn-studio.instructions.mdc` |

---

## In-repo “Code Connect” (required reading order)

Agents resolve Figma → code using these files **before** generating JSX:

| File | Purpose |
| --- | --- |
| `packages/shadcn-studio/src/styles/shadcn-studio.figma-manifest.json` | Master Figma file map: collections, v1 components, node IDs → source paths |
| `packages/shadcn-studio/src/styles/afenda-brand.figma-manifest.json` | Color Brand collection ↔ `docs/swiss-noir.css` (per-story quarantine) |
| `packages/shadcn-studio/src/styles/afenda-verdant.figma-manifest.json` | Verdant Milk Noir lab ↔ `docs/verdant-noir.css` (per-story quarantine) |
| `packages/shadcn-studio/src/styles/dsb-state-ds-build-afenda-shadcn-2026-001.json` | Design-system build ledger (FULL_PASS) |
| `packages/shadcn-studio/tokens-complete.json` | Token SSOT |
| `packages/shadcn-studio/src/governance/ui-primitive-metadata.registry.ts` | Governed primitive inventory |
| `packages/shadcn-studio/src/components/ui/{name}.contract.ts` | Variant axes, slots, cva per primitive |
| `.cursor/skills/shadcncraft-generate-code/references/registry-index.json` | Frame name / data-slot → `@shadcncraft/{name}` |
| `.cursor/skills/shadcncraft-generate-code/references/figma-node-hints.json` | Weak node-id hints only — corroboration, not primary key |

Skill cross-refs:

- [shadcncraft-generate-code](../shadcncraft-generate-code/SKILL.md) · [component-mapping.md](../shadcncraft-generate-code/references/component-mapping.md) — **Rule 0: install registry item first**
- [shadcncraft-import-variables](../shadcncraft-import-variables/SKILL.md) — Figma variables → CSS tokens

---

## Path 1 — Registry-first (shadcncraft / kit blocks)

**Rule 0:** Before writing JSX, resolve the selection to a registry item and install.

```powershell
pnpm studio:shadcn:quarantine add @shadcncraft/<name> --yes
# Pro items: SHADCNCRAFT_LICENSE_KEY from .env.secret
```

Match order (from component-mapping.md):

1. **`data-slot`** on specimen frame → `registry-index.json` item key
2. **Frame name** (kebab-case; try `-1` suffix for variants)
3. **`get_screenshot`** to confirm before install
4. **`figma-node-hints.json`** — corroboration only, never primary key

On the reuse path you do **not** need `get_design_context` — `get_metadata` + `get_screenshot` is enough.

---

## Path 2 — shadcn/studio `/ftc` (unmodified block instances)

For **unmodified** shadcn/studio block instances in Figma:

| Tool | Workflow |
| --- | --- |
| `shadcn-studio` MCP | `/ftc` → installs matching `@ss-blocks/*` into `components-quarantine/` (promote before ERP) |

Requires `SHADCN_STUDIO_LICENSE_KEY` (see [credentials-env.md](./reference/credentials-env.md)). No Code Connect.

Post-install: restore P06-008-R2 markers, run gates — see [SKILL.md](./SKILL.md) § Post-install.

---

## Path 3 — Custom frames (Figma MCP + skills)

For heavily customized or one-off UI:

| Tool | Role |
| --- | --- |
| `get_design_context` | Layout + styles reference (adapt, do not paste raw) |
| `get_variable_defs` | Spacing, color, radius from selection |
| `get_screenshot` | Visual fidelity check |
| `get_metadata` | Large files — outline first, drill by node ID |

**Mandatory prompt pattern:**

```text
Implement this Figma frame using @afenda/shadcn-studio primitives only.
Map layers to existing components/ui/* adapters; do not generate raw Tailwind buttons/inputs.
Read {name}.contract.ts for variant axes before composing.
Install cwd: packages/shadcn-studio
Import in ERP from @afenda/shadcn-studio barrel only.
```

**Afenda conversion rules:**

1. **Primitives:** `packages/shadcn-studio/src/components-ui/{name}.tsx` + `{name}.contract.ts` — match variant props from contract
2. **Blocks:** `src/components-quarantine/` on install → promote to `src/components-layouts/` — install via `/ftc` or `pnpm studio:shadcn:quarantine add @ss-blocks/*`
3. **Theme CSS:** `@afenda/shadcn-studio/shadcn-studio.css` + optional per-story `docs/swiss-noir.css` / `docs/verdant-noir.css` — edit noir sources under `packages/shadcn-studio/docs/`, TS mirrors under `src/styles/*.preset.ts`, then `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio` when `shadcn-studio.css` changes
4. **ERP wiring:** `apps/erp` imports package barrel — no deep `src/` paths
5. **Gates:** `pnpm --filter @afenda/shadcn-studio typecheck` · `pnpm check:studio-metadata-binding` · `pnpm --filter @afenda/erp build`

**Retired — do not use:** `@afenda/ui`, `@afenda/appshell`, `ui:guard*`, PAS-005 css-authority pipeline.

---

## Path 4 — Tokens only

| Source | Action |
| --- | --- |
| `tokens-complete.json` | Code SSOT — Figma collections mirror this |
| `shadcn-studio.css` | Runtime AdminCN theme — apps import from package `dist/` |
| `docs/swiss-noir.css` / `docs/verdant-noir.css` | Scoped noir lab themes — Storybook per-story `@import` only (not ERP globals) |
| Figma `get_variable_defs` | Diff against manifest; import via [shadcncraft-import-variables](../shadcncraft-import-variables/SKILL.md) |

Figma file collections (verified FULL_PASS): **Primitives**, **Color** (Light/Dark), **Color Brand** (Brand Light/Dark), **Spacing**, **Radius**. Legacy STRING collection **Afenda Brand Tokens** — removed; use **Color Brand** only.

---

## Path 5 — Storybook ↔ Figma traceability (QA only)

Does **not** generate code. Links stories to Figma frames for visual comparison.

| Item | Location |
| --- | --- |
| Addon | `@storybook/addon-designs` in `apps/storybook` |
| Helper | `packages/shadcn-studio/src/_storybook/story-parameters.ts` → `shadcnStudioFigmaDesignFromEnv` |
| Env vars | `.env.example` → `STORYBOOK_FIGMA_*` optional URLs |

---

## OSS backup reader (optional)

If official Figma MCP is unavailable, [Framelink figma-developer-mcp](https://github.com/GLips/Figma-Context-MCP) (MIT) reads Figma via REST + personal access token. Pair with shadcncraft skills — it is a **reader**, not Code Connect.

---

## What we intentionally omit (no mitigation needed)

| Code Connect feature | Afenda substitute |
| --- | --- |
| Auto “use `Button.tsx`” in Figma Dev Mode | Manifest nodeId → source + primitive registry |
| Connected-component badge in Figma UI | Storybook design links + contract tests |
| Bidirectional design↔code in Figma | One-way MCP + registry install is sufficient for ERP |

**Agents:** If Code Connect API returns a license error, **ignore it** and continue with the paths above. Do not report FULL_PASS as blocked.

---

## One-time setup (human)

1. Restart Cursor after `.cursor/mcp.json` changes.
2. Authenticate remote Figma MCP: Cursor → Settings → MCP → `figma` → **Connect** → OAuth.
3. Optional desktop MCP: Figma Desktop → Dev Mode MCP Server → enable `figma-desktop` in Cursor.
4. Studio license: `.env.secret` → `SHADCN_STUDIO_LICENSE_KEY` · `pnpm env:sync`.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Code Connect license error | **Expected** — use registry/manifest paths; do not upgrade Figma for this |
| `/ftc` vs Figma MCP confusion | Unmodified blocks → `/ftc`; custom → Path 3 |
| Generated raw Tailwind in ERP | Re-run with primitive-only prompt; read contracts |
| Token drift Figma ↔ CSS | Diff against `tokens-complete.json` + manifests |
| Images 403 in dev | Enable desktop MCP; `apps/erp/next.config.ts` port 3845 patterns |

---

## Verification

- Agent used registry-first or `/ftc` before custom generation
- No `add_code_connect_map` / Code Connect dependency
- Imports from `@afenda/shadcn-studio` in ERP, not duplicated primitives
- CSS edits synced: `pnpm check:package-css-dist-sync`

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm check:studio-metadata-binding
pnpm --filter @afenda/erp build
```
