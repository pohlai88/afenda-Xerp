# ADR-0034 — Service-Actor Production Policy Attestation

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · Platform API Contract domain |
| **Supersedes** | [ADR-0033](ADR-0033-service-actor-s2s-token-verification-deferred.md) |
| **Superseded by** | [ADR-0035](ADR-0035-internal-v1-service-actor-bearer-verification.md) (machine S2S policy) |

---

## Context

[ADR-0033](ADR-0033-service-actor-s2s-token-verification-deferred.md) blocked S2S production but left [Enterprise Runtime exit criterion 5](../PAS/API-CONTRACT/REST/enterprise-runtime-exit-checklist.md) (**service-actor policy attested where applicable**) in **Open** state.

As of 2026-06-30:

| Fact | Evidence |
| --- | --- |
| Zero `service-token-required` operations in the registry | `API_CONTRACTS` — no machine-production REST surface |
| Human-session internal v1 is production accepted | PAS-API-REST-001 · IS-004 R3 Delivered |
| Forged S2S headers must not reach session routes | `createApiHandler` → `assertApiRouteAuthPolicy` |
| Shape-only S2S ingress attested (R2/R3b) | `pnpm check:erp-service-actor-s2s-attestation` |

Blueprint §11 criterion 5 reads **“where applicable”**. With no service-token operations registered, applicable scope is **contract + runtime fail-close attestation**, not live machine traffic.

---

## Decision

1. **Supersede ADR-0033 deferral framing** — session-only internal v1 is a **resolved production policy**, not an ambiguous block.

2. **Human-session internal v1 — GO** — all current governed operations use `session-required` or `public` auth policies.

3. **Machine S2S production — not offered** — no `service-token-required` routes; `assertApiRouteAuthPolicy` returns `401` for:
   - service-actor ingress headers on session/public operations; and
   - any `service-token-required` operation until a future ADR implements cryptographic verification.

4. **Enterprise Runtime criterion 5 — Pass** — service-actor policy is attested where applicable:
   - registry declares actor policy per operation (API-006);
   - runtime enforces `authPolicy` before handler execution;
   - R2/R3b S2S shape ingress gate remains active for assembly paths;
   - Prove-It test rejects forged headers on session routes.

5. **Future machine production** — registering a `service-token-required` operation **without** a superseding ADR and verified token boundary is prohibited. Required before first such route:
   - token introspection, signed JWT validation, or mTLS at trust boundary;
   - rate-limit identity from verified actor;
   - amendment to this ADR or successor ADR.

---

## Consequences

### Positive

- Enterprise Runtime checklist criterion 5 closes without falsely claiming crypto-verified S2S.
- Integrators have explicit policy: session REST is supported; machine REST is not.
- ADR-0033 ambiguity (“blocked” vs “deferred”) is replaced with attested fail-close behavior.

### Negative / trade-offs

- Machine callers cannot use internal v1 REST until a future ADR + runtime land.
- `internal-only` operations (if added) still require explicit policy review — shape-only ingress is not production verification.

---

## Acceptance Gate

- [ ] `assertApiRouteAuthPolicy` in `apps/erp/src/server/api/runtime/create-api-handler.ts`
- [ ] `api-handler-boundary.test.ts` — forged S2S headers → `401` before handler
- [ ] `check-erp-service-actor-s2s-attestation.mts` — handler auth-policy marker gate
- [ ] [enterprise-runtime-exit-checklist.md](../PAS/API-CONTRACT/REST/enterprise-runtime-exit-checklist.md) criterion 5 → **Pass**
- [ ] PAS-API-REST-001 · R3b · pas-status-index cite ADR-0034

---

## References

- [ADR-0030 — ERP REST API Contract Standard](ADR-0030-erp-rest-api-contract-standard.md)
- [ADR-0033 — S2S Token Verification Deferred](ADR-0033-service-actor-s2s-token-verification-deferred.md) (superseded)
- [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)
- [Enterprise Runtime exit checklist](../PAS/API-CONTRACT/REST/enterprise-runtime-exit-checklist.md)
- [`create-api-handler.ts`](../apps/erp/src/server/api/runtime/create-api-handler.ts)
