# Platform API Contract — PAS-API-001 slice handoffs

| Field | Value |
| --- | --- |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Guideline** | [SLICE-BUILDING-GUIDELINE.md](../SLICE-BUILDING-GUIDELINE.md) |
| **Catalog** | [pas-api-001-slice-catalog.md](./pas-api-001-slice-catalog.md) |
| **Track index** | [pas-api-001-slice-track.md](./pas-api-001-slice-track.md) |
| **Closure registry** | [pas-status-index.md](../../pas-status-index.md) |
| **Last reviewed** | 2026-06-30 |

---

## Build order

```text
PAS-API-001-S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8 → S9
```

**Prerequisite:** [api-contract North Star §0.2](../../NORTHSTAR/api-contract-north-star.md) doctrine accepted · [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) published.

**Next implementable slice:** **S1** — Operation Identity Registry

---

## Style binding slices (sibling folders)

| Binding | Slice folder |
| --- | --- |
| REST (Active) | [REST/SLICE/](../REST/SLICE/README.md) |
| RPC (Reserved) | [RPC/SLICE/](../RPC/SLICE/README.md) |
| GraphQL (Reserved) | [GRAPHQL/SLICE/](../GRAPHQL/SLICE/README.md) |
| Event (Reserved) | [EVENT/SLICE/](../EVENT/SLICE/README.md) |
| Agent (Reserved) | [AGENT/SLICE/](../AGENT/SLICE/README.md) |
| ERP consumer | [KERNEL/SLICE/pas-001a-api-binding-slice-track.md](../KERNEL/SLICE/pas-001a-api-binding-slice-track.md) |
