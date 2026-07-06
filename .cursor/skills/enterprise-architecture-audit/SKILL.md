---
name: enterprise-architecture-audit
description: >
  Read-only full-stack enterprise architecture assessment of the Afenda ERP monorepo.
  Builds runtime-evidence mental model before any judgement; scores architecture,
  security, scalability, governance, and readiness to 9.5/10 enterprise benchmark.
  Use when auditing the entire platform end-to-end, producing gap/risk registers,
  maturity scores, or runtime-vs-documented drift analysis. Never modifies code.
disable-model-invocation: true
---

# Enterprise Architecture Audit

> Target: **9.5/10 enterprise quality** — World-Class Enterprise Platform benchmark.
>
> Stack: Turborepo · pnpm workspaces · Next.js App Router · `@afenda/kernel` · PAS/ADR constitution · 30+ governance gates.

---

## Operator mandate (verbatim — do not soften)

```txt
THE AGENT IS USING ENTERPRISE ARCHITECTURE AUDIT.
```

**The first user-visible line of every reply must be that sentence exactly.**

### Objective

Before writing any code, modifying any file, or proposing any refactoring, perform a complete enterprise architecture assessment of the current codebase.

Do NOT assume the documentation is correct.

Treat the source code as the runtime truth.

Your responsibility is to build a complete mental model of the entire ERP platform before making any judgement.

This is an architecture understanding exercise, not merely a static code review.

### Mission

Read, understand, and evaluate the entire monorepo from an Enterprise ERP perspective.

The expected quality target is:

Enterprise Grade 9.5/10

using modern enterprise software engineering practices adopted by organizations such as Microsoft, SAP, Oracle, Salesforce, Atlassian, Shopify, Stripe, AWS, Azure, Google Cloud and other large-scale SaaS platforms.

Every conclusion must be supported by runtime evidence from the existing codebase.

Never speculate.

If evidence cannot be found, explicitly state:

"Not evidenced."

Never invent architecture.

### Execution Rules

DO NOT modify code.

DO NOT create files.

DO NOT refactor.

DO NOT optimise.

DO NOT suggest implementations until the entire architecture has been understood.

Read first.

Understand second.

Evaluate third.

Recommend last.

---

## Read-only hard stops

```
Write / StrReplace / Delete on application or governance source
Refactor or optimize proposals before Phase 8 complete
Invent registry entries, permissions, tenant resolvers, or architecture
Score a dimension without file:line, test, or gate evidence
Skip Phase 1 repository understanding on full-platform scope
Spawn personas from worker agents (orchestrator only may fan-out Phase 3)
Apply afenda-presentation-quality fix-first mandate only outside audit mode (audit sections only in Phase 3)
Run coding-consistency-bundle preflight (audit mode). **Removed:** `ui-consistency-bundle`, `enterprise-frontend-audit` — use `afenda-presentation-quality` + `afenda-react-surface-quality` (see [NATIVE-EVALUATION.md](../NATIVE-EVALUATION.md)).
```

---

## Evidence contract

| Rule | Requirement |
| --- | --- |
| Runtime truth | Source code, tests, and gate output beat documentation |
| Citation format | `path:line`, test name, or pasted `pnpm` exit output |
| Missing evidence | State **"Not evidenced."** — never guess |
| Documentation | Compare PAS/ADR/matrix to runtime; record drift |
| Gates | Recommend from [reference/gate-matrix.md](reference/gate-matrix.md); orchestrator runs and pastes output |

Primary evidence index: [reference/evidence-map.md](reference/evidence-map.md)

---

## Audit Phase 0 — scope contract (before Phase 1)

State before any assessment:

```text
1. Audit mode     — full | resume | phase-only
2. Phase          — 1–8 (current)
3. Scope          — entire monorepo | explicit package/app paths
4. Mode           — read-only; no edits
5. Source truth   — code + tests + gates over docs
6. Output         — phase sections + checkpoint toward 20 deliverables
```

If scope is ambiguous, infer the smallest safe package scope and state it.

---

## Orchestration entry

| Intent | Entry |
| --- | --- |
| Full 8-phase deterministic audit | `@enterprise-architecture-audit-orchestrator` |
| Single phase or ad-hoc slice | Attach this skill + specify `Phase: N` |
| Continue prior audit | `@enterprise-architecture-audit-orchestrator` with `Audit mode: resume` |

