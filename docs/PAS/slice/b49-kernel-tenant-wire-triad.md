# Slice B49 — Kernel Tenant Wire Triad (PAS-001 §4.4)

**Prerequisite:** PAS-001 §4.4 wire ingress triad pattern · ADR-0022 split-ID persistence · B16 operating-context baseline

**Status:** Delivered — 2026-06-28

**Type:** Evidence-sync (implementation already delivered; this slice closes documentation + consumer typing collateral)

**Risk class:** Low — doc-only + enterprise-knowledge projection typing; no kernel runtime mutation

**Clean Core impact:** A→A — documents existing tenant wire triad; typed consumer projections only

## Purpose

Close PAS-001 §4.4 tenant operating-context wire ingress to **10/10** enterprise acceptance:

1. **Registry promotion** — `tenant-context` triad registered in `context-registry.ts` with `wireIngress: true` and triad file mapping.
2. **Wire triad** — `tenant-context.{contract,assert,parser}.ts` implements branded `TenantContext` from `TenantWireContext`.
3. **ADR-0022 ERP split-ID** — ERP mappers brand database `enterpriseId` as kernel `TenantId` at the trust boundary (`operating-context.mappers.ts`).
4. **Database lookup** — `TenantLookupRow.enterpriseId` is the canonical wire ingress id for tenant resolution (`workspace-lookup.service.ts`).

Collateral: PAS-004C consumer projection overloads fix TS4111 across ERP and metadata-ui stacks without changing projection output shape.

## Handoff block

```
Handoff from: docs/PAS/slice/b49-kernel-tenant-wire-triad.md

1. Objective    — Document delivered PAS-001 §4.4 tenant wire triad; sync PAS-001 status headers; add typed consumer projection interfaces + overloads at enterprise-knowledge source; verify tenant triad + metadata-ui integration gates green.
2. Allowed layer— docs/PAS/** · packages/enterprise-knowledge/src/projection/** · packages/enterprise-knowledge/src/index.ts · packages/enterprise-knowledge/src/__tests__/** · apps/erp/src/server/api/contracts/openapi/build-afenda-openapi-document.ts (meta example TS4111 only)
3. Files        —
   docs/PAS/slice/b49-kernel-tenant-wire-triad.md
   docs/PAS/pas-status-index.md
   docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md (header + slice closure row)
   .cursor/skills/kernel-authority/SKILL.md (header mirror)
   packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts
   packages/enterprise-knowledge/src/index.ts
   apps/erp/src/server/api/contracts/openapi/build-afenda-openapi-document.ts
4. Prohibited   — foundation-disposition.registry.ts · packages/kernel/src/** runtime edits (triad already delivered) · packages/ui · packages/shadcn-studio · broad refactors unrelated to TS4111
5. Authority    — PAS-001 §4.4 wire triad · ADR-0021/0022 · PAS-004C consumer projection typing · kernel-authority header sync rule
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm --filter @afenda/ui-composition typecheck
   pnpm --filter @afenda/metadata-ui typecheck
   pnpm --filter @afenda/erp typecheck
   pnpm check:kernel-context-surface
   pnpm --filter @afenda/kernel test:run
   pnpm --filter @afenda/erp test:run -- operating-context / resolve-legal-entity-context
7. Closes       — PAS-001 tenant wire triad documentation closure; TS4111 collateral for knowledge consumer projections
8. Evidence     —
   packages/kernel/src/context/tenant-context.{contract,assert,parser}.ts
   packages/kernel/src/context/context-registry.ts (tenant wireIngress: true)
   apps/erp/src/lib/context/operating-context.mappers.ts (parseUnknownTenantContext + enterpriseId)
   packages/database/src/workspace/workspace-lookup.service.ts (TenantLookupRow.enterpriseId)
   packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts (typed overloads)
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Tenant wire ingress uses the **contract / assert / parser** triad — no branded ids on untrusted wire without `parse*`.
2. ERP maps `TenantLookupRow.enterpriseId` → `tenantId` wire field → `parseUnknownTenantContext` → branded `TenantContext`.
3. Kernel owns shape; ERP owns resolver; database owns persistence — PAS §4.4 ownership split unchanged.
4. Consumer projections return JSON-serializable typed facets — overloads must not change runtime output shape.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | B49 slice doc + PAS-001 / pas-status-index / kernel-authority header sync | file read |
| 2 | Typed `projectKnowledgeAtom` overloads per consumer profile | typecheck consumers |
| 3 | Tenant triad gates remain green | `check:kernel-context-surface`, kernel + ERP context tests |
| 4 | No projection behavior change | enterprise-knowledge tests |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Tenant wire triad (contract/assert/parser) | Yes — pre-B49 runtime | `packages/kernel/src/context/tenant-context.*.ts` |
| Context registry wireIngress | Yes | `packages/kernel/src/context/context-registry.ts` |
| ERP enterpriseId → TenantId branding | Yes | `apps/erp/src/lib/context/operating-context.mappers.ts` |
| Database tenant lookup enterpriseId | Yes | `packages/database/src/workspace/workspace-lookup.service.ts` |
| Typed consumer projections | Yes — B49 | `packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts` |

## Ingress flow (tenant)

```text
database tenants.enterprise_id (ten_…)
  → TenantLookupRow.enterpriseId
  → operating-context.mappers toTenantContext
  → parseUnknownTenantContext({ tenantId: enterpriseId, … })
  → assertWireTenantContext (structural)
  → parseTenantId at trust boundary
  → branded TenantContext.tenantId (TenantId)
```

## ADR references

| ADR | Role |
| --- | --- |
| ADR-0021 | Identity constitution — branded TenantId family |
| ADR-0022 | Split-ID persistence — enterpriseId column vs uuid PK |

## Related slices

| Slice | Relationship |
| --- | --- |
| B14 | Localization wire triad reference implementation |
| B15-4.3 | Execution / operating context baseline |
| B47/B48 | Consumer projection adoption (metadata/docs) — B49 fixes TS4111 at projection source |
