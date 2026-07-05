# Codex Goal Template

## Purpose

Use this template when asking Codex to change `apps/developer`. A good goal is a
shared execution contract, not just a task sentence.

This template is optimized for:

- fast execution
- low architecture drift
- governed scope boundaries
- explicit verification
- measurable completion

It is intentionally strict because `apps/developer` is a route lab, not a free
form sandbox.

## When to use this template

Use this template when the request should produce:

- code edits
- route-lab structure changes
- documentation tied to the route lab
- verification and hardening work
- governed frontend best-practice implementation

Do not use this template as a substitute for vague brainstorming. If the user
does not know the target state yet, define that first.

## Goal Quality Standard

A Codex goal is strong only when it defines:

1. the true end state
2. the allowed layer
3. prohibited drift
4. required deliverables
5. proof of completion

Shortest rule:

```text
A good Codex goal defines the target state, allowed boundary,
prohibited drift, required proof, and exact completion condition.
```

## Required Template

Copy this block and fill every section.

```md
## Objective
[One sentence describing the real end state.]

## Why
[Why this work matters now.]

## Allowed Scope
- [path or layer]
- [path or layer]

## Out of Scope
- [path or layer]
- [path or layer]

## Constraints
- [governance rule]
- [architecture rule]
- [things Codex must not introduce]

## Required Deliverables
- [code/doc/test/config artifact]
- [code/doc/test/config artifact]

## Verification
- [command]
- [command]
- [runtime or evidence check]

## Done Means
- [observable completion condition]
- [observable completion condition]
- [observable completion condition]
```

## Writing Rules

### Objective

State the real end state, not the first step.

Weak:

```text
improve the route lab
```

Strong:

```text
Harden the route-lab governance check so it fails on `use client` in page/layout boundaries,
loss of `(lab)` force-dynamic rendering, and `generateStaticParams` under lab routes.
```

### Allowed Scope

Name the exact files or layers Codex may touch.

Good:

```text
Allowed Scope:
- apps/developer/**
- docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md
```

### Out of Scope

Say what must not move, especially in a governed repo.

Good:

```text
Out of Scope:
- apps/erp/**
- app/api/**
- auth
- database
- placeholder activation
```

### Constraints

State architectural law, not generic preferences.

Good:

```text
Constraints:
- Do not introduce runtime authority.
- Do not add mock APIs.
- Do not move route-specific UI into generic cross-route component folders.
- Preserve route-lab doctrine and audit terminology.
```

### Required Deliverables

Make the output visible before work starts.

Good:

```text
Required Deliverables:
- one governance script update
- one audit update if status changes
- one verification summary
```

### Verification

Verification must match the scope of the request.

Good:

```text
Verification:
- .\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit
- .\node_modules\.bin\biome ci apps\developer
- node apps\developer\scripts\check-route-lab-governance.mjs
```

### Done Means

Completion must be observable.

Weak:

```text
Done means the app is better.
```

Strong:

```text
Done means the governance script fails when a lab page/layout uses `use client`,
fails when `(lab)/layout.tsx` stops exporting `dynamic = "force-dynamic"`,
and the audit reflects the stronger executable guard.
```

## Recommended Default Boundary for `apps/developer`

Use this default unless the task explicitly requires something else.

```md
## Allowed Scope
- apps/developer/**
- docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md

## Out of Scope
- apps/erp/**
- apps/developer/src/app/api/**
- auth
- tenant runtime
- database
- kernel imports
- mock backend infrastructure
```

## Recommended Default Verification for `apps/developer`

```md
## Verification
- .\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit
- .\node_modules\.bin\biome ci apps\developer
- node apps\developer\scripts\check-route-lab-governance.mjs
- route or runtime evidence only if the request changes rendered behavior
```

## Example Goal

```md
## Objective
Strengthen the route-lab governance check so executable guards match the route audit.

## Why
The route baseline is already hardened in implementation, but the highest ROI next step is
preventing regression automatically.

## Allowed Scope
- apps/developer/**
- docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md

## Out of Scope
- apps/erp/**
- apps/developer/src/app/api/**
- auth
- database
- placeholder activation

## Constraints
- Do not change runtime authority boundaries.
- Do not add new routes.
- Keep route-lab terminology aligned with the audit.

## Required Deliverables
- governance script update
- audit evidence update if the guard surface changes

## Verification
- .\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit
- .\node_modules\.bin\biome ci apps\developer
- node apps\developer\scripts\check-route-lab-governance.mjs

## Done Means
- the script fails on `use client` in any `page.tsx` or `layout.tsx`
- the script fails when `(lab)/layout.tsx` loses `dynamic = "force-dynamic"`
- the script fails when `generateStaticParams` appears under `app/(lab)/**`
```

## Acceptance Rule

This template is working correctly only when:

- Codex can identify the exact layer to change
- Codex can identify what must not be touched
- the requested output is visible before implementation starts
- completion can be proven from commands, files, or runtime evidence

## Related Docs

- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `apps/developer/src/app/(lab)/GOVERNANCE_GUARD_HARDENING.md`
