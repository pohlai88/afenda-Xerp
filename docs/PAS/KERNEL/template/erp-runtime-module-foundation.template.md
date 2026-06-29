# ERP Runtime Module Foundation Template

> **Business authority:** [ERP Runtime Module Foundation North Star](../../../NORTHSTAR/erp-module-runtime-north-star.md) — §1–§12 business architecture; this file is **implementation SSOT**.
>
> **Temporary location:** `docs/PAS/KERNEL/template/` — migrates to `docs/PAS/ERP-MODULES/` when `@afenda/erp-modules` package is live.
>
> **Agreed package path law (supersedes `packages/{module}/` below):**
>
> ```text
> packages/features/erp-modules/src/{module-slug}/
> ```
>
> Reference exemplar: `procurement` (`KV-PROC`).

## 1. Module Identity

Every ERP runtime module must declare a governed module identity.

Required file:

```ts
packages/{module}/src/{module}.module-definition.ts
```

Required fields:

```ts
export const {MODULE}_RUNTIME_MODULE = defineErpRuntimeModule({
  slug: "{module}",
  kvId: "KV-XXX",
  runtimePackage: "@afenda/{module}",
  wirePackage: "@afenda/kernel/erp-domain/{module}",
  ownerPackage: "@afenda/{module}",
  databaseOwner: "@afenda/database",
  appOwner: "apps/erp",
  permissionOwner: "@afenda/permissions",
  knowledgeOwner: "@afenda/enterprise-knowledge",
  lifecycle: "foundation",
  runtimeStatus: "foundation_authorized",
});
```

Purpose:

* Prevent anonymous module creation
* Bind runtime to PAS-001B KV ID
* Bind module to ownership
* Prevent module folder creation without ADR / PAS authority

---

## 2. Required Folder Structure

```text
packages/{module}/
  src/
    {module}.module-definition.ts
    {module}.runtime.contract.ts
    {module}.authority.contract.ts
    {module}.knowledge-map.ts
    {module}.ownership.contract.ts
    {module}.context-projection.ts
    {module}.permission-binding.ts
    {module}.policy.ts
    {module}.audit-map.ts
    {module}.event-catalog.ts
    {module}.outbox.contract.ts
    {module}.readiness.contract.ts
    application/
      use-cases/
      commands/
      queries/
    domain/
      entities/
      value-objects/
      lifecycle/
    infrastructure/
      repository.contract.ts
      persistence.mapper.ts
    testing/
      {module}.fixtures.ts
      {module}.testkit.ts
      {module}.readiness.test.ts
    index.ts

packages/database/src/schema/
  {module}.schema.ts

packages/database/src/migrations/
  {module}/

apps/erp/src/lib/{module}/
  {module}.server-context.ts
  {module}.authorization.ts
  {module}.server-actions.ts
  {module}.metadata-binding.ts
  {module}.route-policy.ts

apps/erp/src/app/(protected)/modules/{module}/
  page.tsx
  _components/
  _actions/
  _queries/

docs/PAS/ERP-MODULES/{MODULE}/
  PAS-{module}-RUNTIME-FOUNDATION-STANDARD.md
  {module}-runtime-readiness-report.md
```

---

## 3. Required Runtime Files

### 3.1 `{module}.runtime.contract.ts`

Defines runtime contract only.

Must include:

* Runtime lifecycle
* Supported document families
* Supported operations
* Runtime non-goals
* Cross-domain dependencies
* Required gates

Must not include:

* Database implementation
* API handlers
* React components
* Business glossary definitions

---

### 3.2 `{module}.knowledge-map.ts`

Maps wire vocabulary to enterprise knowledge.

Required statuses:

```ts
export type KnowledgeStatus =
  | "accepted"
  | "proposed"
  | "wire_only"
  | "missing"
  | "ambiguous"
  | "deferred";
```

Every major business term must be classified.

Example:

