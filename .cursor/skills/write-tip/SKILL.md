---
name: write-tip
description: Author Afenda TIP delivery docs, ADRs, acceptance criteria, file-path boundary plans, and DoD tables in the project-canonical format. Use when drafting or updating a TIP, writing a new ADR, planning a feature's file paths, or creating enterprise acceptance criteria. Prevents documentation drift by enforcing ADR-0009 runtime-evidence-first rules and the ADR-0012 evidence-backed status vocabulary. Invoke with /write-tip or attach when you need to produce any architecture or delivery document.
disable-model-invocation: true
---

# write-tip — Afenda Delivery & Architecture Doc Authoring

> Read this skill before writing any TIP, ADR, feature requirement, or DoD table.
> Full templates are in [TEMPLATES.md](TEMPLATES.md). Authority chain is in `docs/adr/`.

---

## 0 · Authority order (never invert)

```
ADR-0000–0013
  → docs/architecture/*-registry.md
    → pre-accounting-foundation-roadmap.md
      → docs/delivery/tip-*.md   ← you are authoring here
        → _afenda-erp-master-plan.llms.md (compass only)
```

A delivery doc **never overrides** an ADR. When they conflict, update the doc, not the ADR.

---

## 1 · Document types and when to write each

| Document | When | Trigger command |
|----------|------|-----------------|
| **TIP delivery doc** (`docs/delivery/tip-NNN-*.md`) | Scoping or updating a TIP implementation | `/write-tip TIP-NNN` |
| **ADR** (`docs/adr/ADR-NNNN-*.md`) | Recording a binding architectural decision | `/write-tip ADR` |
| **Feature requirement** (section in delivery doc) | Defining scope, AC, DoD for a feature slice | part of TIP doc |
| **Runtime truth update** (`docs/architecture/afenda-runtime-truth-matrix.md`) | After an implementation lands | `/write-tip runtime` |

---

## 2 · TIP delivery doc — workflow

### Step 1 — Pre-flight (read before writing)

```
1. Read afenda-runtime-truth-matrix.md for current status of all dependencies
2. Read pre-accounting-foundation-roadmap.md — confirm the TIP is in the current phase
3. Read docs/architecture/package-registry.md — confirm package names
4. Read docs/architecture/ownership-registry.md — confirm which package owns the TIP
5. Check docs/delivery/ for an existing TIP doc; update don't recreate
```

### Step 2 — Gather required fields

Before drafting, answer all of these:

```
TIP ID            : TIP-NNN (from master plan; do not invent new IDs)
Title             : Short descriptive title
Current status    : one of the ADR-0012 vocabulary (see §4)
Foundation phase  : Phase 0–9 from pre-accounting-foundation-roadmap.md
Owning package(s) : from package-registry.md (PKG-NNN)
Depends on TIPs   : list of upstream TIPs that must be complete first
Blocks TIPs       : list of downstream TIPs that cannot start until this one finishes
Runtime evidence  : specific file paths that prove partial/complete status
Remaining gaps    : what is NOT yet done
```

### Step 3 — Draft using the canonical template

Full template → [TEMPLATES.md §A](TEMPLATES.md). The required sections are:

| Section | Required | Notes |
|---------|----------|-------|
| Metadata table | Yes | status, authority status, runtime evidence path, status source |
| Purpose | Yes | one paragraph; link to ADR that grants authority |
| Scope (In / Out) | Yes | explicit out-of-scope prevents drift |
| Runtime evidence table | Yes | file path → proven Y/N (ADR-0012) |
| Package ownership table | Yes | from package-registry.md |
| Depends on / Blocks | Yes | explicit dependency chain |
| Deliverables | Yes | concrete file paths — not vague "implement X" |
| Acceptance gate | Yes | bullet list; CI gate commands preferred |
| Acceptance criteria | Yes | Gherkin (see §5) |
| Verdict | Yes | single-sentence plain-English status |

### Step 4 — Status vocabulary (ADR-0012)

Only these values are allowed in the `Status` field:

