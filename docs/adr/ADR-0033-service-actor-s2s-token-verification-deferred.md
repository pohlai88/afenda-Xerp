# ADR-0033 — Service-Actor S2S Token Verification Deferred

> **Superseded by [ADR-0034](ADR-0034-service-actor-production-policy-attestation.md)** — retained for history.

| Field | Value |
| --- | --- |
| **Status** | **Superseded** |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · Platform API Contract domain |
| **Supersedes** | — |
| **Superseded by** | [ADR-0034](ADR-0034-service-actor-production-policy-attestation.md) |

---

## Context

Internal v1 REST (`/api/internal/v1/**`) must declare distinct human-session and service-actor authentication policies ([ADR-0030](ADR-0030-erp-rest-api-contract-standard.md) §5 · [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)).

PAS-001A R3b delivered service-actor operating-context assembly with **shape-only** header parsing at the ERP trust boundary — `x-afenda-actor-*` headers are validated for structure via kernel `AuthActorIdentity` ingress, not cryptographically verified ([R3b handoff](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md) · [`resolve-service-actor.server.ts`](../../apps/erp/src/lib/auth/resolve-service-actor.server.ts)).

Production machine-to-machine traffic requires token introspection, signed JWT validation, or mTLS at the trust boundary before service-actor headers may be trusted. That runtime is not yet constitutionalized or implemented.

Evidence as of 2026-06-30:

| Artifact | Role |
| --- | --- |
| [`resolve-service-actor.server.ts`](../../apps/erp/src/lib/auth/resolve-service-actor.server.ts) | Shape-only `x-afenda-actor-*` parsing; no OAuth/token verification |
| [`create-api-handler.ts`](../../apps/erp/src/server/api/runtime/create-api-handler.ts) | Governed handler runtime — fail-closes forged S2S headers on routes that do not declare `service-token-required` |
| Operation registry | **No route** currently declares `authPolicy: "service-token-required"` |

---

## Decision

1. **Session-only production (2026-06-30):** Internal v1 REST in production accepts **human session** callers only. Service-actor S2S is **not** a supported production traffic class until this ADR is superseded.

2. **Shape-only ingress (R3b):** `x-afenda-actor-*` header parsing remains shape validation only — no cryptographic verification at the ERP boundary.

3. **Fail-close on session routes:** `createApiHandler` rejects requests that present service-actor ingress headers on operations whose `authPolicy` is not `service-token-required` (already implemented).

4. **No service-token routes:** No governed operation currently declares `service-token-required`; S2S production paths are therefore unreachable by contract design.

5. **Future S2S production** requires a **new ADR** amending this deferral with:
   - Token introspection, signed JWT validation, or mTLS at the trust boundary
   - Runtime enforcement of `authPolicy` for service routes (including `service-token-required` operations)
   - Rate-limit identity derived from **verified** service actor, not header shape alone

---

## Consequences

### Positive

- Production stance is explicit: integrators must not rely on unverified S2S headers.
- R3b assembly and attestation gates remain valid for shape-only ingress and test paths.
- Enterprise Runtime promotion is not blocked by undocumented S2S assumptions.

### Negative / trade-offs

- Machine callers cannot use internal v1 REST in production until superseding ADR and runtime land.
- Service-actor policy attestation for Enterprise Runtime remains **Open** ([enterprise-runtime-exit-checklist](../PAS/API-CONTRACT/REST/enterprise-runtime-exit-checklist.md)).

---

## Acceptance Gate

This deferral ADR is satisfied when:

- [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) cites ADR-0033 in hard stops or invariants
- [R3b handoff](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md) links ADR-0033 in production stance
- [pas-status-index](../PAS/pas-status-index.md) IS-004 notes S2S blocked per ADR-0033
- No route declares `service-token-required` without superseding ADR

Supersession requires explicit ADR acceptance and runtime gates — not documentation-only amendment.

---

## References

- [ADR-0030 — ERP REST API Contract Standard](ADR-0030-erp-rest-api-contract-standard.md)
- [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)
- [PAS-001A R3b — Service-Actor Context Assembly](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md)
- [`apps/erp/src/lib/auth/resolve-service-actor.server.ts`](../../apps/erp/src/lib/auth/resolve-service-actor.server.ts)
- [Platform API Contract Blueprint §11](../BLUEPRINT/api-contract-blueprint.md)
