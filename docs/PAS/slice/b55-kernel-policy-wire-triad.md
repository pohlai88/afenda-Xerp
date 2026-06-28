# Slice B55 — Kernel Policy Wire Triad (PAS-001 §4.9)

**Prerequisite:** Slice B15 — Policy decision vocabulary (`b15-4.9-policy-decision-vocabulary.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low — vocabulary-only hardening; no evaluation or persistence changes

**Clean Core impact:** A→A — wire assert/parser/serialize triad on frozen B15 kinds and reasons

---

## Objective

Harden PAS-001 §4.9 policy module with assert/parser/serialize wire triad mirroring context wire patterns — strict JSON ingress, typed semantic validation, wire egress — without renaming B15 frozen vocabulary.

1. Add `PolicyWireDecision` JSON-safe wire type on `policy-decision.contract.ts`.
2. Add `policy-decision.assert.ts` compile-time serializability guard + strict-key wire assert.
3. Add `policy-decision.parser.ts` parse/normalize/serialize triad.
4. Remove `as` casts from `getPolicyDecisionKind` / `getPolicyDenialReason`.
5. Sync kernel layout registry, implementation sequence evidence, and governance gate.

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | `PolicyWireDecision` wire type added | `policy-decision.contract.ts` |
| 2 | Assert triad — compile-time + strict keys | `policy-decision.assert.ts`, parser tests |
| 3 | Parser triad — parse/normalize/serialize | `policy-decision.parser.ts`, round-trip tests |
| 4 | Get helpers use type guards without `as` | `policy-vocabulary.contract.ts` |
| 5 | Layout + sequence registry synced | `kernel-package-layout.contract.ts`, `kernel-implementation-sequence.contract.ts` |
| 6 | Governance gate operational | `check-kernel-policy-wire-serializable.mts` |
| 7 | All acceptance gates pass | Kernel typecheck + policy tests + structure gates |

---

## Handoff block

```
1. Objective    — Harden PAS-001 §4.9 policy wire triad (assert/parser/serialize); fix get-helper casts; sync layout + sequence + governance gate.
2. Allowed layer— packages/kernel/src/policy/**; kernel index (policy exports); layout + sequence contracts; governance script; package.json check line; PAS docs
3. Files        — policy-decision.assert.ts, policy-decision.parser.ts (CREATE)
                  policy-decision.contract.ts, policy-vocabulary.contract.ts, policy/index.ts, kernel index (MODIFY)
                  kernel-package-layout.contract.ts, kernel-implementation-sequence.contract.ts (MODIFY)
                  policy-decision.parser.test.ts (CREATE); policy-vocabulary.contract.test.ts (MODIFY)
                  check-kernel-policy-wire-serializable.mts (CREATE); package.json (MODIFY)
                  b55-kernel-policy-wire-triad.md, pas-status-index.md (CREATE/MODIFY)
4. Prohibited   — metadata-ui, erp, permissions, foundation-disposition.registry.ts, schema migrations, npm deps
5. Authority    — PAS-001 §4.9 · kernel-authority · B15 frozen vocabulary
6. Gates        — pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/kernel test:run -- policy
                  pnpm check:kernel-policy-wire-serializable
                  pnpm check:kernel-package-structure
                  pnpm check:kernel-subpath-exports
7. Closes       — PAS-001 §4.9 policy wire triad hardening
8. Evidence     — triad tests pass; governance gate pass; B55 Delivered in pas-status-index
9. Attestation  — Afenda Governed Implementer — Enterprise 9.5+/10
```

---

## Drift prevention

| Rule | Result |
|------|--------|
| No B15 kind/reason rename | Pass |
| No parallel registry | Pass |
| No permissions evaluation in kernel | Pass |
| Strict wire keys on ingress | Pass |
| Backward-compatible `isPolicyDecision` | Pass |
