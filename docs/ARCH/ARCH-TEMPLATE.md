# Enterprise Architecture Requirement Template

> Use this template when asking an IDE / coding agent / subagent to implement, audit, or close a feature, package, FDR, TIP, module, or architecture slice to enterprise quality.

---

# 1. Execution instruction

You are executing an enterprise architecture delivery slice.

You must produce implementation and evidence that meets:

* Architecture authority
* Runtime truth
* Package ownership
* Clean Core boundaries
* Enterprise acceptance criteria
* Automated gate proof
* Documentation sync
* Definition of Done

You must not rely on prose-only claims. Every completion claim must map to:

* file path
* test path
* command exit code
* documentation row
* explicit waiver

---

# 2. Target item

| Field                   | Value                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Work ID                 | `ARCH-<DOMAIN>-<NNN>` (e.g. ARCH-AUTH-001) · paired `<FDR-ID>` |
| Title                   | `<short title>`                                              |
| Status                  | `<Not started / Partially Implemented / Complete / Blocked>` |
| Package                 | `<@afenda/package-name>`                                     |
| Registry entry ID       | `<PKGxxx_ENTRY>`                                             |
| Runtime owner           | `<packages/... or apps/...>`                                 |
| Lane                    | `<green-lane / amber-lane / red-lane / blue-lane>`           |
| Risk class              | `<Low / Medium / High>`                                      |
| Change class            | `<Extension / Refactor / Fix / Governance / Evidence-sync>`  |
| Clean Core target       | `<A / B>`                                                    |
| Enterprise score target | `<28/30 foundation acceptable OR 29/30 enterprise 9.5>`      |

---

# 3. Authority chain

Read in this order before touching code:

```text
1. docs/ARCH/arch-status-index.md
2. docs/delivery/fdr-status-index.md
2. packages/architecture-authority/src/data/foundation-disposition.registry.ts
3. docs/architecture/afenda-runtime-truth-matrix.md
4. docs/delivery/FDR/[status] <FDR-ID>.md
5. related ADRs under docs/adr/
6. related package source files
7. related tests and governance scripts
```

The registry is source of truth for ownership, gates, prohibited actions, and allowed agents.

The FDR / TIP document is delivery authority only.

The runtime truth matrix is evidence status authority.

---

# 4. Problem statement

## Current risk / gap

```text
<Describe the runtime, architecture, governance, UX, security, test, or documentation risk.>
```

Example:

```text
ERP navigation does not highlight the active module at runtime, causing the manifest-nav pipeline to be functionally correct but visually incomplete.
```

## Business / architecture impact

```text
<Explain why this matters for enterprise ERP correctness, maintainability, user experience, security, auditability, or Clean Core.>
```

---

# 5. Architecture requirement

The implementation must satisfy the following architecture requirements:

## 5.1 Ownership

| Concern                | Owner                | Allowed path |
| ---------------------- | -------------------- | ------------ |
| Contract authority     | `<package>`          | `<path>`     |
| Runtime implementation | `<package/app>`      | `<path>`     |
| Tests                  | `<package/app>`      | `<path>`     |
| Documentation          | `docs`               | `<path>`     |
| Governance script      | `scripts/governance` | `<path>`     |

No implementation may occur outside the declared owner paths unless explicitly listed in this template.

---

## 5.2 Boundary rules

The implementation must:

1. Keep package ownership clear.
2. Avoid duplicated constants.
3. Avoid private/deep imports.
4. Preserve public API compatibility unless the change explicitly declares a breaking change.
5. Keep runtime resolution in the runtime owner package.
6. Keep contracts serializable where applicable.
7. Keep UI state derived from runtime evidence, not hardcoded.
8. Keep security decisions server-side where applicable.
9. Keep documentation synchronized with runtime proof.
10. Avoid creating accounting runtime unless the FDR explicitly allows it.

---

## 5.3 Prohibited actions

