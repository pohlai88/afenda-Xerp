---
name: write-tip
description: Authors Afenda TIP delivery docs, ADRs, acceptance criteria, file-path boundary plans, and DoD tables in the project-canonical format. Use when drafting or updating a TIP, writing a new ADR, planning a feature's file paths, or creating enterprise acceptance criteria. Prevents documentation drift by enforcing ADR-0009 runtime-evidence-first rules and the ADR-0012 evidence-backed status vocabulary. Invoke with /write-tip or attach when you need to produce any architecture or delivery document.
disable-model-invocation: true
---

# write-tip — Afenda Delivery & Architecture Doc Authoring

> **Archive only (2026-06-25):** Do **not** author new TIP delivery docs for foundation or package work. Use [`write-fdr`](../write-fdr/SKILL.md) + [FDR workflow](../../../docs/architecture/foundation-delivery-authority.md) + `foundation-disposition.registry.ts`. This skill remains valid for **repairing archive TIPs**, **ADRs** (or use write-fdr), runtime matrix updates, and historical delivery evidence.
>
> Read this skill before writing any ADR, feature requirement, or DoD table tied to FDR entries.
> Full templates are in [TEMPLATES.md](TEMPLATES.md). Authority chain is in `docs/adr/`.

---

## 0 · Authority order (never invert)

```
ADR-0000–0013
  → docs/architecture/*-registry.md
    → pre-accounting-foundation-roadmap.md
      → docs/PAS/slice/[status] tip-*.md   ← you are authoring here
        → _afenda-erp-master-plan.llms.md (compass only)
```

A delivery doc **never overrides** an ADR. When they conflict, update the doc, not the ADR.

---

## 1 · Document types and when to write each

| Document | When | Trigger command |
|----------|------|-----------------|
| **TIP delivery doc** (`docs/PAS/slice/[status] tip-NNN-*.md`) | Scoping or updating a TIP implementation | `/write-tip TIP-NNN` |
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
TIP ID            : TIP-NNN — MUST exist in tip-status-index.md or pre-accounting-foundation-roadmap.md
                    If it does not exist, STOP — request Architecture Authority decision.
                    Do not create or assign a TIP number yourself.
Title             : Short descriptive title
Current status    : one of the TIP delivery statuses (see §2 Step 4) — not runtime matrix vocabulary
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

Two separate vocabularies exist. **Never mix them.**

#### TIP delivery doc status (human-readable; use in the TIP `Status` field)

| Value | Meaning |
|-------|---------|
| `Not started` | No runtime evidence exists |
| `Partially Implemented` | Evidence exists but gaps remain |
| `Complete (authority only)` | Contracts/governance exist; no runtime implementation (by design — see §2.5) |
| `Complete` | Evidence + all acceptance gates pass |
| `Blocked` | Cannot proceed — list the blocking TIP/ADR inline |
| `Superseded` | Replaced by another TIP — add a superseded-by banner |
| `Obsolete` | No longer relevant — add an obsolete banner |

#### Runtime truth matrix status (machine vocabulary; use only in `afenda-runtime-truth-matrix.md`)

| Value | Meaning |
|-------|---------|
| `implemented` | Evidence proves full implementation |
| `partially-implemented` | Evidence exists; gaps remain |
| `documented-only` | Delivery doc claims; no code evidence |
| `runtime-only` | Code exists; delivery doc not yet written |
| `drifted` | Delivery doc and code contradict each other |
| `obsolete` | No longer relevant |
| `blocked` | Cannot proceed |

**Never copy runtime matrix status into a TIP metadata table.** The TIP `Status` field uses delivery statuses only.

**Never write `Complete` without runtime evidence.** Authority-only completions must be labeled `Complete (authority only)`.

### Step 5 — `Complete (authority only)` — tight definition

Use this status **only when all four conditions are true:**

1. The TIP intentionally delivers contracts, registries, or governance rules only — no runtime behavior expected.
2. The acceptance gate proves the authority surface (file, export, or registry entry) exists.
3. Downstream implementation TIPs are listed explicitly under **Blocks**.
4. The delivery doc contains a note: `"No runtime implementation is expected from this TIP."`

