# AI Development Governance

| Field | Value |
|-------|-------|
| **Status** | Active |
| **Owner** | Architecture Authority |
| **TIP** | TIP-002 — AI Development Governance |
| **ADR** | [ADR-0007](../adr/ADR-0007-ai-development-governance.md) |
| **Fingerprint** | `AI-GOV-BASELINE-2026-06-20-v1` |
| **Package** | `@afenda/ai-governance` |

## Hierarchy

```text
ADR-0007  >  docs/ai/*  >  .tip-scope.json  >  @afenda/ai-governance  >  CI
```

TIP-001 architecture authority remains the source of truth for packages, layers, ownership, and dependencies. AI governance adds scope contracts and AI-specific invariants on top.

## Documents

| Document | Purpose |
|----------|---------|
| [ai-development-governance.md](./ai-development-governance.md) | Master policy, invariants, DoD |
| [ai-change-boundaries.md](./ai-change-boundaries.md) | Allowed/prohibited changes, scope manifest |
| [ai-prompt-policy.md](./ai-prompt-policy.md) | Prompt and attestation requirements |
| [ai-review-checklist.md](./ai-review-checklist.md) | Human review gates |
| [ai-drift-policy.md](./ai-drift-policy.md) | Drift indicators and rollback |

## Commands

```bash
pnpm quality:ai-governance                              # baseline (main)
pnpm quality:ai-governance -- --scope .tip-scope.json   # PR scope validation
pnpm --filter @afenda/ai-governance test:run
```

## 9.5 Command Principle

```text
AI can only change what the TIP explicitly allows.
AI can only add packages/deps approved by TIP-001.
AI cannot hide errors.
AI cannot create duplicate architecture.
AI cannot touch ERP feature code during governance work.
```

## Related

- Documentation index: [`docs/README.md`](../README.md)
- UI guard gates: [`docs/governance/ui-guard.md`](../governance/ui-guard.md)