The agent must not:

```text
- create an accounting package
- implement accounting runtime
- duplicate registry constants
- bypass package public exports
- introduce ad-hoc route strings outside approved registry/manifest/contracts
- add local authority where a registry already exists
- weaken type safety with `any`
- suppress tests instead of fixing the issue
- mark Complete without peer review where DoD requires it
- claim enterprise 9.5 without gate evidence
```

Add project-specific prohibitions:

```text
- <prohibition 1>
- <prohibition 2>
- <prohibition 3>
- use vague timeline language ("future", "defer", "optional later", "v2 maybe", "when needed", "TBD later") without P0/P1/P2/P3 classification
- label production-critical gaps as "future" instead of P0 mandatory or P1 hardening
- imply excluded capabilities will ship without a separate ARCH/FDR approval row
```

---

## 5.4 Production classification vocabulary (mandatory)

Every capability, gap, slice, or platform service **must** use one of these buckets — not informal timeline words.

| Bucket | Meaning | Can ship enterprise 9.5? |
| --- | --- | ---: |
| **P0 — Production mandatory** | Must be closed before enterprise production acceptance | No, if open |
| **P1 — Production hardening** | Should be closed for 9.5 unless formally waived with expiry | Usually no |
| **P2 — Excluded from current production release** | Not in this release; requires separate ARCH/FDR approval to implement | Yes |
| **P3 — Enhancement backlog** | Post-9.5 only; not required for production correctness | Yes |

**Prohibited vocabulary in ARCH/FDR/slice docs:** `future`, `defer`, `optional later`, `v2 maybe`, `when needed`, `TBD later`, `nice to have later`.

**Required wording for P2 exclusions:**

```text
Not in current production release scope.
Requires separate ARCH/FDR approval before implementation.
No runtime code may be added under this capability in this work item.
```

**P1 waivers** must include: waiver ID, reason, approver, expiry/revisit event. No waiver may hide broken P0 runtime.

---

# 6. Required implementation scope

## In scope

```text
- <file/path/one>
- <file/path/two>
- <test/path/one>
- <doc/path/one>
```

## Out of scope

```text
- <out-of-scope item>
- <out-of-scope package>
- <future FDR/TIP>
```

## Expected files touched

| File     | Package     | Change type      | Required? |
| -------- | ----------- | ---------------- | --------- |
| `<path>` | `<package>` | `<new/modified>` | Yes       |
| `<path>` | `<package>` | `<new/modified>` | Yes       |
| `<path>` | `<package>` | `<new/modified>` | Optional  |

---

# 7. Enterprise acceptance criteria

Use Gherkin-style criteria.

```gherkin
Feature: <Feature / FDR / architecture capability>

  Scenario: <primary success path>
    GIVEN <runtime precondition>
    AND <contract or registry authority exists>
    WHEN <implementation function / route / action / resolver runs>
    THEN <expected runtime output is produced>
    AND <output is derived from authority, not duplicated locally>

  Scenario: <negative security / boundary path>
    GIVEN <unauthorized / invalid / drifted input>
    WHEN <implementation is executed>
    THEN <access is denied OR validation fails OR drift gate fails>
    AND <no unsafe fallback is used>

  Scenario: <contract drift protection>
    GIVEN <registry / manifest / contract changes>
    WHEN <test or governance gate runs>
    THEN <drift is detected>
    AND <the build fails before runtime>

  Scenario: <consumer compatibility>
    GIVEN <downstream package imports the public surface>
    WHEN <typecheck and tests run>
    THEN <consumer remains compatible>
    AND <no private/deep import is introduced>
```

---

# 8. Enterprise quality benchmark

Target score:

```text
Minimum acceptable: 28/30 foundation acceptable
Enterprise 9.5: 29/30 and no dimension below 4/5
```

