# PAS-001 — Kernel Package Tree (package-local)

> **Canonical PAS:** [`docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md`](../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md)
>
> **Runtime authority (code wins over prose):**
> [`src/contracts/kernel-package-layout.contract.ts`](src/contracts/kernel-package-layout.contract.ts) ·
> [`src/context/context-registry.ts`](src/context/context-registry.ts) ·
> [`src/governance/kernel-boundary-drift.registry.ts`](src/governance/kernel-boundary-drift.registry.ts)
>
> **Gates:** `pnpm check:kernel-package-structure` · `pnpm --filter @afenda/kernel test:run`

Annotated filesystem map for `@afenda/kernel`. Update after serialized slice delivery or when drift registry entries change.

**Legend:** ✅ CANON · 📋 registry · ⚠️ DRIFT (scheduled refactor) · 🔶 behavior scheduled out of kernel · ⛔ QUARANTINE · 🧪 tests · 🗑️ remove after migration

```text
packages/kernel/
├── PAS-001-KERNEL-TREE.md                # this file — package-local tree map
├── package.json                          # §6.3 — eight public export keys
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
└── src/
    ├── index.ts                          # ✅ CANON §6.3 — root public barrel (only root .ts file)
    │
    ├── context/                          # ✅ CANON §4.4 — operating-context vocabulary
    │   ├── index.ts                      # ✅ Public @afenda/kernel/context barrel
    │   ├── context-registry.ts           # 📋 REQUIRED + SUPPORT module registry
    │   │
    │   │── ── §4.4 REQUIRED shapes (gate-enforced) ──────────────────────────
    │   ├── tenant-context.contract.ts              # ✅ TenantContext
    │   ├── entity-group-context.contract.ts        # ✅ EntityGroupContext
    │   ├── legal-entity-context.contract.ts        # ✅ LegalEntityContext
    │   ├── ownership-interest-context.contract.ts  # ✅ OwnershipInterestContext (+ date predicate)
    │   ├── organization-unit-context.contract.ts   # ✅ OrganizationUnitContext
    │   ├── team-context.contract.ts                # ✅ TeamContext  ← shape only, not team DB
    │   ├── project-context.contract.ts             # ✅ ProjectContext
    │   ├── operating-context.contract.ts           # ✅ OperatingContext + error codes + selection hints
    │   ├── permission-scope-context.contract.ts      # ✅ scope slot (resolver → @afenda/permissions)
    │   ├── consolidation-scope-context.contract.ts # ✅ ConsolidationScopeContext
    │   │
    │   │── ── §4.4 SUPPORT shapes / metadata ───────────────────────────────
    │   ├── workspace-context.contract.ts           # ✅ WorkspaceContext
    │   ├── surface-context.contract.ts             # ✅ SurfaceContext (shape only)
    │   ├── workflow-context.contract.ts            # ✅ WorkflowContext (shape only)
    │   ├── localization-context.contract.ts        # ✅ §4.5 LocalizationContext + wire parse/serialize
    │   ├── lifecycle.contract.ts                   # ✅ Shared PlatformLifecycleStatus
    │   ├── enterprise-hierarchy.contract.ts        # ✅ Tier metadata (persisted vs derived)
    │   ├── operating-context-hierarchy.contract.ts # ✅ PAS §4.4 layer registry
    │   ├── hierarchy-id-boundary.contract.ts       # ✅ Wire id normalize/parse at trust boundary
    │   ├── permission-grant-vocabulary.contract.ts # ✅ §8 grant scope words (not evaluation)
    │   │
    │   └── __tests__/                                # 🧪 localization-context tests
    │
    ├── identity/                         # ✅ CANON §4.1 — enterprise ID authority floor
    │   ├── index.ts
    │   ├── brand/
    │   │   ├── brand.contract.ts         # ✅ Brand + unbrand (canonical — not contracts/brand shim)
    │   │   └── index.ts
    │   ├── canonical/                    # ✅ §4.1 canonical ID format/parse/generate
    │   │   ├── canonical-id.contract.ts
    │   │   ├── canonical-id-format.contract.ts
    │   │   ├── canonical-id-parser.contract.ts
    │   │   ├── canonical-id-generator.contract.ts
    │   │   ├── canonical-id-validator.contract.ts
    │   │   ├── canonical-id-body-generator.contract.ts
    │   │   ├── invalid-canonical-id.error.ts
    │   │   ├── index.ts
    │   │   └── __tests__/                # 🧪 (5 files)
    │   ├── families/                     # ✅ §4.1 enterprise ID families
    │   │   ├── define-enterprise-family.ts
    │   │   ├── tenant-hierarchy-id.contract.ts
    │   │   ├── enterprise-hierarchy-id.contract.ts
    │   │   ├── business-reference-id.contract.ts
    │   │   ├── identity-access-id.contract.ts
    │   │   ├── audit-execution-id.contract.ts
    │   │   ├── index.ts
    │   │   └── __tests__/
    │   ├── primitives/                   # ✅ §4.5 global format vocabulary
    │   │   ├── country-code.contract.ts      # ✅ confirmed canonical primitive
    │   │   ├── locale-code.contract.ts
    │   │   ├── timezone-id.contract.ts
    │   │   ├── date-format.contract.ts
    │   │   ├── number-format.contract.ts
    │   │   ├── currency-code.contract.ts
    │   │   ├── uom-code.contract.ts
    │   │   ├── primitive-brand.contract.ts
    │   │   ├── primitive-brand.helpers.ts
    │   │   ├── primitive-reference.registry.ts
    │   │   ├── index.ts
    │   │   └── __tests__/
    │   ├── registry/                     # ✅ §4.1 ID family / prefix / forbidden-floor registries
    │   │   ├── id-family.registry.ts
    │   │   ├── enterprise-id-prefix.registry.ts
    │   │   ├── index.ts
    │   │   └── __tests__/                # 🧪 includes forbidden-platform-floor
    │   ├── wire/                         # ✅ §4.1 wire ingress contracts
    │   │   ├── identity-wire.contract.ts
    │   │   ├── business-reference-wire.contract.ts  # ✅ §4.7 wire references (K7)
    │   │   ├── auth-subject-id.contract.ts
    │   │   ├── auth-actor-identity.contract.ts
    │   │   ├── audit-event-identity.contract.ts
    │   │   ├── internal-entity-pk.contract.ts
    │   │   ├── index.ts
    │   │   └── __tests__/
    │   ├── postgres/                     # ✅ §4.1 DB wire helpers (check constraints, uuid-v7)
    │   │   ├── canonical-id-check.contract.ts
    │   │   ├── uuid-v7-format.contract.ts
    │   │   ├── index.ts
    │   │   └── __tests__/
    │   ├── tenant-human-reference/       # ✅ §4.1 tenant-scoped human refs
    │   │   ├── tenant-human-reference.contract.ts
    │   │   └── index.ts
    │   ├── governance/                   # ✅ §4.1 identity boundary policies
    │   │   ├── identity-stack.contract.ts
    │   │   ├── identity-boundary-policy.contract.ts
    │   │   ├── identity-module-layout.contract.ts
    │   │   ├── identity-trust-boundary.policy.ts
    │   │   ├── better-auth-boundary.policy.ts
    │   │   ├── business-reference-identity.policy.ts
    │   │   ├── tenant-human-reference.policy.ts
    │   │   ├── index.ts
    │   │   └── __tests__/
    │   └── __tests__/                    # 🧪 module-location, identity-boundary
    │
    ├── contracts/                        # ✅ CANON — platform wire vocabulary (not §4.4 context slots)
    │   ├── result.contract.ts            # ✅ §4.2 Result type
    │   ├── app-error.contract.ts         # ✅ §4.2 App error surface
    │   ├── problem-detail.contract.ts    # ✅ RFC 9457 problem detail
    │   ├── json-wire.contract.ts         # ✅ JsonValue wire types
    │   ├── execution-context.contract.ts # ✅ §4.3 execution context shape
    │   ├── execution-context.policy.contract.ts
    │   ├── kernel-package-layout.contract.ts  # 📋 §6.1 layout + context/contracts boundary
    │   │
    │   └── platform/
    │       ├── platform-entity-authority.contract.ts  # ✅ §4.6 Platform entity map
    │       └── index.ts
    │
    ├── erp-domain/                         # ✅ §4.8 ERP domain vocabulary modules
    │   ├── erp-domain-layout.contract.ts   # 📋 module registry (accounting, future inventory, …)
    │   └── accounting/                     # ✅ @afenda/kernel/erp-domain/accounting
    │       ├── accounting-authority.contract.ts
    │       ├── accounting-domain-vocabulary.registry.ts
    │       ├── accounting-domain-vocabulary.policy.ts
    │       ├── accounting-domain-wire-context.contract.ts
    │       ├── accounting-id.contract.ts             # ⛔ QUARANTINE FiscalCalendarId/FiscalPeriodId
    │       ├── accounting-permission-vocabulary.contract.ts
    │       ├── accounting-audit-actions.contract.ts
    │       ├── account-type.contract.ts
    │       ├── consolidation-method.contract.ts
    │       ├── fiscal-period-state.contract.ts
    │       ├── journal-document-type.contract.ts
    │       ├── posting-status.contract.ts
    │       ├── index.ts
    │       └── __tests__/
    │
    ├── governance/                       # ✅ CANON §9 — PAS self-governance in kernel
    │   ├── kernel-boundary-drift.registry.ts       # 📋 refactor lock / drift entries
    │   ├── kernel-contract-rules.policy.ts
    │   ├── kernel-decision-matrix.contract.ts
    │   ├── kernel-implementation-sequence.contract.ts
    │   ├── kernel-prohibited-ownership.contract.ts
    │   ├── kernel-runtime-rules.contract.ts
    │   ├── index.ts                    # @afenda/kernel/governance
    │   └── __tests__/                    # 🧪 (6 files)
    │
    ├── permission/                       # ✅ CANON §8 — permission model vocabulary (not evaluation)
    │   ├── permission-vocabulary.contract.ts
    │   ├── permission-model.contract.ts
    │   ├── permission-model-scope.contract.ts
    │   ├── permission-action.contract.ts
    │   ├── index.ts                    # @afenda/kernel/permission
    │   └── __tests__/
    │
    ├── policy/                           # ✅ CANON — policy decision vocabulary
    │   ├── policy-vocabulary.contract.ts
    │   ├── policy-decision.contract.ts
    │   ├── policy-denial-reason.contract.ts
    │   ├── index.ts                    # @afenda/kernel/policy
    │   └── __tests__/
    │
    ├── propagation/                      # ✅ CANON — context frame propagation contract
    │   ├── kernel-context-frame.contract.ts
    │   ├── kernel-context.ts
    │   └── index.ts                    # @afenda/kernel/propagation
    │
    ├── events/                           # ✅ CANON — domain event wire shape
    │   ├── domain-event.contract.ts
    │   └── index.ts                    # @afenda/kernel/events
    │
    └── __tests__/                        # 🧪 package-level acceptance (~35 files)
        └── fixtures/
            └── enterprise-id.fixtures.ts
```

## Relocated out of kernel (completed — drift registry)

```text
apps/erp/src/lib/context/
├── untrusted-client-authority.server.ts
├── accounting-readiness-context.types.ts       # AccountingReadinessContext (gate layer shape)
├── accounting-readiness.projection.ts          # toAccountingReadinessContext / toAccountingDomainContext
├── consolidation-scope-resolution.server.ts    # deriveConsolidationScopeContext
├── consolidation-scope-investee-merge.policy.ts
├── runtime-module-path.server.ts
├── surface-context.resolution.server.ts
└── workflow-context.resolution.server.ts

@afenda/architecture-authority/src/data/
├── business-master-data-authority.registry.ts    # was kernel contracts/business-master-data/*
├── business-master-data-shared-package.policy.ts
└── business-master-data-import-boundary.policy.ts
```

## Pending drift (still in kernel — scheduled slices)

| Path | Target |
|------|--------|
| `erp-domain/accounting/accounting-id.contract.ts` | ⛔ quarantine until Finance ADR |