```ts
export const PROCUREMENT_KNOWLEDGE_MAP = defineModuleKnowledgeMap({
  module: "procurement",
  kvId: "KV-PROC",
  terms: [
    {
      term: "purchase_order",
      status: "wire_only",
      requiredAction: "Create PAS-004 atom before runtime behavior.",
    },
    {
      term: "supplier",
      status: "missing",
      requiredAction: "Create BMD / PAS-004 atom.",
    },
  ],
});
```

Purpose:

* Prevent business meaning from hiding inside runtime code
* Force PAS-004 alignment
* Avoid guessing business definitions

---

### 3.3 `{module}.ownership.contract.ts`

Declares ownership boundaries.

Required ownership rows:

```ts
export const PROCUREMENT_OWNERSHIP = defineModuleOwnership({
  wireVocabulary: "@afenda/kernel",
  businessMeaning: "@afenda/enterprise-knowledge",
  runtimeBehavior: "@afenda/procurement",
  databaseSchema: "@afenda/database",
  appIngress: "apps/erp",
  permissionRegistry: "@afenda/permissions",
  metadataBinding: "apps/erp",
  presentation: "@afenda/shadcn-studio",
});
```

Purpose:

* One owner per responsibility
* No hidden runtime in kernel
* No duplicate vocabulary in ERP

---

### 3.4 `{module}.context-projection.ts`

Projects ERP operating context into module runtime context.

Required rule:

```text
All protected module requests must consume PAS-001A OperatingContext.
No module may build local tenant/company/org context.
```

Required helper:

```ts
export function project{Module}RuntimeContext(
  operatingContext: OperatingContext
): {Module}RuntimeContext;
```

Must fail when:

* Module reads session directly
* Module parses tenant/company/org from headers directly
* Module bypasses ERP operating-context spine

---

### 3.5 `{module}.permission-binding.ts`

Binds PAS-001B permission keys to `@afenda/permissions`.

Required checks:

* Every kernel permission key is registered
* Every registered permission key exists in kernel wire vocabulary
* Every route/server action declares required permission
* No ad-hoc permission string exists

Required helper:

```ts
export const PROCUREMENT_PERMISSION_BINDING = defineModulePermissionBinding({
  module: "procurement",
  kvId: "KV-PROC",
  kernelPermissionKeys: PROCUREMENT_PERMISSION_KEYS,
  registryNamespace: "procurement",
});
```

---

### 3.6 `{module}.policy.ts`

Defines module runtime policy.

Must include:

* Who can create
* Who can approve
* Who can post / submit / cancel
* Which operations are blocked until cross-domain ADR
* Which operations require inventory/accounting/workflow dependency

Must not include:

* UI logic
* Database queries
* Kernel mutations

---

### 3.7 `{module}.audit-map.ts`

Maps runtime actions to PAS-001B audit vocabulary.

Required helper:

```ts
export const PROCUREMENT_AUDIT_MAP = defineModuleAuditMap({
  module: "procurement",
  kvId: "KV-PROC",
  actions: PROCUREMENT_AUDIT_ACTIONS,
});
```

Must fail when:

* Service uses ad-hoc audit action string
* Mutation has no audit action
* Audit event lacks actor/context/target

---

### 3.8 `{module}.event-catalog.ts`

Defines events emitted by the module.

Example:

```ts
export const PROCUREMENT_EVENT_CATALOG = defineModuleEventCatalog({
  module: "procurement",
  events: [
    "procurement.requisition.submitted",
    "procurement.purchase_order.sent",
  ],
});
```

Purpose:

* Prepare outbox before integration
* Avoid event naming drift
* Keep events separate from audit action vocabulary

---

### 3.9 `{module}.outbox.contract.ts`

Declares which events require outbox.

Required classifications:

```ts
export type OutboxRequirement =
  | "required"
  | "not_required"
  | "deferred"
  | "cross_domain_required";
```

Example:

```ts
{
  event: "procurement.purchase_order.sent",
  requirement: "required",
}
```

---

### 3.10 `{module}.metadata-binding.ts`

Binds module runtime surfaces to metadata/PAS-006.

Required fields:

* KV ID
* module slug
* surface ID
* route
* permission key
* operating-context requirement
* metadata slot ID
* UI block reference