Do not skip phases on full-platform audits without explicit `phase-only` contract.

---

## Skill bundle (mandatory reads before Phase 1)

| # | Skill | Path | Required when |
| --- | --- | --- | --- |
| 1 | architecture-authority | `.cursor/skills/architecture-authority/SKILL.md` | **Always** |
| 2 | enterprise-erp-standards | `.cursor/skills/enterprise-erp-standards/SKILL.md` | **Always** |
| 3 | pas-codebase-bridge | `.cursor/skills/pas-codebase-bridge/SKILL.md` | Phase 1, 8 |
| 4 | platform-cross-boundary-anti-pattern-scan | `.cursor/skills/platform-cross-boundary-anti-pattern-scan/SKILL.md` | Phase 1, 4 |
| 5 | multi-tenancy-erp | `.cursor/skills/multi-tenancy-erp/SKILL.md` | Phase 1, 5 |
| 6 | kernel-authority | `.cursor/skills/kernel-authority/SKILL.md` | Kernel / identity scope |
| 7 | platform-observability-usage | `.cursor/skills/platform-observability-usage/SKILL.md` | Audit / logging scope |
| 8 | platform-api-contract | `.cursor/skills/platform-api-contract/SKILL.md` | API / contract scope |
| 9 | monorepo-discipline | `.cursor/skills/monorepo-discipline/SKILL.md` | Topology / packages |
| 10 | afenda-presentation-quality + afenda-react-surface-quality | `.cursor/skills/afenda-presentation-quality/SKILL.md` + `.cursor/skills/afenda-react-surface-quality/SKILL.md` | Phase 3 frontend — **audit only** |

Composed agents (orchestrator Phase 3 fan-out):

- `.cursor/agents/afenda-governance-auditor.md`
- `.cursor/agents/afenda-security-auditor.md`

Documentation drift patterns (read-only): `.cursor/agents/documentation-drift.md`

---

## Phase map (8 phases — run in order)

```
Phase 1 → Repository Understanding     reference/phase-1-repository.md
Phase 2 → Enterprise Architecture Assessment   reference/phase-2-assessment.md
Phase 3 → Full Stack Review            reference/phase-3-full-stack.md
Phase 4 → Gap Analysis                 reference/phase-4-gaps.md
Phase 5 → Enterprise Readiness         reference/phase-5-readiness.md
Phase 6 → Architecture Risk Register   reference/phase-6-risks.md
Phase 7 → Enterprise Maturity Model    reference/phase-7-maturity.md
Phase 8 → North Star Alignment         reference/phase-8-north-star.md
```

Deliverable templates (20 sections): [reference/deliverables.md](reference/deliverables.md)

Scoring rubric: [reference/scoring.md](reference/scoring.md)

Gate matrix: [reference/gate-matrix.md](reference/gate-matrix.md)

### Phase 1 — Repository Understanding

Construct architectural understanding including: package topology, runtime composition, dependency graph, bounded contexts, module ownership, architecture layers, shared kernel, business modules, infrastructure, applications, design system, identity model, security model, tenancy model, authorization, audit architecture, execution model, API architecture, persistence architecture, event architecture, integration architecture, observability, deployment topology, CI/CD, quality gates, governance packages, architecture authority.

Identify **actual runtime** vs **documented architecture**. Highlight every drift.

### Phase 2 — Enterprise Architecture Assessment

Evaluate every package, module, application, shared library, and infrastructure component. Score each area independently (see phase-2 reference for 14 dimensions).

### Phase 3 — Full Stack Review

Review end-to-end: Frontend, Backend, API, Contracts, Database, ORM, Authentication, Authorization, RLS, Caching, Validation, Background Jobs, Events, Audit, Logging, Configuration, Secrets, Feature Flags, Error Handling, Accessibility, Localization, Internationalization, Performance, Security, Developer Tooling, Testing, Release Pipeline, Infrastructure, Cloud Readiness, Disaster Recovery, Operational Excellence.

### Phase 4 — Gap Analysis

Identify every gap. Categorize: Critical, High, Medium, Low, Technical Debt, Architecture Debt, Governance Debt, Security Debt, Documentation Debt, Testing Debt, Operational Debt, Compliance Debt, Developer Experience Debt.

