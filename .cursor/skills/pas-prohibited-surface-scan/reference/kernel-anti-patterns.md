# Kernel Anti-Pattern Reference

← Back to [SKILL.md](../SKILL.md)

Specific violation patterns found in `@afenda/kernel` that standard import gates do NOT catch, mapped to their PAS-001 prohibition.

**Authority rule:** Severity in this table is a starting classification. Final verdict requires checking the canonical PAS, the current source context, and relevant FDR/registry entries. Names create suspicion; PAS decides violation.

---

## Anti-pattern table

| Anti-pattern | File | PAS-001 ref | Why it looks allowed | Suspicion | Starting severity | Correct home |
|---|---|---|---|---|---|---|
| `resolveReportingCurrency()` | `context/accounting-readiness.contract.ts` | §4.5, §7 | Named "resolve"; no DB import | Encodes `reportingCurrency ?? baseCurrency` fallback — currency decision, not pure vocabulary projection | REVIEW → WARN if decision logic confirmed | Approved Finance/Accounting authority surface per current PAS/FDR |
| `formatWorkspaceDisplayLabel()` | `context/app-shell-context.contract.ts` | §4.5 | Small pure function; no external deps | Formats a UI display string for shell chrome — presentation, not cross-package vocabulary | REVIEW → WARN if user-facing display confirmed | `@afenda/appshell` or ERP presentation layer if display-only |
| `FiscalPeriodId` brand + helpers | `contracts/accounting-domain/accounting-id.contract.ts` | §4.1 | Inside `accounting-domain/` sub-folder | PAS §4.1: "FiscalPeriodId not approved at this stage as general platform ID" | REVIEW if in approved accounting-domain contract; BLOCK if exposed as general platform-floor ID | Approved Finance/Accounting authority surface per current PAS/FDR; not a kernel platform ID |
| `AccountingReadinessGateLiveSnapshot` | `context/accounting-readiness-gate-live-status.contract.ts` | §4.4, §4.8 | Named "contract"; types-only | Operational gate-run output (evidence, run-mode, delegated results) — diagnostic telemetry, not stable cross-package vocabulary | REVIEW → WARN if not in approved PAS authority surface; BLOCK if carries runtime/persistence concerns | ERP system-admin or `@afenda/observability` if not an approved gate contract |
| `isCostCenterOrganizationUnit()` | `context/accounting-readiness.contract.ts` | §5 | Looks like a type guard | Encodes a business classification rule for cost-center org-units — domain decision, not platform vocabulary guard | REVIEW → WARN if domain rule confirmed | Approved Finance domain or ERP context layer |
| `from "@afenda/kernel"` (self-import) | `contracts/accounting-domain/accounting-id.contract.ts` | §3.3 | Looks like any import | Self-import via package name hides the true intra-package dependency graph; resolution can break under isolated builds | BLOCK — no exceptions | Relative path (e.g. `../brand.contract.js`) |
| `BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS` | `contracts/business-master-data/business-master-data-scaffold.policy.ts` | §5 | Named "policy"; no external runtime | Governs which repo-level directories must not exist — repo layout enforcement, not ERP vocabulary | WARN | `scripts/governance/check-business-master-data-scaffold.mts` (already consumes it; source export can be removed) |
| `PermissionScopeContext` (resolved record) | `context/permission-scope-context.contract.ts` | §4.9, §8 | Looks like vocabulary type | Carries resolved runtime fields (`membershipId`, `roleId`, `grantScopeType`). Kernel may define permission vocabulary; resolved permission scopes are a different concern | REVIEW → WARN if runtime resolution confirmed | `@afenda/permissions` for resolved scope; kernel retains vocabulary only |
| `new Date()` in `toAccountingReadinessContext()` | `context/accounting-readiness.contract.ts` | §10 | "Defaults to today" looks harmless | Generates live timestamp at call time — contracts-layer functions should not decide "now"; callers should supply the date | WARN | Caller supplies `reportingDate`; keep the parameter required |
| `getPackageName()` / `PACKAGE_NAME` | `src/index.ts` | §4, §5 | Looks like metadata | TIP-001 scaffolding; not in any PAS authority surface; not cross-package vocabulary | INFO | Remove or keep as dev-only constant |

---

## Gate coverage map

| Violation | `quality:boundaries` | `check:kernel-zero-runtime-deps` | `check:kernel-events-wire-serializable` | `check:accounting-domain-contracts` | `pas-prohibited-surface-scan` |
|---|:---:|:---:|:---:|:---:|:---:|
| `resolveReportingCurrency()` decision | ✗ | ✗ | ✗ | ✗ | **✓** |
| `formatWorkspaceDisplayLabel()` display | ✗ | ✗ | ✗ | ✗ | **✓** |
| `FiscalPeriodId` as general platform ID | ✗ | ✗ | ✗ | ✗ | **✓** |
| Gate-live diagnostic types | ✗ | ✗ | ✗ | ✗ | **✓** |
| Self-import via package name | ✗ | ✗ | ✗ | ✗ | **✓** |
| Scaffold policy in source | ✗ | ✗ | ✗ | ✗ | **✓** |
| Prohibited runtime import | **✓** | ✗ | ✗ | ✗ | **✓** |
| Runtime dependencies in package.json | ✗ | **✓** | ✗ | ✗ | **✓** |

---

## How violations enter kernel (root cause analysis)

Three entry paths account for almost all violations:

**Path 1 — Allowed sub-domain, forbidden item inside it**
`accounting-domain/` is PAS-approved. But `FiscalPeriodId` inside it may still be on the "not approved as general platform ID" list. Gates check the folder boundary; they do not check individual IDs inside the folder. This is why Dimension B exists.

**Path 2 — Allowed function class, forbidden behavior encoded inside it**
`deriveConsolidationScopeContext` is approved (pure derivation, no data loading). `resolveReportingCurrency` looks the same shape — pure, no import — but may encode a business fallback rule. Import analysis cannot tell the difference. This is why Dimension A exists.

**Path 3 — Approved-at-start TIP delivery, evolved out of scope**
`accounting-readiness-gate-live-status.contract.ts` was delivered as gate diagnostic types during early TIP slices, before the kernel authority standard crystallised. No subsequent gate challenged it. Over time, diagnostic output migrated into a contracts-only package. This is why Dimension B REVIEW-first exists — some things need human authority check, not automatic condemnation.

---

## Suggested new governance gates

These do not yet exist. Add when corresponding cleanup slices are delivered and ownership is confirmed.

```bash
# Check for self-imports inside packages (all packages)
pnpm check:no-self-package-imports

# Check kernel functions against prohibition profile (kernel-specific)
pnpm check:kernel-prohibited-surfaces

# Check for FiscalPeriodId / FiscalCalendarId as general kernel platform IDs
pnpm check:kernel-fiscal-id-exclusion
```
