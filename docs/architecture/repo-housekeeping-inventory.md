# Repository Housekeeping Inventory

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-23 |
| **Baseline commit** | `3bf698b` |
| **Architecture fingerprint** | `ARCH-BASELINE-2026-06-23-v2` |
| **Trigger** | Pre-TIP-011 (outbox) governed housekeeping pass |
| **Authority** | ADR-0012, ADR-0013, TIP-000D/TIP-000E |

> **Purpose:** Evidence-based inventory of stale docs, superseded artifacts, uncommitted noise, and cleanup candidates. **No deletions** performed in this pass unless separately approved.

---

## Git baseline

| Item | Result |
| --- | --- |
| Branch | `main` (synced with `origin/main` at inventory start) |
| HEAD | `3bf698b` — TIP-000D documentation authority closeout |
| Uncommitted noise (start) | `token-diff-preview.html` whitespace-only — **reverted** |
| Post-inventory changes | Doc status sync + this inventory (see Completion Report) |

---

## Classification legend

| Status | Meaning |
| --- | --- |
| `keep-active` | Current authority or referenced by quality/docs |
| `keep-superseded` | Historical; retain with banner + index row |
| `safe-fix` | Small doc/link/status correction (applied this pass) |
| `safe-revert` | Unrelated uncommitted noise — reverted |
| `candidate-remove-later` | Appears unused; needs separate approval + gates |
| `do-not-touch` | Runtime, business, or architecture-sensitive |

---

## Housekeeping inventory

| Item | Classification | Evidence | Recommended action |
| --- | --- | --- | --- |
| `docs/delivery/tip-status-index.md` | `keep-active` | Canonical TIP status authority; drift guard enforced | Maintain after every TIP PR |
| `docs/delivery/tips/[Superseded] tip-010-observability-audit.md` | `keep-superseded` | Misnumbered; index row TIP-010† Superseded; banner present | **Done:** status → Superseded |
| `docs/delivery/tips/[Superseded] tip-012-execution-foundation.md` | `keep-superseded` | Misnumbered; index row TIP-011† Superseded | **Done:** status → Superseded |
| `docs/delivery/README.md` | `keep-active` | Routes agents to index + `tips/` layout | No change |
| `docs/delivery/tips/` | `keep-active` | TIP delivery docs with `[status]` filename prefix | Rename prefix when status changes |
| Master plan v5 | `keep-active` | `_afenda-erp-master-plan.llms.md` v5.0.0; drift guard forbids v4 markers as current | Do not rewrite; fix stale refs only |
| Master plan v4 Section 3 | `keep-superseded` | Referenced only as historical in ADR-0010, AGENTS.md warnings | Never cite as current truth |
| `ARCH-BASELINE-2026-06-20-v1` | `obsolete` | Only in `documentation-drift-registry.mts` as forbidden marker | Do not reintroduce in registries |
| `docs/tip/` directory | `do-not-touch` | Does not exist; ADR-0013 records intentional absence | Do not create parallel TIP tree |
| `docs/roadmap/` directory | `do-not-touch` | Replaced by `pre-accounting-foundation-roadmap.md` | Do not create |
| `tip-ui-01` / `tip-ui-02` "Complete" | `keep-active` | Matches tip-status-index **Implemented** + runtime matrix | No change — not stale |
| Phase 9 "Accounting Core may begin" | `keep-active` | `pre-accounting-foundation-roadmap.md` gate language (conditional) | Do not shorten; ADR-0010 |
| `.cursor/agents/documentation-drift.md` | `keep-active` | Committed in `3bf698b`; AGENTS.md pointer | Use after TIP/doc work |
| `.cursor/agents/ui-primitive-refactor.md` | `keep-active` | TIP-004 / ADR-0008 batch agent | Keep |
| `.cursor/skills/write-tip/` | `keep-active` | Committed in `3bf698b`; TIP authoring helper | Keep |
| `scripts/governance/check-documentation-drift.mts` | `keep-active` | `pnpm quality:documentation-drift` | Keep |
| `scripts/governance/check-downstream-integration.mts` | `candidate-remove-later` | In `package.json` as `check:downstream-integration` only — **not** in `pnpm quality` | Wire into quality or document as optional pre-UI gate |
| `scripts/governance/*.mjs` helpers | `keep-active` | Imported by ui-guard, csp checks, tests | Do not delete |
| `packages/design-system/.../token-diff-preview.html` | `safe-revert` | Whitespace-only diff vs HEAD | **Reverted** |
| Git loose objects warning | `candidate-remove-later` | `git gc` suggested loose objects on commit | Run `git prune` / `git gc` locally when convenient |
| `apps/docs` in runtime matrix | `keep-active` | Listed as docs app package | Verify separately if app is still maintained |
| Superseded delivery doc deletion | `do-not-touch` | ADR-0012 evidence retention | **Never delete** — banner + index only |

---

## Stale reference scan (2026-06-23)

| Pattern | Hits | Assessment |
| --- | --- | --- |
| `master plan v4` | ADR-0010, AGENTS.md, runtime matrix (historical) | **OK** — warning context only |
| `version: 4.0.0` | `documentation-drift-registry.mts` forbidden list | **OK** — guard enforcement |
| `ARCH-BASELINE-2026-06-20-v1` | Drift registry obsolete constant | **OK** — guard enforcement |
| `tip-010-observability-audit` as authority | delivery README (labeled misnumbered) | **OK** |
| `tip-012-execution-foundation` as authority | delivery README (labeled misnumbered) | **OK** |
| `Accounting Core may begin` | Phase 9 roadmap gate only | **OK** — conditional gate |

---

## Deletion candidates (list only — not deleted)

| Candidate | Why listed | Blocker to deletion |
| --- | --- | --- |
| `docs/delivery/tips/[Superseded] tip-010-observability-audit.md` | Misnumbered | ADR-0012 audit trail; superseded banner sufficient |
| `docs/delivery/tips/[Superseded] tip-012-execution-foundation.md` | Misnumbered | Same |
| `check:downstream-integration` script | Not in quality aggregator | May be intentional manual gate; has tests |
| Git loose objects | Performance | Requires user-approved maintenance window |

---

## Safe fixes applied (this pass)

1. Reverted `token-diff-preview.html` whitespace noise.
2. `tip-status-index.md` — TIP-001 remaining gap cleared (fingerprint bump complete).
3. Misnumbered evidence docs — status aligned to **Superseded**.
4. `afenda-runtime-truth-matrix.md` — post-TIP-000D rows refreshed (doc governance, CI gates, kernel context, metadata UI).

---

## Next implementation handoff (post-housekeeping)

| Field | Value |
| --- | --- |
| **Next TIP** | TIP-011 — execution foundation (outbox) |
| **Foundation phase** | Phase 1 — ERP operating spine / execution |
| **Blocking gate** | None for quality chain (`pnpm quality` passing) |
| **Agent** | `afenda-coding-session` (+ `documentation-drift` after implementation) |
| **First command** | Read `tip-011-execution-foundation.md` → narrow package gate for `@afenda/execution` / `@afenda/database` |

---

*Generated by governed repo housekeeping inventory — 2026-06-23*
