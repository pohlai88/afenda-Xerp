# FDR Delivery Folder

| Field | Value |
| --- | --- |
| **Authority** | ADR-0016 · ADR-0014 |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Registry (machine)** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| **Authoring** | `.cursor/skills/write-fdr/SKILL.md` |

> **This folder is FDR delivery authority for new foundation/package work.**  
> **TIP docs** under `docs/delivery/tips/` are **archive-lane only** — historical evidence, not implementation handoffs.

---

## Naming

- Files: `[status] fdr-NNN-<domain-slug>.md`
- **`fdr-NNN` prefix = owning `PKG-NNN`** from [`package-registry.data.ts`](../../../packages/architecture-authority/src/data/package-registry.data.ts)
- **Multiple FDRs per PKG** when a package owns multiple domains (e.g. PKG-013 → `fdr-013-audit-coverage` + `fdr-013-logging-tracing`)
- Domain packages: `fdr-r01-<domain-slug>.md` for `PKG-R01`
- **Catalog authority:** every FDR ID must appear in [`fdr-status-index.md`](../fdr-status-index.md) §FDR register (33 rows)
- **Regenerate scaffolds:** `pnpm tsx scripts/governance/scaffold-fdr-docs.mts` (from [`fdr-catalog.data.mts`](../../../scripts/governance/fdr-catalog.data.mts))

---

## Workflow

```text
1. Read foundation-disposition.registry.ts + fdr-status-index.md
2. Open target FDR doc — copy ONE §Handoff slice block
3. fdr-slice-implementer OR afenda-coding-session Phase 0
4. Run registry gates[] + enterprise-erp-standards controls
5. §11 Completion Report + enterprise attestation
6. Sync index + runtime matrix; registry-owner for lane changes
```

Parallel batches: invoke `fdr-orchestrator`.

**Cursor commands (any FDR):** `/fdr-start` · `/fdr-continue` · `/fdr-orchestrate`  
**PKG-001 routing detail:** [`fdr-001-playbook.md`](fdr-001-playbook.md)

---

## Gap tracking

Registry `knownGaps` is **deprecated**. Document gaps in FDR **§Remaining gaps**.  
**Not started** FDRs require **§Research** and Slice 1 = Research (docs-only).

---

## Related

| Path | Role |
| --- | --- |
| [`foundation-delivery-authority.md`](../../architecture/foundation-delivery-authority.md) | Workflow |
| [`foundation-disposition.md`](../../architecture/foundation-disposition.md) | Registry human view |
| [`tip-status-index.md`](../tip-status-index.md) | TIP archive index |
