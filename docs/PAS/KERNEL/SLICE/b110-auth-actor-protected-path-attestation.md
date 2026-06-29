# Slice B110 — Auth Actor Protected-Path Attestation (PAS-001 amendment)

> **Position:** Amendment slice 4 of 4 in PAS-001 · Blueprint box: `Kernel Vocabulary` + ERP consumer proof

**Prerequisite:** B109 Delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b110-auth-actor-protected-path-attestation.md

1. Objective    — Governed auth actor wire ingress on all ERP protected paths + consumer attestation gate + integration registry wiring.
2. Allowed layer— apps/erp/src/lib/auth/** · apps/erp/src/lib/context/** · apps/erp/src/lib/metadata/** · packages/auth/src/auth.actor-wire.ts · scripts/governance/check-erp-auth-actor-protected-path-attestation.mts · docs/PAS/KERNEL/SLICE/b110-auth-actor-protected-path-attestation.md · docs/BLUEPRINT/kernel-blueprint.md §6
3. Files        —
   apps/erp/src/lib/auth/resolve-protected-path-actor.server.ts
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/metadata/resolve-metadata-auth-actor.server.ts
   apps/erp/src/app/(protected)/layout.tsx
   apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx
   apps/erp/src/lib/system-admin/resolve-system-admin-operating-context.server.ts
   apps/erp/src/lib/user-settings/resolve-user-settings-context.server.ts
   apps/erp/src/lib/workspace/load-dashboard-widget-render-context.server.ts
   apps/erp/src/lib/auth/load-auth-workspace-select-page.server.ts
   apps/erp/src/lib/auth/security-review.action.ts
   apps/erp/src/app/api/internal/v1/auth/memberships/route.ts
   scripts/governance/check-erp-auth-actor-protected-path-attestation.mts
   package.json
4. Prohibited   — packages/kernel/src/** new vocabulary · foundation-disposition.registry.ts · permission evaluation in kernel
5. Authority    — PAS-001 §4.1.11 Actor and Integration Identity · Blueprint §6 · PAS-001A spine
6. Gates        —
   pnpm check:erp-auth-actor-protected-path-attestation
   pnpm check:erp-operating-context-spine
   pnpm --filter @afenda/kernel test:run
   pnpm --filter @afenda/erp test:run
7. Closes       — Actor/integration identity protected-path consumer attestation (Blueprint §6 planned → delivered)
8. Evidence     — apps/erp/src/lib/auth/__tests__/resolve-protected-path-actor.server.test.ts
9. Attestation  — Contract · Gate · Integration
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Canonical ERP protected-path actor resolver | pnpm check:erp-auth-actor-protected-path-attestation | PAS-001 §4.1.11 |
| 2 | No raw identity.userId actor ingress on protected paths | pnpm check:erp-auth-actor-protected-path-attestation | Blueprint §6 |
| 3 | AUTH_ACTOR_BRIDGE_WIRING registry entries | pnpm check:erp-operating-context-spine | PAS-001A spine |
| 4 | Metadata actor bridge uses governed ingress | pnpm check:erp-auth-actor-protected-path-attestation | PAS-001A metadata bridge |
