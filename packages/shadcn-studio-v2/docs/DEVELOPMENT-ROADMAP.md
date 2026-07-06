# Afenda Enterprise Design System — Greenfield Development Roadmap

## Position

We are not repairing an old system.

We are building a clean enterprise design system from scratch.

Codex shall not investigate historical failures, compare old folders, or explain past mistakes. Codex shall only execute the current architecture and return proof.

---

# 0. Non-Negotiable Architecture

## Tech Stack

```txt
React
TypeScript
shadcn/ui component model
Tailwind CSS v4
canonical shadcn CSS variables
Geist typography
Vitest
Biome
Storybook or route proof
```

## Package

```txt
packages/shadcn-studio-v2
```

## Source Shape

```txt
src/
  components/
    ui/
    layout/
    shared/
    assets/
    quarantine/

  views/
    auth/
    pages/
    widgets/
    datatables/
    forms/
    dialogs/
    settings/

  configs/
  contexts/
  hooks/
  metadata/
  styles/
  types/
  utils/
  lib/

  index.ts
  clients.ts
  server.ts
  metadata.ts
```

## Style Files

```txt
src/styles/shadcn-default.css
src/styles/swiss-noir.css
src/styles/verdant-noir.css
```

## Public Entry Points

```txt
@afenda/shadcn-studio-v2
@afenda/shadcn-studio-v2/clients
@afenda/shadcn-studio-v2/server
@afenda/shadcn-studio-v2/metadata
@afenda/shadcn-studio-v2/theme
@afenda/shadcn-studio-v2/shadcn-default.css
@afenda/shadcn-studio-v2/themes/swiss-noir.css
@afenda/shadcn-studio-v2/themes/verdant-noir.css
```

---

# 1. Codex Operating Rule

Codex must follow this rule:

```txt
Do not diagnose the past.
Do not search for old intent.
Do not compare against old package structure.
Do not create explanation documents.
Build the target architecture and prove it.
```

Codex output must always contain:

```txt
changed files
created files
commands run
command result
remaining gaps
DoD status
```

---

# 2. Phase A — Create Clean Package skeleton

## Codex command

```txt
Create the clean package skeleton for packages/shadcn-studio-v2 using the approved Afenda enterprise design-system architecture.

Do not inspect or compare against old implementation patterns.

Create only the approved src structure:

src/components/ui
src/components/layout
src/components/shared
src/components/assets
src/components/quarantine
src/views/auth
src/views/pages
src/views/widgets
src/views/datatables
src/views/forms
src/views/dialogs
src/views/settings
src/configs
src/contexts
src/hooks
src/metadata/builders
src/metadata/contracts
src/metadata/gates
src/metadata/registries
src/styles
src/types
src/utils
src/lib

Create root files:

src/index.ts
src/clients.ts
src/server.ts
src/metadata.ts

Add package-level tests that reject unapproved src top-level folders and reject unapproved public entrypoint drift.

Return changed files and proof commands only.
```

## DoD

```txt
src tree exists
no unapproved top-level folder exists
root public entry files exist
taxonomy test exists
package test passes
typecheck passes
build passes
Biome passes
```

---

# 3. Phase B — Establish Token And CSS Authority

## Codex command

```txt
Implement the Afenda shadcn/Tailwind v4 CSS authority.

Create:

src/styles/shadcn-default.css
src/styles/swiss-noir.css
src/styles/verdant-noir.css

Rules:

Use canonical shadcn CSS variable names only.
Do not create --brand-* tokens.
Do not create --afenda-* tokens.
Do not create --surface-* tokens.
Do not create --luxury-* tokens.
Do not create near-canonical tokens such as --primary-2 or --background-alt.
Noir theme files must use static :root and .dark selectors and be imported one at a time.
Named themes must override only tokens declared by shadcn-default.css.
No component selectors in theme files.
No layout selectors in theme files.
No app-specific selectors in theme files.

Add drift tests for forbidden token families and raw hex usage inside reusable TSX files.

Return changed files and proof commands only.
```

## DoD

```txt
base CSS exists
two named themes exist
theme files are static root/dark override sheets
only canonical tokens are used
no forbidden token family exists
no raw hex appears inside reusable components or views
CSS exports are available from package boundary
drift test passes
```

---

# 4. Phase C — Build Primitive Layer

## Codex command