| Dimension                        |      Target | Evidence required                                             |
| -------------------------------- | ----------: | ------------------------------------------------------------- |
| Contract stability               |         5/5 | Typecheck exit 0, contract tests                              |
| Test coverage                    |         5/5 | Unit/integration tests with positive and negative paths       |
| Observability + audit            | 4/5 minimum | Audit event, diagnostic trace, or explicit read-path waiver   |
| Security + RBAC + RLS            |         5/5 | Permission test, denial test, server-side enforcement         |
| Documentation + BRD traceability |         5/5 | FDR/TIP/index/matrix updated                                  |
| Maintainability + Clean Core     |         5/5 | Biome, boundaries, no duplicate constants, no private imports |

Do not inflate the score. If any gate fails, either fix it or record a bounded waiver.

---

# 9. Non-functional requirements

| Characteristic         | Requirement                                                           | Verification               |
| ---------------------- | --------------------------------------------------------------------- | -------------------------- |
| Functional suitability | Feature works according to acceptance criteria                        | Unit/integration tests     |
| Security               | No client-trusted authority; negative path tested                     | Security tests             |
| Compatibility          | Public exports remain stable                                          | Typecheck + consumer tests |
| Reliability            | Deterministic behavior for same input                                 | Unit tests                 |
| Maintainability        | No duplicate authority or deep imports                                | Governance scripts         |
| Performance            | No unnecessary runtime round trips or O(n²) behavior unless justified | Code review/test           |
| Accessibility          | UI changes expose correct ARIA/state where applicable                 | Component tests            |
| Observability          | Runtime failures are diagnosable                                      | Audit/log/trace or waiver  |
| Documentation          | Architecture docs reflect runtime truth                               | Documentation drift gate   |

---

# 10. Required gates

Run the relevant gates and report exit codes.

```bash
pnpm --filter <package> typecheck
pnpm --filter <package> test:run
pnpm exec biome check <package-path>
pnpm quality:boundaries
pnpm check:foundation-disposition
pnpm check:documentation-drift
```

Add package-specific gates:

```bash
pnpm <custom-governance-gate>
pnpm <custom-e2e-or-integration-test>
```

Gate report format:

| Gate        | Exit | Result                          |
| ----------- | ---: | ------------------------------- |
| `<command>` |    0 | Pass                            |
| `<command>` |    1 | Fail — explain and fix or waive |

---

# 11. Definition of Done

| #   | Criterion                               | Evidence                              | Status |
| --- | --------------------------------------- | ------------------------------------- | ------ |
| 1   | Runtime evidence exists at stated paths | File paths listed                     | [ ]    |
| 2   | Acceptance criteria implemented         | Tests pass                            | [ ]    |
| 3   | Positive path tested                    | Test path                             | [ ]    |
| 4   | Negative path tested                    | Test path                             | [ ]    |
| 5   | TypeScript strict passes                | `typecheck` exit 0                    | [ ]    |
| 6   | Package tests pass                      | `test:run` exit 0                     | [ ]    |
| 7   | Biome clean                             | `biome check` exit 0                  | [ ]    |
| 8   | Boundaries pass                         | `quality:boundaries` exit 0           | [ ]    |
| 9   | Registry/index aligned                  | `check:foundation-disposition` exit 0 | [ ]    |
| 10  | Documentation drift clean               | `check:documentation-drift` exit 0    | [ ]    |
| 11  | Runtime matrix updated                  | Matrix row path                       | [ ]    |
| 12  | FDR/TIP status updated                  | Delivery doc path                     | [ ]    |
| 13  | Impact analysis completed               | Table filled                          | [ ]    |
| 14  | Rollback strategy documented            | Rollback section                      | [ ]    |
| 15  | Security / RBAC / RLS path verified     | Test or waiver                        | [ ]    |
| 16  | Observability / audit verified          | Trace/audit or waiver                 | [ ]    |
| 17  | Public API compatibility verified       | Typecheck/export test                 | [ ]    |
| 18  | Clean Core level declared               | A/B/C/D                               | [ ]    |
| 19  | Waivers documented if any               | Waiver table                          | [ ]    |
| 20  | Peer review completed if required       | DoD #14                               | [ ]    |

