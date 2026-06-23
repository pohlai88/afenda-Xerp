# write-tip — Canonical Templates

> Copy a template; fill every placeholder. Do not leave `<!-- ... -->` stubs in committed docs.

---

## §A — TIP Delivery Doc Template

File path: `docs/delivery/tip-NNN-short-title.md`

```markdown
# TIP-NNN — <Title>

| Field | Value |
| --- | --- |
| **Status** | Not started \| Partially Implemented \| Complete (authority only) \| Complete \| Blocked |
| **Authority status** | <e.g. "Documented — contracts not frozen" or "Contracts frozen"> |
| **Runtime evidence** | <comma-separated file paths that prove current status, or "—" if Not started> |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase N — <name from pre-accounting-foundation-roadmap.md> |
| **Remaining gap** | <one sentence; "—" if Complete> |

## Purpose

<One paragraph. Why this TIP exists. Link to the ADR that grants authority.>

ADR-NNNN authority: <quote the binding rule from the ADR>.

## Scope

**In scope**

- <Deliverable 1>
- <Deliverable 2>

**Out of scope**

- <Explicitly excluded concern 1 — name the TIP that owns it if applicable>
- <Explicitly excluded concern 2>

## Runtime evidence (<YYYY-MM-DD>)

| Artifact | Path | Proven |
| --- | --- | --- |
| <Description> | `<path/to/file.ts>` | Yes \| No \| Partial |
| <Description> | `<path/to/file.ts>` | Yes \| No \| Partial |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/<pkg>` (PKG-NNN) | <role description> |

## Depends on

- TIP-NNN <Title> — <why this must be complete first>

## Blocks

- TIP-NNN <Title> — <why this TIP must complete before that one starts>

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
|------|---------|-------|----------------|-------------------|
| `packages/<pkg>/src/<path>.ts` | `@afenda/<pkg>` | <layer> | New | <ADR/TIP or "—"> |

## Acceptance gate

- <Gate 1: specific pass condition — prefer pnpm command>
- <Gate 2>
- <Gate 3>

## Acceptance criteria

```gherkin
GIVEN <precondition>
AND   <additional precondition>
WHEN  <action>
THEN  <observable outcome>
AND   <additional outcome — always include audit event for mutations>
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Runtime evidence exists at stated file paths | File exists in repo | [ ] |
| 2 | Acceptance criteria pass as tests | `pnpm test:run --filter <pkg>` | [ ] |
| 3 | No unauthorized package boundary crossing | `pnpm quality:boundaries` | [ ] |
| 4 | TypeScript strict — no `any` | `pnpm --filter <pkg> typecheck` | [ ] |
| 5 | Biome lint + format clean | `pnpm ci:biome` | [ ] |
| 6 | Runtime truth matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 7 | Delivery doc status matches codebase | `pnpm check:documentation-drift` | [ ] |
| 8 | Completion report posted | afenda-coding-session §11 | [ ] |

## Verdict

**<Status>** — <one sentence plain-English summary of what is done, what remains, and what is explicitly blocked>.
```

---

## §B — ADR Template

File path: `docs/adr/ADR-NNNN-short-title.md`

```markdown
# ADR-NNNN — <Title>

| Field | Value |
|-------|-------|
| **Status** | Proposed \| Accepted \| Deprecated \| Superseded |
| **Date** | YYYY-MM-DD |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

<What problem or risk does this ADR address? Link to registries, TIPs, or incidents.>

---

## Decision

<What we will do. Be specific and testable. No implementation details — only the binding rule.>

---

## Consequences

### Positive

- <Benefit 1>

### Negative / trade-offs

- <Cost or constraint 1>

---

## Acceptance Gate

<How do we know this ADR is satisfied? CI gate command, registry state, or review checklist.>

```bash
pnpm <gate-command>
```

---

## References

- Registry: `docs/architecture/<relevant-registry>.md`
- Related ADRs: ADR-NNNN
- Related TIPs: TIP-NNN
```

---

## §C — Feature Requirement Slice (inline in TIP doc)

Use inside a TIP doc's **Scope** or a separate `## Feature: <Name>` section when a TIP contains multiple distinct feature slices.

