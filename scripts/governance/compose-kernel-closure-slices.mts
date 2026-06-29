/**
 * Composes kernel closure slice handoffs B49–B80, B106 into docs/PAS/KERNEL/SLICE/.
 * Legacy docs/PAS/slice/ removed; composed files are SSOT for Phase 0.
 */
import fs from "node:fs";
import path from "node:path";

interface SliceDef {
  readonly id: string;
  readonly filename: string;
  readonly title: string;
  readonly pas: "PAS-001" | "PAS-001A" | "PAS-001B";
  readonly pasSection: string;
  readonly positionN: number;
  readonly positionTotal: number;
  readonly blueprintBox: string;
  readonly prerequisite: string;
  readonly type: string;
  readonly risk: string;
  readonly cleanCore: string;
  readonly purpose: string;
  readonly objective: string;
  readonly allowedLayer: string;
  readonly files: readonly string[];
  readonly prohibited: string;
  readonly authority: string;
  readonly gates: readonly string[];
  readonly closes: string;
  readonly evidence: readonly string[];
  readonly attestation: string;
  readonly rules: readonly string[];
  readonly dod: readonly {
    readonly criterion: string;
    readonly gate: string;
    readonly trace: string;
  }[];
  readonly runtime: readonly {
    readonly capability: string;
    readonly path: string;
  }[];
  readonly extra?: string;
}

const OUT = path.join("docs", "PAS", "KERNEL", "SLICE");

function pas001WireSlice(
  id: string,
  filename: string,
  title: string,
  section: string,
  positionN: number,
  prerequisite: string,
  purpose: string,
  kernelPath: string,
  gate: string,
): SliceDef {
  return {
    id,
    filename,
    title,
    pas: "PAS-001",
    pasSection: section,
    positionN,
    positionTotal: 12,
    blueprintBox: "Kernel Vocabulary",
    prerequisite,
    type: "Implementation",
    risk: "Medium",
    cleanCore: "A→A — wire triad at ERP mapper trust boundary",
    purpose,
    objective: purpose.split(".")[0] ?? purpose,
    allowedLayer:
      "packages/kernel/src/context/** · apps/erp/src/lib/context/** · docs/PAS/KERNEL/SLICE/**",
    files: [
      `docs/PAS/KERNEL/SLICE/${filename}`,
      kernelPath,
      "apps/erp/src/lib/context/operating-context.mappers.ts",
    ],
    prohibited:
      "foundation-disposition.registry.ts · schema migrations · packages/ui · shadcn-studio",
    authority: `PAS-001 ${section} · ADR-0021/0022 · kernel-authority`,
    gates: [
      gate,
      "pnpm --filter @afenda/kernel test:run",
      "pnpm --filter @afenda/erp typecheck",
    ],
    closes: `Closes DoD #1–#3 · ${title}`,
    evidence: [
      kernelPath,
      "apps/erp/src/lib/context/operating-context.mappers.ts",
      `docs/PAS/KERNEL/SLICE/${filename}`,
    ],
    attestation: "Contract · Test · Governance",
    rules: [
      "Wire triad uses contract/assert/parser — branded ids only after parse*.",
      "ERP maps lookup enterpriseId at mapper boundary; uuid PK retained for FK ops.",
      "Kernel owns shape; ERP owns resolver; database owns persistence.",
    ],
    dod: [
      {
        criterion: "Wire triad registered and tested",
        gate,
        trace: `PAS-001 ${section} · Kernel NS wire EFR`,
      },
      {
        criterion: "ERP mapper branding tests pass",
        gate: "operating-context.mappers.test.ts",
        trace: "ADR-0022 split-ID",
      },
      {
        criterion: "Composed handoff SSOT published",
        gate: "file read",
        trace: "PAS-001 §12 · pas-slice-template author validation",
      },
    ],
    runtime: [{ capability: title, path: kernelPath }],
  };
}

function render(s: SliceDef): string {
  const handoffPath = `docs/PAS/KERNEL/SLICE/${s.filename}`;
  const dodRows = s.dod
    .map(
      (r, i) =>
        `| ${i + 1} | ${r.criterion} | ${r.gate} | ${r.trace} |`,
    )
    .join("\n");
  const f8Map = s.dod
    .map((r, i) => `| ${i + 1} | ${s.evidence[i] ?? r.gate} |`)
    .join("\n");
  const rules = s.rules.map((r, i) => `${i + 1}. ${r}`).join("\n");
  const runtime = s.runtime
    .map((r) => `| ${r.capability} | Yes — ${s.id} | \`${r.path}\` |`)
    .join("\n");
  const filesBlock = s.files.map((f) => `   ${f}`).join("\n");
  const gatesBlock = s.gates.map((g) => `   ${g}`).join("\n");
  const evidenceBlock = s.evidence.map((e) => `   ${e}`).join("\n");

  return `# Slice ${s.id} — ${s.title} (${s.pas} ${s.pasSection})

> **Position:** Slice \`${s.positionN} of ${s.positionTotal}\` in ${s.pas} · Blueprint box: \`${s.blueprintBox}\`

**Prerequisite:** ${s.prerequisite}

**Status:** Delivered (2026-06-28)

**Type:** ${s.type}

**Risk class:** ${s.risk}

**Clean Core impact:** ${s.cleanCore}

## Purpose

${s.purpose}

## Handoff block

\`\`\`
Handoff from: ${handoffPath}

1. Objective    — ${s.objective}
2. Allowed layer— ${s.allowedLayer}
3. Files        —
${filesBlock}
4. Prohibited   — ${s.prohibited}
5. Authority    — ${s.authority}
6. Gates        —
${gatesBlock}
7. Closes       — ${s.closes}
8. Evidence     —
${evidenceBlock}
9. Attestation  — ${s.attestation}
\`\`\`

## Rules frozen

${rules}

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
${dodRows}

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
${f8Map}

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
${runtime}
${s.extra ?? ""}
`;
}