Purpose:

* No UI surface without metadata authority
* No metadata surface without permission
* No presentation fork of runtime context

---

### 3.11 `{module}.readiness.contract.ts`

Declares readiness checklist.

Required readiness dimensions:

```ts
export const PROCUREMENT_READINESS = defineModuleReadiness({
  authority: "required",
  knowledge: "required",
  ownership: "required",
  database: "required",
  contextSpine: "required",
  permissions: "required",
  audit: "required",
  outbox: "required",
  metadata: "required",
  ui: "required",
  tests: "required",
  gates: "required",
});
```

---

## 4. Required Database Template

```text
packages/database/src/schema/{module}.schema.ts
packages/database/src/schema/{module}-rls.policy.ts
packages/database/src/schema/{module}-audit-targets.ts
packages/database/src/schema/{module}-outbox-events.ts
```

Every table must declare:

* tenant scope
* company scope
* lifecycle status
* effective dating if applicable
* created/updated audit fields
* canonical enterprise ID
* internal UUID primary key
* RLS expectation
* ownership registry row

---

## 5. Required ERP App Template

```text
apps/erp/src/lib/{module}/
  load-{module}-runtime-context.server.ts
  authorize-{module}-action.server.ts
  {module}.server-actions.ts
  {module}.queries.ts
  {module}.metadata-binding.ts
  {module}.route-policy.ts
  __tests__/
    {module}.context-spine-consumer.test.ts
    {module}.permission-enforcement.test.ts
    {module}.metadata-binding.test.ts
```

Protected routes must always flow through:

```text
request
→ PAS-001A OperatingContext
→ module runtime context projection
→ permission check
→ service/use case
→ audit/outbox
→ response / UI
```

---

## 6. Required Gates

Authority: [PAS-001C — ERP Module Foundation Standard](../PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) §6.

```bash
pnpm check:erp-module-foundation
pnpm check:erp-module-ownership
pnpm check:erp-module-knowledge-alignment
pnpm check:erp-module-context-spine-consumer
pnpm check:erp-module-permission-binding
pnpm check:erp-module-audit-outbox
pnpm check:erp-module-metadata-binding
pnpm check:erp-module-database-boundary
pnpm check:erp-module-no-kernel-runtime-leak
pnpm check:erp-module-readiness
```

Each module may also expose a module-specific composite gate:

```bash
pnpm check:procurement-module-readiness
pnpm check:inventory-module-readiness
pnpm check:accounting-module-readiness
pnpm check:sales-module-readiness
```

---

## 7. Required Module Readiness Output

Every module must produce:

```md
# {Module} Runtime Readiness Report

| Dimension     | Verdict   | Evidence | Missing | Gate |
| ------------- | --------- | -------- | ------- | ---- |
| Authority     | Pass/Fail | path     | gap     | gate |
| Knowledge     | Pass/Fail | path     | gap     | gate |
| Ownership     | Pass/Fail | path     | gap     | gate |
| Database      | Pass/Fail | path     | gap     | gate |
| Context spine | Pass/Fail | path     | gap     | gate |
| Permission    | Pass/Fail | path     | gap     | gate |
| Audit/outbox  | Pass/Fail | path     | gap     | gate |
| Metadata/UI   | Pass/Fail | path     | gap     | gate |
| Tests         | Pass/Fail | path     | gap     | gate |
| Documentation | Pass/Fail | path     | gap     | gate |
```

---

## 8. Non-Negotiable Rules

1. Kernel owns wire vocabulary only.
2. Enterprise Knowledge owns meaning.
3. Runtime package owns behavior.
4. Database package owns persistence.
5. ERP app owns ingress and protected routes.
6. Permissions package owns evaluation.
7. Metadata/PAS-006 owns presentation binding.
8. No module may bypass PAS-001A OperatingContext.
9. No module may duplicate PAS-001 identity families.
10. No module may use ad-hoc audit, permission, event, or status strings.
11. No module may create UI without metadata binding.
12. No module may become ready without gates.
