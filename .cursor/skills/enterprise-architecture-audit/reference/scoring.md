# Enterprise Architecture Scoring Rubric

Target: **9.5/10 overall** for World-Class Enterprise Platform label.

---

## 14 dimensions — weights

| Dimension | Weight | Primary gates / evidence |
| --- | ---: | --- |
| Architecture | 10% | `quality:architecture`, boundaries, registries |
| Maintainability | 8% | ownership registry, module cohesion |
| Scalability | 8% | RLS, outbox, stateless app |
| Extensibility | 8% | PAS lanes, kernel contracts |
| Security | 10% | RBAC, CSP, RLS, auth gates |
| Performance | 6% | ERP tests, frontend perf (Phase 3) |
| Reliability | 8% | outbox, audit, error envelopes |
| Observability | 7% | `quality:erp-observability` |
| Developer Experience | 7% | typecheck, biome, skills |
| API Governance | 7% | `check:api-contracts` |
| Domain Modelling | 8% | identity + BMD + glossary |
| Code Organization | 6% | monorepo discipline |
| Testability | 7% | vitest, interaction tests |
| Documentation | 10% | `check:documentation-drift`, matrix |

**Total weight:** 100%

---

## Overall score formula

```
Overall = Σ (dimension_score × weight)
```

Round to one decimal. Apply grade label from SKILL.md grading scale.

---

## Scoring rules

1. **No evidence → no score above 5.0** for that dimension unless explicitly marked "Not evidenced" with partial adjacent evidence noted.
2. **Gate failure** on a dimension's primary gate caps that dimension at **7.0** until gate passes.
3. **Critical finding** (Phase 4) in a dimension caps at **8.0** until resolved.
4. **World-Class (9.5+)** requires: all primary gates green for in-scope packages; no Critical gaps; documentation-drift pass.

---

## Dimension quick rubric (/10 each)

| Pts | Meaning |
| ---: | --- |
| 9.5–10 | Gate green + no Important gaps + benchmark parity |
| 9.0–9.4 | Gate green + minor gaps only |
| 8.0–8.9 | Enterprise ready; some Medium gaps |
| 7.0–7.9 | Production ready; High gaps or partial gates |
| < 7.0 | Prototype; Critical gaps or missing evidence |

---

## Package-level scoring (optional supplement)

When scope is single-package, weight dimensions by package relevance:

| Package type | Emphasize dimensions |
| --- | --- |
| `@afenda/kernel` | Architecture, Domain, Security, Extensibility |
| `apps/erp` | Full stack, Testability, DX |
| `packages/database` | Security (RLS), Reliability, Domain |
| `packages/ui` | Code org, Testability, Maintainability |

Document weight adjustment in audit checkpoint when used.
