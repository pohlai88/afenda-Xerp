# ADR-0014 — Foundation Disposition Registry

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-24 |
| **Owner** | Architecture Authority |
| **Supersedes** | ADR-0013 §2 implementation-handoff hierarchy (foundation packages) |
| **Superseded by** | — |

---

## Context

Multiple subagents implement foundation packages against inconsistent package truth. Delivery TIP markdown files mix historical delivery receipts with architecture authority. Agents interpret status files differently, duplicate constants, and treat markdown as runtime truth.

This ADR establishes a **single machine-readable registry** as the subagent source of truth for package disposition. Markdown docs become read-only views. TIP delivery docs are quarantined as historical evidence only.

**No TIPE framework is approved.** TIP is not extended or replaced — it is archived as delivery evidence.

---

## Decision

1. **Authority file:** `packages/architecture-authority/src/data/foundation-disposition.registry.ts` is the canonical package disposition registry.
2. **Lane vocabulary:** Closed set — `red-lane`, `amber-lane`, `green-lane`, `blue-lane`, `black-lane`, `archive-lane`.
3. **TIP role:** TIP delivery docs under `docs/PAS/CSS-AUTHORITY/SLICE/` are `archive-lane` historical evidence only. TIP is not package authority.
4. **Registry owner:** Only the `foundation-registry-owner` subagent may edit the registry. All other agents consume it read-only.
5. **Subagent contract:** Before touching foundation packages, agents must read the registry and respect `lane`, `prohibited`, and `allowedAgents`.
6. **Generated view:** `docs/architecture/foundation-disposition.md` is a read-only report synced from the registry — not authority.
7. **Enterprise benchmark:** Subagents must apply `.cursor/skills/enterprise-erp-standards/SKILL.md` when working on `red-lane` or `amber-lane` entries.

### Lane definitions

| Lane | Meaning |
|------|---------|
| `red-lane` | Must be resolved before accounting agents run |
| `amber-lane` | Incomplete but bounded; safe if scope is not expanded |
| `green-lane` | Stable and consumable |
| `blue-lane` | Incubating; no production dependency; not `requiredBeforeAccounting` |
| `black-lane` | ADR-gated; do not touch without ADR |
| `archive-lane` | Historical delivery evidence only |

### Phase 9 accounting readiness rule

Accounting agents (`TIP-014+`, `@afenda/accounting`) may run only when:

- No registry entry remains in `red-lane` with open `knownGaps`.
- No route/registry/doc claims implementation that runtime does not prove.
- No accounting dependency points to `blue-lane`, `black-lane`, or `archive-lane` unless explicitly allowed by ADR.

---

## Consequences

### Positive

- All subagents consume identical typed constants — no markdown interpretation drift.
- Disposition is lane-based, not score-based — surgical gate clarity.
- TIP docs remain as audit trail without polluting package authority.
- CI enforces registry integrity via `pnpm check:foundation-disposition`.

### Negative / trade-offs

- Registry must be manually synced to `foundation-disposition.md` until a generator script is added.
- Only one agent may edit the registry per session — slower parallel doc updates.

---

## Acceptance Gate

```bash
pnpm --filter @afenda/architecture-authority typecheck
pnpm --filter @afenda/architecture-authority test:run
pnpm check:foundation-disposition
pnpm quality:architecture
pnpm check:documentation-drift
pnpm ci:biome
```

Registry validator rules (all must pass):

1. Red-lane entries must have at least one gate.
2. Red-lane entries must have at least one evidence path.
3. `packageId` must exist in `package-registry.data.ts` (except `archive-lane`).
4. Non-archive entries must not use `legacyTipEvidence` as sole authority.
5. Blue-lane entries must not set `requiredBeforeAccounting: true`.
6. Every entry must have at least one `prohibited` rule.
7. Red-lane entries must have non-empty `allowedAgents`.

Optional agent assignment check:

```bash
pnpm check:foundation-disposition -- --agent erp-app-agent --entry PKG007_ADMIN
```

---

## References

- **FDR workflow (canonical):** [`docs/architecture/foundation-delivery-authority.md`](../architecture/foundation-delivery-authority.md)
- Registry: [`packages/architecture-authority/src/data/foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts)
- Read-only view: [`docs/architecture/foundation-disposition.md`](../architecture/foundation-disposition.md)
- Package registry: [`docs/architecture/package-registry.md`](../architecture/package-registry.md)
- Enterprise standards skill: [`.cursor/skills/enterprise-erp-standards/SKILL.md`](../../.cursor/skills/enterprise-erp-standards/SKILL.md)
- Related ADRs: ADR-0010, ADR-0012, ADR-0013
