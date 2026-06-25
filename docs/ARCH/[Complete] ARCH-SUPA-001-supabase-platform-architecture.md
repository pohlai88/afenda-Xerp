# ARCH-SUPA-001 — Supabase Platform Architecture

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Slices:** [`slices/ARCH-SUPA-001/slice-index.md`](slices/ARCH-SUPA-001/slice-index.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-SUPA-001 |
| **Work ID** | ARCH-SUPA-001 · paired `fdr-003-persistence` · `fdr-003-tenant-rls` |
| **Status** | **Complete — enterprise 9.5 accepted** (29/30; DoD #20 closed 2026-06-25) — Slices 1–9 delivered |
| **Date** | 2026-06-25 |
| **Owner** | Platform Authority (`@afenda/database` + env ops) |
| **Package** | PKG-003 · `@afenda/database` · PKG-007 · `apps/erp` (SSR diagnostics) · `@afenda/storage` |
| **Registry entry ID** | `PKG003_DATABASE` |
| **Runtime owner** | `packages/database` · `scripts/` · `scripts/ops/` |
| **Lane** | green-lane |
| **Risk class** | Medium (Postgres platform + pooler routing) |
| **Change class** | Extension |
| **Clean Core target** | A |
| **Enterprise score target** | 29/30 enterprise 9.5 — **29/30 accepted** |

> **Scope:** Supabase as **managed Postgres + platform ops** — **not** ERP identity.  
> **Identity:** [`packages/auth/docs/auth-provider-decision.md`](../../packages/auth/docs/auth-provider-decision.md) (Better Auth).  
> **Skills:** [`supabase-postgres-best-practices`](../../.cursor/skills/supabase-postgres-best-practices/SKILL.md) · [`multi-tenancy-erp`](../../.cursor/skills/multi-tenancy-erp/SKILL.md) · [`afenda-drizzle-migration`](../../.cursor/skills/afenda-drizzle-migration/SKILL.md)

---

# 1. Execution instruction

Execute **one slice per session** from [`slices/ARCH-SUPA-001/`](slices/ARCH-SUPA-001/).  
Use **P0/P1/P2/P3** classification only — prohibited vocabulary: `future`, `defer`, `optional later`, `v2 maybe`.

---

# 2. Target item

**Purpose (one sentence):** Govern Supabase as Afenda's production Postgres platform — connection routing, RLS defense-in-depth, env doctor, and explicit P2 exclusions — without Supabase Auth, PostgREST writes, or replacing R2/Trigger.dev.

---

# 3. Authority chain

```text
1. docs/ARCH/arch-status-index.md
2. packages/architecture-authority/src/data/foundation-disposition.registry.ts
3. docs/architecture/afenda-runtime-truth-matrix.md
4. docs/delivery/FDR/[Partially Implemented] fdr-003-persistence.md
5. docs/delivery/FDR/[Complete] fdr-003-tenant-rls.md
6. packages/auth/docs/auth-provider-decision.md
7. This document + slice handoffs under slices/ARCH-SUPA-001/
```

---

# 4. Problem statement

## Current risk / gap

```text
Supabase usage is implemented but fragmented: env sync, Drizzle, RLS registry, thin @supabase/ssr
diagnostics, and ops scripts lacked a single production authority with P0–P3 classification.
Connection method per consumer was implicit in env.ts without a typed registry.
```

## Business / architecture impact

```text
- Production ERP requires deterministic pooler routing (migrations direct; app transaction).
- Tenant isolation requires Afenda RLS registry + withRlsSessionContext — not auth.uid().
- Object binaries remain R2; Supabase Storage is an additional option only when storage ARCH extends providers.
- Excluded capabilities must not enter production accidentally.
```

---

# 5. Architecture requirement

## 5.1 Ownership

| Concern | Owner | Path |
| --- | --- | --- |
| Connection routing registry | `@afenda/database` | [`connection-routing.contract.ts`](../../packages/database/src/supabase/connection-routing.contract.ts) |
| Excluded capabilities registry | `@afenda/database` | [`excluded-production-capabilities.contract.ts`](../../packages/database/src/supabase/excluded-production-capabilities.contract.ts) |
| URL builders | `@afenda/database` | [`env.ts`](../../packages/database/src/env.ts) |
| RLS registry | `@afenda/database` | [`packages/database/src/rls/`](../../packages/database/src/rls/) |
| Env sync + advisory | `scripts/` | [`env-utils.mjs`](../../scripts/env-utils.mjs) · [`env-doctor.mjs`](../../scripts/env-doctor.mjs) |
| Preview branch ops | `scripts/ops/` | [`supabase-preview-branch.mjs`](../../scripts/ops/supabase-preview-branch.mjs) |
| GoTrue redirect ops (infra only) | `scripts/ops/` | [`supabase-auth-redirects.mjs`](../../scripts/ops/supabase-auth-redirects.mjs) |
| SSR Supabase clients (diagnostics) | `apps/erp` | [`apps/erp/src/lib/supabase/`](../../apps/erp/src/lib/supabase/) |
| Production object binaries | `@afenda/storage` | R2 · [`storage-additional-providers.contract.ts`](../../packages/storage/src/contracts/storage-additional-providers.contract.ts) |
| Async execution | `@afenda/execution` | Trigger.dev — not Edge Functions |

## 5.2 Boundary rules

1. All ERP writes via Drizzle + `withRlsSessionContext` — not PostgREST.
2. Migrations: **direct** connection only (`drizzle-migrations` consumer).
3. App pools: **transaction** pooler (Vercel/serverless default).
4. Never expose `SUPABASE_SECRET_KEY` to browser.
5. R2 is production storage; Supabase Storage requires storage ARCH/FDR to deploy.

## 5.3 Prohibited actions

```text
- Supabase Auth / GoTrue as ERP identity
- PostgREST / Data API for tenant-mutating ERP operations
- Replace R2 with Supabase Storage
- Replace Trigger.dev with Edge Functions
- auth.uid() or Supabase JWT sub for ERP RBAC
- Hand-edit migration SQL
- generate_typescript_types (Drizzle is schema authority)
- Vague timeline language without P0/P1/P2/P3
```

---

# 6. Production release scope decision

## P0 — Production mandatory (in scope)

| Capability | Evidence |
| --- | --- |
| Supabase Postgres 17 | Drizzle schema · [`fdr-003-persistence`](../delivery/FDR/[Partially%20Implemented]%20fdr-003-persistence.md) |
| Supavisor session + transaction poolers | [`env.ts`](../../packages/database/src/env.ts) |
| Direct migration connection | `resolveMigrationDatabaseUrl` |
| Afenda tenant RLS | [`fdr-003-tenant-rls`](../delivery/FDR/[Complete]%20fdr-003-tenant-rls.md) Complete |
| Connection routing registry | Slice 1 · [`connection-routing.contract.ts`](../../packages/database/src/supabase/connection-routing.contract.ts) |
| R2 object storage | `@afenda/storage` |

## P1 — Production hardening (Slices 2, 3, 6)

| Capability | Slice |
| --- | --- |
| Env doctor Supabase advisory | Slice 2 |
| Preview branch ops discipline | Slice 3 |
| Legacy GoTrue redirect ops boundary | Slice 6 |

## P2 — Excluded from current production release

| Capability | Decision |
| --- | --- |
| Supabase Realtime | Not in release scope · Slice 4 registry |
| Supabase Storage runtime | Additional option only · R2 production · Slice 5 |
| Edge Functions | Trigger.dev authority |
| Database Webhooks | Outbox authority |
| GoTrue ERP identity | Prohibited |

Standard exclusion wording applies (see [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) §5.4).

---

# 7. Connection routing contract

| Consumer | Method | Resolver |
| --- | --- | --- |
| `drizzle-migrations` | direct | `resolveDatabaseUrlForConsumer("drizzle-migrations")` |
| `platform-db-pool` | transaction | `createPgPool` → `resolveDatabaseUrlForConsumer("platform-db-pool")` |
| `auth-db-pool` | transaction | `createAuthDbClient` → `resolveDatabaseUrlForConsumer("auth-db-pool")` |
| `execution-workers` | transaction | `@afenda/execution` env |
| `rls-live-probe` | direct | live RLS gate |

Authority: [`DATABASE_CONNECTION_ROUTING`](../../packages/database/src/supabase/connection-routing.contract.ts).

---

# 8. Enterprise acceptance criteria

```gherkin
Scenario: Excluded Supabase capabilities cannot enter production by accident
  GIVEN Realtime, Edge Functions, Database Webhooks, and GoTrue are P2 excluded
  WHEN governance tests run
  THEN excluded capability registry is enforced
  AND new usage requires ARCH/FDR approval

Scenario: Production Supabase routing is explicit
  GIVEN an ERP database consumer
  WHEN resolveDatabaseUrlForConsumer runs
  THEN method matches DATABASE_CONNECTION_ROUTING

Scenario: Supabase is not ERP identity
  GIVEN a protected ERP route
  WHEN session resolves
  THEN actor is users.id via Better Auth — not Supabase JWT sub

Scenario: R2 remains production storage
  GIVEN production object binaries
  THEN StorageProviderId is blob or r2 only
  AND Supabase Storage is additional option not in production union
```

---

# 9. Slice delivery status

| Slice | Title | Classification | Status |
| ---: | --- | --- | --- |
| 1 | Connection routing registry | P0 | **Delivered** |
| 2 | Env doctor advisory | P1 | **Delivered** |
| 3 | Preview branch alignment | P1 | **Delivered** |
| 4 | Realtime excluded contract | P2 | **Delivered** (governance only) |
| 5 | Supabase Storage additional option | P2 | **Delivered** (governance only) |
| 6 | Legacy GoTrue ops cleanup | P1 | **Delivered** |
| 7 | Complete promotion (DoD #20) | Evidence-sync | **Delivered** (2026-06-25) |
| 8 | Pool routing registry wiring | P1 | **Delivered** (2026-06-25) |
| 9 | Supabase advisors governance gate | P1 | **Delivered** (2026-06-25) |

Handoffs: [`slices/ARCH-SUPA-001/slice-index.md`](slices/ARCH-SUPA-001/slice-index.md)

---

# 10. Required gates

```bash
pnpm --filter @afenda/database typecheck
pnpm --filter @afenda/database test:run
pnpm --filter @afenda/storage test:run
pnpm exec vitest run scripts/governance/__tests__/env-utils-supabase-advisory.test.ts
pnpm exec vitest run scripts/governance/__tests__/supabase-preview-branch.test.ts
pnpm exec vitest run scripts/governance/__tests__/supabase-auth-redirects.test.ts
pnpm exec vitest run scripts/governance/__tests__/supabase-advisors-governance.test.ts
pnpm exec vitest run scripts/governance/__tests__/check-supabase-advisors.test.ts
pnpm check:supabase-advisors --skip-missing-token
pnpm check:documentation-drift
pnpm check:foundation-disposition
```

---

# 11. Definition of Done (summary)

| # | Criterion | Status |
| --- | --- | --- |
| 1–6 | Slices 1–6 runtime/doc evidence | [x] Slices 1–6 delivered |
| 7 | Complete promotion evidence-sync | [x] Slice 7 delivered 2026-06-25 |
| 10 | Documentation drift | [x] Gate exit 0 |
| 15 | Identity / exclusion boundary | [x] Slice 4 + 6 |
| 18 | Clean Core A | [x] Declared |
| 20 | Architecture Authority peer review | [x] Approved 2026-06-25 (§16) |

**Promotion:** **Complete — enterprise 9.5 accepted** (29/30). Waiver **SUPA-P1-ADVISORS-001** accepted 2026-06-25 with operator runbook (§12).

---

# 12. Waiver policy

| Waiver ID | Requirement waived | Status | Approver | Acceptance date | Revisit |
| --- | --- | --- | --- | --- | --- |
| **SUPA-P1-ADVISORS-001** | Automated MCP `get_advisors` in CI | **Accepted** | Architecture Authority / Platform Authority | 2026-06-25 | Before external beta go-live **or** next Supabase hardening slice — whichever comes first |

**Reason:** Production gate is `pnpm check:supabase-advisors` (Management API) plus operator runbook below. Mandatory CI pipeline wiring remains operator/release responsibility while waiver is Accepted.

**Operator runbook (mandatory while waiver is Accepted):**

1. Run `pnpm check:supabase-advisors --report > release-evidence/supabase-advisors.json` **before production cutover**.
2. Re-run after **each production migration batch** that touches RLS, indexes, or pooler configuration.
3. Re-run **quarterly** during platform review.
4. Attach JSON output to **release evidence** (release notes, ops checklist, or migration batch sign-off).
5. Local dev without secrets: `pnpm check:supabase-advisors --skip-missing-token`.

Automated advisor CI in the default `pnpm quality` aggregator is **not closed** — satisfied by Accepted waiver + governance script + runbook.

---

# 13. Rollback

| Area | Method |
| --- | --- |
| Code | `git revert` per slice commit |
| Docs | Revert ARCH + slice status rows; restore `[Partially Implemented]` filename if demoting |
| Ops scripts | Restore prior `supabase-auth-redirects.mjs` behavior (--apply default) if ops requires |
| Waiver | Re-open SUPA-P1-ADVISORS-001 if advisor runbook obligations are not met at revisit |

---

# 14. Skills / MCP / open source

| Resource | Use |
| --- | --- |
| [`supabase-postgres-best-practices`](../../.cursor/skills/supabase-postgres-best-practices/SKILL.md) | RLS perf, pooling |
| Context7 `/supabase/supabase` · `/supabase/ssr` | Connection + SSR patterns |
| Supabase MCP | `get_advisors`, `create_branch`, `list_migrations` (ops) |
| [supabase/supavisor](https://github.com/supabase/supavisor) | Pooler reference |

Install (optional): `npx skills add supabase/agent-skills@supabase-postgres-best-practices -g -y`

---

# 15. Known debt (post-Complete)

| Item | Classification | Owner |
| --- | --- | --- |
| Wire `check:supabase-advisors` into release CI with secrets | P1 · waiver **Accepted** | Platform ops · revisit at external beta |
| Realtime / Edge / Supabase Storage runtime | P2 excluded | Separate ARCH/FDR required |

---

# 16. Promotion rule

Do not promote to **Complete — enterprise 9.5 accepted** unless all are true:

```text
- Slices 1–6 runtime evidence delivered ✓
- Slice 7 Complete promotion exit 0 ✓
- All §11 DoD rows checked including #20 peer review ✓
- Enterprise score ≥ 29/30 ✓
- Runtime matrix Supabase platform row = implemented ✓
- ARCH/index synchronized ✓
- Waiver SUPA-P1-ADVISORS-001 Accepted with operator runbook ✓
```

Allowed status labels for this work item:

```text
Not started
Partially Implemented
Complete — foundation acceptable
Complete — enterprise 9.5 accepted   ← current
Blocked
```

### DoD #20 — Architecture Authority peer review

> **Closed 2026-06-25.** Filename promoted to `[Complete]` in Slice 7 change set.

| # | Review criterion | Evidence path | Gate | Exit |
| --- | --- | --- | --- | ---: |
| 1 | Connection routing registry | `packages/database/src/supabase/connection-routing.contract.ts` | `@afenda/database` test:run | 0 |
| 2 | Excluded capabilities registry | `excluded-production-capabilities.contract.ts` | `@afenda/database` test:run | 0 |
| 3 | Env doctor P1 advisories | `scripts/env-utils.mjs` · `env-doctor.mjs` | governance vitest | 0 |
| 4 | Preview branch + auth redirect ops | `scripts/ops/supabase-*.mjs` | governance vitest | 0 |
| 5 | Storage additional-provider boundary | `storage-additional-providers.contract.ts` | `@afenda/storage` test:run | 0 |
| 6 | Documentation authorities aligned | ARCH · matrix · index · slice-index | `pnpm check:documentation-drift` | 0 |
| 7 | Waiver Accepted with runbook | §12 SUPA-P1-ADVISORS-001 | Architecture Authority sign-off | Approved |

**Sign-off (Architecture Authority):**

```text
DoD #20 peer review — ARCH-SUPA-001
Reviewer: Architecture Authority
Date: 2026-06-25
PR: —
Result: Approved
Notes: Slices 1–6 gate evidence reviewed; SUPA-P1-ADVISORS-001 Accepted with operator runbook;
       Slices 8–9 delivered (pool registry wiring + check:supabase-advisors).
```
