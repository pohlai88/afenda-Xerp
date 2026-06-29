# PAS-API-001 — slice track index

> **Position:** PAS-API-001 family track · Blueprint box: **Platform API Contract**

**Prerequisite:** [api-contract North Star §0.2](../../NORTHSTAR/api-contract-north-star.md) · [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) accepted

**Status:** Delivered (S1–S9 · family doctrine attested 2026-06-30)

**Type:** Track index (orchestrator — **do not implement from this file alone**)

---

## Track decomposition

| Slice | Handoff | Closes (invariant) | Status |
| --- | --- | --- | --- |
| **S1** | [pas-api-001-s1-operation-identity-registry.md](./pas-api-001-s1-operation-identity-registry.md) | API-001 · API-002 | **Delivered** |
| **S2** | [pas-api-001-s2-schema-authority-model.md](./pas-api-001-s2-schema-authority-model.md) | API-003 | **Delivered** |
| **S3** | [pas-api-001-s3-validation-direction-model.md](./pas-api-001-s3-validation-direction-model.md) | API-004 · API-005 | **Delivered** |
| **S4** | [pas-api-001-s4-actor-context-permission-policy.md](./pas-api-001-s4-actor-context-permission-policy.md) | API-006 · API-007 · API-008 | **Delivered** |
| **S5** | [pas-api-001-s5-error-correlation-audit-replay.md](./pas-api-001-s5-error-correlation-audit-replay.md) | API-009 · API-010 · API-011 | **Delivered** |
| **S6** | [pas-api-001-s6-lifecycle-breaking-change.md](./pas-api-001-s6-lifecycle-breaking-change.md) | API-012 · API-013 | **Delivered** |
| **S7** | [pas-api-001-s7-consumer-impact-ownership.md](./pas-api-001-s7-consumer-impact-ownership.md) | API-014 · API-016 | **Delivered** |
| **S8** | [pas-api-001-s8-governance-exception-model.md](./pas-api-001-s8-governance-exception-model.md) | API-015 | **Delivered** |
| **S9** | [pas-api-001-s9-family-gate-release-attestation.md](./pas-api-001-s9-family-gate-release-attestation.md) | API-001–API-016 attestation | **Delivered** |

**Order:** S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8 → S9

**Attestation gate:** `pnpm check:api-family-conformance`

---

## Discovery chain

```text
api-contract North Star → PAS-API-001 → S-track index → S1–S9 → style bindings → Code
```

---

## Core contract surfaces (target package layout)

```text
apps/erp/src/server/api/contracts/core/   # MVP locus until @afenda/api-contract extract
  api-operation-id.contract.ts
  api-style.contract.ts
  api-registry.contract.ts
  api-policy.contract.ts
  api-validation.contract.ts
  api-lifecycle.contract.ts
  api-consumer-impact.contract.ts
  api-audit-replay.contract.ts
  api-exception.contract.ts
  api-ownership.contract.ts
```

**Hard stops:** No REST paths · No OpenAPI generator · No `.proto` · No ERP route wiring in S-track.
