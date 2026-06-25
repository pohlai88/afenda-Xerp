# ARCH-AUTH-001 Slice 2 — Canonical→mirror sync

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-02-canonical-mirror-sync.md
1. Objective    — FR-A02: platform users.id → Better Auth auth_user + identity link, idempotent, swallowed-audit failure path.
2. Allowed layer— packages/auth/src/
3. Files        — packages/auth/src/auth.mirror-sync.ts · auth.contract.ts · auth.hooks.ts · __tests__/auth.mirror-sync.test.ts
4. Prohibited   — @afenda/accounting; apps/erp; packages/appshell; packages/ui
5. Authority    — FR-A02 · PKG002_AUTH
6. Gates        — pnpm --filter @afenda/auth typecheck · test:run · check:documentation-drift
7. Closes       — FR-A02.1–FR-A02.4
8. Evidence     — auth.mirror-sync.ts · auth.mirror-sync.test.ts
9. Attestation  — Contract · Test · Security · Observability
```
