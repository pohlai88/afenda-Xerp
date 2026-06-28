# Governance docs

Operational runtime policy for UI, API, CSP, and package composition. Evidence/history for foundation work lives in [`docs/PAS/`](../PAS/README.md).

| Doc | Purpose |
|-----|---------|
| [`governed-ui-policy.md`](governed-ui-policy.md) | **Canonical** governed UI policy (author + consumer) |
| [`ui-guard.md`](ui-guard.md) | `pnpm ui:guard` gates A–F |
| [`downstream-ui-composition.md`](downstream-ui-composition.md) | Package boundaries, CSS import order, integration harness |
| [`api-contract.md`](api-contract.md) | API contract governance |
| [`nextjs-api-hardening.md`](nextjs-api-hardening.md) | Next.js API hardening |

## Support docs (`support/`)

Operational delivery evidence and runbooks — not constitutional authority.

| Doc | Purpose |
|-----|---------|
| [`support/nextjs-csp-nonce-pipeline.md`](support/nextjs-csp-nonce-pipeline.md) | CSP nonce pipeline (ERP) |
| [`support/csp-sri-hybrid-strategy.md`](support/csp-sri-hybrid-strategy.md) | SRI vs nonce hybrid CSP |
| [`support/csp-supabase-platform-approval.md`](support/csp-supabase-platform-approval.md) | Supabase CSP origins |
| [`support/csp-third-party-ci-gate.md`](support/csp-third-party-ci-gate.md) | Third-party script CI gate |
| [`support/fumadocs-docs-app-deploy.md`](support/fumadocs-docs-app-deploy.md) | `@afenda/docs` deploy runbook |
| [`support/pino-erp-logger.md`](support/pino-erp-logger.md) | ERP pino logging evidence |

**Retired (2026-06-27):** `architecture-erp-kernel-approval.md`, `nextjs-app-router-hardening.md`, `ui-radix-primitive-normalization.md` — one-shot delivery evidence; policy lives in registries, `governed-ui-policy.md`, and `ui-guard.md`.
