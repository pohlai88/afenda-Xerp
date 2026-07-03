# Phase 4 — Gap Analysis

Identify every gap from Phases 1–3. Categorize and document with full fields.

---

## Severity categories

| Category | Definition |
| --- | --- |
| **Critical** | Production/security/data-integrity blocker |
| **High** | Enterprise gate failure or major drift |
| **Medium** | Partial implementation or missing test/gate |
| **Low** | Polish, DX, non-blocking drift |
| **Technical Debt** | Known shortcuts with waiver |
| **Architecture Debt** | Boundary or ownership violation |
| **Governance Debt** | Registry/docs/PAS out of sync |
| **Security Debt** | Missing control without active exploit path |
| **Documentation Debt** | Docs contradict runtime |
| **Testing Debt** | Missing or flaky coverage |
| **Operational Debt** | Runbook, DR, observability gap |
| **Compliance Debt** | SOX/GDPR/SOC2 evidence missing |
| **Developer Experience Debt** | Tooling friction |

---

## Gap register template (one row per issue)

```md
### GAP-NNN — <title>

| Field | Value |
| --- | --- |
| **Category** | Critical / High / … |
| **Current evidence** | `path:line` or gate output |
| **Why it is a problem** | |
| **Business impact** | |
| **Technical impact** | |
| **Long-term risk** | |
| **Recommended resolution** | (Phase 8+ only for implementation detail) |
| **Estimated complexity** | S / M / L / XL |
| **Priority** | P0–P3 |
| **Confidence** | High / Medium / Low |
```

---

## Aggregation summary

```md
## Gap Summary

| Severity | Count |
| --- | ---: |
| Critical | |
| High | |
| Medium | |
| Low | |
| Debt (all types) | |

### Top 10 gaps by priority
1. GAP-001 — ...
```

Feed deliverables **7 Technical Debt Register**, **8 Governance Gaps**, **16 Top 50**, **17 Quick Wins**, **18 Strategic Improvements**.
