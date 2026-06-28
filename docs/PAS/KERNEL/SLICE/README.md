# Kernel Slice Family — SSOT

| Field | Value |
| --- | --- |
| **Directory (SSOT)** | `docs/PAS/KERNEL/SLICE/` |
| **Legacy** | `docs/PAS/CSS-AUTHORITY/SLICE/` — **removed from repo**; do not restore for kernel Phase 0 |
| **Template** | [pas-slice-template.md](../../../../.cursor/skills/kernel-authority/reference/pas-slice-template.md) |
| **Catalog** | [kernel-slice-catalog.md](kernel-slice-catalog.md) |
| **Slice range** | B49–B106 (48 individual handoffs) |
| **Last reviewed** | 2026-06-29 |

> Each slice is **one markdown file** in this folder (`b49-*.md` … `b106-*.md`). Paste the 9-field handoff from that file into `/afenda-coding-session` Phase 0.

## Tracks

| PAS | Slices | Blueprint box |
| --- | --- | --- |
| PAS-001 | B49–B70 | Kernel Vocabulary |
| PAS-001A | B71–B75 | ERP Integration Spine |
| PAS-001B | B76–B106 | ERP Wire Vocabulary Catalog |

## Regenerate (AUTHOR)

```bash
npx tsx scripts/governance/compose-kernel-closure-slices.mts
npx tsx scripts/governance/compose-kernel-module-slices.mts
```

Amendment slices (B107+): [amendment-slice-handoff-template.md](amendment-slice-handoff-template.md)
