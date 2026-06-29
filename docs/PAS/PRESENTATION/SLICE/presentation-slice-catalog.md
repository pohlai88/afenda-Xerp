# Presentation slice catalog (PAS-006 family)

| Field | Value |
| --- | --- |
| **Blueprint box** | shadcn/studio Presentation |
| **Registry** | PKGR05A_SHADCN_STUDIO · PKG-026 |
| **Last reviewed** | 2026-06-29 |

> Sync this catalog and Blueprint §10 on every slice close. Runtime truth: [`pas-status-index.md`](../../pas-status-index.md).

---

## Sequence overview

```text
P06-001  Product baseline (006A)     [Delivered — legacy B38–B42f]
    ↓
P06-002  Relational inventory scaffold (006B)  [Delivered]
    ↓
P06-003  Block slot + data contracts (006B)
    ↓
P06-004  Block lifecycle in registry (006B)
    ↓
P06-005  Acceptance Record contract (006C)
    ↓
P06-006  ACPA acceptance gate suite (006C)
    ↓
P06-007  Auth-adjacent WCAG AA pack (006C)
    ↓
P06-008  Metadata binding contract (006D)     [may parallel after P06-004]
    ↓
P06-009  Surface template registry (006D)
    ↓
P06-010  Enterprise Accepted attestation (family)
```

---

## Catalog

| Slice | PAS | Title | Status | Prerequisite | Closes |
| --- | --- | --- | --- | --- | --- |
| **P06-001** | 006A | Product baseline — theme, CSS, MCP seed, lab, ERP globals | **Delivered** | ADR-0027 reset | PAS-006A product surfaces |
| **P06-002** | 006B | Relational inventory registry scaffold | **Delivered** | P06-001 | §3.1 inventory layers in registry |
| **P06-003** | 006B | Block slot + block data contract surfaces | Proposed | P06-002 | Slot map + serializable contracts |
| **P06-004** | 006B | Block lifecycle state in registry | Proposed | P06-003 | NS §8.1 lifecycle enforcement |
| **P06-005** | 006C | Acceptance Record wire contract | Proposed | P06-004 | NS §8.2 · §3.7 criteria schema |
| **P06-006** | 006C | ACPA block acceptance gate suite | Proposed | P06-005 | Primary operator-surface profile |
| **P06-007** | 006C | Auth-adjacent WCAG 2.2 AA acceptance pack | Proposed | P06-005 | Sign-in/MFA/denial surfaces |
| **P06-008** | 006D | Metadata binding contract | Proposed | P06-004 | NS §3.5 metadata path |
| **P06-009** | 006D | Surface template registry | Proposed | P06-008 | Template → operator surface |
| **P06-010** | 006 family | Enterprise Accepted attestation | Blocked | P06-002–P06-007 minimum | Blueprint Enterprise Accepted |

---

## Legacy mapping (reference only — do not re-execute)

| Legacy slice | Maps to | Notes |
| --- | --- | --- |
| B38–B42f | P06-001 | Scaffold, theme, MCP seed, lab, integration — pre-ADR-0027 path |
| B42k | P06-006 partial | Statistics ACPA article pattern — informs 006C |
| B42i–B42m | — | **Obsolete** — appshell strangler retired with ADR-0027 |

---

## Next sequence item

**P06-003** — Block slot + block data contracts ([PAS-006B](../PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) §12).
