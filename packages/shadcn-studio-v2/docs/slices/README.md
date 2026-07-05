# shadcn-studio-v2 Slice Index

## Mode

- Primary mode: `spec`
- Audience: engineers and maintainers working inside `@afenda/shadcn-studio-v2`
- Source of truth: `../DESIGN-SYSTEM-ARCHITECTURE.md`, `../DEVELOPMENT-ROADMAP.md`, `../TAXONOMY.md`
- Lifecycle state: `draft`
- Action enabled: execute small, proof-driven implementation slices without expanding narrative documentation

## Purpose

This directory holds execution-facing slice specifications for `@afenda/shadcn-studio-v2`.

This is a greenfield execution sequence.

The slice set is intentionally narrow. It exists to turn the current
architecture and roadmap into bounded implementation work that can be verified
through code, tests, exports, and one real consumer route.

## Quality bar

Every slice in this directory must satisfy the same review threshold before it
can be marked complete.

### Required qualities

- architecture-aligned
- taxonomy-safe
- token-safe
- accessible
- export-safe
- consumer-provable
- revert-path-aware when consumer adoption is involved

### Minimum proof contract

Unless a slice explicitly states a narrower pre-flight scope, it must identify:

- files expected to change
- commands required to prove completion
- pass/fail meaning
- remaining gaps that block the next slice

### Codex output contract

Every slice must end with the same required return format:

1. Files changed
2. Files created
3. Commands run
4. Pass/fail result
5. Remaining gaps
6. DoD checklist
7. Explicit decision: `proceed` / `hold` / `reject`

### Hard stop rule

Do not treat any slice as complete when it only has:

- a rendered screenshot
- package-local implementation without tests
- tests without public export proof
- public export proof without consumer proof
- consumer proof without synchronized docs and gates
- unresolved design questions in place of execution decisions

## Active slice order

0. [Slice 0 - Active Authority Lock](PRE-FLIGHT-0-DOCUMENTATION-BASELINE-LOCK.md)
1. [Slice 1 - Executable Gate Alignment](PRE-FLIGHT-1-EXECUTABLE-GATE-ALIGNMENT.md)
2. [Slice 2 - Clean Package Skeleton](PHASE-1-CLEAN-PACKAGE-SKELETON.md)
3. [Slice 3 - Token And CSS Authority](PHASE-2-TOKEN-AND-CSS-AUTHORITY.md)
4. [Slice 4 - Primitive Layer](PHASE-3-PRIMITIVE-LAYER.md)
5. [Slice 5 - Runtime Boundary](PHASE-4-RUNTIME-BOUNDARY.md)
6. [Slice 6 - Layout Chrome](PHASE-5-LAYOUT-CHROME.md)
7. [Slice 7A - Page And Widget Views](PHASE-7A-PAGE-AND-WIDGET-VIEWS.md)
8. [Slice 7B - Workflow Views](PHASE-7B-WORKFLOW-VIEWS.md)
9. [Slice 7C - Auth Presentation](PHASE-7C-AUTH-PRESENTATION.md)
10. [Slice 8 - Public Export Contract](PHASE-7-PUBLIC-EXPORT-CONTRACT.md)
11. [Slice 9 - Verification App And Proof Route](PHASE-8-VERIFICATION-APP-AND-PROOF-ROUTE.md)
12. [Slice 10 - Enterprise Acceptance Gate](PHASE-9-ENTERPRISE-ACCEPTANCE-GATE.md)
13. [Slice 11 - Closing Synchronization Gate](CLOSING-SYNCHRONIZATION-GATE.md)

## Scope boundary

These slice docs are internal technical specs.

They do:

- define bounded implementation scope
- define constraints and acceptance gates
- define bounded execution and proof expectations where relevant
- require every slice to return proof
- keep each slice scoped to its own phase

They do not:

- restate broad design doctrine
- create a second architecture document
- publish end-user or external developer documentation
- justify documentation expansion that does not protect executable work

## Maintenance rule

Refresh a slice when one of these changes materially:

- source-of-truth architecture rules
- required commands or gates
- exit criteria
- revert-path or consumer-adoption assumptions

If a slice becomes obsolete after implementation and verification, delete or
archive it rather than letting it drift.