```txt
Build the primitive UI layer in src/components/ui.

Implement:

button.tsx
badge.tsx
card.tsx
alert.tsx
field.tsx
table.tsx

Rules:

Use TypeScript.
Use semantic variant props.
Avoid boolean customization props except narrow semantic exceptions.
Use children and named parts.
Do not use render props.
Do not own runtime state inside primitives unless absolutely necessary.
Use canonical shadcn tokens only.
Use data-slot attributes where useful for structure.
Preserve accessibility states.
Do not import from app routes.
Do not import from reference folders.
Do not hardcode colors.

Add primitive API consistency tests.

Return changed files and proof commands only.
```

## DoD

```txt
button implemented
badge implemented
card implemented
alert implemented
field implemented
table implemented
typed props exported
semantic variants exist
focus-visible state exists
disabled state exists where applicable
loading state exists where applicable
no render-prop primitive API
no forbidden boolean customization props
primitive API tests pass
```

---

# 5. Phase D — Build Runtime Boundary

## Codex command

```txt
Build the design-system runtime boundary.

Implement:

src/contexts/theme-provider.tsx
src/contexts/studio-provider.tsx
src/hooks/use-theme.ts
src/hooks/use-studio.ts
src/components/shared/theme-toggle.tsx
src/components/shared/theme-script.tsx
src/configs/theme-config.ts
src/configs/studio-config.ts
src/types/theme.ts
src/types/studio.ts

Rules:

Theme runtime must support shadcn-default, swiss-noir, and verdant-noir.
Runtime code must be client-safe only where exported from clients or theme entrypoint.
Server entry must not export client runtime.
Neutral entry must not accidentally export server-only logic.
No app-specific storage rule unless explicitly configured.
No decorative theme sprawl.

Add tests for client/server export separation.

Return changed files and proof commands only.
```

## DoD

```txt
theme-provider exists
studio-provider exists
theme-toggle exists
theme-script exists
use-theme exists
use-studio exists
theme config exists
studio config exists
client/server boundary tests pass
no server-only logic in client export
no client-only runtime in server export
```

---

# 6. Phase E — Build Layout Chrome

## Codex command

```txt
Build the enterprise layout chrome.

Implement:

src/components/layout/AppShell.tsx
src/components/layout/sidebar.tsx
src/components/layout/topbar.tsx

Rules:

Use primitives from src/components/ui.
Use semantic HTML.
Navigation must expose accessible labels.
Active navigation state must support aria-current.
topbar must support product title, actions, and optional user/control slot.
sidebar must support groups and items.
No business logic.
No app router dependency.
No hardcoded route assumptions.
No hardcoded color values.

Return changed files and proof commands only.
```

## DoD

```txt
AppShell exists
sidebar exists
topbar exists
navigation groups supported
active state supported
aria-current supported
keyboard reachable navigation
responsive structure works
no route-framework dependency
layout tests pass
```

---

# 7. Phase F — Build View Layer

## Codex command

```txt
Build the first enterprise view layer.

Implement:

src/views/pages/page-surface.tsx
src/views/auth/auth-shell.tsx
src/views/widgets/widget-metric.tsx
src/views/widgets/widget-evidence.tsx
src/views/datatables/data-table-surface.tsx
src/views/forms/form-surface.tsx
src/views/dialogs/confirm-dialog-surface.tsx
src/views/settings/settings-surface.tsx

Rules:

Views compose primitives and layout only.
Views do not own ERP business logic.
Views do not call databases.
Views do not call auth services.
Views do not import app routes.
Views expose typed props.
Views include empty, loading, error, and unavailable states where applicable.
Views remain token-safe.
Views remain accessible.

Return changed files and proof commands only.
```

## DoD

```txt
page-surface exists
auth-shell exists
MetricWidget exists
EvidenceWidget exists
data-table-surface exists
form-surface exists
confirm-dialog-surface exists
settings-surface exists
typed props exist
state coverage exists
a11y labels exist
views do not contain business logic
view tests pass
```

---

# 8. Phase G — Public Export Contract

## Codex command

```txt
Create the public export contract for the greenfield design system.

Configure:

src/index.ts
src/clients.ts
src/server.ts
src/metadata.ts
theme export if package supports it
CSS package exports

Rules:

Consumers must never import from src.
Consumers must never import internal component folders.
Consumers must use package entrypoints only.
CSS must be imported from package-exported CSS paths.
Metadata exports must stay metadata-only.
Server exports must stay server-safe.
Client exports must stay client-safe.

Add tests that reject forbidden deep imports and accidental export drift.

Return changed files and proof commands only.
```

