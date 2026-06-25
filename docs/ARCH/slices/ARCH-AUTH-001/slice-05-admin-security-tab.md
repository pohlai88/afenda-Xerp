# ARCH-AUTH-001 Slice 5 — Admin Security tab

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-05-admin-security-tab.md
1. Objective    — Promote account-settings-06; MFA policy toggle; session management; zero className on @afenda/ui.
2. Allowed layer— packages/appshell/.../blocks/ · apps/erp/.../settings/security/
3. Files        — app-shell-account-settings-06.* · security/page.tsx · system-admin-security-settings-panel.tsx · resolve/update security actions
4. Prohibited   — packages/ui primitives; login/register blocks; @afenda/accounting
5. Authority    — FR-A03.4 · ADR-0017
6. Gates        — appshell check:governance · erp typecheck · ui:guard:scan · ui:guard:proof
7. Closes       — FR-A03.4 · AC-09
8. Evidence     — app-shell-account-settings-06.* · security/page.tsx
9. Attestation  — TIP-004 · Maintainability
```
