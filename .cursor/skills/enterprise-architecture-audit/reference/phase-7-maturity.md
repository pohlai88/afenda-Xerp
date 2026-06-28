# Phase 7 — Enterprise Maturity Model

Assess maturity **Level 1 (Ad Hoc)** through **Level 5 (Optimized)** per capability.

---

## Maturity levels

| Level | Name | Characteristics |
| --- | --- | --- |
| 1 | Ad Hoc | No standard; reactive |
| 2 | Repeatable | Basic process; some gates |
| 3 | Defined | Documented PAS/ADR; enforced gates |
| 4 | Managed | Measured; drift detection; CI proof |
| 5 | Optimized | Continuous improvement; 9.5+ benchmark |

---

## Capability scorecard

| Capability | L1 | L2 | L3 | L4 | L5 | Score | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Package / layer governance | | | | | | /5 | architecture-authority gates |
| Kernel identity constitution | | | | | | /5 | kernel identity governance |
| Multi-tenancy / operating context | | | | | | /5 | multi-tenancy gates |
| Authentication / SSO | | | | | | /5 | auth PKG + ARCH-AUTH |
| Authorization / RBAC | | | | | | /5 | permissions + API RBAC |
| API contract governance | | | | | | /5 | check:api-contracts |
| Database / migrations / RLS | | | | | | /5 | quality:migrations + RLS |
| Audit / observability | | | | | | /5 | erp-observability |
| Event / outbox / jobs | | | | | | /5 | execution PKG |
| Metadata-driven UI | | | | | | /5 | metadata-ui + ui-composition |
| Design system / UI governance | | | | | | /5 | ui:guard + TIP-004 |
| CSS token authority (PAS-005) | | | | | | /5 | css-authority gates |
| Testing / Prove-It | | | | | | /5 | vitest + interaction |
| CI/CD / quality gates | | | | | | /5 | pnpm quality |
| Documentation / runtime truth | | | | | | /5 | documentation-drift |
| Enterprise knowledge (PAS-004) | | | | | | /5 | knowledge-conformance |
| AI governance | | | | | | /5 | quality:ai-governance |
| Feature flags / entitlements | | | | | | /5 | feature-flags PKG |
| Storage / tenant assets | | | | | | /5 | storage PKG |
| Accounting readiness (contracts) | | | | | | /5 | accounting-domain-contracts |

**Mark exactly one level column per row** (e.g. ✓ under L4).

---

## Overall maturity

```md
## Enterprise Maturity Summary

**Mean capability level:** X.X / 5
**Lowest capabilities:** ...
**Highest capabilities:** ...
```

Include in final report narrative; supports **Deliverable 2** and **Deliverable 20**.
