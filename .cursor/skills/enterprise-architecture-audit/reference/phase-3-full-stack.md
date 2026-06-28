# Phase 3 — Full Stack Review

End-to-end review across the platform. Map each row to Afenda paths and gates.

**Phase 3 orchestrator fan-out:**

| Slice | Agent / skill | Scope |
| --- | --- | --- |
| Backend / API / DB | `enterprise-architecture-auditor` Phase 3 backend | packages/database, auth, permissions, execution, outbox, api |
| Governance | `afenda-governance-auditor` | registries, boundaries, ERP gates |
| Security | `afenda-security-auditor` | auth, RBAC, CSP, server actions |
| Frontend | `enterprise-frontend-audit` **audit only** | Phases 1–10 read; skip Phase 11 Repair |

---

## Review matrix

| Dimension | Primary paths | Gate / test | Status | Evidence |
| --- | --- | --- | --- | --- |
| **Frontend** | `apps/erp/`, `packages/appshell/`, `packages/metadata-ui/` | `pnpm ui:guard:scan` | | |
| **Backend** | `apps/erp/src/lib/`, server actions | ERP tests | | |
| **API** | `apps/erp/src/app/api/`, contracts | `check:api-contracts` | | |
| **Contracts** | `packages/kernel/src/contracts/`, OpenAPI | `check:openapi-drift` | | |
| **Database** | `packages/database/src/schema/` | `quality:migrations` | | |
| **ORM** | Drizzle schemas + services | database tests | | |
| **Authentication** | `packages/auth/` | auth PKG tests | | |
| **Authorization** | `packages/permissions/`, `authorize-api-route.ts` | RBAC boundary gate | | |
| **RLS** | RLS registry + policies | `check:database-tenant-rls-coverage` | | |
| **Caching** | Next.js cache, revalidate | source grep | | |
| **Validation** | Zod schemas at boundaries | contract tests | | |
| **Background Jobs** | `packages/execution/`, Trigger | execution tests | | |
| **Events** | kernel events, outbox | outbox tests | | |
| **Audit** | observability + DB audit tables | `quality:erp-observability` | | |
| **Logging** | Pino adapters | diagnostic logging gate | | |
| **Configuration** | env governance skill | `env-var-governance` patterns | | |
| **Secrets** | no .env in repo; Vercel/Supabase | grep + docs | | |
| **Feature Flags** | `packages/feature-flags/` | PKG tests | | |
| **Error Handling** | ProblemDetail, server-action-result | error-handling skill patterns | | |
| **Accessibility** | frontend audit Phase 8 | WCAG checklist | | |
| **Localization** | kernel LocalizationContext | kernel context tests | | |
| **Internationalization** | next-intl if present | apps grep | | |
| **Performance** | frontend audit Phase 9 | bundle / RSC | | |
| **Security** | afenda-security-auditor report | STRIDE + OWASP | | |
| **Developer Tooling** | biome, vitest, husky, cursor hooks | AGENTS.md | | |
| **Testing** | vitest.shared.ts, packages/testing | `pnpm test:run` | | |
| **Release Pipeline** | `.github/workflows/` | CI yaml | | |
| **Infrastructure** | Supabase, Vercel, R2 storage | supabase + storage PKG | | |
| **Cloud Readiness** | stateless app, managed DB | architecture narrative | | |
| **Disaster Recovery** | backup/runbook docs | docs grep | | |
| **Operational Excellence** | observability, admin diagnostics | system-admin routes | | |

---

## Integration flows (trace one path with evidence)

Document at least three end-to-end flows:

1. **Authenticated API mutation** — session → context → RBAC → handler → audit → outbox
2. **Metadata workspace preview** — UI → server action → authorization → render context
3. **Context switch** — client action → resolver → session workspace

For each step: file:line or **"Not evidenced."**

---

## Phase 3 outputs

Feed deliverables **9 Security Assessment**, **10 Scalability Assessment**, **13 Domain Model Assessment**.
