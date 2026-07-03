# Phase 6 — Architecture Risk Register

Produce an enterprise risk register from gaps and assessment findings.

---

## Risk entry template

```md
### RISK-NNN — <short title>

| Field | Value |
| --- | --- |
| **Risk ID** | RISK-NNN |
| **Category** | Security / Architecture / Operational / Compliance / Data / Performance |
| **Description** | |
| **Likelihood** | Rare / Unlikely / Possible / Likely / Almost certain |
| **Impact** | Negligible / Minor / Moderate / Major / Catastrophic |
| **Severity** | Low / Medium / High / Critical (Likelihood × Impact matrix) |
| **Evidence** | `path:line` or gate — or "Not evidenced." |
| **Affected Packages** | |
| **Affected Runtime** | e.g. API auth path, RLS policy |
| **Recommended Action** | |
| **Priority** | P0–P3 |
| **Owner** | team/role (recommend only) |
| **Confidence** | High / Medium / Low |
```

---

## Severity matrix (default)

| | Negligible | Minor | Moderate | Major | Catastrophic |
| --- | --- | --- | --- | --- | --- |
| **Almost certain** | Medium | High | High | Critical | Critical |
| **Likely** | Low | Medium | High | High | Critical |
| **Possible** | Low | Low | Medium | High | High |
| **Unlikely** | Low | Low | Low | Medium | High |
| **Rare** | Low | Low | Low | Low | Medium |

---

## Risk register summary

```md
## Enterprise Risks

| Risk ID | Severity | Category | One-line | Priority |
| --- | --- | --- | --- | --- |
| RISK-001 | Critical | Security | ... | P0 |

**Total:** N risks | Critical: N | High: N
```

Feed **Deliverable 6 — Enterprise Risks**.