| Value | Meaning |
|-------|---------|
| `Not started` | No runtime evidence exists |
| `Partially Implemented` | Evidence exists but gaps remain |
| `Complete (authority only)` | Contracts exist; no runtime implementation (by design) |
| `Complete` | Evidence + all acceptance gates pass |
| `Blocked` | Cannot proceed — list blocking TIP/ADR |

**Never write `Complete` without runtime evidence.** Authority-only completions must be labeled `Complete (authority only)`.

---

## 3 · File path planning — boundary rules

When a TIP requires new files, plan them using this boundary table before writing any code.

| Layer | Owning package | Allowed paths | Ask before crossing |
|-------|---------------|---------------|---------------------|
| Application | `apps/erp/src/` | Pages, routes, Server Components, layout | — |
| Shell composition | `packages/appshell/src/` | Shell UI, nav, context switcher | If TIP-004 consumed |
| Metadata UI | `packages/metadata-ui/src/` | Renderers, surfaces, layouts | If adding new contract |
| UI primitives | `packages/ui/src/components/` | Governed components only | **Always ask** |
| Design tokens | `packages/design-system/src/` | Token registry, recipes, CSS vars | **Always ask** |
| Kernel contracts | `packages/kernel/src/context/` | Operating context modules | Architecture approval |
| Database | `packages/database/src/schema/` | Drizzle schemas + migrations | ADR required for new domain |
| Permissions | `packages/permissions/src/` | RBAC registry, policy, scope | Architecture approval |
| Auth | `packages/auth/src/` | Auth provider adapters | Security review |
| Observability | `packages/observability/src/` | Logging, audit, correlation | — |
| Execution / Jobs | `packages/execution/src/` | Trigger.dev jobs, outbox | — |
| Entitlements | `packages/entitlements/src/` | Feature manifest, capabilities | — |
| Architecture docs | `docs/architecture/` | Registry markdown files | Architecture Authority |
| Delivery docs | `docs/delivery/` | TIP docs (this skill) | — |
| ADRs | `docs/adr/` | ADR-NNNN-*.md files | Architecture Authority |

**Hard boundary rules:**

- New domain packages (`@afenda/accounting`, etc.) require an ADR before filesystem creation.
- Contracts crossing package boundaries must be serializable (no class instances, functions, React nodes).
- Reserved packages (PKG-R01–R05) are blocked until Phase 9 gate.
- Do not create `docs/tip/` or `docs/roadmap/` — those directories do not exist.

### File path plan template

Include this table in every TIP delivery doc under **Deliverables**:

```markdown
| File | Package | Layer | New / Modified | Boundary approval |
|------|---------|-------|----------------|-------------------|
| `packages/appshell/src/contracts/navigation.contract.ts` | `@afenda/appshell` | Shell | New | Architecture (TIP-006) |
| `apps/erp/src/app/(protected)/layout.tsx` | `apps/erp` | Application | Modified | — |
```

---

## 4 · Acceptance criteria — Gherkin format

All acceptance criteria must be written in Gherkin. This locks down testable behavior before implementation.

### Pattern

```gherkin
GIVEN <the system/user state before the action>
AND   <additional precondition>
WHEN  <the action taken>
THEN  <the observable outcome>
AND   <additional outcomes>
```

### Required GIVEN clauses for Afenda enterprise features

Include these preconditions where applicable:

| Concern | GIVEN clause |
|---------|-------------|
| Tenant isolation | `GIVEN the user is signed in under Tenant A` |
| Company scope | `GIVEN the user operates within Company A (legal entity)` |
| RBAC | `GIVEN the user has permission <domain>.<action>` |
| Org unit scope | `GIVEN the organization unit is <OrgUnit>` |
| Approval state | `GIVEN no pending approval exists for this action` |
| Audit requirement | `THEN an audit event records actor, company, action, target, correlation ID` |
| Cross-company isolation | `THEN Company B data is not accessible or returned` |

### Example — AppShell nav contract

```gherkin
GIVEN a developer registers a new nav item in the manifest
WHEN the AppShell nav renders
THEN only nav items the user has RBAC permission for are visible
AND no ad-hoc string literals for nav IDs exist outside governed unions
AND an audit event records the context switch actor and target company
```

