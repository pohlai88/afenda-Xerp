# DEPRECATED — Flat slice folder (shim only)

> **Maturity: Deprecated / Superseded**
>
> `docs/PAS/slice/` is a **temporary redirect shim**. Individual `b*.md` files here are tombstones only. **This entire directory will be deleted** once downstream links are migrated. Update references **now** — do not wait for removal.

## Canonical slice SSOT (use these paths)

Slice handoffs live under each PAS family folder in **`SLICE/`** (uppercase):

| PAS family | Canonical slice directory | Catalog |
| --- | --- | --- |
| Kernel (PAS-001 · PAS-001A · PAS-001B) | [`docs/PAS/KERNEL/SLICE/`](../KERNEL/SLICE/README.md) | [kernel-slice-catalog.md](../KERNEL/SLICE/kernel-slice-catalog.md) |
| Architecture Authority (PAS-002 · PAS-002A) | [`docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/`](../ARCHITECTURE-AUTHORITY/SLICE/README.md) | [architecture-authority-slice-catalog.md](../ARCHITECTURE-AUTHORITY/SLICE/architecture-authority-slice-catalog.md) |
| Accounting Standards (PAS-003) | [`docs/PAS/ACCOUNTING-STANDARDS/SLICE/`](../ACCOUNTING-STANDARDS/SLICE/README.md) | [accounting-slice-catalog.md](../ACCOUNTING-STANDARDS/SLICE/accounting-slice-catalog.md) |
| Enterprise Knowledge (PAS-004–PAS-004D) | [`docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/`](../ENTERPRISE-KNOWLEDGE/SLICE/README.md) | [enterprise-knowledge-slice-catalog.md](../ENTERPRISE-KNOWLEDGE/SLICE/enterprise-knowledge-slice-catalog.md) |
| CSS Authority (PAS-005 · PAS-005A · PAS-005B) | [`docs/PAS/CSS-AUTHORITY/SLICE/`](../CSS-AUTHORITY/SLICE/README.md) | [css-authority-slice-catalog.md](../CSS-AUTHORITY/SLICE/css-authority-slice-catalog.md) |

**Closure registry:** [`docs/PAS/pas-status-index.md`](../pas-status-index.md)

## What remains in this folder

Only **PAS-005 (CSS Authority)** tombstone redirects (`b27-pas005*` … `b43-pas005b`). Each file points to its composed handoff under [`docs/PAS/CSS-AUTHORITY/SLICE/`](../CSS-AUTHORITY/SLICE/README.md).

Kernel, Architecture Authority, Accounting Standards, and Enterprise Knowledge handoffs were **never restored** here — they exist only under their family `SLICE/` folders above.

## Migration checklist

When you encounter `docs/PAS/slice/` in code, docs, skills, or agent Phase 0:

1. Identify the PAS family (filename prefix / catalog row in `pas-status-index.md`).
2. Replace with `docs/PAS/<FAMILY>/SLICE/<same-filename>.md`.
3. Paste handoff blocks from the **family** path only — never from this shim folder.
4. Do **not** add new files under `docs/PAS/slice/`.

## Link rewrite helpers (one-shot maintenance)

- CSS Authority: `scripts/governance/rewrite-css-authority-pas-links.mts`
- Enterprise Knowledge: `scripts/governance/rewrite-enterprise-knowledge-pas-links.mts`
