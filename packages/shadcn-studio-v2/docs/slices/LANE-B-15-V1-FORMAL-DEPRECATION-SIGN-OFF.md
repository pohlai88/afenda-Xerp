# Lane B-15 — V1 Formal Deprecation Sign-Off

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Tech lead / architecture authority
- Authority: ADR-0027, ADR-0040, foundation disposition, Lane B index
- Action enabled: v1 formally deprecated; filesystem removal authorized (housekeeping PR)

## Overview

Final acceptance gate for Lane B. When **`PROCEED`**, `@afenda/shadcn-studio` is
**formally deprecated** — disposition `archive-lane`, ADR chain amended, filesystem removal
authorized in a follow-up housekeeping slice (not necessarily same PR).

## Problem

"Migration complete" without formal deprecation leaves ADR-0027, PAS-006A, and registry
naming v1 as active presentation owner — inviting new v1 work.

## Goals

- Re-run full consumer + package gate matrix.
- Amend ADR-0027 (or superseding ADR) to name `@afenda/shadcn-studio-v2` as sole chain.
- Registry: `@afenda/shadcn-studio` → **`retired`** via foundation-registry-owner.
- Publish remaining gaps (if any) with explicit waivers.
- Add `lane-b-sign-off.test.ts` enforcing decision in docs.

## Non-goals

- Accounting core, kernel, or non-presentation packages.
- Mandatory same-day filesystem delete (may be separate housekeeping PR).

## Constraints

- Reject sign-off if any consumer v1 import remains (B-13 gate).
- Reject if B-14 sync test fails.
- Registry mutation only through `@foundation-registry-owner`.

## Proposed design

### Sign-off output

```md
## Lane B sign-off (YYYY-MM-DD)
- Consumer v1 imports: 0
- ERP build: pass/fail
- Developer build + verify:v2-proof: pass/fail
- Storybook: pass/fail or waiver id
- ADR amendment: ADR-00XX Accepted
- Registry: @afenda/shadcn-studio → retired
- Remaining gaps: ...
- Decision: PROCEED | HOLD | REJECT
```

### ADR amendment (minimum)

Update presentation chain:

```txt
MCP / shadcn CLI → @afenda/shadcn-studio-v2 → apps/erp
```

Retire v1 install cwd guidance; point MCP quarantine to v2 promotion pipeline.

### Post-deprecation housekeeping (follow-up)

| Task | Owner |
| --- | --- |
| Remove `packages/shadcn-studio` from workspace | monorepo housekeeping |
| Update PAS-006A product standard to v2 package name | documentation-drift |
| Archive v1 docs under `_retired/` | documentation-drift |
| Update AGENTS.md / skills shadcn-studio paths | cursor skills |

## Interfaces / dependencies

- Requires B-14 complete.
- Requires B-13 retirement-candidate → retired promotion.

## Risks and mitigations

- Risk: premature deletion breaks historical Storybook references.
  - Mitigation: archive tag + git history; delete only after PROCEED.

## Rollout and rollback

1. Run gates; record matrix in this file.
2. Merge ADR amendment.
3. Registry owner sets `retired`.
4. Update `MIGRATION-MAP.md`: v1 package row **`retired`**, Lane B program **Complete**.

Rollback: decision **HOLD** — keep v1 package in repo as retirement-candidate;
revert ADR to draft.

## Required gates

Full matrix from B-14 plus:

```bash
pnpm check:foundation-disposition
pnpm check:documentation-drift  # advisory
```

## Done definition

- [x] All gates PASS or waivers documented
- [x] ADR amendment Accepted
- [x] Registry `@afenda/shadcn-studio` → `retired` (`archive-lane`)
- [x] `lane-b-sign-off.test.ts` PASS
- [x] `MIGRATION-MAP.md` Lane B complete
- [x] Decision recorded: **PROCEED**

## Formal deprecation definition

v1 is **formally deprecated** when all are true:

1. No workspace consumer imports `@afenda/shadcn-studio`.
2. ADR presentation chain names v2 only.
3. Foundation disposition status is **`retired`** (`archive-lane`).
4. B-15 decision is **`PROCEED`**.

Filesystem deletion is **authorized** after (4) but may land in a separate PR.

## Lane B sign-off (2026-07-06)

- Consumer v1 imports: **0**
- ERP build: **pass**
- Developer build + verify:v2-proof: **pass**
- Storybook typecheck: **pass**
- ADR amendment: **ADR-0040 Accepted** (ADR-0027 presentation chain amended)
- Registry: `@afenda/shadcn-studio` → **`archive-lane` (retired)**; `@afenda/shadcn-studio-v2` → **`green-lane`**
- Remaining gaps: v1 filesystem removal (housekeeping PR); PAS-006A doc sync (documentation-drift)
- Decision: **PROCEED**

### Gate matrix

| Gate | Result |
| --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-sign-off lane-b-synchronization lane-b-v1-import` | PASS |
| `pnpm --filter @afenda/shadcn-studio-v2 check:v1-consumer-imports` | PASS |
| `pnpm check:foundation-disposition` | PASS |
| `pnpm --filter @afenda/developer verify:v2-proof && pnpm --filter @afenda/developer build` | PASS |
| `pnpm --filter @afenda/erp build` | PASS |
| `pnpm --filter @afenda/storybook typecheck` | PASS |

## Decision

**PROCEED** — Lane B program **Complete**. v1 formally deprecated; v2 is sole ERP presentation chain per ADR-0040.
