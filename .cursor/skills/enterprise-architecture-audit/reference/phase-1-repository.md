# Phase 1 — Repository Understanding

Build a complete mental model before scoring. Every row needs **Evidence** or **"Not evidenced."**

---

## 1.1 Package topology

| Check | Evidence location | Status | Evidence |
| --- | --- | --- | --- |
| All workspace packages registered | `package-registry.data.ts` | | |
| Layer assignment per package | layer registry + disposition | | |
| Apps vs packages separation | `apps/` vs `packages/` | | |
| No orphan packages | compare filesystem to registry | | |

---

## 1.2 Runtime composition

| Surface | Entry path | RSC/client model | Evidence |
| --- | --- | --- | --- |
| ERP protected shell | `apps/erp/src/app/(protected)/` | | |
| Auth shell | `apps/erp/src/app/(auth)/` | | |
| API internal v1 | `apps/erp/src/app/api/` | | |
| Server actions | `apps/erp/src/lib/**/**.action.ts` | | |
| Trigger worker | `packages/execution/` | | |
| Docs app | `apps/docs/` | | |

---

## 1.3 Dependency graph

Run or cite: `pnpm quality:boundaries` · `pnpm architecture:dependencies`

| Check | Pass/Fail | Evidence |
| --- | --- | --- |
| No forbidden cross-layer imports | | |
| No cycles | `pnpm architecture:cycles` | |
| Kernel zero runtime deps | `pnpm check:kernel-zero-runtime-deps` | |
| Consumer does not own authority contracts | cross-boundary scan | |

---

## 1.4 Bounded contexts and ownership

| Domain | Owner package | Consumer packages | Drift? |
| --- | --- | --- | --- |
| Identity / IDs | `@afenda/kernel` | | |
| Architecture registries | `@afenda/architecture-authority` | | |
| Auth / session | `@afenda/auth` | | |
| Tenancy / operating context | ERP + database | | |
| RBAC | `@afenda/permissions` | | |
| Metadata authority | `@afenda/ui-composition` | | |
| Metadata UI | `@afenda/metadata-ui` | | |
| Audit / logging | `@afenda/observability` | | |
| Outbox / jobs | `@afenda/execution` | | |

Use `.cursor/skills/cross-boundary-anti-pattern-scan/SKILL.md` for semantic leaks.

---

## 1.5 Cross-cutting models

| Model | Authority doc | Runtime path | Gate |
| --- | --- | --- | --- |
| Identity (enterprise IDs) | PAS-001 · ADR-0021+ | `packages/kernel/src/identity/` | `check:kernel-identity-governance` |
| Security / CSP | `apps/erp/src/proxy.ts` | `csp-allowlist.ts` | `check:csp-third-party` |
| Tenancy (7-tier) | `multi-tenancy.md` | `apps/erp/src/lib/context/` | `check:multi-tenancy-enterprise-acceptance` |
| Authorization | PERMISSION_REGISTRY | `packages/permissions/` | `check:permissions-scope-grants-surface` |
| Audit | PKG013 | observability + DB audit | `quality:erp-observability` |
| Events / outbox | PAS execution slice | `apps/erp/src/lib/outbox/` | execution PKG tests |
| API contracts | PAS-007 | `server/api/contracts/` | `check:api-contracts` |
| Persistence | `@afenda/database` | `packages/database/` | `quality:migrations` |

---

## 1.6 Infrastructure and delivery

| Area | Evidence | Status |
| --- | --- | --- |
| CI workflows | `.github/workflows/` | |
| Quality gate aggregator | root `package.json` `quality` script | |
| Turborepo | `turbo.json` | |
| Deployment config | Vercel / env docs | |
| Observability spine | `packages/observability/` | |

---

## 1.7 Runtime vs documented drift table

Compare `afenda-runtime-truth-matrix.md` + PAS status to source:

| Area | Documented status | Runtime status | Drift | Evidence |
| --- | --- | --- | --- | --- |
| | | | Yes/No | |

Use `pas-codebase-bridge` per PAS when drift suspected.

---

## Phase 1 outputs (feed deliverables 11, 12, 14)

- Package topology narrative
- Dependency assessment summary
- Runtime drift table (minimum 10 rows or all matrix areas in scope)
- Bounded context map
