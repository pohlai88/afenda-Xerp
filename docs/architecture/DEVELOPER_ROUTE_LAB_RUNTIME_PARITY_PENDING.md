# Developer Route-Lab Runtime Parity Pending Technical Specification

- Status: Pending
- Date: 2026-07-05
- Audience: engineers maintaining `apps/developer`
- Source of truth: `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Overview

This specification converts selected `apps/developer` runtime-capability
exclusions into a governed pending track.

The change does not activate runtime authority by itself. It records that the
capabilities are now planned best-practice work that must be implemented through
explicit slices, tests, and governance updates before becoming active code.

## Problem

The route lab previously treated several valid Next.js and Vercel runtime
capabilities as doctrine exclusions. That posture protected the frontend-only
baseline, but it also made the route lab incomplete as a full Next.js
best-practice demonstration.

The requested target state is:

- remove those capabilities from permanent doctrine exclusion
- mark them as pending
- define the official implementation path before code activation

## Goals

- Reclassify Route Handlers / `app/api/**` as pending.
- Reclassify live Server Actions as pending.
- Reclassify `cacheComponents` or shared operator-route cache strategy as pending.
- Reclassify middleware / request-policy runtime surfaces as pending.
- Reclassify tenant/auth/OperatingContext/BFF runtime authority as pending.
- Preserve existing route-lab frontend law while pending runtime slices are not
  yet implemented.
- Keep pending work explicit, testable, and ordered.

## Non-goals

- Do not add live auth, tenant, database, kernel, server, or ERP imports in this
  status-change slice.
- Do not add ungoverned `app/api/**` handlers.
- Do not convert `.gitkeep` placeholders into service layers without an
  activated slice.
- Do not simulate ERP backend behavior through fake clients or mock services.
- Do not weaken thin `page.tsx`, RSC-first, route-local component, loading,
  error, image, or metadata best-practice gates.

## Constraints

- Pending is not Pass.
- Pending is not an authorization for ad hoc runtime code.
- Any slice that activates runtime authority must update the audit, governance
  checks, tests, and route ownership evidence in the same change.
- Runtime surfaces must remain isolated from route UI so page composition stays
  promotion-ready.

## Proposed Design

The pending runtime-parity track is split into five slices.

| Slice | Capability | Activation target | Required evidence before Pass |
|---|---|---|---|
| P1 | Route Handlers / `app/api/**` | A minimal governed internal lab API contract or health-style handler, if route-lab authority approves it | route handler file, cache/runtime config, smoke or integration proof, governance allowlist |
| P2 | Live Server Actions | One route-local action seam tied to a concrete UI mutation | `"use server"` action file, client/server boundary proof, no fake service layer, tests |
| P3 | Cache strategy | Explicit route-data cache policy where correctness allows it | documented cache boundary, no cross-operator leakage, build/runtime proof |
| P4 | Middleware / request policy | Minimal request-policy surface if route-lab routing requires it | middleware/proxy file, request tests, no tenant spoofing, no auth shortcut |
| P5 | Tenant/auth/OperatingContext/BFF authority | Demo-safe runtime authority model or ERP-backed promotion path | ADR/PAS authority, dependency approvals, security tests, audit update |

## Interfaces / Dependencies

Primary docs:

- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_GREENLIGHT.md`

Primary code gates:

- `apps/developer/scripts/check-route-lab-governance.mjs`
- `apps/developer/scripts/verify-greenlight.mjs`
- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`

Current pending placeholders:

- `apps/developer/src/app/(lab)/**/_actions/.gitkeep`
- `apps/developer/src/app/(lab)/**/_queries/.gitkeep`

## Rollout and Rollback

Rollout:

1. Reclassify the audit status from doctrine exclusion to pending.
2. Keep existing runtime guards until a slice is explicitly activated.
3. Implement one pending slice at a time.
4. Promote a slice from Pending to Pass only after code, tests, and governance
   evidence exist.

Rollback:

1. Revert a pending slice to Pending if implementation evidence fails.
2. Revert a pending slice to doctrine exclusion only through an explicit
   architecture decision, not through incidental audit cleanup.

## Open Questions

- Which pending slice should be activated first: Route Handlers or Server Actions?
- Should route-lab runtime authority remain demo-safe and local, or should it
  always point to ERP-owned runtime code?
- What minimum auth/tenant demonstration is acceptable without undermining
  ADR-0039?

## Current Status

Pending. No runtime authority is active from this document alone.
