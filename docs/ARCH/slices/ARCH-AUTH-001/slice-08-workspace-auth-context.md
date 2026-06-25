# ARCH-AUTH-001 Slice 8 — Workspace auth context (contract)

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-08-workspace-auth-context.md
1. Objective    — FR-A05.1: additive activeWorkspaceId in session metadata; serializable normalizer.
2. Allowed layer— packages/auth/src/
3. Files        — auth.contract.ts · auth.session.ts · __tests__/auth.session.test.ts · auth.types.test.ts
4. Prohibited   — @afenda/permissions contract changes; auth.config.ts persistence (→ 8a)
5. Authority    — FR-A05 · ADR-0011
6. Gates        — auth typecheck · auth test:run · check:multi-tenancy-context-integration
7. Closes       — FR-A05.1 · FR-A05.4 · AUTH_EVENT.workspaceContextSwitched vocabulary
8. Evidence     — auth.session.ts · auth.session.test.ts
9. Attestation  — Contract (serializable) · Test
```
