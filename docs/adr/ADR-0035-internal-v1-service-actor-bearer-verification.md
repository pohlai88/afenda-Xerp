# ADR-0035 — Internal v1 Service-Actor Bearer Verification

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · Platform API Contract domain |
| **Supersedes** | [ADR-0034](ADR-0034-service-actor-production-policy-attestation.md) (machine S2S policy) |
| **Superseded by** | — |

---

## Context

[ADR-0034](ADR-0034-service-actor-production-policy-attestation.md) attested session-only internal v1 production and **fail-closed** rejection of unverified service-actor headers, but explicitly blocked machine S2S REST until cryptographic verification landed.

PAS-001A R2/R3b delivered **shape-only** `x-afenda-actor-*` header ingress and operating-context assembly paths. Without bearer verification, forged headers could not reach session routes but could not be trusted for machine production either.

This ADR closes that gap: machine callers may use governed `service-token-required` operations when they present a verified `afenda-s2s-v1` bearer token whose claims match ingress headers.

---

## Decision

1. **Trust model** — Service actor identity is trusted only when **both**:
   - `Authorization: Bearer <afenda-s2s-v1 token>` verifies HMAC-SHA256 with `AFENDA_INTERNAL_S2S_SIGNING_SECRET` (minimum 32 characters); and
   - Token claims match `x-afenda-actor-*` headers (`actorKind`, `authSubjectId`, `integrationProvider`, `integrationExternalId`).

2. **Token format** — `afenda-s2s-v1.<base64url(payload)>.<base64url(signature)` where payload JSON is `{ sub, actorKind, provider, externalId, iat, exp }` with maximum 5-minute lifetime (clock skew tolerated).

3. **Human session routes** — Unverified service headers remain rejected on `session-required` / `public` operations (existing fail-close via `assertApiRouteAuthPolicy`).

4. **`service-token-required` routes** — Require verified service actor (`authActor.kind === 'service'`). Remove blanket `401` in `assertApiRouteAuthPolicy` that blocked all service-token operations.

5. **Rate limiting** — Derive rate-limit subject from verified `authSubjectId` when `authActor.kind === 'service'`.

6. **Environment** — `AFENDA_INTERNAL_S2S_SIGNING_SECRET` is **apps/erp only**, validated via `apps/erp/src/lib/env/s2s-env.ts` (Zod, min 32 chars).

7. **First production route** — `GET /api/internal/v1/auth/service-actor/ping` — `service-token-required`, `contextPolicy: none`, returns `{ status: "ok" }` — proves end-to-end verification.

8. **Supersede ADR-0034 machine policy** — ADR-0034 remains historical for session-only attestation framing; **machine S2S production policy** moves to this ADR.

---

## Alternatives Considered

| Alternative | Outcome |
| --- | --- |
| **mTLS at edge** | Strong transport trust; deferred — requires infra contract beyond ERP handler boundary |
| **OAuth 2.0 token introspection** | Standard for third-party integrations; deferred — adds external dependency and latency |
| **Signed JWT (industry JWT)** | Familiar format; rejected for v1 in favor of minimal custom prefix + HMAC to avoid JWT library surface and algorithm confusion |
| **Shape-only headers (status quo)** | Rejected — insufficient for machine production per Enterprise Runtime criterion 5 evolution |

---

## Consequences

### Positive

- First governed machine S2S REST surface with cryptographic verification.
- Token/header binding prevents header forgery without signing secret.
- Rate limits attribute machine traffic to verified `authSubjectId`.
- Ping route provides Prove-It integration test target.

### Negative / trade-offs

- Shared secret rotation requires coordinated deploy across issuers and ERP.
- No OAuth/mTLS in this slice — external integrators must use Afenda-issued S2S tokens until a future ADR.
- `AFENDA_INTERNAL_S2S_SIGNING_SECRET` must be present in ERP runtime even when no S2S traffic occurs (verification path loads secret).

---

## Acceptance Gate

- [x] `verifyServiceActorS2sBearerToken` in `apps/erp/src/lib/auth/verify-service-actor-s2s-token.server.ts`
- [x] `resolve-service-actor.server.ts` rejects claim/header mismatch
- [x] `assertApiRouteAuthPolicy` requires verified service actor on `service-token-required`
- [x] `GET /api/internal/v1/auth/service-actor/ping` registered in `API_CONTRACTS`
- [x] `verify-service-actor-s2s-token.server.test.ts` — valid, expired, wrong sig, mismatch
- [x] `api-handler-boundary.test.ts` — service-token route Prove-It
- [x] `pnpm check:erp-service-actor-s2s-attestation` — `verifyServiceActorS2sBearerToken` marker
- [x] `pnpm export:openapi` + `pnpm check:api-contracts`
- [x] PAS-API-REST-001 REST-INV-009 · enterprise-runtime-exit-checklist criterion 5 updated
- [x] Production activation attested in [ADR-0036](ADR-0036-machine-s2s-production-activation.md)

---

## References

- [ADR-0030 — ERP REST API Contract Standard](ADR-0030-erp-rest-api-contract-standard.md)
- [ADR-0034 — Service-Actor Production Policy Attestation](ADR-0034-service-actor-production-policy-attestation.md) (machine policy superseded)
- [ADR-0033 — S2S Token Verification Deferred](ADR-0033-service-actor-s2s-token-verification-deferred.md) (historical)
- [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)
- [Enterprise Runtime exit checklist](../PAS/API-CONTRACT/REST/enterprise-runtime-exit-checklist.md)
- [`verify-service-actor-s2s-token.server.ts`](../apps/erp/src/lib/auth/verify-service-actor-s2s-token.server.ts)
- [`create-api-handler.ts`](../apps/erp/src/server/api/runtime/create-api-handler.ts)
- [ADR-0036 — Machine S2S Production Activation](ADR-0036-machine-s2s-production-activation.md)
