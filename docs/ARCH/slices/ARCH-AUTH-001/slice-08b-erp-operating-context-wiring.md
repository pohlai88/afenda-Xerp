# ARCH-AUTH-001 Slice 8b — ERP operating context wiring (FR-A05.2)

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-08b-erp-operating-context-wiring.md
1. Objective    — Wire ERP resolveOperatingContext to auth session activeWorkspaceId; persist on context switch.
2. Allowed layer— apps/erp/src/lib/context/ · packages/auth/src/auth.workspace-session.ts
3. Files        — active-workspace-id.contract.ts · tenant-domain.server.ts · resolve-operating-context-from-headers.server.ts · context-switch.action.ts · auth.workspace-session.ts
4. Prohibited   — packages/ui; packages/auth schema/migration changes; @afenda/accounting
5. Authority    — FR-A05.2 · ADR-0011 · Kernel multi-tenancy (ERP resolver)
6. Gates        — erp typecheck · erp test:run · auth test:run · check:multi-tenancy-context-integration
7. Closes       — FR-A05.2 · AUTH_EVENT.workspaceContextSwitched on switch
8. Evidence     — context-switch.action.ts · auth.workspace-session.ts
9. Attestation  — TypeScript · Test · Integration registry
```
