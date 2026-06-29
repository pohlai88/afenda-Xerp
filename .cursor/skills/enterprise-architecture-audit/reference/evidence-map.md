# Evidence Map — Runtime Truth Sources

Use this map before every phase. **Read sources in order; cite what you inspected.**

---

## Tier 1 — Primary runtime authority

| Source | Path | Use for |
| --- | --- | --- |
| Runtime truth matrix | `docs/PAS/pas-status-index.md` | Area status, evidence pointers, gaps |
| Foundation disposition | `packages/architecture-authority/src/data/foundation-disposition.registry.ts` | Package lanes, allowedAgents, prohibited |
| Package registry | `packages/architecture-authority/src/data/package-registry.data.ts` | Package topology, layers |
| Dependency registry | `packages/architecture-authority/src/data/dependency-registry.data.ts` | Allowed edges |
| Ownership registry | `packages/architecture-authority/src/data/ownership-registry.data.ts` | Module ownership |
| PAS index | `docs/PAS/README.md` · `docs/PAS/pas-status-index.md` | Delivery authority (compare to runtime) |
| ADR index | `docs/adr/` | Constitutional decisions |

---

## Tier 2 — Application and platform runtime

| Area | Primary paths | Tests / gates |
| --- | --- | --- |
| ERP app | `apps/erp/src/` | `pnpm --filter @afenda/erp test:run` |
| Auth | `packages/auth/` · `apps/erp/src/app/api/auth/` | `pnpm check:auth-user-id-rbac-boundary` |
| Context / tenancy | `apps/erp/src/lib/context/` | `pnpm check:multi-tenancy-*` |
| API routes | `apps/erp/src/app/api/` · `apps/erp/src/server/api/contracts/` | `pnpm check:api-contracts` |
| Database | `packages/database/src/schema/` | `pnpm quality:migrations` · `pnpm check:database-tenant-rls-coverage` |
| Kernel | `packages/kernel/src/` | `pnpm quality:kernel-context-surface` · `pnpm check:kernel-identity-governance` |
| Permissions | `packages/permissions/` | `pnpm check:permissions-scope-grants-surface` |
| Observability / audit | `packages/observability/` · `packages/database/src/audit/` | `pnpm quality:erp-observability` |
| Execution / outbox | `packages/execution/` · `apps/erp/src/lib/outbox/` | PKG008 tests |
| Metadata | `packages/ui-composition/` · `packages/metadata-ui/` | metadata-ui tests |
| AppShell | `packages/appshell/` | `pnpm check:appshell-context-surface` |
| UI / design | `packages/ui/` · `packages/css-authority/` | `pnpm ui:guard` |

---

## Tier 3 — Aggregated quality gates

| Command | Scope |
| --- | --- |
| `pnpm quality:architecture` | Package/layer boundaries |
| `pnpm quality:boundaries` | Import direction |
| `pnpm check:foundation-disposition` | Registry sync |
| `pnpm check:documentation-drift` | Docs vs runtime |
| `pnpm check` | Wide CI hygiene (when full audit) |
| `pnpm quality` | Full composite (long — orchestrator schedules) |

Full mapping: [gate-matrix.md](gate-matrix.md)

---

## Tier 4 — Architecture documentation (hypothesis — verify against Tier 1–3)

| Doc | Path |
| --- | --- |
| Multi-tenancy model | `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md` |
| Glossary | `docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md` |
| Foundation disposition (human) | `packages/architecture-authority/src/data/foundation-disposition.registry.ts` |
| Dependency snapshot | `packages/architecture-authority/dependency-snapshot.json` |
| Master plan (v5+) | `docs/PAS/_afenda-erp-master-plan.llms.md` |

---

## Evidence citation checklist

For each finding, record at least one:

- [ ] `file:line` from source read
- [ ] Test file + assertion reference
- [ ] Gate command + exit code + relevant output line
- [ ] Registry row ID + field value
- [ ] **"Not evidenced."** if none of the above exist

---

## Scoped audit shortcuts

| Scope | Minimum reads |
| --- | --- |
| `packages/kernel` | PAS-001, kernel package.json, `src/index.ts`, context/contracts/identity, kernel gates |
| `apps/erp` | ERP layout, context, api, lib/outbox, erp tests, erp-context gates |
| `packages/database` | schema/, migrations/, RLS registry, tenant-domain gates |
| Full monorepo | Tier 1 all + sample from each Tier 2 area + gate-matrix subset |
