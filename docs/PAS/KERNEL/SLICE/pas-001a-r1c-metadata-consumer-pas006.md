# Slice PAS-001A-R1c — Metadata Consumer on PAS-006

> **Position:** Slice `R1c of R1d` in PAS-001A rebuild · Blueprint box: **ERP Integration Spine (IS-003)** + **PAS-006D consumer**

**Prerequisite:** PAS-001A-R1b Delivered · P06-008 Delivered · P06-008-R1 Delivered · P06-009 Delivered

**Recommended:** P06-008-R2 Delivered (DOM slot markers) before full block hydration phase

**Status:** Delivered (2026-06-29)

**Type:** Implementation

**Risk class:** High — metadata authorization bridge on PAS-006 skeleton

**Clean Core impact:** B→A — IS-003 live on ERP-local metadata runtime (replaces archived `@afenda/metadata-ui` bridge)

## Authority decision (kernel-authority)

R1c delivers **IS-003 Metadata Authorization Bridge** on the PAS-006 ERP skeleton.

| Layer | R1c role |
| --- | --- |
| `@afenda/kernel` | ERP validates `erpDomainModuleSlug` at projection boundary only (existing) |
| `@afenda/shadcn-studio` | Binding + template + slot inventory — **no kernel import** |
| `apps/erp` | Metadata runtime consumes **verified** `OperatingContext` from R1a/R1b spine (INV-004) |
| Enterprise Knowledge | Label atom refs — presentation cites; ERP does not invent meaning |

**INV-004:** Metadata authorization MUST consume ERP spine output — not local scope forks.

**Not API contract:** Metadata hydration is **server-side RSC + server actions** — not OpenAPI surface design. Internal preview actions may exist; R1c does not own `afenda-internal-v1.openapi.json` authority.

## Purpose

Rebuild IS-003 on PAS-006: metadata workspace routes resolve surfaces from `@afenda/shadcn-studio` registries, project binding wire through `metadata-ui-binding.projection.ts`, and (when P06-008-R2 is delivered) hydrate values into `data-afenda-slot` targets — without `@afenda/metadata-ui`.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r1c-metadata-consumer-pas006.md

1. Objective    — Prove metadata workspace consumes verified OperatingContext and hydrates PAS-006 binding/template contracts at ERP trust boundary.
2. Allowed layer— apps/erp/src/lib/metadata/** · apps/erp/src/app/(protected)/metadata-workspace/** · scripts/governance/** · docs/PAS/KERNEL/** · docs/PAS/PRESENTATION/** (status sync only)
3. Files        —
   apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts
   apps/erp/src/lib/metadata/resolve-metadata-ui-render-context.server.ts
   apps/erp/src/lib/metadata/resolve-metadata-workspace-surfaces.server.ts
   apps/erp/src/lib/metadata/hydrate-metadata-binding-slots.server.ts
   apps/erp/src/lib/metadata/metadata-workspace-preview.action.ts
   apps/erp/src/app/(protected)/metadata-workspace/page.tsx
   apps/erp/src/lib/metadata/__tests__/metadata-ui-binding.projection.test.ts
   apps/erp/src/lib/metadata/__tests__/metadata-workspace-hydration.integration.test.ts
   scripts/governance/check-erp-metadata-pas006-consumer.mts
   package.json
   docs/PAS/KERNEL/SLICE/pas-001a-r1c-metadata-consumer-pas006.md
4. Prohibited   — packages/kernel/src/** · @afenda/metadata-ui restore · metadata schema DB · permission evaluation in shadcn-studio · untrusted authority fields in metadata actions · foundation-disposition.registry.ts
5. Authority    — PAS-001A IS-003 · INV-004 · PAS-006D · P06-008-R1 · kernel-authority (ERP projection boundary)
6. Gates        —
   pnpm check:erp-metadata-pas006-consumer
   pnpm check:studio-metadata-binding
   pnpm --filter @afenda/erp test:run
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
7. Closes       — PAS-001A §6.1 row 9 · IS-003 on PAS-006 skeleton · B74 successor (ERP-local)
8. Evidence     —
   apps/erp/src/lib/metadata/hydrate-metadata-binding-slots.server.ts
   scripts/governance/check-erp-metadata-pas006-consumer.mts
   apps/erp/src/app/(protected)/metadata-workspace/page.tsx
9. Attestation  — Integration · Security · Test · Governance
```

## Two-phase delivery (recommended)

| Phase | Delivers | Depends on |
| --- | --- | --- |
| **R1c-1 Projection** | Spine → runtime context → binding projection wire on metadata-workspace | R1b |
| **R1c-2 Hydration** | Render PAS-006 blocks + map field values to `data-afenda-slot` | P06-008-R2 · **Delivered** |

R1c-1 may ship before R2 with JSON projection preview (current page pattern). R1c-2 requires DOM slot markers for enterprise metadata-driven UI target.

## Composition chain (target)

```text
resolveOperatingContext (R1a)
  → resolveMetadataUiRenderContextFromTenantContext
  → resolveMetadataWorkspaceSurfaces (studio templates + bindings)
  → projectMetadataUiBindingWire (kernel erp-domain catalog at boundary)
  → hydrateMetadataBindingSlots (R1c-2 — maps runtime → slot targets)
  → PAS-006 block components (presentation)
```

## PAS-001A-R1c MUST rules

1. Metadata routes MUST delegate to R1a spine — `resolveOperatingContextFromHeaders` or canonical `resolveOperatingContext` only.
2. Metadata server actions MUST reject untrusted tenant/company/org/actor authority fields (INV-004).
3. Binding fields MUST trace to `@afenda/shadcn-studio` registries — not hardcoded per-route field maps.
4. ERP domain module slugs MUST validate against `@afenda/kernel/erp-domain/catalog` at projection boundary only.
5. No parallel metadata scope resolver — spine output is sole authority input.
6. `@afenda/shadcn-studio` MUST NOT import `@afenda/kernel`.
7. Gate MUST fail when metadata-workspace bypasses protected surface registry (R1b).
8. Archived `check:metadata-context-authorization-bridge` is **not** resurrected — replaced by ERP-local gate.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Metadata consumer gate passes | `pnpm check:erp-metadata-pas006-consumer` |
| 2 | Binding projection tests pass | `metadata-ui-binding.projection.test.ts` |
| 3 | Workspace route uses spine + studio registries | `metadata-workspace-hydration.integration.test.ts` |
| 4 | Studio binding coverage still green | `pnpm check:studio-metadata-binding` |

## Out of scope

| Item | Owner |
| --- | --- |
| Operating-context spine implementation | R1a |
| Protected route shell | R1b |
| DOM slot markers in studio blocks | P06-008-R2 |
| §6 10/10 attestation | R1d |
| Knowledge atom persistence | PAS-004 |

## Related

- [B74](./b74-metadata-context-authorization-bridge.md) (historical — pre-reset) · [P06-008-R1](../../PRESENTATION/SLICE/p06-008-r1-metadata-binding-enforcement.md) · [P06-008-R2](../../PRESENTATION/SLICE/p06-008-r2-dom-slot-markers.md)
