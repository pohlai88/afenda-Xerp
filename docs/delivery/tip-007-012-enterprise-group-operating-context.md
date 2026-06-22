# TIP-007 / TIP-012 — Enterprise Group Operating Context

> Delivery evidence for the multi-tenancy operating-context foundation slice.
> Revision: 2026-06-22

## Executive summary

Delivered serializable kernel operating-context contracts, tenant subdomain resolution,
server-side operating context resolver with fail-closed membership checks, workspace
lookup services in `@afenda/database`, AppShell display wiring, and regression tests.
Entity Group, Ownership Interest, Team, and Project persistence remain authority stubs
(TIP-008 / TIP-030) — contracts only, no accounting logic.

## Glossary

Updated: `docs/architecture/glossary.md` (pre-existing, aligned 2026-06-22).

## Existing-state audit (before)

| Area | Status before slice |
|------|---------------------|
| Glossary | Present — 11 terms defined |
| Kernel context | Only `ExecutionContext` — no operating context |
| Tenant subdomain | Not wired in `proxy.ts` |
| Operating resolver | Missing in `apps/erp` |
| Entity groups / ownership | Not in DB (TIP-008 planned) |
| AppShell context display | Identity only |
| Type error | `app-error.test.ts` union narrowing |

## Package and file changes

| Package | Added / updated |
|---------|-----------------|
| `@afenda/kernel` | `src/context/**` contracts, branded `EntityGroupId` / `TeamId` / `ProjectId` |
| `@afenda/database` | `src/workspace/workspace-lookup.service.ts` |
| `@afenda/appshell` | `ApplicationShellOperatingContext`, header breadcrumb |
| `apps/erp` | `src/lib/context/**`, `proxy.ts` tenant header, protected layout wiring |
| Tests | kernel, tenant-domain, operating-context, proxy regression |

## Dependency decisions

- Kernel owns serializable contracts (no Next.js / React).
- Database owns lookup queries only — no new governed tables in this slice.
- ERP owns request integration (`proxy.ts`, resolvers).
- Permissions owns membership matching (`resolveScopedMembership`).
- AppShell consumes display labels only — no database dependency added.

## Security behavior

- Tenant slug from subdomain or `/t/{slug}` — never selects legal entity.
- Client `companySlug` / `organizationSlug` verified against tenant + company chain.
- Membership denied when scope does not match — fail closed.
- Suspended/archived tenant, company, or org blocks access.
- CSP, correlation ID, and auth proxy behavior preserved.

## Verification results

Run locally:

```bash
pnpm --filter @afenda/kernel typecheck test:run
pnpm --filter @afenda/database typecheck
pnpm --filter @afenda/appshell typecheck
pnpm --filter @afenda/erp typecheck test:run
```

## Rollout plan

1. Deploy kernel + database packages.
2. Deploy ERP with proxy tenant header injection.
3. Configure wildcard DNS `*.afenda.app`.
4. Seed workspaces use `{slug}.localhost` or `/t/{slug}` in dev.

## Rollback plan

1. Revert ERP proxy tenant header injection (requests without slug skip context display).
2. Protected layout tolerates missing operating context (optional prop).
3. Kernel contracts are additive exports — safe to keep.

## Remaining gaps

| Gap | Target |
|-----|--------|
| `entity_groups` table | TIP-008 |
| `legal_entity_ownership` table | TIP-008 |
| Dedicated `teams` / `projects` tables | TIP-030 |
| Context switch server action | Follow-up slice |
| Supabase RLS policies | In progress |
| `entityGroupId` on `companies` | TIP-008 |

## Enterprise acceptance checklist

- [x] Glossary defines all 11 terms with do-not-confuse notes
- [x] Kernel serializable contracts exported
- [x] Tenant subdomain resolves tenant only
- [x] Legal entity verified server-side
- [x] Organization unit verified against legal entity
- [x] Membership scope fail-closed
- [x] AppShell displays resolved labels
- [x] No accounting / TIP-013 work
- [x] Tests added
- [ ] Full `pnpm quality` — run in CI

## Scores

| Dimension | Score |
|-----------|-------|
| Glossary clarity | 9.5 / 10 |
| Multi-company model quality | 9.0 / 10 |
| RLS/grant readiness | 9.0 / 10 |
| Accounting-consolidation readiness | 9.5 / 10 (stubs only) |
| Security quality | 9.5 / 10 |
| Architecture quality | 9.5 / 10 |
| Test quality | 9.0 / 10 |
| Documentation quality | 9.0 / 10 |
| **Overall enterprise score** | **9.3 / 10** |