const SLICES: SliceDef[] = [
  {
    id: "B49",
    filename: "b49-kernel-tenant-wire-triad.md",
    title: "Kernel Tenant Wire Triad",
    pas: "PAS-001",
    pasSection: "§4.4",
    positionN: 1,
    positionTotal: 12,
    blueprintBox: "Kernel Vocabulary",
    prerequisite: "ADR-0022 tenant wire · B16 operating-context baseline",
    type: "Evidence-sync",
    risk: "Low",
    cleanCore: "A→A — documents delivered triad; consumer typing collateral only",
    purpose:
      "Close PAS-001 §4.4 tenant operating-context wire ingress: registry promotion, wire triad, ADR-0022 ERP split-ID branding, and PAS-004C consumer projection typing collateral.",
    objective:
      "Document delivered tenant wire triad; sync PAS-001 status; verify tenant triad + consumer typecheck gates green.",
    allowedLayer:
      "docs/PAS/** · packages/enterprise-knowledge/src/projection/** · apps/erp OpenAPI meta (TS4111 only)",
    files: [
      "docs/PAS/KERNEL/SLICE/b49-kernel-tenant-wire-triad.md",
      "packages/kernel/src/context/tenant-context.contract.ts",
      "packages/kernel/src/context/context-registry.ts",
      "apps/erp/src/lib/context/operating-context.mappers.ts",
      "packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts",
    ],
    prohibited:
      "packages/kernel runtime triad edits (pre-delivered) · foundation-disposition.registry.ts · packages/ui",
    authority: "PAS-001 §4.4 · ADR-0021/0022 · kernel-authority",
    gates: [
      "pnpm check:kernel-context-surface",
      "pnpm --filter @afenda/kernel test:run",
      "pnpm --filter @afenda/erp typecheck",
    ],
    closes: "Closes DoD #1–#4 · tenant wire triad documentation",
    evidence: [
      "packages/kernel/src/context/tenant-context.parser.ts",
      "packages/kernel/src/context/context-registry.ts",
      "apps/erp/src/lib/context/operating-context.mappers.ts",
      "packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts",
    ],
    attestation: "Contract · Test · Governance · Documentation",
    rules: [
      "Tenant wire uses contract/assert/parser triad — no branded ids without parse*.",
      "ERP maps TenantLookupRow.enterpriseId → parseUnknownTenantContext.",
      "Kernel owns shape; ERP owns resolver; database owns persistence.",
    ],
    dod: [
      {
        criterion: "B49 composed slice + PAS sync",
        gate: "file read",
        trace: "PAS-001 §4.4 · Kernel NS EFR tenant wire",
      },
      {
        criterion: "Tenant triad registered wireIngress",
        gate: "pnpm check:kernel-context-surface",
        trace: "PAS-001 §11 governance",
      },
      {
        criterion: "ERP enterpriseId branding path",
        gate: "operating-context tests",
        trace: "ADR-0022 split-ID",
      },
      {
        criterion: "Consumer projection overloads typecheck",
        gate: "pnpm --filter @afenda/erp typecheck",
        trace: "PAS-004C consumer projection",
      },
    ],
    runtime: [
      {
        capability: "Tenant wire triad",
        path: "packages/kernel/src/context/tenant-context.*.ts",
      },
    ],
  },
  {
    id: "B70",
    filename: "b70-kernel-test-import-hygiene.md",
    title: "Kernel Test Import Hygiene",
    pas: "PAS-001",
    pasSection: "§3.3",
    positionN: 12,
    positionTotal: 12,
    blueprintBox: "Kernel Vocabulary",
    prerequisite: "B69 Delivered",
    type: "Implementation",
    risk: "Low",
    cleanCore: "A→A — test import paths only",
    purpose:
      "Replace @afenda/kernel self-imports in context __tests__ with relative identity/vocabulary imports per PAS-001 §3.3 — closes PAS-001 Enterprise Accepted track.",
    objective:
      "Zero @afenda/kernel imports in context/__tests__; all context tests pass.",
    allowedLayer: "packages/kernel/src/context/__tests__/** · docs/PAS/KERNEL/SLICE/**",
    files: [
      "packages/kernel/src/context/__tests__/tenant-context.test.ts",
      "packages/kernel/src/context/__tests__/operating-context.test.ts",
      "docs/PAS/KERNEL/SLICE/b70-kernel-test-import-hygiene.md",
    ],
    prohibited: "packages/kernel production exports · apps/erp/**",
    authority: "PAS-001 §3.3 · B16-9 frozen rule 3 · kernel-authority",
    gates: ["pnpm --filter @afenda/kernel test:run"],
    closes: "Closes DoD #1–#2 · PAS-001 closure (B70)",
    evidence: [
      "ripgrep: no @afenda/kernel in context/__tests__",
      "packages/kernel/src/context/__tests__/",
    ],
    attestation: "Test · Maintainability",
    rules: [
      "Context tests import relative paths or subpath exports — never package self-import.",
      "No production export changes in this slice.",
    ],
    dod: [
      {
        criterion: "Zero @afenda/kernel in context/__tests__",
        gate: "ripgrep",
        trace: "PAS-001 §3.3 import hygiene",
      },
      {
        criterion: "All context tests pass",
        gate: "pnpm --filter @afenda/kernel test:run",
        trace: "PAS-001 §11 test discipline",
      },
      {
        criterion: "PAS-001 Enterprise Accepted attestation row updated",
        gate: "Manual review — PAS author",
        trace: "PAS-001 §14 maturity exit",
      },
    ],
    runtime: [
      {
        capability: "Test import hygiene",
        path: "packages/kernel/src/context/__tests__/",
      },
    ],
  },
  {
    id: "B71",
    filename: "b71-permission-scope-permissions-parser.md",
    title: "Permission Scope Permissions Parser Owner",
    pas: "PAS-001A",
    pasSection: "§2.2 · IS-001",
    positionN: 1,
    positionTotal: 5,
    blueprintBox: "ERP Integration Spine",
    prerequisite: "PAS-001 Enterprise Accepted (B70 Delivered)",
    type: "Implementation",
    risk: "High",
    cleanCore: "A→B — parser moves to permissions package; kernel projection-only (justified)",
    purpose:
      "Close IS-001 permission-scope ownership split per PAS-001A §2.2: wire assert/parse live in @afenda/permissions; kernel retains branded projection only for OperatingContext.permissionScope.",
    objective:
      "Attest permission-scope wire triad in @afenda/permissions; remove kernel parser; add governance gate.",
    allowedLayer:
      "packages/permissions/src/scope/** · packages/kernel/src/context/permission-scope-context.projection.ts · apps/erp/src/lib/context/** · scripts/governance/**",
    files: [
      "packages/permissions/src/scope/permission-scope-context.parser.ts",
      "packages/kernel/src/context/permission-scope-context.projection.ts",
      "scripts/governance/check-permission-scope-permissions-surface.mts",
      "docs/PAS/KERNEL/SLICE/b71-permission-scope-permissions-parser.md",
    ],
    prohibited:
      "New kernel resolver logic · @afenda/kernel importing @afenda/permissions · ERP-local permission vocabulary",
    authority: "PAS-001A §2.2 · IS-001 · kernel-authority",
    gates: [
      "pnpm --filter @afenda/permissions test:run",
      "pnpm --filter @afenda/kernel test:run",
      "pnpm check:permission-scope-permissions-surface",
      "pnpm quality:kernel-context-surface",
    ],
    closes: "Closes DoD #1–#4 · IS-001 · INV-001",
    evidence: [
      "packages/permissions/src/scope/permission-scope-context.parser.ts",
      "packages/kernel/src/context/permission-scope-context.projection.ts",
      "scripts/governance/check-permission-scope-permissions-surface.mts",
      "Gate output archived in B75 attestation",
    ],
    attestation: "Contract · Test · Governance · Security",
    rules: [
      "Permission-scope wire assert/parse only in @afenda/permissions.",
      "Kernel brandPermissionScopeContextFromWire is projection-only.",
      "ERP assembly imports permissions parser then kernel projection.",
    ],
    dod: [
      {
        criterion: "No permission-scope parser under kernel",
        gate: "pnpm check:permission-scope-permissions-surface",
        trace: "PAS-001A §2.2 IS-001",
      },
      {
        criterion: "Permissions exports assert + parser",
        gate: "pnpm --filter @afenda/permissions test:run",
        trace: "PAS-001A §4.2 runtime ingress",
      },
      {
        criterion: "ERP typecheck with spine wiring",
        gate: "pnpm --filter @afenda/erp typecheck",
        trace: "Kernel Blueprint §4 ERP Integration Spine",
      },
      {
        criterion: "Context surface gates green",
        gate: "pnpm quality:kernel-context-surface",
        trace: "PAS-001A §13 baseline",
      },
    ],
    runtime: [
      {
        capability: "IS-001 permissions-owned parser",
        path: "packages/permissions/src/scope/permission-scope-context.parser.ts",
      },
    ],
  },
  {
    id: "B72",
    filename: "b72-erp-operating-context-spine-gate.md",
    title: "ERP Operating Context Spine Gate",
    pas: "PAS-001A",
    pasSection: "§2.3 · IS-002",
    positionN: 2,
    positionTotal: 5,
    blueprintBox: "ERP Integration Spine",
    prerequisite: "B71 Delivered",
    type: "Implementation",
    risk: "Medium",
    cleanCore: "A→A — governance gate for ERP integration registry",
    purpose:
      "Add `check:erp-operating-context-spine` gate verifying CONTEXT_INTEGRATION_WIRING and AUTH_SESSION_BRIDGE_WIRING entries in context-integration-registry.ts are wired in source.",
    objective:
      "Machine-enforce ERP operating-context integration registry wiring.",
    allowedLayer:
      "scripts/governance/check-erp-operating-context-spine.mts · apps/erp/src/lib/context/**",
    files: [
      "scripts/governance/check-erp-operating-context-spine.mts",
      "apps/erp/src/lib/context/context-integration-registry.ts",
      "apps/erp/src/lib/context/__tests__/context-integration-registry.test.ts",
      "docs/PAS/KERNEL/SLICE/b72-erp-operating-context-spine-gate.md",
    ],
    prohibited:
      "Kernel contract changes · resolver shortcuts bypassing resolveOperatingContextFromHeaders",
    authority: "PAS-001A §2.3 · IS-002 · multi-tenancy Step 8",
    gates: [
      "pnpm check:erp-operating-context-spine",
      "pnpm check:erp-context-surface",
      "pnpm --filter @afenda/erp test:run",
    ],
    closes: "Closes DoD #1–#3 · IS-002 integration spine",
    evidence: [
      "scripts/governance/check-erp-operating-context-spine.mts",
      "apps/erp/src/lib/context/context-integration-registry.ts",
      "Gate output archived in B75 attestation",
    ],
    attestation: "Governance · Test · Documentation",
    rules: [
      "Each registry module path resolves under apps/erp/src/.",
      "Each delegate symbol exported from declared module.",
      "Forbidden import patterns from check-erp-context-surface.mts rejected.",
    ],
    dod: [
      {
        criterion: "Gate fails on missing module/delegate",
        gate: "pnpm check:erp-operating-context-spine",
        trace: "PAS-001A §2.3 IS-002",
      },
      {
        criterion: "Gate passes on mainline registry",
        gate: "pnpm check:erp-operating-context-spine",
        trace: "PAS-001A §6 acceptance matrix row 2",
      },
      {
        criterion: "ERP context surface gate green",
        gate: "pnpm check:erp-context-surface",
        trace: "PAS-001A §13 baseline",
      },
    ],
    runtime: [
      {
        capability: "IS-002 spine gate",
        path: "scripts/governance/check-erp-operating-context-spine.mts",
      },
    ],
  },
  {
    id: "B75",
    filename: "b75-pas001a-production-candidate-attestation.md",
    title: "PAS-001A Production Candidate Attestation",
    pas: "PAS-001A",
    pasSection: "§6",
    positionN: 5,
    positionTotal: 5,
    blueprintBox: "ERP Integration Spine",
    prerequisite: "B71–B74 Delivered",
    type: "Evidence-sync",
    risk: "Low",
    cleanCore: "A→A — documentation and maturity promotion only",
    purpose:
      "Close PAS-001A at Production Candidate: §6 ERP Integration Acceptance Matrix 10/10 green; promote pas-status-index; sync runtime matrix and kernel-authority SKILL mirror.",
    objective:
      "Attest PAS-001A Production Candidate closure with archived gate output for all matrix rows.",
    allowedLayer:
      "docs/PAS/** · docs/PAS/pas-status-index.md · .cursor/skills/kernel-authority/SKILL.md",
    files: [
      "docs/PAS/pas-status-index.md",
      "docs/PAS/pas-status-index.md",
      "docs/PAS/KERNEL/SLICE/b75-pas001a-production-candidate-attestation.md",
      ".cursor/skills/kernel-authority/SKILL.md",
    ],
    prohibited:
      "Reopening PAS-001 Enterprise Accepted · kernel vocabulary expansion",
    authority: "PAS-001A §6 · documentation-drift · kernel-authority",
    gates: [
      "Full PAS-001A §13 gate table",
      "PAS-001A §6 acceptance matrix (10 rows)",
      "pnpm check:documentation-drift",
    ],
    closes: "Closes DoD #1–#3 · PAS-001A Production Candidate · INV-001–INV-006",
    evidence: [
      "docs/PAS/pas-status-index.md",
      "docs/PAS/pas-status-index.md",
      "Archived §6 matrix gate output",
    ],
    attestation: "Governance · Documentation · Observability",
    rules: [
      "All 10 §6 matrix rows must have executable gate evidence — no narrative-only Pass.",
      "PAS-001A maturity promotion does not demote PAS-001 Enterprise Accepted.",
    ],
    dod: [
      {
        criterion: "§6 acceptance matrix 10/10 green",
        gate: "PAS-001A §6 row gates",
        trace: "PAS-001A §6 · INV-001–INV-006",
      },
      {
        criterion: "pas-status-index PAS-001A → Production Candidate",
        gate: "pnpm check:documentation-drift",
        trace: "PAS-001A §14 maturity exit",
      },
      {
        criterion: "Runtime matrix integration row implemented",
        gate: "Manual review — architecture",
        trace: "Kernel Blueprint §8 ERP Integration Spine",
      },
    ],
    runtime: [
      {
        capability: "PAS-001A Production Candidate",
        path: "docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md §6",
      },
    ],
  },
  {
    id: "B80",
    filename: "b80-procurement-domain-vocabulary.md",
    title: "Procurement Domain Vocabulary",
    pas: "PAS-001B",
    pasSection: "§4.8 · KV-PROC",
    positionN: 5,
    positionTotal: 31,
    blueprintBox: "ERP Wire Vocabulary Catalog",
    prerequisite: "B79 Delivered (inventory wire)",
    type: "Implementation",
    risk: "Medium",
    cleanCore: "A→A — contracts-only wire promotion",
    purpose:
      "Promote KV-PROC `procurement` from catalog-only to delivered under PAS-001B Rule 3 — one module, one slice. No legacy handoff existed; this composed slice is SSOT.",
    objective:
      "Deliver procurement kernel ERP wire vocabulary module (contracts-only) under KV-PROC.",
    allowedLayer:
      "packages/kernel/src/erp-domain/procurement/** · erp-domain-layout.contract.ts · governance gates",
    files: [
      "packages/kernel/src/erp-domain/procurement/procurement-authority.contract.ts",
      "packages/kernel/src/erp-domain/procurement/__tests__/procurement-domain-vocabulary.contract.test.ts",
      "scripts/governance/check-procurement-domain-contracts.mts",
      "docs/PAS/KERNEL/SLICE/b80-procurement-domain-vocabulary.md",
    ],
    prohibited:
      "purchase-order posting runtime · @afenda/database · packages/procurement recreation",
    authority: "PAS-001B §4.8 · KV-PROC · kernel-authority · ADR-0020 Rule 2",
    gates: [
      "pnpm check:procurement-domain-contracts",
      "pnpm check:erp-domain-layout",
      "pnpm check:erp-domain-delivered-vocabulary",
      "pnpm --filter @afenda/kernel typecheck",
    ],
    closes: "Closes DoD #1–#4 · KV-PROC delivered · Rule 3",
    evidence: [
      "packages/kernel/src/erp-domain/procurement/index.ts",
      "scripts/governance/check-procurement-domain-contracts.mts",
      "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts",
      "Gate output: check:erp-domain-delivered-vocabulary",
    ],
    attestation: "Contract · Test · Governance · Documentation",
    rules: [
      "Kernel may describe procurement words — must not execute PO posting runtime.",
      "VendorId remains on kernel business-reference authority (Rule 2).",
      "Module remains contracts-only under erp-domain/procurement/.",
    ],
    dod: [
      {
        criterion: "Procurement 10-file module pattern present",
        gate: "pnpm check:procurement-domain-contracts",
        trace: "PAS-001B §4.8 · KV-PROC",
      },
      {
        criterion: "Layout maturity = delivered for procurement",
        gate: "pnpm check:erp-domain-layout",
        trace: "Kernel Blueprint §4",
      },
      {
        criterion: "Vocabulary tests pass",
        gate: "pnpm --filter @afenda/kernel test:run src/erp-domain/procurement",
        trace: "PAS-001B §11",
      },
      {
        criterion: "Unified vocabulary gate includes procurement",
        gate: "pnpm check:erp-domain-delivered-vocabulary",
        trace: "PAS-001B §13 · Rule 3",
      },
    ],
    runtime: [
      {
        capability: "KV-PROC wire module",
        path: "packages/kernel/src/erp-domain/procurement/",
      },
    ],
  },
  {
    id: "B106",
    filename: "b106-foundation-erp-domain-scaffold-standardization.md",
    title: "Foundation ERP Domain Scaffold Standardization",
    pas: "PAS-001B",
    pasSection: "§2 · KV-ACCT · KV-INV",
    positionN: 31,
    positionTotal: 31,
    blueprintBox: "ERP Wire Vocabulary Catalog",
    prerequisite: "B81–B105 Delivered",
    type: "Implementation",
    risk: "High",
    cleanCore: "A→B — re-scaffold foundation modules to catalog scaffold (justified)",
    purpose:
      "Close structural drift between hand-built foundation modules (accounting, inventory) and governed scaffold pattern. Re-scaffold from foundation specs while preserving ADR-0020 cross-refs and fiscal ID quarantine.",
    objective:
      "Re-scaffold accounting + inventory to match catalog scaffold contract; all foundation gates green.",
    allowedLayer:
      "packages/kernel/src/erp-domain/accounting/** · packages/kernel/src/erp-domain/inventory/** · scripts/governance/erp-domain-foundation-module-specs.mts · docs/PAS/KERNEL/**",
    files: [
      "scripts/governance/erp-domain-foundation-module-specs.mts",
      "scripts/governance/scaffold-foundation-erp-domain-modules.mts",
      "packages/kernel/src/erp-domain/accounting/",
      "packages/kernel/src/erp-domain/inventory/",
      "docs/PAS/KERNEL/SLICE/b106-foundation-erp-domain-scaffold-standardization.md",
    ],
    prohibited:
      "@afenda/database schema · ERP routes · posting services · batch re-scaffold of B81+ modules",
    authority: "PAS-001B §2 · Rule 2 · ADR-0020 · kernel-authority",
    gates: [
      "pnpm check:erp-domain-layout",
      "pnpm check:erp-domain-delivered-vocabulary",
      "pnpm check:accounting-domain-contracts",
      "pnpm check:inventory-domain-contracts",
      "pnpm --filter @afenda/kernel test:run src/erp-domain",
      "pnpm check:documentation-drift",
    ],
    closes: "Closes DoD #1–#4 · PAS-001B Enterprise Accepted closure",
    evidence: [
      "packages/kernel/src/erp-domain/accounting/accounting-authority.contract.ts",
      "packages/kernel/src/erp-domain/inventory/inventory-authority.contract.ts",
      "scripts/governance/scaffold-foundation-erp-domain-modules.mts",
      "Gate output: all §13 gates",
    ],
    attestation: "Contract · Test · Governance · Documentation · Maintainability",
    rules: [
      "ACCOUNTING_REGISTRY_ID = PKG-R01; INVENTORY_REGISTRY_ID = PKGR02_INVENTORY preserved.",
      "FiscalCalendarId/FiscalPeriodId remain forbidden platform floor branded ids.",
      "Do not re-scaffold B81+ catalog modules in this slice.",
    ],
    dod: [
      {
        criterion: "Foundation modules match scaffold contract",
        gate: "pnpm check:erp-domain-delivered-vocabulary",
        trace: "PAS-001B §2 foundation standardization",
      },
      {
        criterion: "Legacy domain gates retained green",
        gate: "pnpm check:accounting-domain-contracts · check:inventory-domain-contracts",
        trace: "PAS-001B §11 · KV-ACCT · KV-INV",
      },
      {
        criterion: "178+ erp-domain tests pass",
        gate: "pnpm --filter @afenda/kernel test:run src/erp-domain",
        trace: "PAS-001B §11 type safety",
      },
      {
        criterion: "PAS-001B doc + status index synced",
        gate: "pnpm check:documentation-drift",
        trace: "PAS-001B §14 maturity exit",
      },
    ],
    runtime: [
      {
        capability: "Foundation scaffold parity",
        path: "scripts/governance/scaffold-foundation-erp-domain-modules.mts",
      },
    ],
  },
  pas001WireSlice(
    "B50",
    "b50-kernel-company-org-wire-triad.md",
    "Company/Org/Entity-Group Wire Triad",
    "§4.4",
    2,
    "B49 Delivered",
    "Complete ADR-0022 split-ID wire triad for company, organization unit, and entity group at ERP mapper boundary.",
    "packages/kernel/src/context/company-context.parser.ts",
    "pnpm check:kernel-context-surface",
  ),
  pas001WireSlice(
    "B51",
    "b51-kernel-parent-org-wire.md",
    "Parent Org Wire",
    "§4.4",
    3,
    "B50 Delivered",
    "Wire parent organization context triad and ERP mapper enrichment for hierarchy traversal.",
    "packages/kernel/src/context/organization-unit-context.parser.ts",
    "pnpm check:kernel-context-surface",
  ),
  pas001WireSlice(
    "B52",
    "b52-kernel-full-hierarchy-wire-closure.md",
    "Full Hierarchy Wire Closure",
    "§4.4",
    4,
    "B51 Delivered",
    "Close full operating-context hierarchy wire chain tenant → company → org → entity group.",
    "packages/kernel/src/context/entity-group-context.parser.ts",
    "pnpm check:kernel-context-surface",
  ),
  pas001WireSlice(
    "B53",
    "b53-kernel-propagation-frame-wire.md",
    "Propagation Frame Wire",
    "§4.11",
    5,
    "B16 §10 Delivered",
    "Register propagation frame wire vocabulary aligned with PAS-001 §4.11 and async propagation rules.",
    "packages/kernel/src/context/propagation-frame-context.parser.ts",
    "pnpm check:kernel-propagation-isolation",
  ),
  pas001WireSlice(
    "B54",
    "b54-kernel-project-wire-triad.md",
    "Project Wire Triad",
    "§4.11",
    6,
    "B52 Delivered",
    "Deliver project context wire triad for project-scoped operating context.",
    "packages/kernel/src/context/project-context.parser.ts",
    "pnpm check:kernel-context-surface",
  ),
  pas001WireSlice(
    "B55",
    "b55-kernel-policy-wire-triad.md",
    "Policy Wire Triad",
    "§4.9",
    7,
    "B15-4.9 Delivered",
    "Deliver policy context wire triad for lifecycle enforcement vocabulary.",
    "packages/kernel/src/context/policy-context.parser.ts",
    "pnpm check:kernel-context-surface",
  ),
  pas001WireSlice(
    "B57",
    "b57-kernel-permission-wire-triad.md",
    "Permission Wire Triad",
    "§8",
    8,
    "B55 Delivered",
    "Deliver permission vocabulary wire triad preceding permission-scope ownership split (PAS-001A).",
    "packages/kernel/src/context/permission-context.parser.ts",
    "pnpm check:kernel-context-surface",
  ),
  {
    id: "B67",
    filename: "b67-pas001-doc-attestation-closure.md",
    title: "PAS-001 Doc Attestation Closure",
    pas: "PAS-001",
    pasSection: "§14",
    positionN: 9,
    positionTotal: 12,
    blueprintBox: "Kernel Vocabulary",
    prerequisite: "B57 Delivered",
    type: "Evidence-sync",
    risk: "Low",
    cleanCore: "A→A — documentation attestation only",
    purpose:
      "Attest PAS-001 documentation chain closure: composed headers, pas-status-index, kernel-authority SKILL mirror, runtime matrix kernel rows.",
    objective: "PAS-001 doc attestation gates green; Enterprise Accepted evidence archived.",
    allowedLayer: "docs/PAS/** · docs/PAS/** · .cursor/skills/kernel-authority/**",
    files: [
      "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
      "docs/PAS/pas-status-index.md",
      "docs/PAS/KERNEL/SLICE/b67-pas001-doc-attestation-closure.md",
    ],
    prohibited: "packages/kernel/** source edits · foundation-disposition without registry-owner",
    authority: "PAS-001 §14 · documentation-drift · kernel-authority",
    gates: [
      "pnpm check:documentation-drift",
      "pnpm check:foundation-disposition",
    ],
    closes: "Closes DoD #1–#3 · PAS-001 doc attestation",
    evidence: [
      "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
      "docs/PAS/pas-status-index.md",
      "docs/PAS/pas-status-index.md",
    ],
    attestation: "Governance · Documentation",
    rules: [
      "Doc attestation does not claim runtime capabilities without gate evidence.",
      "Composed PAS-001 in KERNEL/ is SSOT over legacy root PAS-001 for agent Phase 0.",
    ],
    dod: [
      {
        criterion: "documentation-drift gate green",
        gate: "pnpm check:documentation-drift",
        trace: "PAS-001 §14 maturity",
      },
      {
        criterion: "PAS-001 Enterprise Accepted row in status index",
        gate: "file read pas-status-index.md",
        trace: "PAS-001 §11 EAC",
      },
      {
        criterion: "Runtime matrix kernel vocabulary rows synced",
        gate: "Manual review — architecture",
        trace: "Kernel Blueprint §8",
      },
    ],
    runtime: [
      {
        capability: "PAS-001 doc attestation",
        path: "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
      },
    ],
  },
  pas001WireSlice(
    "B68",
    "b68-hierarchy-id-boundary-wire-triad.md",
    "Hierarchy ID Boundary Wire Triad",
    "§4.4",
    10,
    "B67 Delivered",
    "Deliver hierarchy-id-boundary wire triad enforcing branded id families at wire ingress.",
    "packages/kernel/src/context/hierarchy-id-boundary.parser.ts",
    "pnpm check:kernel-context-surface",
  ),
  {
    id: "B69",
    filename: "b69-kernel-context-wire-triad-gate.md",
    title: "Kernel Context Wire Triad Gate",
    pas: "PAS-001",
    pasSection: "§9",
    positionN: 11,
    positionTotal: 12,
    blueprintBox: "Kernel Vocabulary",
    prerequisite: "B68 Delivered",
    type: "Implementation",
    risk: "Medium",
    cleanCore: "A→A — governance gate for context wire triads",
    purpose:
      "Add check:kernel-context-wire-triad gate verifying every wireIngress context in context-registry has contract/assert/parser triad on disk.",
    objective: "Machine-enforce context wire triad completeness across context-registry.",
    allowedLayer:
      "scripts/governance/check-kernel-context-wire-triad.mts · packages/kernel/src/context/**",
    files: [
      "scripts/governance/check-kernel-context-wire-triad.mts",
      "packages/kernel/src/context/context-registry.ts",
      "docs/PAS/KERNEL/SLICE/b69-kernel-context-wire-triad-gate.md",
    ],
    prohibited: "apps/erp/** · new context types without PAS amendment slice",
    authority: "PAS-001 §9 rule 14 · kernel-authority",
    gates: [
      "pnpm check:kernel-context-wire-triad",
      "pnpm quality:kernel-context-surface",
    ],
    closes: "Closes DoD #1–#3 · context wire triad gate",
    evidence: [
      "scripts/governance/check-kernel-context-wire-triad.mts",
      "packages/kernel/src/context/context-registry.ts",
      "Gate output archived in B70/B75 docs",
    ],
    attestation: "Governance · Test",
    rules: [
      "Every wireIngress:true registry entry must have triad files.",
      "Gate fails closed when triad file missing or export mismatch.",
    ],
    dod: [
      {
        criterion: "Wire triad gate passes on mainline",
        gate: "pnpm check:kernel-context-wire-triad",
        trace: "PAS-001 §9 · Kernel NS context EFR",
      },
      {
        criterion: "Context surface quality gate green",
        gate: "pnpm quality:kernel-context-surface",
        trace: "PAS-001 §13",
      },
      {
        criterion: "PAS-001 §9 rule 14 no longer deferred",
        gate: "Manual review — PAS author",
        trace: "PAS-001 §14 maturity",
      },
    ],
    runtime: [
      {
        capability: "Context wire triad gate",
        path: "scripts/governance/check-kernel-context-wire-triad.mts",
      },
    ],
  },
  {
    id: "B73",
    filename: "b73-kernel-erp-doc-drift-closure.md",
    title: "Kernel ERP Doc Drift Closure",
    pas: "PAS-001A",
    pasSection: "§1.2 D5",
    positionN: 3,
    positionTotal: 5,
    blueprintBox: "ERP Integration Spine",
    prerequisite: "B71 Delivered",
    type: "Evidence-sync",
    risk: "Low",
    cleanCore: "A→A — documentation sync only",
    purpose:
      "Sync documentation with post–PAS-001 runtime: fix stale resolver paths in runtime matrix; close multi-tenancy delivery-doc gaps; update PAS-001 §9 rule-14 prose.",
    objective: "Documentation reflects ERP resolver + permissions ownership split from B71.",
    allowedLayer:
      "docs/PAS/** · docs/PAS/** · apps/docs delivery evidence if generated",
    files: [
      "docs/PAS/pas-status-index.md",
      "docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md",
      "docs/PAS/KERNEL/SLICE/b73-kernel-erp-doc-drift-closure.md",
    ],
    prohibited:
      "Marking runtime implemented without gate evidence · kernel source edits",
    authority: "PAS-001A §1.2 · documentation-drift",
    gates: [
      "pnpm check:documentation-drift",
      "pnpm check:multi-tenancy-context-contracts",
    ],
    closes: "Closes DoD #1–#3 · doc drift closure",
    evidence: [
      "docs/PAS/pas-status-index.md",
      "docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md",
      "pnpm check:documentation-drift output",
    ],
    attestation: "Documentation · Governance",
    rules: [
      "No doc cites deleted kernel permission-scope parser path.",
      "Runtime matrix permission scope → @afenda/permissions.",
    ],
    dod: [
      {
        criterion: "documentation-drift green",
        gate: "pnpm check:documentation-drift",
        trace: "PAS-001A §1.2 D5",
      },
      {
        criterion: "multi-tenancy context contracts green",
        gate: "pnpm check:multi-tenancy-context-contracts",
        trace: "Kernel Blueprint §8 Step 8",
      },
      {
        criterion: "No stale kernel parser paths in docs",
        gate: "ripgrep docs/",
        trace: "PAS-001A INV-002",
      },
    ],
    runtime: [
      {
        capability: "Doc/runtime parity",
        path: "docs/PAS/pas-status-index.md",
      },
    ],
  },
  {
    id: "B74",
    filename: "b74-metadata-context-authorization-bridge.md",
    title: "Metadata Context Authorization Bridge",
    pas: "PAS-001A",
    pasSection: "§1.2 D6 · IS-003",
    positionN: 4,
    positionTotal: 5,
    blueprintBox: "ERP Integration Spine",
    prerequisite: "B72 Delivered",
    type: "Implementation",
    risk: "High",
    cleanCore: "A→A — consumer wiring to ERP spine",
    purpose:
      "Prove metadata workspace and metadata-ui authorization paths consume verified OperatingContext from ERP spine — IS-003; no parallel scope resolution.",
    objective: "Metadata surfaces use ERP operating-context spine for RBAC.",
    allowedLayer:
      "apps/erp/src/app/(protected)/metadata-workspace/** · apps/erp/src/lib/metadata/** · packages/metadata-ui/**",
    files: [
      "apps/erp/src/app/(protected)/metadata-workspace/page.tsx",
      "scripts/governance/check-metadata-context-authorization-bridge.mts",
      "docs/PAS/KERNEL/SLICE/b74-metadata-context-authorization-bridge.md",
    ],
    prohibited:
      "New kernel contracts · metadata-local tenant/company ID parsing · @afenda/database deep imports in metadata lib",
    authority: "PAS-001A IS-003 · metadata-ui · ERP Context",
    gates: [
      "pnpm check:metadata-context-authorization-bridge",
      "pnpm --filter @afenda/erp test:run",
      "pnpm ui:guard:scan",
    ],
    closes: "Closes DoD #1–#3 · IS-003 metadata bridge",
    evidence: [
      "scripts/governance/check-metadata-context-authorization-bridge.mts",
      "apps/erp/src/app/(protected)/metadata-workspace/page.tsx",
      "Gate output archived in B75 attestation",
    ],
    attestation: "Security · Test · Governance",
    rules: [
      "Metadata routes delegate to resolveOperatingContextFromHeaders.",
      "Metadata actions reject untrusted authority fields.",
    ],
    dod: [
      {
        criterion: "Metadata bridge gate passes",
        gate: "pnpm check:metadata-context-authorization-bridge",
        trace: "PAS-001A IS-003",
      },
      {
        criterion: "ERP metadata integration tests pass",
        gate: "pnpm --filter @afenda/erp test:run",
        trace: "PAS-001A §6 matrix row metadata",
      },
      {
        criterion: "Governed UI scan clean if metadata-ui touched",
        gate: "pnpm ui:guard:scan",
        trace: "Governed UI policy",
      },
    ],
    runtime: [
      {
        capability: "IS-003 metadata authorization bridge",
        path: "scripts/governance/check-metadata-context-authorization-bridge.mts",
      },
    ],
  },
  {
    id: "B76",
    filename: "b76-pas001b-erp-domain-catalog-doc.md",
    title: "PAS-001B ERP Domain Catalog Doc",
    pas: "PAS-001B",
    pasSection: "§0–§8",
    positionN: 1,
    positionTotal: 31,
    blueprintBox: "ERP Wire Vocabulary Catalog",
    prerequisite: "PAS-001 closed · PAS-001A Production Candidate",
    type: "Evidence-sync",
    risk: "Low",
    cleanCore: "A→A — PAS authoring and authority chain sync",
    purpose:
      "Author composed PAS-001B at catalog_authority maturity and sync authority chain (README, pas-status-index, runtime matrix, kernel tree).",
    objective: "Publish ERP Wire Vocabulary Catalog PAS + authority chain sync.",
    allowedLayer:
      "docs/PAS/KERNEL/** · docs/PAS/** · packages/kernel/PAS-001-KERNEL-TREE.md · .cursor/skills/kernel-authority/**",
    files: [
      "docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
      "docs/PAS/KERNEL/README.md",
      "docs/PAS/pas-status-index.md",
      "docs/PAS/KERNEL/SLICE/b76-pas001b-erp-domain-catalog-doc.md",
    ],
    prohibited:
      "New erp-domain/{slug}/ folders · foundation-disposition without registry-owner",
    authority: "PAS-001B §0 · kernel-authority · documentation-drift",
    gates: ["pnpm check:documentation-drift"],
    closes: "Closes DoD #1–#3 · PAS-001B doc foundation",
    evidence: [
      "docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
      "docs/PAS/pas-status-index.md",
      "docs/PAS/pas-status-index.md",
    ],
    attestation: "Documentation · Governance",
    rules: [
      "Composed PAS-001B in KERNEL/ is SSOT — legacy root PAS-001B is archive.",
      "28-module KV-* registry published in PAS §3.",
    ],
    dod: [
      {
        criterion: "Composed PAS-001B published",
        gate: "file read",
        trace: "PAS-001B §0 catalog authority",
      },
      {
        criterion: "documentation-drift green",
        gate: "pnpm check:documentation-drift",
        trace: "PAS-001B §14",
      },
      {
        criterion: "Authority chain pointers synced",
        gate: "Manual review — PAS author",
        trace: "Kernel Blueprint §4",
      },
    ],
    runtime: [
      {
        capability: "PAS-001B catalog doc",
        path: "docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
      },
    ],
  },
  {
    id: "B77",
    filename: "b77-erp-domain-layout-gate.md",
    title: "ERP Domain Layout Gate",
    pas: "PAS-001B",
    pasSection: "§4.1",
    positionN: 2,
    positionTotal: 31,
    blueprintBox: "ERP Wire Vocabulary Catalog",
    prerequisite: "B76 Delivered",
    type: "Implementation",
    risk: "Medium",
    cleanCore: "A→A — layout contract + gate",
    purpose:
      "Deliver erp-domain-layout.contract.ts and check:erp-domain-layout gate enforcing module folder maturity and KV-* registry parity.",
    objective: "Machine-enforce ERP domain layout contract for catalog modules.",
    allowedLayer:
      "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · scripts/governance/check-erp-domain-layout.mts",
    files: [
      "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts",
      "scripts/governance/check-erp-domain-layout.mts",
      "docs/PAS/KERNEL/SLICE/b77-erp-domain-layout-gate.md",
    ],
    prohibited: "Promoting module maturity without slice · @afenda/database",
    authority: "PAS-001B §4.1 · kernel-authority",
    gates: [
      "pnpm check:erp-domain-layout",
      "pnpm --filter @afenda/kernel typecheck",
    ],
    closes: "Closes DoD #1–#3 · layout gate",
    evidence: [
      "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts",
      "scripts/governance/check-erp-domain-layout.mts",
      "Gate output archived",
    ],
    attestation: "Contract · Governance · Test",
    rules: [
      "Layout contract is single registry for module maturity and KV ids.",
      "Gate fails when folder exists without layout row or vice versa.",
    ],
    dod: [
      {
        criterion: "Layout gate passes",
        gate: "pnpm check:erp-domain-layout",
        trace: "PAS-001B §4.1",
      },
      {
        criterion: "Kernel typecheck green",
        gate: "pnpm --filter @afenda/kernel typecheck",
        trace: "PAS-001B §11",
      },
      {
        criterion: "Composed slice SSOT published",
        gate: "file read",
        trace: "PAS-001B §12",
      },
    ],
    runtime: [
      {
        capability: "ERP domain layout gate",
        path: "scripts/governance/check-erp-domain-layout.mts",
      },
    ],
  },
  {
    id: "B78",
    filename: "b78-pas001b-audit-closure.md",
    title: "PAS-001B Audit Closure",
    pas: "PAS-001B",
    pasSection: "§11",
    positionN: 3,
    positionTotal: 31,
    blueprintBox: "ERP Wire Vocabulary Catalog",
    prerequisite: "B77 Delivered",
    type: "Evidence-sync",
    risk: "Low",
    cleanCore: "A→A — audit attestation before module promotions",
    purpose:
      "Close PAS-001B pre-promotion audit: prohibited surface scan, layout gate evidence, catalog doc alignment.",
    objective: "Attest PAS-001B audit closure before B79+ module promotions.",
    allowedLayer: "docs/PAS/KERNEL/** · docs/PAS/**",
    files: [
      "docs/PAS/KERNEL/SLICE/b78-pas001b-audit-closure.md",
      "docs/PAS/KERNEL/SLICE/slice-compliance-audit.md",
      "docs/PAS/pas-status-index.md",
    ],
    prohibited: "Module promotions in same session · kernel erp-domain slug folders",
    authority: "PAS-001B §11 · pas-prohibited-surface-scan · documentation-drift",
    gates: [
      "pnpm check:erp-domain-layout",
      "pnpm check:documentation-drift",
    ],
    closes: "Closes DoD #1–#3 · pre-promotion audit",
    evidence: [
      "docs/PAS/KERNEL/SLICE/b78-pas001b-audit-closure.md",
      "pnpm check:erp-domain-layout output",
      "docs/PAS/pas-status-index.md",
    ],
    attestation: "Governance · Documentation",
    rules: [
      "Audit closure is evidence-sync — no erp-domain module folders created here.",
      "Slice compliance audit documents legacy non-compliance before promotions.",
    ],
    dod: [
      {
        criterion: "Layout gate green at audit time",
        gate: "pnpm check:erp-domain-layout",
        trace: "PAS-001B §11 governance",
      },
      {
        criterion: "Documentation drift green",
        gate: "pnpm check:documentation-drift",
        trace: "PAS-001B §14",
      },
      {
        criterion: "Audit alignment table published",
        gate: "file read slice-compliance-audit.md",
        trace: "documentation-drift AUDIT alignment table",
      },
    ],
    runtime: [
      {
        capability: "PAS-001B audit closure",
        path: "docs/PAS/KERNEL/SLICE/b78-pas001b-audit-closure.md",
      },
    ],
  },
  {
    id: "B79",
    filename: "b79-inventory-domain-vocabulary.md",
    title: "Inventory Domain Vocabulary",
    pas: "PAS-001B",
    pasSection: "§4.8 · KV-INV",
    positionN: 4,
    positionTotal: 31,
    blueprintBox: "ERP Wire Vocabulary Catalog",
    prerequisite: "B78 Delivered",
    type: "Implementation",
    risk: "Medium",
    cleanCore: "A→A — contracts-only wire promotion",
    purpose:
      "Promote KV-INV inventory from catalog-only to delivered under PAS-001B Rule 3 — first individual module promotion after audit closure.",
    objective: "Deliver inventory kernel ERP wire vocabulary module (contracts-only).",
    allowedLayer:
      "packages/kernel/src/erp-domain/inventory/** · governance gates · docs/PAS/KERNEL/**",
    files: [
      "packages/kernel/src/erp-domain/inventory/inventory-authority.contract.ts",
      "packages/kernel/src/erp-domain/inventory/__tests__/inventory-domain-vocabulary.contract.test.ts",
      "scripts/governance/check-inventory-domain-contracts.mts",
      "docs/PAS/KERNEL/SLICE/b79-inventory-domain-vocabulary.md",
    ],
    prohibited:
      "Stock posting runtime · @afenda/database · packages/inventory recreation · other erp-domain modules",
    authority: "PAS-001B §4.8 · KV-INV · kernel-authority · ADR-0020 Rule 2",
    gates: [
      "pnpm check:inventory-domain-contracts",
      "pnpm check:erp-domain-layout",
      "pnpm check:erp-domain-delivered-vocabulary",
      "pnpm --filter @afenda/kernel typecheck",
    ],
    closes: "Closes DoD #1–#4 · KV-INV delivered",
    evidence: [
      "packages/kernel/src/erp-domain/inventory/index.ts",
      "scripts/governance/check-inventory-domain-contracts.mts",
      "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts",
      "Gate output: check:erp-domain-delivered-vocabulary",
    ],
    attestation: "Contract · Test · Governance · Documentation",
    rules: [
      "Kernel describes inventory words only — no stock posting runtime.",
      "ProductId/WarehouseId remain business-reference authority (Rule 2).",
      "Module remains contracts-only.",
    ],
    dod: [
      {
        criterion: "Inventory 10-file module pattern present",
        gate: "pnpm check:inventory-domain-contracts",
        trace: "PAS-001B §4.8 · KV-INV",
      },
      {
        criterion: "Layout maturity = delivered for inventory",
        gate: "pnpm check:erp-domain-layout",
        trace: "Kernel Blueprint §4",
      },
      {
        criterion: "Vocabulary tests pass",
        gate: "pnpm --filter @afenda/kernel test:run src/erp-domain/inventory",
        trace: "PAS-001B §11",
      },
      {
        criterion: "Unified vocabulary gate includes inventory",
        gate: "pnpm check:erp-domain-delivered-vocabulary",
        trace: "PAS-001B §13 · Rule 3",
      },
    ],
    runtime: [
      {
        capability: "KV-INV wire module",
        path: "packages/kernel/src/erp-domain/inventory/",
      },
    ],
  },
];

for (const slice of SLICES) {
  const out = path.join(OUT, slice.filename);
  fs.writeFileSync(out, render(slice));
  console.log("wrote", out);
}

console.log("closure slices:", SLICES.length);
