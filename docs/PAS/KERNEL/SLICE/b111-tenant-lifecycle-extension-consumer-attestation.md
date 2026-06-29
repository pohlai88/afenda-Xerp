# Slice B111 — Tenant Lifecycle & Extension Boundary Consumer Attestation (PAS-001 amendment)

> **Position:** Amendment slice 5 of 5 in PAS-001 · Blueprint box: `Kernel Vocabulary` + ERP consumer proof

**Prerequisite:** B110 Delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b111-tenant-lifecycle-extension-consumer-attestation.md

1. Objective    — ERP consumer attestation for B107 tenant SaaS lifecycle wire and B108 tenant extension boundary wire; metadata runtime carrier.
2. Allowed layer— apps/erp/src/lib/context/** · apps/erp/src/lib/metadata/** · packages/ui-composition/src/runtime.contract.ts · scripts/governance/check-erp-tenant-lifecycle-extension-consumer-attestation.mts · docs/PAS/KERNEL/SLICE/b111-tenant-lifecycle-extension-consumer-attestation.md
3. Files        —
   apps/erp/src/lib/context/map-tenant-saas-lifecycle-phase.ts
   apps/erp/src/lib/context/operating-context.mappers.ts
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/metadata/resolve-metadata-tenant-extension-boundary.server.ts
   apps/erp/src/lib/metadata/resolve-metadata-ui-render-context.server.ts
   packages/ui-composition/src/runtime.contract.ts
   scripts/governance/check-erp-tenant-lifecycle-extension-consumer-attestation.mts
   package.json
4. Prohibited   — packages/kernel/src/** new vocabulary · foundation-disposition.registry.ts · DB schema changes for provisioned status
5. Authority    — PAS-001 §4 tenant context · Kernel NS §8.3 · B107/B108 wire · Blueprint §6 · PAS-001A metadata bridge
6. Gates        —
   pnpm check:erp-tenant-lifecycle-extension-consumer-attestation
   pnpm check:erp-operating-context-spine
   pnpm check:kernel-context-wire-triad
   pnpm --filter @afenda/kernel test:run
   pnpm --filter @afenda/ui-composition test:run
   pnpm --filter @afenda/erp test:run -- map-tenant-saas-lifecycle-phase resolve-metadata-tenant-extension-boundary operating-context.mappers
7. Closes       — Tenant lifecycle/extension ERP consumer attestation (Blueprint §6 planned → delivered)
8. Evidence     —
   apps/erp/src/lib/context/__tests__/map-tenant-saas-lifecycle-phase.test.ts
   apps/erp/src/lib/metadata/__tests__/resolve-metadata-tenant-extension-boundary.server.test.ts
   apps/erp/src/lib/context/__tests__/operating-context.mappers.test.ts
9. Attestation  — Contract · Gate · Integration
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | DB tenant status maps to kernel SaaS lifecycle phase | pnpm check:erp-tenant-lifecycle-extension-consumer-attestation | PAS-001 B107 |
| 2 | Metadata extension ingress uses kernel brand guard | pnpm check:erp-tenant-lifecycle-extension-consumer-attestation | PAS-001 B108 |
| 3 | TENANT_LIFECYCLE_BRIDGE_WIRING registry entries | pnpm check:erp-operating-context-spine | PAS-001A spine |
| 4 | Metadata runtime carries tenantSaasLifecyclePhase | pnpm check:erp-tenant-lifecycle-extension-consumer-attestation | PAS-001A metadata bridge |

## Risk mitigations

| Risk | Mitigation |
| --- | --- |
| Status→lifecycle mapping drift | Exhaustive switch; `archived`→`offboarded` documented in mapper |
| `provisioned` not in DB enum | Omitted until explicit column/signal; active tenants map to `active` |
| Extension guard too narrow | `assertTenantExtensionFieldKeyDoesNotForkKernelBrand` at metadata ingress |
