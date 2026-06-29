# Kernel slice handoffs (PAS-001 / PAS-001A / PAS-001B)

| Field | Value |
| --- | --- |
| **Catalog (full table)** | [kernel-slice-catalog.md](./kernel-slice-catalog.md) |
| **Closure registry** | [pas-status-index.md](../../pas-status-index.md) |
| **Lane boundaries** | [DEVELOPMENT-LANE-BOUNDARIES.md](../../DEVELOPMENT-LANE-BOUNDARIES.md) |
| **Last reviewed** | 2026-06-29 |

> **Do not use** [`docs/PAS/slice/`](../../slice/README.md) for new work — deprecated shim only.

---

## Build order

```text
PAS-001:  B49 → B70 · B107 → B111 (amendment)
PAS-001A: B71 → B75 · R1a → R1d (skeleton rebuild — delivered)
PAS-001B: B76 → B106
```

---

## PAS-001A-R1 track (skeleton rebuild)

| Slice | Handoff | Status |
| --- | --- | --- |
| R1a | [pas-001a-r1a-is002-operating-context-spine.md](./pas-001a-r1a-is002-operating-context-spine.md) | **Delivered** |
| R1b | [pas-001a-r1b-protected-app-router-shell.md](./pas-001a-r1b-protected-app-router-shell.md) | **Delivered** |
| R1c | [pas-001a-r1c-metadata-consumer-pas006.md](./pas-001a-r1c-metadata-consumer-pas006.md) | **Delivered** *(optional gate registration follow-up)* |
| R1d | [pas-001a-r1d-production-candidate-reclose.md](./pas-001a-r1d-production-candidate-reclose.md) | **Delivered** |

---

## PAS-001 amendment (B107–B111)

| Slice | Handoff | Status |
| --- | --- | --- |
| B107 | [b107-tenant-saas-lifecycle-wire.md](./b107-tenant-saas-lifecycle-wire.md) | Delivered |
| B108 | [b108-tenant-extension-boundary-wire.md](./b108-tenant-extension-boundary-wire.md) | Delivered |
| B109 | [b109-effective-dating-consumer-attestation.md](./b109-effective-dating-consumer-attestation.md) | Delivered *(historical — pre-ADR-0027 consumers)* |
| B110 | [b110-auth-actor-protected-path-attestation.md](./b110-auth-actor-protected-path-attestation.md) | Delivered |
| B111 | [b111-tenant-lifecycle-extension-consumer-attestation.md](./b111-tenant-lifecycle-extension-consumer-attestation.md) | Delivered |

---

## Historical slices (pre-ADR-0027 consumers)

These handoffs remain for audit traceability. Runtime consumers cited (`@afenda/appshell`, `@afenda/metadata-ui`, `ui:guard`) are **retired** — see [DEVELOPMENT-LANE-BOUNDARIES.md](../../DEVELOPMENT-LANE-BOUNDARIES.md).

| Slice | Notes |
| --- | --- |
| B74 | Metadata bridge — IS-003 intent preserved; presentation consumer is PAS-006 / `apps/erp` |
| B109 | Effective-dating consumer attestation — historical package references |

---

## Related

- [KERNEL README](../README.md)
- [PAS-001A ERP Integration Spine](../PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md)
- [PRESENTATION lane](../../PRESENTATION/README.md) — metadata binding touchpoint at IS-003
