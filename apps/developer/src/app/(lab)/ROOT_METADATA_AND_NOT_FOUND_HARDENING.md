# Root Metadata and Not-Found Hardening

## Status

This hardening slice is implemented.

## Objective

Harden the `@afenda/developer` root App Router document surface so it follows
the remaining applicable Next.js best practices for metadata file conventions
and unmatched-route handling.

## Why

The route lab already proves:

- thin async route boundaries
- route-local composition
- request-dynamic operator rendering
- route-owned loading and error boundaries
- `next/font` and `next/image` usage
- module-local `not-found.tsx`
- route acceptance and green-light verification

The remaining applicable App Router gaps are now root-level concerns:

- no explicit root `app/not-found.tsx`
- no root metadata files such as `favicon.ico`
- no route-lab OG-image metadata file layer

These are still frontend-only concerns. They improve Next.js completeness
without introducing auth, tenant runtime, database access, or BFF behavior.

## Allowed Scope

- `apps/developer/**`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `apps/developer/README.md` only if the verification surface changes

## Out of Scope

- `apps/erp/**`
- `apps/developer/src/app/api/**`
- auth
- tenant runtime
- database
- kernel imports
- mock backend infrastructure
- placeholder activation under `_actions`, `_queries`, or `modules/**`

## Constraints

- Do not introduce runtime authority.
- Keep the route-lab doctrine explicit in root fallback surfaces.
- Root `not-found.tsx` must remain server-safe unless Next.js requires a client
  leaf for a narrow reason.
- Metadata-file hardening must use App Router file conventions, not custom head
  injection.
- If OG-image or icon assets are added, keep them route-lab branded and
  frontend-only.

## Required Deliverables

- one explicit root `app/not-found.tsx` surface for unmatched URLs
- root metadata files for the route lab, at minimum `favicon.ico` or an
  equivalent approved app-icon file convention
- route-lab metadata-file posture documented in the audit
- updated best-practice status if these changes close the remaining audit gaps

## Verification

- `node apps/developer/scripts/verify-greenlight.mjs`
- `node scripts/governance/check-developer-route-lab-greenlight.mjs`
- route-level evidence that unmatched URLs resolve through the explicit root
  route-lab fallback surface

## Done Means

- `apps/developer/src/app/not-found.tsx` exists and expresses route-lab doctrine
  through a stable unmatched-route UI
- the app owns explicit root metadata-file conventions instead of relying only
  on the metadata object and generated defaults
- the audit no longer treats root unmatched-route handling or metadata-file
  conventions as open applicable gaps
- the route lab becomes more complete as a Next.js App Router proof surface,
  but not more powerful

## Completion Evidence

The implemented surface now exists in:

- `apps/developer/src/app/not-found.tsx`
- `apps/developer/src/app/icon.png`
- `apps/developer/src/app/apple-icon.png`
- `apps/developer/src/app/opengraph-image.png`
- `apps/developer/src/app/twitter-image.png`
- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`
- `apps/developer/scripts/check-route-lab-governance.mjs`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `apps/developer/src/app/(lab)/GREENLIGHT_AUTOMATION_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