If any condition is false, use `Partially Implemented` instead.

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
| 2 | Acceptance criteria pass as tests | `pnpm --filter <pkg> test:run` | [ ] |
| 3 | No unauthorized package boundary crossing | `pnpm quality:boundaries` | [ ] |
| 4 | No `className` on `@afenda/ui` primitives (if UI change) | `pnpm ui:guard:scan` | [ ] |
| 5 | TypeScript strict — no `any` | `pnpm --filter <pkg> typecheck` | [ ] |
| 6 | Biome lint + format clean | `pnpm ci:biome` | [ ] |
| 7 | Runtime truth matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 8 | TIP status index updated when status changes | `docs/PAS/README.md` | [ ] |
| 9 | Delivery doc + matrix in sync | `pnpm check:documentation-drift` | [ ] |
| 10 | No accounting logic introduced (pre-Phase 9) | ADR-0010 compliance | [ ] |
| 11 | Completion Report posted (afenda-coding-session §11) | In PR / chat | [ ] |
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
3. **Status vocabulary is closed** — only use the seven TIP delivery status values from §2 Step 4; never use runtime matrix vocabulary in TIP metadata.
4. **Evidence before status** — never mark `Complete` without listing file paths.
5. **Out-of-scope is required** — every TIP doc must have an explicit out-of-scope list.
6. **Acceptance criteria are testable** — every GIVEN/WHEN/THEN must be implementable as a Vitest or integration test.
7. **DoD links to gates** — every DoD row must reference a `pnpm` command or file path.
8. **Authority chain** — every TIP doc must cite the ADR that grants its authority.

---

## 10 · Handoff to implementation

After drafting a TIP delivery doc, the next step is `/write-tip-slice` to author individual slice handoff blocks. **Do not jump directly to coding.** Use `/write-tip-slice TIP-NNN Slice N` to produce the executor-ready handoff, then `tip-slice-implementer` to run it.

### Post-delivery DoD update

After a slice lands (gated + committed), update the TIP doc in the same PR or follow-up commit:

1. Change `**Status:** Not started` → `**Status:** Delivered (commit: <sha>)` in the slice section.
2. Mark DoD rows `[x]` for criteria proven this slice — do not mark future rows.
3. Update `## Runtime evidence` table — set `Proven` column to `Yes — Slice N`.
4. Advance `## Verdict` remaining-gap sentence to reference the next open slice.
5. Run `pnpm check:documentation-drift`.

**Never mark DoD rows without runtime evidence (file path in repo). Checkboxes without proof violate ADR-0012.**

After drafting a TIP delivery doc, the next step is `afenda-coding-session`. **Do not start coding without this handoff.** A subagent that skips it will miss TypeScript discipline, multi-tenancy resolver rules, test patterns, and UI governance.

### Mapping: TIP doc → `afenda-coding-session` §0 execution contract

The six required lines of the execution contract map directly from the TIP doc:

| afenda-coding-session §0 field | Source in TIP delivery doc |
|-------------------------------|---------------------------|
| **1. Objective** | TIP **Purpose** paragraph — compress to one sentence |
| **2. Allowed layer** | **Package ownership** table — the single owning package for this implementation slice |
| **3. Files to change** | **Deliverables** table — the explicit file list (New / Modified rows) |
| **4. Prohibited** | **Out of scope** list + any Reserved packages from ADR-0010 / PKG-R01–R05 |
| **5. Authority** | The ADR cited in Purpose (e.g., "ADR-0001 Platform Authority") |
| **6. Acceptance gates** | **Acceptance gate** section + DoD verification commands |

### Handoff format (paste this into afenda-coding-session before editing)

```
Handoff from: docs/PAS/slice/[status] tip-NNN-<title>.md

1. Objective    — <Purpose paragraph, compressed to one sentence for this slice only>
2. Allowed layer— <Owning package path, e.g. packages/execution/src/>
3. Files        — <Deliverables table rows, one per line>
                  <When slice changes runtime evidence, also include:>
                  docs/PAS/slice/[status] tip-NNN-<title>.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/PAS/README.md (Modified — only if overall status changes)
4. Prohibited   — <Out-of-scope items + blocked packages>
                  @afenda/accounting, ledger/journal/COA schemas (ADR-0010 — until Phase 9)
5. Authority    — <ADR-NNNN — authority name>
6. Gates        — <Acceptance gate pnpm commands, one per line>
                  pnpm check:documentation-drift  (required when §9 doc sync files are in §3)
```

