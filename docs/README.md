# Afenda ERP Documentation

Human-readable source of truth for architecture, governance, package authority standards (PAS), and AI development policy.

**Hierarchy (when artifacts disagree, higher wins):**

```text
ADR  >  docs/PAS/  >  docs/PAS/*-registry.md  >  pre-accounting-foundation-roadmap.md  >  skills / AGENTS.md
```

Machine enforcement lives in `packages/*` and CI (`pnpm quality`, `pnpm ui:guard`). Docs lead; code enforces.

---

## Start here

### AI / Cursor agents (mandatory read order)

1. [`PAS/README.md`](PAS/README.md) — Package Authority Standards (canonical implementation handoffs)
2. [`architecture/afenda-runtime-truth-matrix.md`](architecture/afenda-runtime-truth-matrix.md) — status source of truth (ADR-0009)
3. [`architecture/pre-accounting-foundation-roadmap.md`](architecture/pre-accounting-foundation-roadmap.md) — delivery sequence (ADR-0013)
4. [`architecture/_afenda-erp-master-plan.llms.md`](architecture/_afenda-erp-master-plan.llms.md) v5 — strategic compass (narrative only)
5. [`architecture/afenda-documentation-drift-audit.md`](architecture/afenda-documentation-drift-audit.md) — drift findings
6. ADR-0009–0014 — Accepted foundation documentation gates
7. [`architecture/foundation-disposition.md`](architecture/foundation-disposition.md) + registry — package lanes and gates

**Do not start from removed legacy ARCH or delivery roadmap trees.**

| Audience | Entry point |
|----------|-------------|
| New contributor | [Root README](../README.md) → [Architecture](architecture/README.md) |
| AI / Cursor agent | See mandatory read order above → [AGENTS.md](../AGENTS.md) → `.cursor/skills/afenda-coding-session/SKILL.md` |
| Kernel / PAS work | [PAS-001](PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) → `.cursor/skills/kernel-authority/SKILL.md` |
| UI block install | [afenda-ui-quality skill](../.cursor/skills/afenda-ui-quality/SKILL.md) → `pnpm ui:guard` |
| React ERP quality | [react-erp-quality skill](../.cursor/skills/react-erp-quality/SKILL.md) → Gate F in `scripts/governance/ui-guard.mjs` |
| API routes | [REST API governance](architecture/afenda-rest-api-governance.md) · [platform-api-contract skill](../.cursor/skills/platform-api-contract/SKILL.md) |
| Multi-tenancy | [multi-tenancy.md](architecture/multi-tenancy.md) |
| Pre-accounting roadmap | [pre-accounting-foundation-roadmap.md](architecture/pre-accounting-foundation-roadmap.md) |
| Runtime truth / drift audit | [afenda-runtime-truth-matrix.md](architecture/afenda-runtime-truth-matrix.md) · [afenda-documentation-drift-audit.md](architecture/afenda-documentation-drift-audit.md) · [monorepo-feature-inventory.md](architecture/monorepo-feature-inventory.md) |
| LLM master plan | [_afenda-erp-master-plan.llms.md](architecture/_afenda-erp-master-plan.llms.md) v5 |

---

## Directory map

| Directory | Purpose |
|-----------|---------|
| [`adr/`](adr/README.md) | Architecture Decision Records (constitutional) |
| [`PAS/`](PAS/README.md) | Package Authority Standards — canonical long-form standards and slice handoffs |
| [`architecture/`](architecture/README.md) | Registries, baselines, CSS authority, glossary, REST API governance |
| [`ai/`](ai/README.md) | AI-assisted development policy |

**Retired (2026-06-27):** ARCH and delivery roadmap trees — premature architecture/dev roadmaps superseded by PAS.

---

## Quality commands (quick reference)

| Command | What it checks |
|---------|----------------|
| `pnpm ui:guard` | UI governance gates A–F (Gate F warns in dev) |
| `pnpm ui:guard:scan` | Gate D only — Governed UI + anti-slop (< 2 s) |
| `pnpm ui:guard:erp` | Gate F only — React ERP quality |
| `pnpm ui:guard:strict` | All gates; Gate F is a hard failure |
| `pnpm quality:css` | CSS manifest + token authority (Gate E) |
| `pnpm quality:architecture` | Package registry, layers, dependencies |
| `pnpm quality:ai-governance` | AI scope and drift policy |
| `pnpm check:documentation-drift` | PAS presence, ADR index, authority files, fingerprint sync (ADR-0009) |
| `pnpm quality:documentation-drift` | Same gate in quality chain |
| `pnpm check` | Biome + typecheck + test:run |

Full gate breakdown: [`scripts/governance/ui-guard.mjs`](../scripts/governance/ui-guard.mjs) · [`.cursor/rules/governed-ui-consumption.mdc`](../.cursor/rules/governed-ui-consumption.mdc).

---

## LLM compass

[`architecture/_afenda-erp-master-plan.llms.md`](architecture/_afenda-erp-master-plan.llms.md) v5 — strategic roadmap. **Supersedes v4.** Not authoritative when it conflicts with ADR-0009–0014, runtime matrix, PAS, or pre-accounting roadmap.

---

*Last structural audit: 2026-06-27 — legacy ARCH/delivery retired; PAS canonical*
