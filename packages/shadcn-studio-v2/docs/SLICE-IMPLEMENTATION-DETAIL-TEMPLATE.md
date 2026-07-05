# Slice Implementation Detail Template

## 1) Slice identity

- Slice ID: `Slice X`  
- Slice name: `Short descriptive name`  
- Tracking owner: `Team / person`  
- Slice start date: `YYYY-MM-DD`  
- Planned completion date: `YYYY-MM-DD`  
- Actual completion date: `YYYY-MM-DD`  
- Current status: `not-started | in-progress | blocked | verified | retired`

## 2) Strategic objective

### Why this slice exists
Briefly state the purpose tied to migration sequencing and governance.

### Slice-level acceptance criteria
- Criterion 1
- Criterion 2
- Criterion 3

## 3) Scope boundaries

### In scope
- Item 1
- Item 2

### Out of scope
- Item 1
- Item 2

### Anti-goals
- Explicitly call out what this slice does not do.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice N`  
- Dependencies on external teams, packages, or tasks:  
  - `item / owner`  
  - `item / owner`
- Required gates before merge:
  - `Gate A` (taxonomy)
  - `Gate B` (naming)
  - etc.

## 5) Implementation plan (do not begin without this)

### Architecture/structure changes
- File/folder changes (intent + reason):
  - `path` → `reason`
  - `path` → `reason`

### Export and boundary work
- Root/public boundaries to touch:
  - `index.ts` / `clients.ts` / `server.ts` / `metadata.ts`
- Explicit non-leak rules for this slice:
  - rule 1

### Behavioral changes
- User story / behavior expectation:
  - `...`
- Validation hooks, integration points, and assumptions:
  - `...`

## 6) Test and verification commands

- `command 1`
- `command 2`
- `command 3`

For each command, capture outputs:

| Command | Result | Evidence path |
| --- | --- | --- |
| | | |

## 7) Evidence log

Use concrete links or logs, not prose.

- Design / discovery notes: `path-or-link`
- Test output: `path-or-link`
- Code review notes: `path-or-link`
- Gate run output: `path-or-link`

## 8) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| | | | | |

## 9) Open questions / assumptions

- Assumption:
  - ...
- Decision needed:
  - ...

## 10) Exit checklist

- [ ] All in-scope files implemented.
- [ ] Required gates passed.
- [ ] No taxonomy/export/name violations.
- [ ] Evidence links attached.
- [ ] Tracking table updated.
- [ ] Handoff report prepared for slice completion.

## 11) Handoff summary

- Completion recommendation: `go / no-go`  
- If `no-go`, list blocker and required follow-up.
- Next slice dependency to start: `Slice Y`

