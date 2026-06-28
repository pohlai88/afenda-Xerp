# Phase 5 — Enterprise Readiness

Evaluate readiness with **Evidence**, **Partial**, or **Not evidenced** per row.

---

## Multi-entity readiness

| Capability | Evidence | Status | Notes |
| --- | --- | --- | --- |
| Multi Tenant | tenants table, RLS, resolver | | |
| Multi Company | companies, legal entity context | | |
| Multi Organization | organizations tree | | |
| Multi Project | to-project-context, TIP-030 | | |
| Multi Team | org.type=team | | |
| ERP Scale (module manifest) | entitlements + feature manifest | | |

---

## Scale tiers

| Users | Evidence for current architecture | Status |
| --- | --- | --- |
| 100 | single-region Vercel + Supabase | |
| 1,000 | connection pooling, RLS | |
| 10,000 | outbox, read replicas | |
| 100,000 | horizontal scaling design | |
| 1M | sharding / multi-region | |

---

## Deployment and operations

| Pattern | Evidence | Status |
| --- | --- | --- |
| Horizontal scaling | stateless Next.js | |
| Cloud native | Vercel + Supabase + R2 | |
| Zero downtime deployment | CI + migration strategy | |
| Blue/Green | | |
| Canary | feature flags | |
| Geo-distributed | | |
| High availability | Supabase HA tier | |
| Disaster recovery | backup docs/runbooks | |

---

## Compliance frameworks

Map controls to Afenda gates (compliance-evidence-collector pattern):

| Framework | Control area | Afenda gate / evidence | Status |
| --- | --- | --- | --- |
| SOX | Audit on financial mutations | `quality:erp-observability` | |
| ISO 27001 | Access control | RBAC + RLS gates | |
| SOC2 | Logging + change control | CI + audit registry | |
| GDPR | Data isolation, export | tenancy + auth | |
| Audit readiness | mutation audit entries | system-admin audit gate | |
| Financial system | accounting contracts-only | `check:accounting-domain-contracts` | |
| Enterprise procurement | PAS + ADR traceability | foundation-disposition | |

---

## Readiness matrix template

```md
## Enterprise Readiness Matrix

| Dimension | Ready | Partial | Not evidenced | Blocker |
| --- | ---: | ---: | ---: | --- |
| Multi-tenant isolation | | | | |
| ... | | | | |

**Overall readiness verdict:** Ready / Conditional / Not ready
**Conditions:** ...
```

Feed **Deliverable 15 — Enterprise Readiness Matrix**.
