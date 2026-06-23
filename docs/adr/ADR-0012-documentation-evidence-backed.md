# ADR-0012 — Documentation Must Be Evidence-backed by Runtime

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-23 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda's governance model states "Docs lead; code enforces" (ADR-0000) — meaning **registries and ADRs precede implementation**, not that documentation may ignore implementation once delivered.

Several delivery TIPs marked "Not started" while runtime code existed (TIP-UI-04 renderers, TIP-UI-05 auth migration). Conversely, the master plan marked kernel contexts "Missing" while `context-registry.ts` listed them as implemented.

**Aspirational documentation** (claiming complete without evidence) and **stale documentation** (claiming missing when code exists) are equally harmful.

---

## Decision

1. Every architecture or delivery claim of **implemented**, **complete**, or **missing** status must cite **runtime evidence:**
   - File paths (schema, component, contract, script)
   - Test files passing
   - Package export map entries
   - CI gate identifiers
2. Delivery TIP status values are restricted to:
   - `Complete` — all acceptance criteria met with evidence links
   - `Partial` — some criteria met; gaps listed with evidence
   - `Not started` — no runtime artifacts beyond planning docs
   - `Blocked` — upstream ADR/TIP/contract missing
   - `Evidence only` — misnumbered or superseded doc retained for audit trail
3. **Governance contracts ≠ implementation** remains valid (ADR-0001): a TIP may be "Complete (authority only)" — but this label must be explicit, not implied by registry existence alone.
4. Documentation drift audits (`afenda-documentation-drift-audit.md`) are triggered when:
   - Master plan age exceeds 14 days without matrix update
   - Delivery doc status conflicts with runtime matrix
   - AI agent reports contradictory foundation state

---

## Consequences

### Positive

- Trustworthy status for AI coding sessions.
- Clear distinction between authority-only and working software.
- Audit trail for enterprise compliance.

### Negative / trade-offs

- Documentation maintenance overhead.
- Requires discipline to update TIP docs in same PR as implementation.

---

## Acceptance Gate

- [ ] Runtime truth matrix published with Evidence column
- [ ] Drift audit classifies all major master plan claims
- [ ] Delivery doc update backlog listed in Phase 0 roadmap
- [ ] AI change boundaries doc references evidence rule

---

## References

- ADR-0000 Architecture Constitution — "Docs lead; code enforces"
- ADR-0009 Runtime Truth Before Roadmap
- [`docs/ai/ai-drift-policy.md`](../ai/ai-drift-policy.md)
