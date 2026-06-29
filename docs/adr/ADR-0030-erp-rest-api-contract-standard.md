# ADR-0030 — ERP REST API Contract Standard

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · Platform API Contract domain (REST binding — ADR-0030) |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda exposes ERP capability primarily through HTTP. Without a constitutional contract layer, teams ship ad-hoc route shapes, hand-edit OpenAPI artifacts, and discover scope and actor policies only from handler source — causing silent drift, integration breakage, and audit gaps.

Evidence as of 2026-06-30:

| Artifact | Role |
| --- | --- |
| [ADR-0010](ADR-0010-no-accounting-before-foundation-gate.md) gate 5 | Foundation requires API contract governance before Accounting Core |
| [ADR-0020](ADR-0020-master-data-authority-consolidation.md) | `apps/erp` owns HTTP wiring for internal v1 REST |
| [Platform API Contract North Star](../NORTHSTAR/api-contract-north-star.md) | Cross-style business architecture; REST is current binding |
| [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) | Permanent API family invariants |
| [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) | Active REST/OpenAPI binding standard |
| Contract registry + OpenAPI generator under `apps/erp/src/server/api/contracts/**` | Runtime scaffold (partial — full handler runtime in PAS-001A R3) |

Related: ADR-0026 (documentation hierarchy) · [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) IS-002 operating-context assembly · RFC 9457 Problem Details · OpenAPI 3.1.

## Scope note (2026-06-30)

This ADR constitutionalizes the **REST / OpenAPI binding** for ERP internal v1 exposure. It does **not** define the full Platform API Contract family — RPC, GraphQL, event, and agent bindings are governed separately under [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) when activated.

---

### 1. Registry-first HTTP operation contracts

Every governed HTTP operation on ERP internal exposure must be declared in a single **operation contract registry** before it may serve production traffic. The registry is the sole authoring surface for operation identity, policies, and schema references.

### 2. Schema-first request and response contracts

Request and response shapes are declared before handler wiring. Runtime validation and OpenAPI publication derive from the same schema source — never from parallel hand-maintained DTO and specification edits.

### 3. Generated OpenAPI publication only

OpenAPI 3.1 publication artifacts are **generated output**. Hand-editing checked-in publication JSON is prohibited. Drift between registry, handlers, and publication must be attested in CI.

### 4. Governed envelope and ProblemDetail errors

Success responses on internal v1 governed routes use a standard envelope with payload and correlation metadata. Failures use structured ProblemDetail-class semantics aligned with RFC 9457 — not ad-hoc string bodies on non-success HTTP status.

### 5. Distinct authentication policies

**Human session policy** and **service-actor policy** are separate contract dimensions. Machine callers must not be conflated with human session semantics without explicit audit design.

### 6. Operating-context dependency on protected operations

Protected operations declare operating-context policy and depend on ERP Integration Spine assembly (IS-002) — not handler-local scope inference from URL slugs or last-used company.

### 7. Bidirectional contract validation

Governed operations validate **ingress** (caller request against declared contract before business execution) and **egress** (handler response against declared contract before serialization). Handlers may not widen wire shape silently.

### 8. Breaking-change governance

HTTP contract changes must be classified as **additive**, **compatible**, **deprecated**, or **breaking**:

| Class | Rule |
| --- | --- |
| **Additive** | New optional fields or new operations — no consumer migration required |
| **Compatible** | Non-breaking clarification or constraint that does not reject previously valid client requests or remove previously valid response fields |
| **Deprecated** | Operation or field marked in publication with migration notice before removal |
| **Breaking** | Requires lifecycle transition, migration notice, and publication signaling before runtime removal; may require new ADR for exposure-tier or namespace change |

Deprecation and migration notice must precede breaking removal and handler retirement. Premature public or partner API expansion requires a new ADR before North Star §4 amendment.

### 9. HTTP wiring ownership

`apps/erp` owns HTTP route wiring, contract registry, OpenAPI generator pipeline, and internal v1 exposure namespace — extending ADR-0020 contract-first layer ownership. Kernel packages own vocabulary only; they do not own HTTP handlers or publication artifacts.

---

## Consequences

### Positive

- Integrators, partners, and agents discover operations from publication — not handler archaeology.
- Foundation gate 5 (ADR-0010) has constitutional backing for contract attestation.
- Breaking changes require explicit classification — reducing silent client breakage.
- Clear split: North Star (business meaning) · Blueprint (box + paths) · PAS/slice (contracts + gates).

### Negative / trade-offs

- Every new internal v1 route requires registry + schema + drift gate work before merge.
- Full handler runtime (createApiHandler) remains a PAS-001A R3 delivery obligation — this ADR does not claim runtime complete.

---

## Realization / Compliance Gate

This ADR is architecturally accepted on 2026-06-30. Runtime realization is satisfied when:

- [Platform API Contract North Star](../NORTHSTAR/api-contract-north-star.md) §16 EAC passes at Enterprise 10 / 10
- [Platform API Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) maps family authority and ERP consumer binding
- [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) R3 slice closes full `createApiHandler` runtime

---

## References

- [Platform API Contract North Star](../NORTHSTAR/api-contract-north-star.md)
- [Platform API Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md)
- [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)
- [PAS-API-REST-001 R3 track handoff](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md)
- [ADR-0010](ADR-0010-no-accounting-before-foundation-gate.md) · [ADR-0020](ADR-0020-master-data-authority-consolidation.md) · [ADR-0026](ADR-0026-platform-north-star-and-architecture-blueprint.md)
- [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) · [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)
