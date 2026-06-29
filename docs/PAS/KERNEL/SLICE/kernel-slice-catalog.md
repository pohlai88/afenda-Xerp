# Kernel Slice Catalog

| Field | Value |
| --- | --- |
| **SSOT directory** | `docs/PAS/KERNEL/SLICE/` |
| **Individual handoffs** | 62 files (55 `b*.md` + 2 `b*-erp-*.md` consumer + 4 `pas-001a-r1*.md` + 1 `pas-001a-r2*.md` + 1 `pas-001a-r3*.md`) |
| **Legacy (deprecated shim)** | [`docs/PAS/slice/`](../../slice/README.md) — do not use |
| **Closure registry** | [pas-status-index.md](../../pas-status-index.md) |
| **Last reviewed** | 2026-06-30 |

> **Catalog only.** Open the linked `b*.md` file for the 9-field handoff.

## Build order

```text
PAS-001:  B49 → B55 · B57 · B67 → B70 · B107 → B113 (amendment)
PAS-001A: B71 → B75 · R1a → R1d · R2 (S2S attestation) · B112-ERP (format precision ingress)
API-CONTRACT: R3a → R3d (see docs/PAS/API-CONTRACT/REST/SLICE/)
PAS-001B: B76 → B106 · KV1–KV3
```

## PAS-001 — B49–B70 (delivered)

| Slice | Handoff | Status |
| --- | --- | --- |
| B49 | [b49-kernel-tenant-wire-triad.md](./b49-kernel-tenant-wire-triad.md) | Delivered |
| B50 | [b50-kernel-company-org-wire-triad.md](./b50-kernel-company-org-wire-triad.md) | Delivered |
| B51 | [b51-kernel-parent-org-wire.md](./b51-kernel-parent-org-wire.md) | Delivered |
| B52 | [b52-kernel-full-hierarchy-wire-closure.md](./b52-kernel-full-hierarchy-wire-closure.md) | Delivered |
| B53 | [b53-kernel-propagation-frame-wire.md](./b53-kernel-propagation-frame-wire.md) | Delivered |
| B54 | [b54-kernel-project-wire-triad.md](./b54-kernel-project-wire-triad.md) | Delivered |
| B55 | [b55-kernel-policy-wire-triad.md](./b55-kernel-policy-wire-triad.md) | Delivered |
| B57 | [b57-kernel-permission-wire-triad.md](./b57-kernel-permission-wire-triad.md) | Delivered |
| B67 | [b67-pas001-doc-attestation-closure.md](./b67-pas001-doc-attestation-closure.md) | Delivered |
| B68 | [b68-hierarchy-id-boundary-wire-triad.md](./b68-hierarchy-id-boundary-wire-triad.md) | Delivered |
| B69 | [b69-kernel-context-wire-triad-gate.md](./b69-kernel-context-wire-triad-gate.md) | Delivered |
| B70 | [b70-kernel-test-import-hygiene.md](./b70-kernel-test-import-hygiene.md) | Delivered |

## PAS-001 — B107–B113 amendment (delivered)

| Slice | Handoff | Status |
| --- | --- | --- |
| B107 | [b107-tenant-saas-lifecycle-wire.md](./b107-tenant-saas-lifecycle-wire.md) | Delivered |
| B108 | [b108-tenant-extension-boundary-wire.md](./b108-tenant-extension-boundary-wire.md) | Delivered |
| B109 | [b109-effective-dating-consumer-attestation.md](./b109-effective-dating-consumer-attestation.md) | Delivered |
| B110 | [b110-auth-actor-protected-path-attestation.md](./b110-auth-actor-protected-path-attestation.md) | Delivered |
| B111 | [b111-tenant-lifecycle-extension-consumer-attestation.md](./b111-tenant-lifecycle-extension-consumer-attestation.md) | Delivered |
| B112 | [b112-rounding-decimal-precision-vocabulary-amendment.md](./b112-rounding-decimal-precision-vocabulary-amendment.md) | Delivered |
| B113 | [b113-actor-kind-integration-identity-vocabulary.md](./b113-actor-kind-integration-identity-vocabulary.md) | Delivered |

## PAS-001 audit closure handoffs (evidence-sync — not vocabulary build slices)

