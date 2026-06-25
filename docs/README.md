# Afenda ERP Documentation

Human-readable source of truth for architecture, governance, delivery evidence, and AI development policy.

**Hierarchy (when artifacts disagree, higher wins):**

```text
ADR  >  docs/architecture/*-registry.md  >  pre-accounting-foundation-roadmap.md  >  docs/delivery/tips/[status] tip-*.md  >  skills / AGENTS.md
```

Machine enforcement lives in `packages/*` and CI (`pnpm quality`, `pnpm ui:guard`). Docs lead; code enforces.

---

## Start here

### AI / Cursor agents (mandatory read order)

1. [`architecture/pre-accounting-foundation-roadmap.md`](architecture/pre-accounting-foundation-roadmap.md) — delivery sequence (ADR-0013)
2. [`architecture/afenda-runtime-truth-matrix.md`](architecture/afenda-runtime-truth-matrix.md) — status source of truth (ADR-0009)
3. [`delivery/tip-status-index.md`](delivery/tip-status-index.md) — current TIP statuses (ADR-0012)
4. [`architecture/_afenda-erp-master-plan.llms.md`](architecture/_afenda-erp-master-plan.llms.md) v5 — strategic compass (narrative only)
5. [`architecture/afenda-documentation-drift-audit.md`](architecture/afenda-documentation-drift-audit.md) — drift findings
6. ADR-0009–0013 — Accepted foundation documentation gates
7. Individual [`delivery/tip-*.md`](delivery/) — evidence only; defer to index + matrix on conflict

**Do not start from stale delivery docs or master plan v4 sections.**

| Audience | Entry point |
|----------|-------------|
| New contributor | [Root README](../README.md) → [Architecture](architecture/README.md) |
| AI / Cursor agent | See mandatory read order above → [AGENTS.md](../AGENTS.md) → `.cursor/skills/afenda-coding-session/SKILL.md` |
| UI block install | [afenda-ui-quality skill](../.cursor/skills/afenda-ui-quality/SKILL.md) → [UI guard](governance/ui-guard.md) |
| React ERP quality | [react-erp-quality skill](../.cursor/skills/react-erp-quality/SKILL.md) → Gate F in [UI guard](governance/ui-guard.md) |
| API routes | [API contract](governance/api-contract.md) → [Next.js API hardening](governance/nextjs-api-hardening.md) |
| Multi-tenancy | [multi-tenancy.md](architecture/multi-tenancy.md) |
| Pre-accounting roadmap | [pre-accounting-foundation-roadmap.md](architecture/pre-accounting-foundation-roadmap.md) |
| Runtime truth / drift audit | [afenda-runtime-truth-matrix.md](architecture/afenda-runtime-truth-matrix.md) · [afenda-documentation-drift-audit.md](architecture/afenda-documentation-drift-audit.md) · [monorepo-feature-inventory.md](architecture/monorepo-feature-inventory.md) |
| LLM master plan | [_afenda-erp-master-plan.llms.md](architecture/_afenda-erp-master-plan.llms.md) v5 |

---

## Directory map

| Directory | Purpose |
|-----------|---------|
| [`adr/`](adr/README.md) | Architecture Decision Records (constitutional) |
| [`architecture/`](architecture/README.md) | Registries, baselines, CSS authority, glossary |
| [`ARCH/`](ARCH/README.md) | Domain architecture authorities — [`arch-status-index.md`](ARCH/arch-status-index.md) |
| [`governance/`](governance/README.md) | Runtime policies — UI guard, API contracts, composition |
| [`delivery/`](delivery/README.md) | TIP completion evidence and implementation reports |
| [`ai/`](ai/README.md) | AI-assisted development policy (TIP-002) |

---

## Quality commands (quick reference)

| Command | What it checks |
|---------|----------------|
| `pnpm ui:guard` | UI governance gates A–F (Gate F warns in dev) |
| `pnpm ui:guard:scan` | Gate D only — TIP-004 + anti-slop (< 2 s) |
| `pnpm ui:guard:erp` | Gate F only — React ERP quality |
| `pnpm ui:guard:strict` | All gates; Gate F is a hard failure |
| `pnpm quality:css` | CSS manifest + token authority (Gate E) |
| `pnpm quality:architecture` | Package registry, layers, dependencies |
| `pnpm quality:ai-governance` | AI scope and drift policy |
| `pnpm check:documentation-drift` | Stale TIP markers, ADR index, authority files, fingerprint sync (ADR-0009) |
| `pnpm quality:documentation-drift` | Same gate in quality chain |
| `pnpm check` | Biome + typecheck + test:run |

Full gate breakdown: [`governance/ui-guard.md`](governance/ui-guard.md).

---

## LLM compass

[`architecture/_afenda-erp-master-plan.llms.md`](architecture/_afenda-erp-master-plan.llms.md) v5 — strategic roadmap. **Supersedes v4.** Not authoritative when it conflicts with ADR-0009–0013, runtime matrix, or pre-accounting roadmap.

---

*Last structural audit: 2026-06-23 — TIP-000D complete*