For every issue: current evidence, why it is a problem, business impact, technical impact, long-term risk, recommended resolution, estimated complexity, priority, confidence level.

### Phase 5 — Enterprise Readiness

Evaluate readiness for: Multi Tenant, Multi Company, Multi Organization, Multi Project, Multi Team, ERP Scale, 100/1K/10K/100K/1M users, horizontal scaling, cloud native, zero downtime, blue/green, canary, geo-distributed, high availability, disaster recovery, regulated industries, SOX, ISO 27001, SOC2, GDPR, audit readiness, financial system readiness, enterprise procurement, long-term maintainability.

### Phase 6 — Architecture Risk Register

Each entry: Risk ID, Category, Description, Likelihood, Impact, Severity, Evidence, Affected Packages, Affected Runtime, Recommended Action, Priority, Owner, Confidence.

### Phase 7 — Enterprise Maturity Model

Assess maturity Level 1 (Ad Hoc) through Level 5 (Optimized) across every architectural capability. Score every capability.

### Phase 8 — North Star Alignment

Evaluate alignment with: PAS standards, ADR decisions, architecture authority, runtime truth, clean architecture, dependency rules, bounded contexts, package ownership, enterprise governance, semantic consistency, API contracts, identity standards, metadata standards, audit standards. Highlight every architectural drift.

**Implementation recommendations are permitted only after Phase 8 completes.**

---

## Expected deliverables (final report)

1. Executive Summary
2. Overall Enterprise Score
3. Architecture Scorecard
4. Strengths
5. Weaknesses
6. Enterprise Risks
7. Technical Debt Register
8. Governance Gaps
9. Security Assessment
10. Scalability Assessment
11. Runtime Drift Analysis
12. Architecture Drift Analysis
13. Domain Model Assessment
14. Full Dependency Assessment
15. Enterprise Readiness Matrix
16. Top 50 Recommended Improvements
17. Quick Wins
18. Strategic Improvements
19. Long-term Architecture Roadmap
20. Final Enterprise Grade

Templates: [reference/deliverables.md](reference/deliverables.md)

---

## Grading scale

| Score | Label |
| --- | --- |
| < 7.0 | Prototype |
| 7.0–8.0 | Production Ready |
| 8.0–9.0 | Enterprise Ready |
| 9.0–9.4 | Enterprise Excellent |
| 9.5–10 | World-Class Enterprise Platform |

Every conclusion must cite concrete code evidence. If evidence does not exist, state **"Not evidenced."**

---

## External research (when upstream API is uncertain)

1. **Context7 MCP** — resolve library ID → query exact API
2. **`npx skills find <query>`** — discover OSS agent skill patterns (optional)
3. **GitHub MCP** — search upstream reference implementations
4. Vendor [security-and-hardening](../vendor/agent-skills/skills/security-and-hardening/SKILL.md) — STRIDE lens for Phase 3 security
5. [`afenda-docs-writing`](../afenda-docs-writing/SKILL.md) — PAS/ADR prose evidence for Phase 8

Link skills and queries only — do not embed full tutorials in audit output.

---

## Completion report (required every audit turn)

```md
## Enterprise Architecture Audit — Checkpoint

### Turn scope
- Phase completed: N/8
- Scope: <paths>
- Mode: read-only

### Evidence quality
| Finding | Evidence | Or "Not evidenced" |
|---------|----------|---------------------|
| ... | path:line / gate output | |

### Gates run (orchestrator)
```bash
# paste actual shell output
```

### Scores this turn (partial until Phase 8)
| Dimension | Score | Evidence summary |
|-----------|-------|-------------------|
| Architecture | X.X/10 | ... |

### Deliverables progress
- Complete: [list 1–20]
- Next phase: N+1

### Open gaps by severity
- Critical: N | High: N | Medium: N | Low: N
```

---

## References

- Evidence map: [reference/evidence-map.md](reference/evidence-map.md)
- Runtime matrix: `docs/PAS/pas-status-index.md`
- Foundation registry: `packages/architecture-authority/src/data/foundation-disposition.registry.ts`
- PAS index: `docs/PAS/README.md`
- Orchestrator: `.cursor/agents/enterprise-architecture-audit-orchestrator.md`
- Worker: `.cursor/agents/enterprise-architecture-auditor.md`
