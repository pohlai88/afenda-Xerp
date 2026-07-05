# Legacy Topology Regression Guard Hardening

## Scope

This migration hardening slice preserves the completed route-lab topology by
making legacy route structure a governed failure condition.

Audience: engineers maintaining `apps/developer`.

Action enabled: prevent reintroduction of `apps/developer/src/app/legacy/**`
after the route lab has normalized to App Router route-local composition under
`apps/developer/src/app/(lab)/**`.

## Preconditions

- `apps/developer/src/app/legacy/**` is absent.
- Active route-lab surfaces live under `apps/developer/src/app/(lab)/**`.
- Active route UI is route-local under `_components/`.
- `apps/developer/scripts/check-route-lab-governance.mjs` is part of the
  route-lab green-light sequence.

## Compatibility / Breaking Changes

This slice does not change runtime behavior.

It intentionally changes governance behavior:

- any future `apps/developer/src/app/legacy/**` directory now fails the
  route-lab governance check
- legacy-style route UI must be moved into the correct route-local
  `app/(lab)/**/_components/` location before it can be accepted

## Migration Rule

Legacy topology is not a staging area.

```text
apps/developer/src/app/legacy/** is prohibited.
apps/developer/src/app/(lab)/** is the governed route-lab topology.
```

## Non-Goals

- This slice does not add `apps/developer/src/app/api/**`.
- This slice does not activate `_actions` or `_queries`.
- This slice does not introduce middleware, auth, tenant context, database
  access, kernel imports, server imports, or ERP runtime imports.
- This slice does not move route-specific UI into generic `src/components`.
- This slice does not change rendered output.

## Implementation

The route-lab governance script now checks for:

```text
apps/developer/src/app/legacy
```

If the path exists, governance fails with an explicit instruction to use
governed `app/(lab)` routes and route-local `_components`.

## Validation

Required validation:

```powershell
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

Expected result:

- Biome passes.
- Vitest passes.
- Next type generation passes.
- TypeScript passes.
- route-lab governance passes.
- Playwright smoke passes.
- Next build passes.

## Rollback

Rollback is allowed only if a new ADR/PAS decision explicitly authorizes legacy
route topology again.

Without that decision, rollback would weaken the route-lab law and should be
rejected.

## Status

Implemented.

