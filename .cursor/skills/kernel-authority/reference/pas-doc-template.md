# PAS Document Template

Copy this file to `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`.

← Index: [pas-template.md](pas-template.md) · [docs/PAS/README.md](../../../../docs/PAS/README.md)

**Section layout:** §0–§15 below. PAS-001 uses §8 Permission Model (kernel extension), §13 Slice Catalog, and §14–§16 for gates / guardrail / doctrine.

---

## PAS maturity labels

Copy this table into every new PAS header block (below the title) when `maturity` is set.

| Label | Meaning | Can be coded? | Can be treated as authority? |
| --- | --- | ---: | ---: |
| **Idea** | Directional concept only | No | No |
| **MVP Authority** | Enough to reserve boundary and start package skeleton | Limited | Partial |
| **Production Candidate** | Implementable with gates, tests, and known owners | Yes | Yes, after gates |
| **Enterprise Accepted** | Fully implemented, gated, documented, and drift-protected | Yes | Yes |
| **Deprecated / Superseded** | Replaced or retired | No new work | Historical only |

**Header block pattern** (adapt values per PAS):

```markdown
> **PAS maturity:** `<Label>`
> **Authority status:** `<authority_status>`
> **Implementation status:** `<implementation_status>`
> **Evidence level:** `<evidence_level>`
>
> **Maturity is part of authority.**
> <One sentence on what this label allows and what it forbids claiming.>
```

---

## Copy block — canonical PAS document

~~~markdown
---
pas_id: PAS-NNN
package: "@afenda/<name>"
layer: Platform | Foundation | Application | UI
runtime_stance: contracts-only | runtime | composition | UI
registry_lane: PKGRxx_<NAME>
skill: <package-name>-authority
maturity: idea | mvp_authority | production_candidate | enterprise_accepted
authority_status: draft | accepted_for_boundary | accepted_for_implementation | enterprise_accepted
implementation_status: not_started | partial | implemented
evidence_level: concept | runtime_partial | runtime_proven
consumers:
  - "@afenda/<consumer>"
  - apps/erp
change_model: serialized-slices | open
quality_target: "9.5"
required_gates:
  - pnpm --filter @afenda/<name> typecheck
  - pnpm --filter @afenda/<name> test:run
adr_prerequisites: []
slice_dir: docs/PAS/slice/
---

# PAS-NNN — <Package Name> Authority Standard

> **PAS maturity:** `<Idea | MVP Authority | Production Candidate | Enterprise Accepted | Deprecated / Superseded>`
> **Authority status:** `<authority_status>`
> **Implementation status:** `<implementation_status>`
> **Evidence level:** `<evidence_level>`
>
> **Maturity is part of authority.**
> <One sentence on what this label allows and what it forbids claiming.>

> **Agent skill entrypoint:** `.cursor/skills/<package-name>-authority/SKILL.md`
> **Canonical location:** `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`
> **Package-local pointer:** `packages/<package-name>/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`

| Field             | Value                                           |
| ----------------- | ----------------------------------------------- |
| Package           | `@afenda/<name>`                                |
| Layer             | `<Platform / Foundation / Application / UI>`    |
| Package role      | `<one sentence>`                                |
| Runtime stance    | `<contracts-only / runtime / composition / UI>` |
| Package owner     | `<Platform Authority / etc.>`                   |
| Consumer packages | `<list>`                                        |
| Change model      | `<serialized slices / open>`                    |
| Quality target    | Enterprise 9.5 / 10                             |
| PAS maturity      | `<Idea | MVP Authority | Production Candidate | Enterprise Accepted>` |

---

# 0. Agent Quick Path

> Read this section first for IDE/agent work. Full detail in §1–§15. Execution adapter: `.cursor/skills/<package-name>-authority/SKILL.md`

**Boundary:** <copy §2 one sentence verbatim>

**Hard stops (summary):**

- **Prohibited imports:** <comma-separated list from §3.2>
- **Must never own:** <top 5 bullets from §5>

**Required gates:** see §13.1

**Slice entrypoint:** `docs/PAS/slice/` · Planner: `pas-slice-planner` · Session: `/afenda-coding-session`

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

---

# 4. Authority Surfaces

What this package owns. One section per surface.

## 4.1 <Surface Name>

**Authority:** <ADR links if applicable>

**Implementation:** `<path>` · **Slice gate:** <prerequisite or "none">

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

---

# 9. Runtime Rules

When runtime code is allowed (if any). List approved runtime primitives explicitly.

---

# 10. Implementation Sequence

Recommended order for new additions.

**Do not add in this package:**

- <deferred item with correct home package>

---

# 11. Enterprise Acceptance Criteria

A change is accepted only when all criteria pass.

## 11.1 Architecture

## 11.2 Type Safety

## 11.3 Governance

## 11.4 Runtime Safety

## 11.5 ERP Readiness (if applicable)

---

# 12. Slice Catalog

Index of implementation slices for this PAS. Update when adding `docs/PAS/slice/*.md` files.

| Slice file | ID | PAS § | Status | Type | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `<bN>-<section>-<slug>.md` | Bn | §4.1 | Not started | Implementation | … |

Slice naming: `b<N>-<pas-section>-<slug>.md` (optional companion: `<file>-prohibited.md`).

Handoff format: 9 fields — see [pas-slice-template.md](pas-slice-template.md).

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

- one canonical PAS document
- one agent skill adapter (`.cursor/skills/<package-name>-authority/SKILL.md`)
- one optional package-local tombstone pointer
- no duplicated long-form authority outside `docs/PAS/`

---

# 15. Final Doctrine

One paragraph. What this package is. What it is not.

When in doubt blockquote pair (may belong / belongs outside).

Closing lines: who owns words / decisions / behavior (if applicable).
~~~

---

**After copy:** fill YAML frontmatter; run [publish checklist](pas-template.md#publish-validation-checklist).
