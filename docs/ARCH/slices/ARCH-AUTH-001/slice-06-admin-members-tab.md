# ARCH-AUTH-001 Slice 6 — Admin Members tab

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-06-admin-members-tab.md
1. Objective    — Promote account-settings-05; invite/resend/revoke; DB member reads; mirror on accept.
2. Allowed layer— packages/appshell · apps/erp · packages/database/membership · packages/auth/invitation
3. Files        — app-shell-account-settings-05.* · members/page.tsx · invite-company-user.server.ts · list-company-members.server.ts · membership.service.ts
4. Prohibited   — packages/ui primitives; shadcn auth entry pages; @afenda/accounting
5. Authority    — FR-A04 · ADR-0017
6. Gates        — appshell check:governance · erp typecheck · ui:guard:scan
7. Closes       — FR-A04.1 · FR-A04.4
8. Evidence     — app-shell-account-settings-05.* · list-company-members.server.ts
9. Attestation  — Documentation · Test · Security
```
