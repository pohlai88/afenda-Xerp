# ARCH-API-002 — OpenAPI Internal v1 Catalog

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Parent:** [`ARCH-API-001`](%5BComplete%5D%20ARCH-API-001-governed-rest-api.md) · **Paired FDR:** [`fdr-007-api-governance`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-api-governance.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-API-002 |
| **Work ID** | ARCH-API-002 · paired `fdr-007-api-governance` |
| **Title** | OpenAPI internal v1 catalog |
| **Status** | **Complete — foundation acceptable** (2026-06-26) |
| **Package** | PKG-007 · `@afenda/erp` + PKG-005 · `@afenda/docs` |
| **Runtime owner** | `apps/erp/src/server/api/contracts/openapi/` · `apps/docs/openapi/` |
| **Lane** | green-lane |
| **Clean Core target** | B |
| **Enterprise score** | **28/30 foundation acceptable** |

> **Scope:** Registry-driven OpenAPI 3.1 for ten governed `/api/internal/v1/**` routes — export script, CI drift gate, Fumadocs reference pages.  
> **Not in scope:** `/api/public/v1`, Kong, SDK codegen, legacy allowlisted transports.

---

# 1. Execution instruction

Deliver OpenAPI as a **generated artifact** from `API_CONTRACTS` — never hand-maintained paths or schemas. Re-export after every registry change: `pnpm sync:openapi`.

---

# 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-API-002 |
| Status | Complete — foundation acceptable |
| Package | `@afenda/erp`, `@afenda/docs` |
| Registry entry ID | PKG007_CONTEXT (api-governance subdomain) |

---

# 3. Authority chain

```text
1. docs/ARCH/arch-status-index.md
2. docs/ARCH/[Complete] ARCH-API-001-governed-rest-api.md
3. docs/architecture/afenda-rest-api-governance.md
4. apps/erp/src/server/api/contracts/api-contract-registry.ts
5. apps/erp/src/server/api/contracts/openapi/build-afenda-openapi-document.ts
6. apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json
```

---

# 4. Problem statement

## Current risk / gap

```text
Governed REST routes had no machine-readable catalog — blocking docs-site API reference,
contract review, and future SDK work despite a complete Zod registry.
```

## Business / architecture impact

```text
- Docs: Fumadocs OpenAPI blocked (ARCH-DOCS-001 gap audit).
- Drift: Hand-written OpenAPI would diverge from runtime Zod validation immediately.
- Integration: Internal ERP clients lack a single reference for envelope + headers.
```

---

# 5. Architecture requirement

## 5.1 Ownership

| Concern | Owner | Path |
| --- | --- | --- |
| OpenAPI generator | `@afenda/erp` | `apps/erp/src/server/api/contracts/openapi/` |
| Canonical snapshot | `@afenda/erp` | `afenda-internal-v1.openapi.json` |
| Docs static copy | `@afenda/docs` | `apps/docs/openapi/` |
| MDX reference pages | `@afenda/docs` | `content/docs/en/(guides)/api-reference/` |
| Export / drift gates | repo scripts | `scripts/api-contract/export-openapi.mts`, `check-openapi-drift.mts` |

## 5.2 Boundary rules

1. Single generator authority — `buildAfendaOpenapiDocument(API_CONTRACTS)`.
2. Envelope-first responses — `{ ok, data|error, meta }` in all success/error schemas.
3. Docs app reads **static JSON only** — no runtime `apps/erp` imports (`no-erp-runtime-coupling` test).
4. Governance extensions (`x-afenda-*`) mirror catalog metadata on every operation.

## 5.3 Prohibited actions

- Hand-edit OpenAPI paths/schemas outside generator output
- Document legacy `/api/auth/**`, `/api/webhooks/**`, `/api/integrations/**`
- Wire Kong or `/api/public/v1` in this ARCH
- Duplicate Zod schemas for OpenAPI-only validation

## 5.4 Production classification

| Capability | Bucket | Notes |
| --- | --- | --- |
| OpenAPI generator + snapshot + drift gate | **P0 — production mandatory** | Delivered |
| Fumadocs reference (en) | **P1 — production hardening** | Delivered |
| zh operation page translation | **P3 — delivered** | 10 zh MDX pages + `meta.json` (2026-06-26) |
| Public `/api/public/v1` OpenAPI | **P2 — excluded** | Separate ARCH/FDR |

---

# 6. Required implementation scope

## In scope

- `apps/erp/src/server/api/contracts/openapi/**`
- `apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json`
- `scripts/api-contract/export-openapi.mts`, `check-openapi-drift.mts`
- `apps/docs/openapi/`, `apps/docs/scripts/generate-openapi-docs.mts`
- `apps/docs/content/docs/en/(guides)/api-reference/**`

## Out of scope

- `/api/public/v1/**`, Kong, kubb SDK codegen
- Accounting domain routes (ADR-0010)

---

# 7. Enterprise acceptance criteria

```gherkin
Feature: OpenAPI internal v1 catalog

  Scenario: Registry drives OpenAPI without duplicate schemas
    GIVEN API_CONTRACTS contains 10 active routes
    WHEN pnpm export:openapi runs
    THEN afenda-internal-v1.openapi.json lists all 10 operations

  Scenario: Envelope documented correctly
    GIVEN internal.v1.health.get
    WHEN the OpenAPI 200 response schema is inspected
    THEN it requires ok=true, data, and meta fields

  Scenario: Drift protection
    GIVEN a contract change without re-export
    WHEN pnpm check:openapi-drift runs
    THEN CI fails
```

---

# 8. Enterprise quality benchmark

| Dimension | Target | Evidence |
| --- | ---: | --- |
| Contract stability | 5/5 | Generator reads `API_CONTRACTS`; drift gate |
| Test coverage | 4/5 | 21+ openapi-document tests + docs-openapi |
| Documentation | 5/5 | This ARCH + Fumadocs pages + governance doc |
| Maintainability | 5/5 | No parallel schema authority |

**Accepted:** **28/30 foundation acceptable** — Fumadocs `generateFiles` blocked on Node 24 ESM; custom MDX generator used (P1 waiver).

---

# 9. Verification gates

```bash
pnpm sync:openapi
pnpm check:api-contracts
pnpm lint:openapi
pnpm --filter @afenda/erp test:run -- openapi
pnpm --filter @afenda/docs typecheck
pnpm --filter @afenda/docs test:run
```

---

# 10. Waiver

| Waiver ID | Requirement | Reason | Expiry |
| --- | --- | --- | --- |
| `openapi-fumadocs-generatefiles-node24` | Use official `fumadocs-openapi` `generateFiles()` | xml-js ESM import failure on Node 24 | Revisit when upstream fixes or Node LTS pins |

---

# 11. Rollback

| Area | Method |
| --- | --- |
| Generator | `git revert` |
| Snapshot | Delete JSON + disable `check:openapi-drift` |
| Docs pages | Remove `api-reference/` MDX + nav entries |

---

# 12. Artifact map

| Artifact | Path |
| --- | --- |
| Generator | `apps/erp/src/server/api/contracts/openapi/build-afenda-openapi-document.ts` |
| Canonical spec | `apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json` |
| Docs copy | `apps/docs/openapi/afenda-internal-v1.openapi.json` |
| Export | `pnpm export:openapi` / `pnpm sync:openapi` |
| Drift gate | `pnpm check:openapi-drift` |
