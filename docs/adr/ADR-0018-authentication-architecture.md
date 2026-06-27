# ADR-0018 — Authentication Architecture (Withdrawn)

| Field | Value |
|-------|-------|
| **Status** | **Withdrawn** — superseded by ARCH-AUTH-001 |
| **Date** | 2026-06-25 |
| **Owner** | Architecture Authority |
| **Superseded by** | [`docs/PAS/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md`](../ARCH/%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |

---

## Decision

This ADR is **withdrawn**. Authentication architecture authority lives in **ARCH-AUTH-001**, not in the ADR series.

Use [`ARCH-AUTH-001`](../ARCH/%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) for:

- Canonical `users.id` vs Better Auth mirror model
- System-admin auth policy surfaces (Members, Security)
- MFA tenant policy + Phase 4 workspace context
- Audit trail obligations (ISO 27001 / NIST / COBIT mapping)

Use [`.cursor/skills/better-auth-erp/SKILL.md`](../../.cursor/skills/better-auth-erp/SKILL.md) for Better Auth plugin mechanics — do not duplicate in architecture docs.