| Audit | Handoff | Status |
| --- | --- | --- |
| AUD-13 | [pas-001-aud-13-localization-context-ingress-attestation.md](./pas-001-aud-13-localization-context-ingress-attestation.md) | Delivered |
| AUD-20 | [pas-001-aud-20-runtime-side-effect-json-contract-audit.md](./pas-001-aud-20-runtime-side-effect-json-contract-audit.md) | Pass |
| AUD-22 | [pas-001-aud-22-delivered-slice-closure-audit.md](./pas-001-aud-22-delivered-slice-closure-audit.md) | Pass |
| AUD-24 | [pas-001-aud-24-archive-composed-document-parity-audit.md](./pas-001-aud-24-archive-composed-document-parity-audit.md) | Pass |

---

## PAS-001A — B71–B75 (delivered)

| Slice | Handoff | Status |
| --- | --- | --- |
| B71 | [b71-permission-scope-permissions-parser.md](./b71-permission-scope-permissions-parser.md) | Delivered |
| B72 | [b72-erp-operating-context-spine-gate.md](./b72-erp-operating-context-spine-gate.md) | Delivered |
| B73 | [b73-kernel-erp-doc-drift-closure.md](./b73-kernel-erp-doc-drift-closure.md) | Delivered |
| B74 | [b74-metadata-context-authorization-bridge.md](./b74-metadata-context-authorization-bridge.md) | Delivered |
| B75 | [b75-pas001a-production-candidate-attestation.md](./b75-pas001a-production-candidate-attestation.md) | Delivered |

## PAS-001A-R1 — skeleton rebuild (delivered)

> ADR-0027 skeleton re-attestation. **Order:** R1a → R1b → R1c → R1d. All delivered — `check:erp-metadata-pas006-consumer` registered in root `package.json`.

| Slice | Handoff | Status |
| --- | --- | --- |
| R1a | [pas-001a-r1a-is002-operating-context-spine.md](./pas-001a-r1a-is002-operating-context-spine.md) | **Delivered** |
| R1b | [pas-001a-r1b-protected-app-router-shell.md](./pas-001a-r1b-protected-app-router-shell.md) | **Delivered** |
| R1c | [pas-001a-r1c-metadata-consumer-pas006.md](./pas-001a-r1c-metadata-consumer-pas006.md) | **Delivered** |
| R1d | [pas-001a-r1d-production-candidate-reclose.md](./pas-001a-r1d-production-candidate-reclose.md) | **Delivered** |

## PAS-001A-R2 — service actor S2S attestation (delivered)

| Slice | Handoff | Status |
| --- | --- | --- |
| R2 | [pas-001a-r2-service-actor-s2s-attestation.md](./pas-001a-r2-service-actor-s2s-attestation.md) | **Delivered** |

## PAS-001A-R3 — API contract runtime

