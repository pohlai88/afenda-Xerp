# Live Route Error Probe Hardening Technical Specification

## Overview

This slice adds route-level live error probing to the `apps/developer`
green-light path.

Audience: engineers maintaining the route lab.

Action enabled: fail the route-lab smoke suite when a registered route emits a
browser `pageerror` or `console.error` during live navigation.

## Problem

Afenda Next.js best practice requires App Router changes to be verified beyond
static filesystem checks. The preferred workflow is:

```text
nextjs_index -> get_routes -> get_errors
```

The current Codex tool surface does not expose the Next.js MCP route/error
tools in this session. The route lab still needs an executable approximation
inside its repo-owned green-light path so route errors cannot hide behind
successful file audits.

## Goals

- Preserve the Next.js best-practice intent of live route error verification.
- Keep the check registry-backed so every active route is covered.
- Fail on browser runtime errors during route navigation.
- Avoid adding runtime authority or test-only backend infrastructure.

## Non-Goals

- Do not claim this replaces a future Next.js MCP `get_errors` run when that
  tool is available.
- Do not add `apps/developer/src/app/api/**`.
- Do not activate `_actions` or `_queries`.
- Do not add middleware, auth, tenant context, database access, kernel imports,
  server imports, or ERP runtime imports.
- Do not introduce mock servers, fake BFFs, or service simulation.

## Constraints

- The probe must use the existing app-local Playwright smoke harness.
- The route set must remain derived from `route-surface-registry.ts`.
- The probe must assert only route health, not business behavior.
- Console and page errors are treated as route-quality regressions.

## Proposed Design

Add a Playwright smoke test that:

1. subscribes to `pageerror`
2. subscribes to `console` messages of type `error`
3. navigates each registered route
4. waits for the route-owned `h1`
5. asserts that no browser runtime errors were collected

## Interfaces / Dependencies

Primary files:

- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`
- `apps/developer/src/lib/lab/route-surface-registry.ts`

Verification entry point:

```powershell
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

## Risks and Mitigations

Risk: third-party or framework noise creates false positives.

Mitigation: the route lab currently has no third-party scripts or runtime API
surface. If a future false positive appears, it should be documented with a
narrow allowlist and an owner.

Risk: this is narrower than Next.js MCP `get_errors`.

Mitigation: the document keeps MCP verification as the preferred standard and
records this as repo-owned executable coverage when MCP tooling is unavailable.

## Rollout and Rollback

Rollout:

1. Add the Playwright route error probe.
2. Run the route-lab green-light command.
3. Record the completed slice in the route-lab audit and Slice 1 summary.

Rollback:

Rollback is not recommended. Removing this check would reduce live route
verification below the current route-lab best-practice bar.

## Status

Implemented.

