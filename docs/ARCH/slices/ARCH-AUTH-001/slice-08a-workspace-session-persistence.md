# ARCH-AUTH-001 Slice 8a — Workspace session persistence (FR-A05.2.1)

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-08a-workspace-session-persistence.md
1. Objective    — Persist activeWorkspaceId on Better Auth session: Drizzle column + auth.config.ts + auth.server.ts passthrough.
2. Allowed layer— packages/database/src/ · packages/auth/src/
3. Files        — auth.schema.ts · 20260625041511_auth_session_active_workspace_id.sql · auth.config.ts · auth.server.ts · auth.server.test.ts · auth-schema.test.ts
4. Prohibited   — apps/erp resolveOperatingContext; hand-edited migration SQL
5. Authority    — FR-A05.2.1 · ADR-0011 · PKG003_DATABASE · PKG002_AUTH
6. Gates        — database typecheck · auth typecheck · quality:migrations · auth test:run · database test:run
7. Closes       — FR-A05.2.1
8. Evidence     — auth_session.active_workspace_id column · auth.config.ts additionalFields
9. Attestation  — Schema · Migration · Config · Test
```