---

## 5 · Definition of Done (DoD) table

Every TIP delivery doc needs an explicit DoD. Use this template:

```markdown
## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Runtime evidence exists at stated file paths | File exists in repo | [ ] |
| 2 | Acceptance criteria pass as tests | `pnpm test:run --filter <pkg>` | [ ] |
| 3 | No unauthorized package boundary crossing | `pnpm quality:boundaries` | [ ] |
| 4 | No `className` on `@afenda/ui` primitives (if UI change) | `pnpm ui:guard:scan` | [ ] |
| 5 | TypeScript strict — no `any` | `pnpm --filter <pkg> typecheck` | [ ] |
| 6 | Biome lint + format clean | `pnpm ci:biome` | [ ] |
| 7 | Runtime truth matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 8 | Delivery doc status matches codebase | `pnpm check:documentation-drift` | [ ] |
| 9 | No accounting logic introduced (pre-Phase 9) | ADR-0010 compliance | [ ] |
| 10 | Completion Report posted (afenda-coding-session §11) | In PR / chat | [ ] |
```

Adjust rows to the TIP scope. Remove irrelevant rows; add domain-specific ones (e.g., RLS proof for Phase 4 TIPs).

---

## 6 · ADR authoring — quick guide

Full template → [TEMPLATES.md §B](TEMPLATES.md).

ADRs are binding. Write one when:

- A technology is chosen over an alternative (irreversible or hard to reverse)
- A boundary is established between packages
- A cross-cutting constraint is enforced (e.g., ADR-0010 accounting gate)
- A previous ADR needs superseding

**ADR status vocabulary:** `Proposed` → `Accepted` → `Deprecated` / `Superseded`

**Numbering:** Check current highest ADR-NNNN in `docs/adr/` and increment by 1.

**Acceptance Gate section** is mandatory — it must contain a CI command or registry state that proves the ADR is satisfied.

---

## 7 · Runtime truth update — when to do it

After any implementation that changes TIP status, update the runtime matrix row:

```markdown
| **<Area>** | `packages/<pkg>/src/` | **implemented** | <specific file proofs> | — | Maintain |
```

Rules (ADR-0009, ADR-0012):

- Status changes require file-path evidence, not delivery doc claims alone
- `pnpm check:documentation-drift` must pass after update
- Update matrix and delivery doc in the **same PR** as the implementation

---

## 8 · Consistency rules for subagents

These rules apply to every doc this skill produces:

1. **Preserve canonical IDs** — `TIP-###`, `ADR-####`, `DEC-###`, `PKG-###` must be verbatim.
2. **No invented directories** — only write to `docs/adr/`, `docs/delivery/`, `docs/architecture/`, `docs/governance/`.
3. **Status vocabulary is closed** — only use the six values from §2 Step 4.
4. **Evidence before status** — never mark `Complete` without listing file paths.
5. **Out-of-scope is required** — every TIP doc must have an explicit out-of-scope list.
6. **Acceptance criteria are testable** — every GIVEN/WHEN/THEN must be implementable as a Vitest or integration test.
7. **DoD links to gates** — every DoD row must reference a `pnpm` command or file path.
8. **Authority chain** — every TIP doc must cite the ADR that grants its authority.

---

## Extended reference

- Full TIP + ADR templates → [TEMPLATES.md](TEMPLATES.md)
- Coding session contract (Phase 0 + gates) → `.cursor/skills/afenda-coding-session/SKILL.md`
- Package authority matrix → `.cursor/skills/afenda-coding-session/SKILL.md` §0.2
- Pre-accounting delivery sequence → `docs/architecture/pre-accounting-foundation-roadmap.md`
- Runtime truth matrix → `docs/architecture/afenda-runtime-truth-matrix.md`
- Status vocabulary authority → `docs/adr/ADR-0012-documentation-evidence-backed.md`
- Delivery authority → `docs/adr/ADR-0013-tip-roadmap-delivery-authority.md`
