---
name: afenda-react-surface-quality
description: >-
  ERP React/TypeScript surface quality authority for PAS-006 presentation surfaces.
  Use when scanning, refactoring, reviewing, or repairing apps/erp TSX, shadcn-studio
  blocks, AI-generated React, operator pages, client islands, forms, dashboards,
  lists, charts, and interactive UI before merge. Routes ui primitives to
  afenda-primitive-contract. Composes vendor skills only on failure.
paths:
  - apps/erp/**
  - packages/shadcn-studio/src/components-layouts/**
---

# Afenda React Surface Quality

**Composer child of:** [`afenda-presentation-quality`](../afenda-presentation-quality/SKILL.md)

**Primitive route:** [`afenda-primitive-contract`](../afenda-primitive-contract/SKILL.md)

**Vendor index:** [reference/vendor-rule-index.md](reference/vendor-rule-index.md)

**P0 playbook:** [reference/p0-refactor-playbook.md](reference/p0-refactor-playbook.md)

**A11y checklist:** [reference/a11y-erp-checklist.md](reference/a11y-erp-checklist.md)

**Testing rules:** [reference/testing-afenda.md](reference/testing-afenda.md)

---

## 0. Operating principle

React surface refactor must use the **minimum correct effort** needed to remove merge blockers and reach the required quality bar.

Do not turn a simple cleanup into a full page rewrite.
Do not patch around P0 defects.
Do not move `"use client"` upward to make code easier.
Do not introduce client state mirrors for server truth.
Do not refactor primitives here — route them to `afenda-primitive-contract`.

The goal is not prettier TSX. The goal is **operator-safe, RSC-correct, test-proven presentation code**.

---

## 1. Route first

Before scanning, classify the target.

| Target | Route |
| --- | --- |
| `packages/shadcn-studio/src/components-ui/*` primitive | `afenda-primitive-contract` (+ M1–M10 mismatch frame on E0) |
| `packages/shadcn-studio/src/components-layouts/*` block | This skill |
| `apps/erp/**/page.tsx` | This skill, RSC-first scan |
| `apps/erp/**/layout.tsx` | This skill, strict client-boundary scan |
| `apps/erp/**/*.client.tsx` | This skill, interaction/hook scan |
| `apps/erp/**/*.server.ts` / loaders | This skill, A1/A6/B8 scan |
| Tests | This skill, T-tier scan |

If the file imports `@base-ui/react/*` inside `components-ui/*`, stop and route to primitive contract.

---

## 2. Effort ladder

| Level | Name | Use when | Output |
| --- | --- | --- | --- |
| **R0** | Scan only | User asks review/evaluate/advice | Report only |
| **R1** | Surgical fix | One or two isolated B/A/C/T failures | Minimal patch |
| **R2** | Surface cleanup | Multiple local issues, no architecture split | Local refactor + existing tests |
| **R3** | RSC/client split | A4/A5/B8 present, page or block too large | Server loader + presentational view + client island |
| **R4** | Operator hardening | Form, dialog, approval, destructive action, chart, dashboard | R3 if needed + a11y + interaction tests |

Default to **R0** for review.
Default to **R1/R2** for normal component cleanup.
Default to **R3** when client boundary, loader, or god-component issues exist.
Default to **R4** for operator-critical flows.

---

## 3. Scan order

Always scan in this order:

```text
Route → B → A → C → a11y → T → report
```

Use **N/A** when a check does not apply.

---

## 4. B-tier — block merge

These are critical. Do not merge until fixed.

| ID | Check | Failure signal | Correct fix |
| --- | --- | --- | --- |
| **B1** | Conditional hooks | Hook inside `if`, loop, callback, early return branch | Move hook to top level |
| **B2** | `key={index}` on reorderable lists | List can sort/filter/insert/delete | Use stable domain id |
| **B3** | Unjustified `any` | `any`, `as any`, broad escape cast | Domain type, generic, or `unknown` narrowing |
| **B4** | `use(promise)` misuse | Promise created in client render | Promise from RSC or stable external source |
| **B5** | State mutation | `.push`, direct object/array mutation before setState | Spread/map/filter or immutable helper |
| **B6** | Effect without cleanup | subscription, interval, listener, observer, async race | Return cleanup/dispose; handle stale result |
| **B7** | `useFormStatus` in wrong place | `useFormStatus()` in same component as `<form>` | Move to child submit button inside form |
| **B8** | Query/RSC mirrored into `useState` | `useState(serverX)` for canonical truth | Server truth as SSOT; local state for draft UI only |

---

## 5. A-tier — performance and architecture

### P0-A critical perf

| ID | Check | Failure signal | Correct fix |
| --- | --- | --- | --- |
| **A1** | Sequential independent `await` | Loaders await without dependency | `Promise.all` |
| **A2** | Static heavy imports | Charts/editors/modals in initial path unnecessarily | `next/dynamic` or route-level split |
| **A3** | Barrel hot path | Broad `@afenda/*` barrel on hot route | Direct import from narrow module |

### P1 high

| ID | Check | Failure signal | Correct fix |
| --- | --- | --- | --- |
| **A4** | God component | Page > ~300 lines or mixed loader/view/actions | Split loader, view, client island |
| **A5** | Client boundary too high | `"use client"` on route/page/layout for small child | Move client boundary to leaf |
| **A6** | Server module mutable state | Mutable singleton/cache in server module | Request-scoped data or safe cache |
| **A7** | Derived state in effect | `useEffect(() => setX(derive(props)))` | Derive in render; memo only when expensive |
| **A8** | Boolean prop explosion | Many flags: `isCompact`, `showX`, `dense` | Variant object or composition |
| **A9** | Inline components | Component defined inside render body | Module scope |
| **A10** | `forwardRef` | Unnecessary `forwardRef` in React 19 code | Ref as prop unless library requires |

---

## 6. C-tier — code hygiene

| ID | Check | Failure signal | Correct fix |
| --- | --- | --- | --- |
| **C1** | Utility too large | Helper > ~50 lines or mixed concerns | Split by purpose |
| **C2** | Deep nesting | Nested `if`/ternary hard to scan | Early return, extraction, guards |
| **C3** | Functional state update | Next state depends on previous | `setState(prev => next)` |
| **C4** | Prop drilling | Same prop through 3+ layers | Composition, context, colocated child |
| **C5** | Unjustified memo | `memo`/`useMemo`/`useCallback` without reason | Remove unless measured benefit |
| **C6** | Exhaustive deps disabled | `eslint-disable react-hooks/exhaustive-deps` | Fix dependency model or rare exception |

---

## 7. Operator a11y tier

For ERP operator surfaces, a11y is an acceptance condition, not polish.

| ID | Check | Required pattern |
| --- | --- | --- |
| **Y1** | Primary action role | Real `button` or `link` |
| **Y2** | Form labels | Visible label or `aria-label` |
| **Y3** | Errors announced | `role="alert"` or `aria-live="polite"` |
| **Y4** | Loading replacement announced | Announce meaningful skeleton/content change |
| **Y5** | Dialog behavior | Focus trap, Escape close, return focus |
| **Y6** | Data table headers | `<th scope="col">` |
| **Y7** | Chart wrapper | `<figure aria-label="...">`; decorative SVG `aria-hidden` |

Query priority: `getByRole` → `getByLabelText` → `getByText` — avoid `getByTestId`.

Detail: [reference/a11y-erp-checklist.md](reference/a11y-erp-checklist.md)

---

## 8. T-tier — test proof

| ID | When | Required action |
| --- | --- | --- |
| **T1** | Primitive contract edit | Route to primitive skill; update `*.contract.test.ts` |
| **T2** | Primitive interaction edit | Route to primitive skill; update `*.interaction.test.tsx` |
| **T3** | Block contract / metadata edit | Add or update block contract test |
| **T4** | Changed click/open/keyboard flow | Add or update `*.interaction.test.tsx` |
| **T5** | Forms / operator surfaces | Test through role/label queries first |
| **T6** | A11y contract added | Assert semantic wrapper, label, live region, table/chart contract |
| **T7** | Refactor only, no behavior change | Existing tests pass; no new test required |
| **T8** | Loader parallelization only | Test only if behavior/output changed |

Afenda rules: `@afenda/testing/react` `setupUser` — **no `fireEvent`**. Prefer `findByRole`.

Detail: [reference/testing-afenda.md](reference/testing-afenda.md)

---

## 9. RSC/client refactor playbook

Use when A4, A5, A1, or B8 appears.

```text
page.tsx
  ├── loadX.server.ts              // server fetch, auth, Promise.all
  ├── x-page-view.tsx              // presentational, no "use client"
  └── x-page-actions.client.tsx    // smallest interactive island
```

Rules:

1. `page.tsx` remains server by default.
2. Data loading stays server-side.
3. Independent loaders use `Promise.all`.
4. Client island only owns interaction state.
5. Do not mirror canonical server data into client state.
6. Keep operator actions role-addressable and testable.

Detail: [reference/p0-refactor-playbook.md](reference/p0-refactor-playbook.md)

---

## 10. Vendor composition

Only read vendor skill when a related check fails.

| Afenda ID | Vendor skill source |
| --- | --- |
| B1–B8 | `typescript-react-reviewer` |
| A1–A3, A7 | `react-best-practices` |
| A8–A10 | `vercel-composition-patterns` |
| A2 / bundle | `afenda-shadcn-performance` |
| C1–C6 | `AGENTS.md` + Biome |
| T1–T8 | `AGENTS.md` testing + `@afenda/testing/react` |

When vendor guidance conflicts with Afenda repo rules, **Afenda wins**.

Detail: [reference/vendor-rule-index.md](reference/vendor-rule-index.md)

---

## 11. Refactor workflow

When asked to repair or improve a surface:

1. Classify route/layer (§1).
2. Choose effort level R0–R4 (§2).
3. Scan B-tier first.
4. Fix B-tier before style or cleanup.
5. Scan A-tier.
6. Apply RSC/client split if needed.
7. Scan C-tier.
8. Apply operator a11y checks (Y-tier).
9. Decide T-tier test proof.
10. Run relevant gates (§13).
11. Output completion report (§12).

Do not patch unrelated files.
Do not change business behavior unless requested.
Do not create abstractions just to reduce line count.
Do not import from broad barrels in hot paths.
Do not add memoization without reason.

---

## 12. Completion report template

```markdown
## React surface quality report

**Target:** path/to/file.tsx
**Layer:** ERP page | layout | client island | server loader | shadcn-studio block | test
**Effort:** R0 | R1 | R2 | R3 | R4
**Decision:** Pass | Partial | Fail
**Merge status:** Clear | Blocked

| ID | Status | Finding | Action |
| --- | --- | --- | --- |
| B1 | ✅/❌/N/A | | |
| B2 | ✅/❌/N/A | | |
| ... | | | |
| Y1–Y7 | ✅/❌/N/A | | |
| T1–T8 | ✅/❌/N/A | | |

### Required actions

1. ...

### Test proof

- Existing tests:
- New/updated tests:
- Not required because:

### Gates

(paste command output)

### Final acceptance

Pass / Partial / Fail

Do not merge until:
- ...
```

---

## 13. Verification commands

For ERP app changes:

```bash
pnpm --filter @afenda/erp typecheck
pnpm lint
```

When interaction flow changes:

```bash
pnpm test:interaction
```

When shadcn-studio block changes:

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm lint
```

For primitive changes, stop and route to:

```bash
pnpm check:studio-primitive-contracts
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run -- src/components-ui
```

---

## 14. Hard stops

Stop and report instead of patching when:

1. Target is a `components-ui/*` primitive.
2. A B-tier issue exists but the requested change is cosmetic.
3. Fix requires changing business behavior.
4. Server truth is being moved into client state.
5. `"use client"` would need to move upward to make the patch work.
6. Interactive behavior changes but no T-tier proof is possible.
7. A11y would regress on an operator-critical surface.
8. The refactor would touch unrelated modules.
9. Hot path uses broad barrels and direct import is unknown.
10. Vendor rule conflicts with Afenda repo rules.

---

## 15. Completion definition

A React surface is merge-ready only when:

- B1–B8 are pass or N/A.
- A1–A3 are pass or N/A.
- P1/P2 findings are fixed or explicitly deferred.
- Operator a11y checks (Y1–Y7) are pass or N/A.
- Test proof matches the type of change (T1–T8).
- Relevant gates pass.
- Remaining risks are documented honestly.

A surface is **ERP operator-ready** only when it is role-addressable, keyboard-reachable, screen-reader explainable, and test-proven through user-level interactions.
