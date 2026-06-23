# TIP-007 — ERP Platform Authority

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Authority status** | Partial — platform entity map incomplete |
| **Runtime evidence** | Kernel context contracts, `@afenda/database` platform schemas, multi-tenancy slice |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Related delivery** | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) |

## Purpose

Define and freeze ERP operating platform entity ownership before domain packages exist. TIP-007 maps tenant, company, organization, user, membership, role, permission, policy, approval, and audit boundaries.

Database schemas exist in `@afenda/database`; this TIP freezes the **authority contract map**, not new business logic.

## Scope

**In scope**

- Platform authority contract map
- Entity ownership boundaries (who owns writes, reads, audit)
- Serializable contract types for cross-package boundaries
- Alignment with existing Drizzle schemas

**Out of scope**

- Business master data entities (TIP-008B)
- Enterprise hierarchy runtime (partial — see TIP-008A / tip-007-012)
- Business domain packages (TIP-013+)

## Runtime evidence (2026-06-23)

| Entity / concern | Evidence | Status |
| --- | --- | --- |
| Tenant, company, org, membership | `packages/database/src/schema/`, kernel context contracts | Implemented |
| Operating context resolver | `apps/erp/src/lib/context/`, tip-007-012 delivery doc | Partial |
| Platform authority map (single doc) | This TIP deliverables section | **Missing** |
| Serializable platform barrel | `packages/kernel/src/context/` | Partial |

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

## Deliverables (remaining)

Contracts map document + tests for:

- Tenant, Company, Organization, Workspace, User, Membership
- Role, Permission, Policy, Approval, Audit

Suggested location: `packages/kernel/src/contracts/platform/` with barrel export from `@afenda/kernel`.

## Acceptance gate

All platform entities have ownership and boundaries per ADR-0001.

## Verdict

**Partially Implemented** — schemas and multi-tenancy slice delivered; formal platform authority map and contract barrel remain open.