## DoD

```txt
neutral export works
client export works
server export works
metadata export works
CSS export works
forbidden deep import test exists
export drift test exists
package build proves exports
```

---

# 9. Phase H — Verification App / Proof Route

## Codex command

```txt
Create a greenfield proof route that consumes the design system only through public package exports.

Use one real consumer app route.

The route must render:

AppShell
sidebar
topbar
page-surface
MetricWidget
EvidenceWidget
data-table-surface
form-surface
confirm-dialog-surface
settings-surface
theme-toggle

Rules:

Import components only from public package entrypoints.
Import CSS only from package CSS exports.
Do not use internal src paths.
Do not create business logic.
Use static fixture data only.
Prove light, dark, swiss-noir, and verdant-noir support.

Return changed files and proof commands only.
```

## DoD

```txt
consumer route renders
public imports only
CSS package import only
all required surfaces visible
theme switching works
no internal import exists
consumer typecheck passes
consumer build passes
route smoke test passes
```

---

# 10. Phase I — Enterprise Acceptance Gate

## Codex command

```txt
Run the full enterprise acceptance gate for the greenfield Afenda design system.

Run:

pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2

Then run the selected consumer app typecheck, build, and smoke test.

Return only:

commands run
pass/fail result
failed files if any
DoD checklist
whether enterprise acceptance is granted or rejected
```

## DoD

```txt
package test passes
package typecheck passes
package build passes
drift guard passes
Biome passes
consumer typecheck passes
consumer build passes
consumer smoke test passes
no forbidden imports
no forbidden tokens
no raw hex in reusable TSX
public exports stable
theme support proven
accessibility states present
rollback unnecessary because this is greenfield proof
```

## Status

**ACCEPTANCE GRANTED** — 2026-07-06. See `docs/slices/PHASE-9-ENTERPRISE-ACCEPTANCE-GATE.md`.

---

# Post-acceptance priority (Lane A vs Lane B)

Phase 9 proves the greenfield package can be consumed. **Lane A is complete** (A-11
**PROCEED**, 2026-07-06). **Lane B is active** — B-01–B-14 **Complete**; B-15 formal
deprecation sign-off remains.

| Lane | Scope | Status |
| --- | --- | --- |
| **A — V2 internal** | Package taxonomy, primitives, metadata, widgets, drift gates, developer proof route | **Complete** (A-11 PROCEED) |
| **B — V1 / ERP migration** | Consumer cutover, ERP surfaces, Storybook, v1 formal deprecation | **B-01–B-14 Complete** — B-15 sign-off pending |

Lane B program index: `docs/slices/LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md`.

Lane A examples (historical — complete):

- manifest registry + widget adapter follow-ons (package-only)
- kebab stem law + `normalize:kebab-stems` enforcement
- proof-route and test coverage for new surfaces
- Storybook or route proof for additional primitives

Lane B examples (complete through B-14):

- B-01 consumer v1 import inventory + CI ratchet (zero imports)
- B-02 ADR drag library + ERP `WorkspaceBoardWidgetFrame` ownership
- B-03–B-08 ERP CSS, shell, surface waves (system admin, metadata, procurement)
- B-09 workflow board runtime; B-10 manifest kind promotion (A-09 HOLD lifted)
- B-04/B-12 developer lab cutover and v1 dependency removal
- B-11 Storybook v2 alignment; B-13 v1 import freeze
- B-14 doc/runtime synchronization (`lane-b-synchronization.test.ts`)
- B-15 formal deprecation sign-off — **next**

Authority: `docs/MIGRATION-MAP.md` execution priority section ·
`docs/slices/LANE-A-INTERNAL-STABILIZATION-INDEX.md` ·
`docs/slices/LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md`.

---

# Final Acceptance Standard

The design system is accepted only when this statement is true:

```txt
Afenda shadcn-studio-v2 can be installed, imported, themed, rendered, tested, and consumed through public entrypoints without internal imports, forbidden tokens, app-specific logic, or undocumented runtime assumptions.
```

**Verified 2026-07-06** — Phase 9 acceptance granted; consumer proof at
`/design-system/v2-proof`; ledger in `docs/MIGRATION-MAP.md`.

Anything else is rejected.