```markdown
## Feature: <Name>

**Owner:** TIP-NNN / `@afenda/<pkg>`  
**Phase:** Foundation Phase N  
**Priority:** P0 / P1 / P2  

### Requirements

| ID | Requirement | Authority |
|----|-------------|-----------|
| REQ-NNN-01 | <One sentence, testable requirement> | ADR-NNNN |
| REQ-NNN-02 | <One sentence, testable requirement> | ADR-NNNN |

### File path plan

| File | Package | Layer | New / Modified | Note |
|------|---------|-------|----------------|------|
| `packages/<pkg>/src/<path>.ts` | `@afenda/<pkg>` | Platform | New | Contract; must be serializable |

### Acceptance criteria

```gherkin
GIVEN <precondition>
WHEN  <action>
THEN  <outcome>
AND   an audit event records actor, action, target, correlation ID
```

### DoD

| Criterion | Gate | Done |
|-----------|------|------|
| Contract exported from package | `pnpm --filter <pkg> typecheck` | [ ] |
| Test covers happy + error path | `pnpm test:run --filter <pkg>` | [ ] |
| No boundary violations | `pnpm quality:boundaries` | [ ] |
| Runtime matrix updated | File edit + `pnpm check:documentation-drift` | [ ] |
```

---

## §D — Runtime Truth Matrix Row (update template)

When adding or updating a row in `docs/architecture/afenda-runtime-truth-matrix.md`:

```markdown
| **<Area>** | `<packages/pkg/src/>` | **<status-vocabulary>** | <evidence: file1, file2, script> | <specific gap> | <required action> |
```

Status vocabulary (closed set from ADR-0012):

- `implemented`
- `partially-implemented`
- `documented-only`
- `runtime-only`
- `drifted`
- `obsolete`
- `blocked`

Evidence must be a file path, test file, export name, script name, or schema table name — not a delivery doc claim.

---

## §E — Gherkin Precondition Library

Copy-paste these standard GIVEN clauses into acceptance criteria:

```gherkin
# Tenant isolation
GIVEN the user is signed in under Tenant A
AND   Tenant B has a separate account with overlapping data

# Company / legal entity scope
GIVEN the user operates within Company A (legal entity)
AND   the user has no role in Company B

# RBAC
GIVEN the user has permission <domain>.<resource>.<action>
AND   no pending approval exists for this action

# Organization unit scope
GIVEN the operating context is OrgUnit X inside Company A

# Accounting gate (pre-Phase 9)
GIVEN Phase 9 Accounting Readiness Gate has NOT passed
WHEN  a developer attempts to create @afenda/accounting
THEN  the attempt is blocked by ADR-0010

# Audit requirement (required for all mutations)
THEN an audit event records actor, company, action, target, correlation ID

# Cross-company isolation (required for multi-company TIPs)
THEN no Company B data is accessible or returned to the Company A user

# Nav / manifest
GIVEN the feature manifest includes module <ModuleName>
AND   the user has RBAC permission for <ModuleName>
WHEN  the AppShell nav renders
THEN  <ModuleName> appears in the nav

# Permission denial
GIVEN the user does NOT have permission <domain>.<action>
WHEN  the user attempts <action>
THEN  the API returns 403 Forbidden
AND   an audit event records the denial with actor and correlation ID
```

---

## §F — Consistency checklist (run before committing any doc)

```
[ ] TIP ID matches master plan table (TIP-NNN; not invented)
[ ] Status is one of the six ADR-0012 vocabulary values
[ ] "Complete" has runtime evidence file paths (not claims only)
[ ] Out-of-scope list exists with at least one entry
[ ] Acceptance criteria are in Gherkin format
[ ] Every DoD criterion links to a pnpm gate or file path
[ ] Deliverables table has concrete file paths (not vague descriptions)
[ ] ADR cited as authority for the TIP
[ ] Package names match docs/architecture/package-registry.md
[ ] pnpm check:documentation-drift passes after update
[ ] No invented directory paths (docs/tip/, docs/roadmap/, etc.)
[ ] Verdict is one sentence, plain English
```
