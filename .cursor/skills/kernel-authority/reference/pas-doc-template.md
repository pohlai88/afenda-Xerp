# PAS Document Template

Copy this file to `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`.

← Index: [pas-template.md](pas-template.md) · [docs/PAS/README.md](../../../../docs/PAS/README.md)

**Section layout:** §0–§15 below. PAS-001 uses §8 Permission Model (kernel extension), §13 Slice Catalog, and §14–§16 for gates / guardrail / doctrine.

---

## PAS maturity labels

Canonical table: [pas-template.md](pas-template.md#pas-maturity-labels). The **PAS authority metadata table** (below the title) is the document header — not a substitute for YAML when frontmatter is used.

| Label | Meaning | Can be coded? | Can be treated as authority? |
| --- | --- | ---: | ---: |
| **Idea** | Directional concept only | No | No |
| **MVP Authority** | Enough to reserve boundary and start package skeleton | Limited | Partial |
| **Production Candidate** | Implementable with gates, tests, and known owners | Yes | Yes, after gates |
| **Enterprise Accepted** | Fully implemented, gated, documented, and drift-protected | Yes | Yes |
| **Deprecated / Superseded** | Replaced or retired | No new work | Historical only |

**Header block pattern** (adapt values per PAS):

Place a **PAS authority metadata table** immediately after the document title (and any constitutional/derivation blockquotes). List **required gates** in a separate numbered table (`#### Required gates`) — one command per row — never inline in the metadata table.

**Runtime status** — factual one-liner: what packages, gates, registries, or cutovers are **live** today (not aspirational).

**Remaining slices** — ordered continuation queue. Use `none` when the planned sequence is closed; use `(proposed)` for backlog items without a handoff file yet. Update on **every slice close** — sync metadata table, maturity blockquote, skill, and [`pas-status-index.md`](../../../../docs/PAS/pas-status-index.md).

---

## Copy block — canonical PAS document

~~~markdown
# PAS-NNN — <Package Name> Authority Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-NNN |
| **Document class** | `package_authority_standard` |
| **Document role** | `<semantic_role_slug>` |
| **Canonical filename** | `PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md` |
| **Package** | `@afenda/<name>` |
| **Layer** | `<Platform / Foundation / Application / UI>` |
| **Package role** | `<one sentence>` |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGRxx_<NAME>` |
| **Package owner** | `<Platform Authority / etc.>` |
| **Agent skill** | `<package-name>-authority` · `.cursor/skills/<package-name>-authority/SKILL.md` |
| **Maturity** | `<Label>` (`<maturity_slug>`) |
| **Authority status** | `<authority_status>` |
| **Implementation status** | `<implementation_status>` |
| **Evidence level** | `<evidence_level>` |
| **Runtime status** | <one sentence — live runtime truth> |
| **Remaining slices** | none \| B<N> — slug (next) |
| **Consumers** | `@afenda/<consumer>`, `apps/erp` |
| **Change model** | `serialized-slices` |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **Blueprint box** | `<Box name in afenda-architecture-blueprint.md>` |
| **Total slices planned** | `<N>` — declare count at PAS authoring time; update on discovery |
| **Delivered slices** | `<N> of <Total>` |
| **ADR prerequisites** | none |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/<name> typecheck` |
| 2 | `pnpm --filter @afenda/<name> test:run` |

> **Maturity is part of authority.**
> <One sentence on what this label allows and what it forbids claiming.>

> **Canonical location:** `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`
> **Package-local pointer:** `packages/<package-name>/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`

---

# 0. Agent Quick Path

> Read this section first for IDE/agent work. Full detail in §1–§15. Execution adapter: `.cursor/skills/<package-name>-authority/SKILL.md`

**Boundary:** <copy §2 one sentence verbatim>

**Hard stops (summary):**

- **Prohibited imports:** <comma-separated list from §3.2>
- **Must never own:** <top 5 bullets from §5>

**Required gates:** see §13.1

**Slice entrypoint:** `docs/PAS/slice/` · Planner: `pas-slice-planner` · Session: `/afenda-coding-session`

**Escalation:** [Authority Escalation Matrix](doc-boundary-contract.md#authority-escalation-matrix) · [Change Classification](doc-boundary-contract.md#change-classification-matrix) · [ADR Constitution](adr-constitution.md)

**Registry:** `<PKGRxx_*>` in `packages/architecture-authority/src/data/foundation-disposition.registry.ts` (or `pending` with owner)

---

# 1. Package Definition

What this package is. One paragraph.

What it answers vs what it must not answer (optional blockquote pair).

---

# 2. One-Sentence Boundary

The shortest enforceable boundary sentence. Bold the owns / never owns clauses.

---

# 3. Dependency Rules

## 3.1 Allowed

What the package may import or use.

## 3.2 Prohibited imports

Explicit list — package names, frameworks, SDKs.

## 3.3 Import rule

One paragraph: self-import only, wrong-package signal, escalation path.

## 3.4 Architectural dependencies (PAS declaration)

> **Implementation-review dependencies** — what this PAS expects architecturally. Not TypeScript import graphs (§3.1–§3.2) and not Blueprint §5.1 prose duplication without alignment.
> Declare **platform areas** and **Blueprint boxes** this package's contracts assume.

| Depends on | Kind | Required for | Blueprint / platform trace | Notes |
| --- | --- | --- | --- | --- |
| **Kernel** | Platform area | Context · IDs · wire envelopes | Platform NS §4 · PAS-001 | |
| **Metadata** | Platform area | Field definitions · taxonomy | Metadata PAS | |
| **Execution** | Foundation | Job / workflow primitives | Blueprint box if applicable | |
| **Permissions** | Platform area | RBAC · tenant scope | Kernel / permission PAS | |
| **Observability** | Platform area | Audit · telemetry contracts | PKG audit lanes | |
| **[Sibling box]** | Blueprint box | [capability] | Blueprint §5.1 edge | Category per Blueprint §3.2 |

> **Rule:** Every **Production Candidate+** PAS has ≥1 row. Rows must match Blueprint §5.1 or §5 consumers — escalate per [Authority Escalation Matrix](doc-boundary-contract.md#authority-escalation-matrix) if mismatch.

---

# 4. Authority Surfaces

What this package owns. One section per surface.

> Classify every surface with **Contract type** and **Stability**. Reviews and ADR triggers use these columns — not ad-hoc judgment.

### Contract classification

| Contract type | Examples | Typical review focus |
| --- | --- | --- |
| **Identity** | Branded IDs, references, foreign keys | Cross-package type safety |
| **Domain** | Business meaning contracts, enums | Domain NS EFR trace |
| **Runtime** | Public APIs, server actions, handlers | ERP integration · security |
| **Persistence** | Schema models, migrations (when allowed) | Tenant RLS · migration gate |
| **Integration** | Events, webhooks, wire envelopes | Domain NS §7 event trace |
| **Security** | Permissions, scopes, SoD hooks | RBAC gates |
| **Metadata** | Configuration schemas, feature metadata | Metadata PAS alignment |
| **Observability** | Audit actions, telemetry shapes | Audit completeness |

### Surface stability levels

| Level | Meaning | Change requires |
| --- | --- | --- |
| **Constitutional** | Platform/domain invariant — very rare changes | ADR + Domain NS / Blueprint review |
| **Stable** | Production interface — consumers depend on it | PAS §11 EAC · migration slice if breaking |
| **Evolutionary** | Planned growth — additive expected | PAS §4 update · slice |
| **Experimental** | MVP / Idea only — not enterprise authority | Maturity ≤ MVP · no downstream EFR reliance |

## 4.1 <Surface Name>

| Field | Value |
| --- | --- |
| **Contract type** | Identity / Domain / Runtime / … |
| **Stability** | Constitutional / Stable / Evolutionary / Experimental |
| **Authority** | ADR links if Constitutional or blocked |
| **Implementation** | `<path>` · **Slice gate:** prerequisite or `none` |
| **Traces to** | Domain NS §4 EFR · Blueprint §4.2 owns · PAS §11.x |

**Authority:** <ADR links if applicable>

Description. TypeScript shape summary or pointer to skill `reference/authority-surfaces.md`.

---

# 5. What This Package Must Never Own

Bullet list of prohibited responsibilities.

---

# 6. Package Structure Standard

Folder tree and `package.json` exports block. Label **Current** vs **Target** where they differ.

---

# 7. Decision Matrix

| Question | If yes → | In this package? |
| --- | --- | --- |
| <question> | <outcome> | **Yes** / **No** |

Minimum eight rows with explicit Yes/No answers.

---

# 8. Contract Rules

Numbered checklist. Minimum:

1. TypeScript strict mode
2. `readonly` on contract properties
3. Branded IDs for cross-package identifiers
4. JSON-serializable wire contracts
5. No side effects on import
6. No hidden business logic
7. Every §4 surface declares **Contract type** + **Stability**
8. **Breaking** changes to **Stable** or **Constitutional** surfaces require ADR ([adr-constitution.md](adr-constitution.md))

---

# 9. Runtime Rules

When runtime code is allowed (if any). List approved runtime primitives explicitly.

---

# 10. Implementation Sequence

Recommended order for new additions.

**Do not add in this package:**

- <deferred item with correct home package>

---

# 11. Enterprise Acceptance Criteria (EAC)

> **PAS-level EAC** — applies when accepting the **whole package / PAS maturity**, not a single slice.
> Slice session proof lives in each slice `## DoD` table ([pas-slice-template.md](pas-slice-template.md)).

A change or maturity promotion is accepted only when **all** criteria in the tables below pass.

**Authoring rules:**

- Every §11.x subsection must have a **Criteria table** — `# | Criterion | Gate | Traces to EFR/EAC`.
- **Gate** = resolvable `pnpm` command, named test file, or explicit manual review owner — never "TBD".
- **Traces to EFR/EAC** = Domain NS §4 capability, §12 D#, or parent PAS §11.x — **never assumption (✗)**.
- Minimum **3 criteria per §11.x** subsection for Production Candidate+ PAS.
- Slice DoD rows should **map upward** to a §11.x subsection (cite in slice field 7).

**Battle-proven rule:** PAS §11 proves implementation of upstream **battle-proven EFR** — it does not invent new enterprise requirements. New business meaning → amend Domain North Star first ([doc-evidence-standard.md](doc-evidence-standard.md)).

## 11.1 Architecture

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | <e.g. Package registered in Architecture Authority> | `pnpm check:foundation-disposition` | Blueprint §4 box · Domain NS D# |
| 2 | <e.g. Dependency direction correct; no consumer imports> | `pnpm quality:architecture` | PAS §2 boundary |
| 3 | <e.g. Layer matches Blueprint §4> | Manual review | Blueprint §4 row |

## 11.2 Type Safety

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | <e.g. Public contracts readonly> | `pnpm --filter @afenda/<name> typecheck` | Domain NS EFR / PAS §4 |
| 2 | <e.g. Branded IDs for cross-package identifiers> | `<contract test file>` | Domain NS §12 D# |
| 3 | <e.g. No `any` in public exports> | `pnpm --filter @afenda/<name> test:run` | PAS §11.2 |

## 11.3 Governance

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | <e.g. PAS doc, skill, tombstone synchronized> | `pnpm check:documentation-drift` | Platform NS §13 |
| 2 | <e.g. Registry lane matches disposition> | `pnpm check:foundation-disposition` | Blueprint §4 status |
| 3 | <e.g. Maturity label matches runtime evidence> | Manual review | T5 runtime-truth-matrix |

## 11.4 Runtime Safety

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | <e.g. No prohibited side effects on import> | `<test file>` | PAS §0 hard stop |
| 2 | <e.g. Approved runtime primitives only — if runtime exists> | `<package gate>` | PAS §4 surface |
| 3 | <e.g. Deterministic validation / no hidden mutation> | `<test file>` | Domain NS principle |

## 11.5 ERP Readiness (if applicable)

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | <e.g. Wire contracts consumable by apps/erp> | `pnpm --filter app typecheck` or scoped test | Domain NS §4 EFR |
| 2 | <e.g. Tenant/context requirements documented in §0> | Manual review | Multi-tenancy EFR |
| 3 | <add domain-specific readiness criteria> | `<gate>` | [enterprise-erp-standards](../../enterprise-erp-standards/SKILL.md) §2 row |

## 11.6 Maturity exit criteria (required)

> When this PAS may leave its current maturity label. Update on every maturity promotion slice.

**May remain `<current maturity>` only if:**

- <explicit allowed gap 1>
- <explicit allowed gap 2>

**May move to `<target maturity>` only when:**

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | <e.g. All §11.1–§11.5 rows pass for in-scope surfaces> | See §11 tables | PAS §11 EAC complete |
| 2 | <e.g. All planned slices Delivered or explicitly waived> | PAS §12 catalog | Slice DoD EAC |
| 3 | <e.g. §13 required gates pass in CI> | `pnpm --filter @afenda/<name> test:run` | PAS §13 |

---

# 12. Slice Catalog

Index of implementation slices for this PAS. **Declare total count at PAS authoring time. Update delivered count on every slice close.**

**Total slices planned: `<N>`**
**Delivered: `<X> of <N>`**
**Remaining queue:** `<B(X+1) — slug (next)>` or `none` when closed.

> **Source of truth:** this table. Metadata table `Total slices planned` and `Delivered slices` fields must stay in sync with this table.

| Slice file | ID | PAS § | Status | Type | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `<bN>-<section>-<slug>.md` | Bn | §4.1 | Not started | Implementation | … |

Slice naming: `b<N>-<pas-section>-<slug>.md` (optional companion: `<file>-prohibited.md`).

Handoff format: 9 fields — see [pas-slice-template.md](pas-slice-template.md).

> **Slice DoD:** Every Implementation slice file must include `## DoD` with ≥3 rows (`# | Criterion | Gate`). Delivered only when all DoD rows pass. See [pas-template.md DoD hierarchy](pas-template.md#definition-of-done-dod--three-layers).

> **When adding a new slice:** (1) add row here, (2) author slice with DoD table, (3) update `Total slices planned` if count grew, (4) update metadata `Remaining slices`.

---

# 13. Required Gates

## 13.1 Required

Run before accepting any package change:

~~~bash
pnpm --filter @afenda/<name> typecheck
pnpm --filter @afenda/<name> test:run
# + package-specific gates
~~~

## 13.2 Recommended

~~~bash
# gates promoted to required when implemented for affected slices
~~~

## 13.3 Promotion rules

- Recommended gates must not block CI until implemented.
- Once implemented, recommended gates become required for affected slices.
- Missing future gates must not block unrelated source-only cleanup.

---

# 14. Reusable Package Guardrail Template

See [PAS README](README.md) for how to create a new PAS.

Reusable template:

~~~text
.cursor/skills/kernel-authority/reference/pas-template.md
~~~

Each package authority standard should have:

- one canonical PAS document (**SSOT**)
- one agent skill adapter — **generated from PAS** (see [pas-template.md](pas-template.md#pas--skill-generation-model))
- one optional package-local tombstone pointer
- no duplicated long-form authority outside `docs/PAS/`

---

# 15. Final Doctrine

One paragraph. What this package is. What it is not.

When in doubt blockquote pair (may belong / belongs outside).

Closing lines: who owns words / decisions / behavior (if applicable).

---

# 16. Appendix — borrow reference inventory (optional, temporary)

Use when a PAS has prior art in other repos or OSS pattern libraries. Mark clearly as **temporary** until slice handoffs absorb the references.

~~~markdown
# Appendix A — Borrow reference inventory (temporary)

> **Status:** Temporary research appendix · **not Enterprise Accepted authority**
> **Purpose:** Guide implementation slices with prior art references.
> **Rule:** Borrow shapes/citations only — not ledger runtime, full standard text, or wrong-layer engines.

## A.1 Borrow tier legend

| Label | Meaning |
| --- | --- |
| **Tier A** | Safe pattern borrow into this package |
| **Tier B** | Rule/evidence shape only — no runtime import |
| **Tier C** | Build-time / monitoring ideas |
| **Exclude** | Wrong layer — do not borrow |

## A.2 Self repo

| Path | Status | Target slice |
| --- | --- | --- |
| `<local paths>` | … | … |

## A.3 Org / OSS prior art

| Repository | Path | Borrow for | Target PAS § / slice | Tier |
| --- | --- | --- | --- | --- |
| `<owner/repo>` | `<path>` | `<what to reuse>` | §4.x · Bn | A / B / C |

## A.4 Explicit exclusions

| Source | Reason |
| --- | --- |
| … | … |

## A.5 Slice → borrow map

| Slice | Primary source | Deliverable |
| --- | --- | --- |
| B1 | … | … |

## A.6 Appendix retirement

Remove when slice handoffs cite sources and governance sync (B12 or equivalent) closes.
~~~

---

**After copy:** fill the PAS authority metadata table; run [publish checklist](pas-template.md#publish-validation-checklist).