> **Moved to:** [`docs/PAS/API-CONTRACT/REST/SLICE/`](../../API-CONTRACT/REST/SLICE/api-contract-slice-catalog.md) — R3a–R3d · [PAS-API-001](../../API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [PAS-API-REST-001](../../API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)

## PAS-001A — B112-ERP format precision ingress (delivered)

| Slice | Handoff | Status |
| --- | --- | --- |
| B112-ERP | [b112-erp-format-precision-consumer-attestation.md](./b112-erp-format-precision-consumer-attestation.md) | **Delivered** |

## PAS-001B — B76–B106 (delivered)

| Slice | Handoff | Status |
| --- | --- | --- |
| B76 | [b76-pas001b-erp-domain-catalog-doc.md](./b76-pas001b-erp-domain-catalog-doc.md) | Delivered |
| B77 | [b77-erp-domain-layout-gate.md](./b77-erp-domain-layout-gate.md) | Delivered |
| B78 | [b78-pas001b-audit-closure.md](./b78-pas001b-audit-closure.md) | Delivered |
| B79 | [b79-inventory-domain-vocabulary.md](./b79-inventory-domain-vocabulary.md) | Delivered |
| B80 | [b80-procurement-domain-vocabulary.md](./b80-procurement-domain-vocabulary.md) | Delivered |
| B81 | [b81-controlling-domain-vocabulary.md](./b81-controlling-domain-vocabulary.md) | Delivered |
| B82 | [b82-treasury-domain-vocabulary.md](./b82-treasury-domain-vocabulary.md) | Delivered |
| B83 | [b83-tax-domain-vocabulary.md](./b83-tax-domain-vocabulary.md) | Delivered |
| B84 | [b84-consolidation-domain-vocabulary.md](./b84-consolidation-domain-vocabulary.md) | Delivered |
| B85 | [b85-intercompany-domain-vocabulary.md](./b85-intercompany-domain-vocabulary.md) | Delivered |
| B86 | [b86-manufacturing-domain-vocabulary.md](./b86-manufacturing-domain-vocabulary.md) | Delivered |
| B87 | [b87-quality-domain-vocabulary.md](./b87-quality-domain-vocabulary.md) | Delivered |
| B88 | [b88-maintenance-domain-vocabulary.md](./b88-maintenance-domain-vocabulary.md) | Delivered |
| B89 | [b89-supply-chain-domain-vocabulary.md](./b89-supply-chain-domain-vocabulary.md) | Delivered |
| B90 | [b90-sales-domain-vocabulary.md](./b90-sales-domain-vocabulary.md) | Delivered |
| B91 | [b91-crm-domain-vocabulary.md](./b91-crm-domain-vocabulary.md) | Delivered |
| B92 | [b92-pricing-domain-vocabulary.md](./b92-pricing-domain-vocabulary.md) | Delivered |
| B93 | [b93-subscription-domain-vocabulary.md](./b93-subscription-domain-vocabulary.md) | Delivered |
| B94 | [b94-ecommerce-domain-vocabulary.md](./b94-ecommerce-domain-vocabulary.md) | Delivered |
| B95 | [b95-pos-domain-vocabulary.md](./b95-pos-domain-vocabulary.md) | Delivered |
| B96 | [b96-service-domain-vocabulary.md](./b96-service-domain-vocabulary.md) | Delivered |
| B97 | [b97-field-service-domain-vocabulary.md](./b97-field-service-domain-vocabulary.md) | Delivered |
| B98 | [b98-marketing-domain-vocabulary.md](./b98-marketing-domain-vocabulary.md) | Delivered |
| B99 | [b99-hcm-domain-vocabulary.md](./b99-hcm-domain-vocabulary.md) | Delivered |
| B100 | [b100-payroll-domain-vocabulary.md](./b100-payroll-domain-vocabulary.md) | Delivered |
| B101 | [b101-project-domain-vocabulary.md](./b101-project-domain-vocabulary.md) | Delivered |
| B102 | [b102-assets-domain-vocabulary.md](./b102-assets-domain-vocabulary.md) | Delivered |
| B103 | [b103-document-domain-vocabulary.md](./b103-document-domain-vocabulary.md) | Delivered |
| B104 | [b104-workflow-domain-vocabulary.md](./b104-workflow-domain-vocabulary.md) | Delivered |
| B105 | [b105-analytics-domain-vocabulary.md](./b105-analytics-domain-vocabulary.md) | Delivered |
| B106 | [b106-foundation-erp-domain-scaffold-standardization.md](./b106-foundation-erp-domain-scaffold-standardization.md) | Delivered |

## PAS-001B — KV1–KV3 closure (delivered)

Cross-cutting catalog closure tracks (2026-06-29). Composed PAS-001B §6 · not numbered B-slices.

| Track | Objective | Runtime evidence | Status |
| --- | --- | --- | --- |
| **KV1** | Per-module `*_MODULE_KV_ID` parity with `ERP_DOMAIN_MODULE_KV_IDS` SSOT | `packages/kernel/src/__tests__/erp-domain/erp-domain-authority-kv.contract.test.ts` · layout gate authority-KV parity (`check:erp-domain-layout`) | Delivered |
| **KV2** | Catalog barrel export `./erp-domain/catalog` re-exports layout SSOT only | `packages/kernel/package.json` · `packages/kernel/src/erp-domain/catalog/index.ts` | Delivered |
| **KV3** | Consumer metadata ERP bridge validates slug/KV against kernel catalog at trust boundary | `pnpm check:erp-metadata-pas006-consumer` · PAS-001A-R1c consumer spine (deferred runtime owner: `apps/erp`) | Delivered |

See [README.md](./README.md) · [slice-compliance-audit.md](./slice-compliance-audit.md)
