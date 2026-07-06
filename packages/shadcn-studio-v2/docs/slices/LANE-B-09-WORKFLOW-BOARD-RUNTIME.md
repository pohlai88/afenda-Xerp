# Lane B-09 — Workflow Board Runtime

## Document status

- Status: **Complete** (2026-07-06 — ADR-0042 ERP frame pilot)
- Audience: ERP engineers
- Authority: **ADR-0042**, `PHASE-7B-WORKFLOW-VIEWS.md`, `workflow-board-host-mapping.ts`
- Action enabled: B-10 manifest kind promotion (after pilot review)

## Overview

Implemented `WorkspaceBoardWidgetFrame` and `WorkspaceBoardCanvasClient` in ERP with
drag/resize behavior per [ADR-0042](../../../../docs/adr/ADR-0042-workspaceboard-drag-resize-runtime.md).
V2 supplies widget adapters and manifest layout hints only.

## Problem

Phase 7B completed V2 workflow views but deferred ERP board interaction.
Metadata workspace expects draggable widget boards.

## Goals

- [x] Implement frame per [ADR-0042](../../../../docs/adr/ADR-0042-workspaceboard-drag-resize-runtime.md) (`react-grid-layout`, ERP paths).
- [x] Wire manifest defaults from `@afenda/shadcn-studio-v2/metadata`.
- [x] Tests: frame interaction + assert no drag attrs in V2 adapter source.

## Non-goals

- Adding drag to V2 package adapters.
- Promoting manifest kinds (B-10).

## Constraints

- Frame lives in ERP (or ADR-approved consumer package).
- Reuse A-09 category mapping until B-10.

## Proposed design

### Components (delivered)

```txt
apps/erp/src/components/workspace/
  workspace-board-canvas.client.tsx       # WorkspaceBoardCanvasClient (RGL host)
  workspace-board-widget-frame.client.tsx # WorkspaceBoardWidgetFrame chrome
apps/erp/src/app/(protected)/workspace/_components/
  workspace-dashboard-board.client.tsx    # edit-mode orchestration
apps/erp/src/app/(protected)/metadata-workspace/_components/
  metadata-workspace-board-preview.client.tsx
```

### Proof

- ERP interaction test: `workspace-board-canvas.interaction.test.tsx`
- V2 boundary test: `lane-b-09-workflow-board-runtime.test.ts` + `lane-b-board-frame-boundary.test.ts`

## Interfaces / dependencies

- Upstream: B-02 ADR **Accepted**, B-08 metadata workspace
- Downstream: B-10

## Risks and mitigations

- Risk: accessibility regression on drag.
  - Mitigation: named drag handles, `aria-grabbed`, keyboard toggle on handle, focus rings, `prefers-reduced-motion` disables RGL transitions.

## Rollout and rollback

1. Land frame behind edit-mode toggle on workspace route.
2. Enable preview on metadata workspace.
3. Record ERP board row → `pilot-proven`.

Rollback: disable edit mode; read-only RGL render remains layout-equivalent.

## Required gates

```bash
pnpm --filter @afenda/erp test:run -- workspace board dashboard
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-09-workflow-board
```

## Gate evidence (2026-07-06)

| Gate | Result |
| --- | --- |
| `pnpm --filter @afenda/erp test:run -- workspace board dashboard` | PASS (see Completion Report) |
| `pnpm --filter @afenda/erp typecheck` | PASS |
| `pnpm --filter @afenda/erp build` | PASS |
| `pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-09-workflow-board` | PASS |

## Done definition

- [x] B-02 ADR cited in implementation
- [x] Board frame operational on metadata workspace
- [x] V2 adapters remain drag-free
- [x] Interaction tests PASS

## Decision

**COMPLETE** — ERP WorkspaceBoard frame pilot per ADR-0042. B-10 may proceed after review.