> **Note:** Use `/write-tip-slice TIP-NNN Slice N` to generate this block automatically with §9 files included and the §7 checklist applied. Manual block authoring is error-prone and was the root cause of file-scope blockers in TIP-011 Slices 1–2.

### Example using TIP-011

```
Handoff from: docs/PAS/slice/[Partially Implemented] tip-011-execution-foundation.md

1. Objective    — Implement database outbox schema, publish worker, and integration test
                  so every protected ERP mutation can enqueue an outbox event.
2. Allowed layer— packages/database/src/schema/ + packages/execution/src/ + apps/erp/src/__tests__/
3. Files        — packages/database/src/schema/outbox.schema.ts (New)
                  packages/execution/src/contracts/outbox-event.contract.ts (New)
                  packages/execution/src/services/outbox-publish.service.ts (New)
                  packages/execution/src/jobs/publish-outbox-events.job.ts (New)
                  packages/execution/src/index.ts (Modified)
                  packages/execution/src/__tests__/outbox-publish.test.ts (New)
                  apps/erp/src/__tests__/outbox-mutation.integration.test.ts (New)
                  Drizzle migration (generated via pnpm db:generate — no hand-edit)
4. Prohibited   — @afenda/accounting, ledger/journal/COA schemas, TIP-013+ work (ADR-0010)
                  packages/ui, packages/appshell (not in this TIP's scope)
5. Authority    — ADR-0001 Platform Authority (TIP-011 execution services)
6. Gates        — pnpm --filter @afenda/execution typecheck
                  pnpm --filter @afenda/execution test:run
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:migrations
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
```

### What `afenda-coding-session` adds that `write-tip` does not cover

After handoff, `afenda-coding-session` governs:

- TypeScript discipline — branded IDs, no `any`, discriminated unions, `satisfies`
- Drizzle ORM patterns — transactions, column selection, `pnpm db:generate` only (no hand-edits)
- Next.js App Router — Server Components first, `use client` only when required
- TIP-004 UI governance — `mapStockButtonProps`, zero `className` on `@afenda/ui` (UI TIPs only)
- Multi-tenancy discipline — `resolveOperatingContext()`, no inline tenant lookups
- Test patterns — `setupUser` over `fireEvent`, AAA structure, `.interaction.test.tsx` naming
- Completion Report (§11) — evidence table that closes the DoD rows this TIP doc defined

**The TIP doc's DoD table is the checklist. `afenda-coding-session` §11 Completion Report is the proof that every DoD row passed.**

---

## 9 · Relationship to `technical-writing` skill

`write-tip` and `technical-writing` are **co-references, not alternatives**.

| Concern | Use |
|---------|-----|
| Prose quality, document mode selection, audience clarity, assumptions labeling | `technical-writing` §Step 5 / §Step 7 |
| Afenda TIP/ADR authoring, status vocabulary, file-path boundaries, Gherkin AC, DoD gates | `write-tip` (this skill) |
| General runbooks, migration guides, internal-guide mode | `technical-writing` primary; `write-tip` for any Afenda-specific gates |

Do not replace `write-tip` with `technical-writing` for TIP or ADR work. `technical-writing` has no knowledge of Afenda's authority chain, closed status vocabulary, package boundaries, or `pnpm` quality gates.

When writing a TIP doc, apply `technical-writing` prose rules (concise bullets, stable headings, labeled assumptions) inside the structure that `write-tip` defines.

---

## Extended reference

- Full TIP + ADR templates → [TEMPLATES.md](TEMPLATES.md)
- Prose quality rules → `technical-writing` skill §Step 5, §Step 7
- Coding session contract (Phase 0 + gates) → `.cursor/skills/afenda-coding-session/SKILL.md`
- Package authority matrix → `.cursor/skills/afenda-coding-session/SKILL.md` §0.2
- Pre-accounting delivery sequence → `docs/architecture/pre-accounting-foundation-roadmap.md`
- Runtime truth matrix → `docs/architecture/afenda-runtime-truth-matrix.md`
- TIP status index → `docs/PAS/README.md`
- Status vocabulary authority → `docs/adr/ADR-0012-documentation-evidence-backed.md`
- Delivery authority → `docs/adr/ADR-0013-tip-roadmap-delivery-authority.md`
