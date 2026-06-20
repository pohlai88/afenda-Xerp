# TIP-007 — ERP Platform Authority

Status: **Pending**

## Purpose

Define and freeze ERP operating platform entity ownership before domain packages exist. TIP-007 maps tenant, company, organization, user, membership, role, permission, policy, approval, and audit boundaries.

Database schemas partially exist in `@afenda/database`; this TIP freezes the **authority contract map**, not new business logic.

## Scope

**In scope**

- Platform authority contract map
- Entity ownership boundaries (who owns writes, reads, audit)
- Serializable contract types for cross-package boundaries
- Alignment with existing Drizzle schemas

**Out of scope**

- Master data entities (TIP-008)
- Identity provider wiring (TIP-010)
- Business domain packages (TIP-013+)

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/kernel` (PKG-010) | Platform context contract types |
| `@afenda/database` (PKG-003) | Persistence (consumes authority; does not define it) |
| `@afenda/permissions` (PKG-014) | Authorization engine (consumes platform contracts) |

## Depends on

- TIP-001 Architecture Authority
- TIP-005 Metadata Authority (cross-package rules)

## Blocks

- TIP-008 Master Data Authority
- TIP-010 Identity & Authorization Foundation
- TIP-012 ERP Operating Spine

## Deliverables (planned)

Contracts for:

- Tenant
- Company
- Organization
- Workspace
- User
- Membership
- Role
- Permission
- Policy
- Approval
- Audit

Suggested location: `packages/kernel/src/contracts/platform/` with barrel export from `@afenda/kernel`.

## TypeScript requirements

- All public contract types must be JSON-serializable (no functions, classes, React nodes)
- Use `as const` object maps for permission/policy key registries
- Explicit interfaces for entity shapes; prefer discriminated unions for scope types

## Acceptance gate

All platform entities have ownership and boundaries per ADR-0001.

## Verdict

Not started — schemas exist; authority map missing.
