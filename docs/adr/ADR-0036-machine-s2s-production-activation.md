# ADR-0036 — Machine S2S Production Activation

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · Platform API Contract domain |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

[ADR-0035](ADR-0035-internal-v1-service-actor-bearer-verification.md) implemented the cryptographic trust boundary for machine callers (`afenda-s2s-v1` HMAC bearer + matching `x-afenda-actor-*` headers) and registered the first `service-token-required` route (`GET /api/internal/v1/auth/service-actor/ping`).

That ADR answers **how** machine identity is verified. This ADR answers **when and whether** Afenda ERP **activates** machine S2S as an offered production capability — distinct from human session auth (Better Auth cookies / OAuth sign-in per ARCH-AUTH-001).

| Lane | Caller | Credential | Use when |
| --- | --- | --- | --- |
| **Human session** | Browser, mobile, signed-in operator | Better Auth session cookie | Operator UI, session-required internal v1 REST |
| **Machine S2S** | Workers, schedulers, integration jobs | `Authorization: Bearer afenda-s2s-v1…` + actor headers | No human session; `service-token-required` internal v1 REST |

OAuth (Google/GitHub/SSO) creates **human sessions only**. It does **not** satisfy machine S2S routes and must not be substituted without a future ADR (OAuth client credentials or token introspection).

Without an explicit activation decision, teams may assume OAuth configuration alone covers internal API automation, or defer S2S env setup indefinitely while governance docs claim machine REST is offered.

---

## Decision

1. **Activate machine S2S production** — Internal v1 REST declares `authPolicy: "service-token-required"` as **live and supported** when [ADR-0035](ADR-0035-internal-v1-service-actor-bearer-verification.md) verification is in place. Status moves from “crypto implemented” to **production activated**.

2. **Operational requirement** — Deployments that register any `service-token-required` operation **must** set `AFENDA_INTERNAL_S2S_SIGNING_SECRET` (≥32 characters, `apps/erp` only). Issuers and ERP share this secret until a future ADR introduces asymmetric keys or OAuth introspection.

3. **Permitted issuers (v1)** — Trusted Afenda-controlled runtimes that call internal v1 without a human session:
   - `@afenda/execution` / Trigger.dev workers (future procurement/sync jobs)
   - CI or ops probes using the ping route
   - **Not** browser clients or third-party OAuth tokens

4. **Registration rule** — New `service-token-required` routes require:
   - OpenAPI + catalog registration ([PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) REST-INV-009)
   - Prove-It tests (handler boundary + route integration where applicable)
   - No bypass of `createApiHandler` → `assertApiRouteAuthPolicy`

5. **Human routes unchanged** — Session-required and public operations continue to use Better Auth. Forged service-actor headers on those routes remain **401 fail-close** (ADR-0035 §3).

6. **Probe route** — `GET /api/internal/v1/auth/service-actor/ping` stays the canonical health check for S2S wiring in every environment that activates machine S2S.

---

## Alternatives Considered

| Alternative | Outcome |
| --- | --- |
| **Session-only (ADR-0034 stance)** | Simpler ops; rejected for ERP integration spine — workers need machine identity without browser login |
| **Reuse Better Auth OAuth tokens for S2S** | Conflates human and machine trust; rejected until dedicated client-credentials ADR |
| **Defer activation; keep crypto dormant** | Rejected — governance and Enterprise Runtime criterion 5 require explicit offered/activated stance |
| **mTLS at edge** | Strong; deferred — infra contract beyond ERP handler (ADR-0035) |

---

## Consequences

### Positive

- Clear operator guidance: OAuth for humans, S2S secret for machines.
- Workers and integrations have a governed path to internal v1 REST.
- Ping route + integration tests give repeatable activation verification.
- `.env.example` documents the secret for onboarding.

### Negative / trade-offs

- Shared-secret rotation requires coordinated deploy of issuers and ERP.
- Environments with zero machine traffic still need the secret if ping or any `service-token-required` route is deployed.
- External integrators cannot use OAuth alone until a successor ADR.

---

## Acceptance Gate

- [x] [ADR-0035](ADR-0035-internal-v1-service-actor-bearer-verification.md) acceptance gates satisfied (crypto + handler enforcement)
- [x] `AFENDA_INTERNAL_S2S_SIGNING_SECRET` documented in `.env.example`
- [x] `GET /api/internal/v1/auth/service-actor/ping` route integration test (issue token → route GET → 200; forged → 401)
- [x] `pnpm check:erp-service-actor-s2s-attestation`
- [x] S2S unit + handler Prove-It suites green (`verify-service-actor-s2s-token`, `resolve-service-actor`, `api-handler-boundary`)
- [x] Trigger.dev task `foundation.service-actor-s2s-ping` deployed (`pnpm trigger:deploy` → version 20260630.2, 2 tasks)
- [x] `AFENDA_INTERNAL_S2S_SIGNING_SECRET` pushed to Vercel production (`pnpm env:push:production`)

---

## References

- [ADR-0030 — ERP REST API Contract Standard](ADR-0030-erp-rest-api-contract-standard.md)
- [ADR-0035 — Internal v1 Service-Actor Bearer Verification](ADR-0035-internal-v1-service-actor-bearer-verification.md)
- [ADR-0034 — Service-Actor Production Policy Attestation](ADR-0034-service-actor-production-policy-attestation.md) (session-only machine policy superseded)
- [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) · REST-INV-009
- [Enterprise Runtime exit checklist](../PAS/API-CONTRACT/REST/enterprise-runtime-exit-checklist.md)
- [`service-actor/ping/route.ts`](../apps/erp/src/app/api/internal/v1/auth/service-actor/ping/route.ts)
