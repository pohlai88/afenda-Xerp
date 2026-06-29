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
P06-003  Block slot + data contracts (006B)  [Delivered]
    ↓
P06-004  Block lifecycle in registry (006B)  [Delivered]
    ↓
P06-005  Acceptance Record contract (006C)  [Delivered]
    ↓
P06-006  ACPA acceptance gate suite (006C)  [Delivered]
    ↓
P06-007  Auth-adjacent WCAG AA pack (006C)  [Delivered]
    ↓
P06-008  Metadata binding contract (006D)     [Delivered]
    ↓
P06-008-R1  Metadata binding enforcement (006D)  [Delivered]
    ↓
P06-008-R2  DOM slot markers (006D)           [Proposed]
    ↓
P06-009  Surface template registry (006D)    [Delivered]
    ↓
P06-010  Enterprise Accepted attestation (family)  [Delivered — registry promotion via foundation-registry-owner]
```

---

## Catalog

| Slice | PAS | Title | Status | Prerequisite | Closes |
| --- | --- | --- | --- | --- | --- |
| **P06-001** | 006A | Product baseline — theme, CSS, MCP seed, lab, ERP globals | **Delivered** | ADR-0027 reset | PAS-006A product surfaces |
| **P06-002** | 006B | Relational inventory registry scaffold | **Delivered** | P06-001 | §3.1 inventory layers in registry |
| **P06-003** | 006B | Block slot + block data contract surfaces | **Delivered** | P06-002 | Slot map + serializable contracts |
| **P06-004** | 006B | Block lifecycle state in registry | **Delivered** | P06-003 | NS §8.1 lifecycle enforcement |
| **P06-005** | 006C | Acceptance Record wire contract | **Delivered** | P06-004 | NS §8.2 · §3.7 criteria schema |
| **P06-006** | 006C | ACPA block acceptance gate suite | **Delivered** | P06-005 | Primary operator-surface profile |
| **P06-007** | 006C | Auth-adjacent WCAG 2.2 AA acceptance pack | **Delivered** | P06-005 | Sign-in/MFA/denial surfaces |
| **P06-008** | 006D | Metadata binding contract | **Delivered** | P06-004 | NS §3.5 metadata path |
| **P06-008-R1** | 006D | Metadata binding registry enforcement | **Delivered** | P06-008 | NS I7 · `check:studio-metadata-binding` |
| **P06-008-R2** | 006D | DOM slot markers (`data-afenda-slot`) | **Proposed** | P06-008-R1 | NS §3.5 Metadata-bound DOM · `check:studio-block-slot-markers` |
| **P06-009** | 006D | Surface template registry | **Delivered** | P06-008 | Template → operator surface |
| **P06-010** | 006 family | Enterprise Accepted attestation | **Delivered** (doc attestation; PKGR05A promotion via registry owner) | P06-002–P06-007 minimum | Blueprint Enterprise Accepted |

---

## Legacy mapping (reference only — do not re-execute)

| Legacy slice | Maps to | Notes |
| --- | --- | --- |
| B38–B42f | P06-001 | Scaffold, theme, MCP seed, lab, integration — pre-ADR-0027 path |
| B42k | P06-006 partial | Statistics ACPA article pattern — informs 006C |
| B42i–B42m | — | **Obsolete** — appshell strangler retired with ADR-0027 |

---

## Next sequence item

**P06-008-R2** — DOM slot markers on YES-binding MCP blocks ([handoff](./p06-008-r2-dom-slot-markers.md)). **PAS-001A-R1** deferred to PAS-001A family discussion (ERP integration spine — not kernel, not generic API contract).
