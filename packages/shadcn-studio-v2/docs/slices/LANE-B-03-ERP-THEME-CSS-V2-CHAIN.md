# Lane B-03 — ERP Theme And CSS V2 Chain

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: ERP + presentation engineers
- Authority: PAS-006A, `package-css-dist-sync` policy, Lane B index
- Action enabled: B-06 ERP shell cutover (consistent v2 tokens)

## Overview

`apps/erp` mounts `ErpPresentationProviders` from `@afenda/shadcn-studio-v2/clients` and
imports presentation CSS from v2 dist exports only. TSX surfaces remain on v1 until B-06–B-08.

## Problem

Split stack (v2 providers + v1 CSS/blocks) causes token drift and blocks v1 retirement.

## Goals

- Replace v1 `@import` chain in `apps/erp/src/app/globals.css` with v2 exports.
- Run `pnpm sync:package-css-dist` and `pnpm check:package-css-dist-sync`.
- Prove ERP build and visual smoke on default + brand theme.

## Non-goals

- Migrating TSX blocks (B-07, B-08).
- Shell layout swap (B-06).

## Constraints

- No raw hex in app CSS.
- Apps import from package **`dist/`** exports only.
- Keep correlation-id and auth routes unchanged.

## Proposed design

### Target CSS chain (implemented)

```css
@import "@afenda/shadcn-studio-v2/shadcn-default.css";
@import "@afenda/shadcn-studio-v2/themes/afenda-brand.css";
```

### Proof

- `lane-b-erp-css-v2-chain.test.ts` — v2-only imports, no v1 CSS paths
- `check:package-css-dist-sync` PASS
- `@afenda/erp build` PASS

## Interfaces / dependencies

- Upstream: B-01
- Downstream: B-06 (shell expects consistent tokens)

## Risks and mitigations

- Risk: v1 blocks render incorrectly until B-07/B-08.
  - Mitigation: acceptable transient dual TSX stack; CSS is v2-first.

## Rollout and rollback

1. ERP globals.css already on v2 chain (pre-slice).
2. Executable proof test + gates recorded here.
3. `MIGRATION-MAP.md` ERP CSS row updated.

Rollback: revert globals.css to prior v1 chain; providers may remain v2.

## Required gates

```bash
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio-v2
pnpm check:package-css-dist-sync
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
```

## Done definition

- [x] ERP globals.css v2-only imports
- [x] CSS dist sync gate PASS
- [x] ERP build PASS
- [x] Migration map ERP CSS note updated
- [x] `lane-b-erp-css-v2-chain.test.ts` committed

## commands Run

| command | Result |
| --- | --- |
| `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio-v2` | PASS |
| `pnpm check:package-css-dist-sync` | PASS |
| `pnpm --filter @afenda/erp typecheck` | PASS |
| `pnpm --filter @afenda/erp build` | PASS |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS (includes lane-b-erp-css-v2-chain) |

## Decision

**`PROCEED`** — B-06 authorized; ERP CSS chain is v2-only.