---

# 12. Impact analysis

| Consumer             | Import surface / runtime dependency | Breaking change? | Required action    |
| -------------------- | ----------------------------------- | ---------------- | ------------------ |
| `<consumer package>` | `<import/function/route>`           | No               | None               |
| `<consumer package>` | `<import/function/route>`           | Yes              | Migration required |

State clearly:

```text
Breaking change: Yes / No
Migration required: Yes / No
Runtime risk: Low / Medium / High
Rollback safe: Yes / No
```

---

# 13. Waiver policy

A waiver is allowed only if:

1. The gate or requirement is not relevant to this slice.
2. The risk is bounded.
3. The revisit point is documented.
4. The waiver does not hide broken runtime behavior.

| Waiver ID     | Requirement waived | Reason     | Approver  | Expiry / revisit     |
| ------------- | ------------------ | ---------- | --------- | -------------------- |
| `<waiver-id>` | `<requirement>`    | `<reason>` | `<owner>` | `<date/slice/event>` |

No waiver may be used to claim a feature works when runtime evidence is missing.

---

# 14. Rollback strategy

| Change area         | Rollback method                    | Risk   |
| ------------------- | ---------------------------------- | ------ |
| Code                | `git revert <commit>`              | Low    |
| Contract            | Restore previous public export     | Medium |
| Docs                | Revert FDR/TIP/index/matrix update | Low    |
| Generated artifacts | Rebuild or remove generated output | Low    |

Rollback must preserve:

```text
- registry authority
- package boundaries
- public API compatibility
- documentation truth
```

---

# 15. Required output from IDE / agent

The final response must include:

```text
1. Summary of what changed
2. Files changed
3. Architecture requirements satisfied
4. Acceptance criteria satisfied
5. Tests added/updated
6. Gate results with exit codes
7. Remaining gaps, if any
8. Waivers, if any
9. Enterprise score recommendation
10. Whether status can be promoted
11. Exact docs/index/matrix updates made
12. Rollback instructions
```

Use this report format:

```markdown
## Completion report

### Status
<Complete / Partially Implemented / Blocked>

### Files changed
- `<path>` — <summary>

### Architecture requirements satisfied
- <requirement> — <evidence>

### Acceptance criteria
| AC   | Status | Evidence         |
| ---- | ------ | ---------------- |
| <AC> | Pass   | <test/gate/path> |

### Gates
| Gate        | Exit | Result |
| ----------- | ---: | ------ |
| `<command>` |    0 | Pass   |

### Enterprise readiness
<score>/30 — <reason>

### Remaining gaps
- <gap or "None">

### Waivers
- <waiver or "None">

### Promotion recommendation
<Can / cannot promote to Complete because...>

### Rollback
<rollback plan>
```

---

# 16. Promotion rule

Do not promote to `Complete` unless all are true:

```text
- Required implementation slices are delivered
- Required gates exit 0
- Runtime evidence exists
- FDR/TIP/index/matrix are synchronized
- Known gaps are closed or explicitly future-lane
- Enterprise score target is met
- Peer review is completed if DoD requires it
```

Allowed status labels:

```text
Not started
Partially Implemented
Complete — foundation acceptable
Complete — enterprise 9.5 accepted
Blocked
```

---

# 17. Command to execute

```text
Execute <WORK-ID> as one bounded enterprise architecture slice.

Use the authority chain, architecture requirements, acceptance criteria, DoD, gates, owner paths, prohibitions, waiver policy, and output format defined above.

Do not expand scope.
Do not start unrelated FDRs/TIPs.
Do not mark Complete unless promotion rules are satisfied.
Stop after the slice completion report.
```
