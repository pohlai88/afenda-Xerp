# Phase 2 — Enterprise Architecture Assessment

Score each dimension **independently**. Every score requires cited evidence or **"Not evidenced."**

See [scoring.md](scoring.md) for weights and formula.

---

## 14-dimension scorecard template

```md
## Architecture Scorecard

**Audit date:** YYYY-MM-DD
**Scope:** <paths>

| Dimension | Score /10 | Key evidence | Top gap |
|-----------|-----------|--------------|---------|
| Architecture | | package-registry, boundaries gate | |
| Maintainability | | module size, ownership registry | |
| Scalability | | stateless RSC, outbox, RLS | |
| Extensibility | | kernel contracts, PAS slices | |
| Security | | RBAC, CSP, RLS gates | |
| Performance | | bundle, parallel fetch (frontend ref) | |
| Reliability | | outbox, error envelopes, tests | |
| Observability | | audit registry, Pino, correlation | |
| Developer Experience | | typecheck, biome, skills, docs | |
| API Governance | | check:api-contracts, OpenAPI | |
| Domain Modelling | | kernel BMD, tenancy glossary | |
| Code Organization | | layer rules, folder conventions | |
| Testability | | vitest projects, interaction tests | |
| Documentation | | check:documentation-drift | |

**Weighted overall (partial):** X.X / 10
```

---

## Evidence requirements per dimension

### Architecture (/10)

- `pnpm quality:architecture` exit 0
- No parallel registries in consumers
- Layer rules in architecture-authority validators
- Deduction: any Critical cross-boundary finding (-1.0 each, max -3.0)

### Maintainability (/10)

- Ownership registry complete for in-scope packages
- No god-modules >800 LOC without documented reason
- Consistent naming (PAS package prefixes)

### Scalability (/10)

- Tenant isolation: RLS + context resolver evidence
- Async work via outbox/Trigger (not inline long jobs)
- Stateless app tier (session externalized)

### Extensibility (/10)

- Clean Core: no consumer-side authority
- Extension via PAS slices + registry lanes
- Feature manifest + entitlements pipeline

### Security (/10)

- `check:auth-user-id-rbac-boundary` · `check:csp-third-party`
- Server action security patterns
- No secrets in repo

### Performance (/10)

- ERP test count + any webperf findings (Phase 3)
- Database index/FK checks where applicable

### Reliability (/10)

- Outbox tests · mutation audit coverage
- ProblemDetail / error envelope consistency

### Observability (/10)

- `quality:erp-observability` · diagnostic logging registry
- Correlation ID propagation

### Developer Experience (/10)

- `pnpm typecheck` · `pnpm ci:biome`
- Skill/orchestration docs present
- Scaffold scripts (`pnpm scaffold:package`)

### API Governance (/10)

- `check:api-contracts` · OpenAPI drift gate
- Idempotency + rate-limit tests cited

### Domain Modelling (/10)

- Kernel identity families + BMD authority registry
- Glossary-first multi-tenancy checks

### Code Organization (/10)

- Monorepo apps/packages split
- No barrel abuse in `@afenda/*` consumers

### Testability (/10)

- Vitest project wiring · AGENTS.md interaction pattern
- Coverage summary gate where applicable

### Documentation (/10)

- Runtime matrix freshness
- `check:documentation-drift` exit 0

---

## Package-level evaluation table

For each package in scope:

| Package | Layer | Lane | Tests | Gates green | Score /10 | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `@afenda/kernel` | Platform | | | | | |

Feed **Deliverable 3 — Architecture Scorecard**.
