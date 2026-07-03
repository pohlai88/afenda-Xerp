# Repair cluster handoff (implementer)

Paste into `@afenda-governed-implementer` Task prompt after wave merge.

---

## Cluster manifest row

| Field | Value |
| --- | --- |
| Cluster ID | C{N} |
| Violation signature | `{signature}` |
| Authority cite | `{PAS section / AUD-ID}` |
| AUD sources | PAS-001B-AUD-{xx}, … |
| Repair mode | doc-only \| code \| registry (registry → foundation-registry-owner) |

---

## Field 3 — exact files (no globs)

```text
- path/to/file1
- path/to/file2
```

---

## Mandatory implementer reads

**Always:** full `coding-consistency-bundle` table from SKILL.md

**PAS-001B:** `kernel-authority`, `architecture-authority`

**PAS-001A:** `kernel-authority`, `multi-tenancy-erp`

---

## Finding coverage

Finding IDs: F001, F002, … (from merged wave findings)

Required fix (mechanical):

```text
1. …
2. …
```

Prohibited:

- `foundation-disposition.registry.ts` unless slot is foundation-registry-owner
- Expanding scope beyond cluster files
- Implementing new PAS features (repair drift only)

---

## Parallel OK when

- Disjoint Field 3 paths
- Disjoint runtimeOwner
- No shared registry entry
- Not docs-only + code mixed in one cluster (split clusters)

---

## Example — PAS-001B C-doc-status

```text
Cluster: C1
Signature: doc-status-drift
Authority: PAS-001B-AUD-01 + PAS-001B §metadata table
Files:
- docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md
- docs/PAS/pas-status-index.md
- docs/architecture/afenda-runtime-truth-matrix.md
Fix: Align implementation status, evidence level, and 28/28 claims across all three.
Gates after repair: pnpm check:documentation-drift
```
