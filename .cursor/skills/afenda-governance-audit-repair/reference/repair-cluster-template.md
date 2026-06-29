# Repair cluster template

Group findings sharing the same mechanical fix before launching implementers.

## Cluster key (all must match)

1. **Violation signature** — same anti-pattern class
2. **Required fix pattern** — same mechanical change
3. **Authority cite** — same PAS section / AUD-ID
4. **Runtime owner** — same registry entry (for orchestrator conflict check)

## Violation signatures (kernel audit)

| Signature | Example fix |
| --- | --- |
| `doc-status-drift` | Sync PAS, status index, runtime matrix |
| `layout-ssot-drift` | Align layout contract + module folders |
| `kv-id-parity` | Sync `ERP_DOMAIN_MODULE_KV_IDS` + per-module constants |
| `export-rule-drift` | Fix `package.json` exports |
| `scaffold-gap` | Add missing module files per scaffold contract |
| `boundary-runtime-leak` | Remove runtime/DB/API from erp-domain |
| `gate-stale-label` | Sync PAS gate table + root scripts |
| `registry-lane-drift` | foundation-registry-owner |
| `inv-single-assembly` | PAS-001A context assembly fix |
| `contract-drift` | Align wire contract with kernel export |

## Repair Cluster Manifest

| Cluster | Signature | Files (exact paths) | Owner agent | Parallel OK? |
| --- | --- | --- | --- | --- |
| C1 | `doc-status-drift` | `docs/PAS/...` | afenda-governed-implementer | YES if disjoint |

## Do not merge when

- Doc cluster + code cluster (split)
- Registry mutation needed → `foundation-registry-owner`
- Shared index/matrix → serialize via `documentation-drift`
- Clusters share a file path

Full handoff: [pas-kernel-audit-orchestrator/reference/repair-cluster-handoff.md](../pas-kernel-audit-orchestrator/reference/repair-cluster-handoff.md)
