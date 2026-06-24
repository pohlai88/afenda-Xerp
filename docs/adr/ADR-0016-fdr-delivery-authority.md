# ADR-0016 — FDR Delivery Authority

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-25 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

ADR-0014 established the typed Foundation Disposition Registry as machine authority. Phase 9 and TIP-014 (contracts-only) are complete. New foundation and package upgrades require:

- Structured delivery docs with Research-first discovery (not registry `knownGaps`)
- SAP/Oracle enterprise acceptance criteria mapped to `pnpm` gates
- Parallel subagent execution without markdown interpretation drift
- A single FDR vocabulary (no TIPE, no new TIP authority)

TIP delivery docs remain archive-lane evidence. They are not retired.

---

## Decision

1. **FDR delivery docs** live under `docs/delivery/FDR/[status] fdr-NNN-*.md`.
2. **Canonical index:** `docs/delivery/fdr-status-index.md` — status and upgrade sequence (not runtime truth alone).
3. **Authoring skills:** `write-fdr` and `write-fdr-slice` replace `write-tip` / `write-tip-slice` for all new foundation/package work.
4. **Implementation agents:** `fdr-slice-implementer` (one slice) and `fdr-orchestrator` (parallel batches).
5. **Gap tracking:** FDR `§Remaining gaps` and `§Research` sections — registry `knownGaps` deprecated (always `[]`).
6. **Minimum coverage:** Each active package in `package-registry.data.ts` must have at least one FDR doc; multi-domain packages may have multiple FDR docs.
7. **Enterprise benchmark:** Every FDR DoD row maps to `enterprise-erp-standards` §2 gate; §11 requires enterprise attestation (§9).
8. **Registry edits:** Still sole authority of `foundation-registry-owner`.

### Authority hierarchy

```text
ADR
  → foundation-disposition.registry.ts
    → fdr-status-index.md + FDR delivery docs
      → afenda-runtime-truth-matrix.md
        → docs/delivery/tips/ (archive only)
```

---

## Consequences

### Positive

- Research-first upgrades (e.g. auth) without premature registry gap strings
- Parallel subagent batches with explicit conflict rules
- Enterprise SAP/Oracle criteria embedded in authoring and completion

### Negative / trade-offs

- Additional FDR docs to maintain (mitigated: stubs + index sync)
- Temporary dual field `knownGaps` in registry contract until removal ADR

---

## Acceptance Gate

```bash
pnpm check:foundation-disposition
pnpm check:documentation-drift
pnpm --filter @afenda/architecture-authority typecheck
pnpm --filter @afenda/architecture-authority test:run
pnpm ci:biome
```

---

## References

- ADR-0014 — Foundation Disposition Registry
- `docs/architecture/foundation-delivery-authority.md`
- `.cursor/skills/write-fdr/SKILL.md`
- `.cursor/agents/fdr-slice-implementer.md`
