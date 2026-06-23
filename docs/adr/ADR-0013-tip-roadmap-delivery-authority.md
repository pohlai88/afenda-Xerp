# ADR-0013 — TIP Roadmap Is the Delivery Authority

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-23 |
| **Owner** | Architecture Authority |
| **Supersedes** | Master plan v4 informal execution order (Section 8) |
| **Superseded by** | — |

---

## Context

Delivery work was tracked across multiple artifacts with conflicting status:

- Master plan v4 two-track model (Track A governance + Track B UI)
- ADR-0001 Phase 1 TIP definitions (TIP-001–012)
- Individual `docs/delivery/tip-*.md` files with stale statuses
- Merged delivery doc `tip-007-012-enterprise-group-operating-context.md`

AI agents need a **single ordered delivery sequence** with explicit phase gates — especially for the pre-accounting foundation that must complete before Accounting Core.

Missing directories (recorded, not created):

- `docs/tip/` — does not exist
- `docs/roadmap/` — does not exist

---

## Decision

1. **[`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md)** is the **delivery authority** for Foundation Phases 0–9.
2. **Authority hierarchy for delivery scope:**
   ```text
   ADR > Registry > pre-accounting-foundation-roadmap > docs/delivery/tip-*.md > master plan narrative
   ```
3. Individual TIP delivery docs remain **evidence artifacts** for their slice — not the ordering authority when they conflict with the foundation roadmap.
4. New foundation TIPs use `TIP-000A`–`TIP-000D` prefix for documentation reset; business domain TIPs remain `TIP-013+`.
5. UI implementation TIPs (`TIP-UI-01`–`TIP-UI-06`) remain valid but are **nested under Foundation Phase 6** in the pre-accounting roadmap.
6. Phase gate checklists in the foundation roadmap are **mandatory** before advancing phases.

---

## Consequences

### Positive

- Unambiguous next-TIP for AI agents.
- Resolves Track A / Track B parallelism confusion via phased sequencing.
- Accounting start gated by Phase 9, not vague "exit gate" language.

### Negative / trade-offs

- Requires maintaining roadmap + matrix alongside per-TIP delivery docs.
- Some parallel work still possible within a phase — roadmap defines minimum order.

---

## Acceptance Gate

- [x] `pre-accounting-foundation-roadmap.md` published with Phases 0–9
- [x] Master plan v5 references foundation roadmap as delivery authority
- [x] ADR-0010 accounting prohibition linked from roadmap Phase 9
- [x] `docs/architecture/README.md` indexes foundation roadmap
- [x] `docs/delivery/tip-status-index.md` published

---

## References

- ADR-0001 Phase 1 Foundation Redefinition
- [`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) v5
- [`docs/delivery/README.md`](../delivery/README.md)
