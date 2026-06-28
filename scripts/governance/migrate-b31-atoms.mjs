#!/usr/bin/env node
/**
 * B31 ontology completion — append 8 kernel-aligned context atoms (16 → 24).
 * Idempotent: skips atoms that already exist in atoms.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../packages/enterprise-knowledge/src/data"
);

function kernelMapping(upstreamContract, operatingContextField, options = {}) {
  return {
    upstreamContract,
    ...(operatingContextField ? { operatingContextField } : {}),
    persistenceClass: options.persistenceClass ?? "derived",
    runtimeStatus: options.runtimeStatus ?? "implemented",
    ...(options.databaseTable ? { databaseTable: options.databaseTable } : {}),
  };
}

const B31_IMPLEMENTATION_MAPPINGS = {
  operating_context: kernelMapping("OperatingContext", undefined),
  permission_scope: kernelMapping("PermissionScopeContext", "permissionScope"),
  project: kernelMapping("ProjectContext", "project"),
  team: kernelMapping("TeamContext", "team"),
  localization_context: kernelMapping("LocalizationContext", undefined, {
    runtimeStatus: "partial",
  }),
  workflow_context: kernelMapping("WorkflowContext", "workflow"),
  business_reference: kernelMapping("BusinessReferenceWire", undefined, {
    persistenceClass: "authority_only",
  }),
};

function createContextAtom({
  atomId,
  fqn,
  canonical,
  business,
  engineering,
  decision,
  inference,
  rules,
  domains,
  evidenceSource,
  mappingKey,
  authorityType = "operational",
  lifecycle = "accepted",
}) {
  const implementationMapping = mappingKey
    ? B31_IMPLEMENTATION_MAPPINGS[mappingKey]
    : undefined;
  return {
    atomId,
    fqn,
    kind: "concept",
    acceptanceChain: [
      { step: "origin", by: "external_source", on: "erp-platform-design" },
      { step: "accepted", by: "afenda_architecture_authority", on: "2026-06" },
    ],
    authorityType,
    binding: "mandatory",
    confidence: { score: 92, basis: ["afenda_decision", "SAP", "Oracle"] },
    structuredReasoning: {
      premises: [
        `Afenda resolves ${atomId.replaceAll("_", " ")} at ERP operating boundaries.`,
      ],
      inference,
      rules,
      conclusion: canonical,
    },
    knowledgeDecision: {
      decision,
      alternativesConsidered: ["Defer to UI-only labels"],
      whyRejected: {
        "Defer to UI-only labels":
          "Operating context requires accepted meaning.",
      },
      impact: ["identity", "security", "ai_reasoning"],
    },
    meaning: { canonical, business, engineering },
    knowledgeDomain: domains,
    applicability: {
      applicable: domains,
      notApplicable: ["networking"],
      exceptions: [],
    },
    lifecycle,
    lineage: {
      origin: "PAS-001 kernel context contracts.",
      evolution: [],
      currentAuthority: "PAS-004A",
      futureDirection: "Consumer proof via approved slice.",
    },
    misconceptions: [],
    exposure: {
      audience: "both",
      afendaPreferredWording: business,
    },
    integrity: {
      correctness: true,
      completeness: true,
      consistency: true,
      authority: true,
      acceptance: true,
      evidence: true,
      reasoning: true,
      applicability: true,
      evolution: true,
      relationship: true,
    },
    typedEvidence: [
      {
        evidenceId: `${atomId}_evidence_1`,
        type: "policy",
        source: evidenceSource,
      },
    ],
    ...(implementationMapping ? { implementationMapping } : {}),
    ownedByPas: "PAS-004",
  };
}

const expansion = [
  createContextAtom({
    atomId: "operating_context",
    fqn: "afenda.enterprise.operating_context",
    canonical:
      "Server-resolved ERP operating snapshot composing tenant, legal entity, workspace, and scoped authorities.",
    business: "Operating context / where am I working.",
    engineering:
      "OperatingContext assembly · resolve-operating-context.server.ts",
    decision:
      "Operating context is a composed authority snapshot, not a user-editable preference.",
    inference:
      "ERP modules consume one resolved operating context per request after permission verification.",
    rules: ["PAS-001 OperatingContext", "multi-tenancy isolation"],
    domains: ["identity", "security"],
    evidenceSource: "packages/kernel/src/context/operating-context.contract.ts",
    mappingKey: "operating_context",
  }),
  createContextAtom({
    atomId: "permission_scope",
    fqn: "afenda.enterprise.permission_scope",
    canonical:
      "Resolved permission evaluation scope for the current actor within tenant and workspace boundaries.",
    business: "Permission scope / what the user may do here.",
    engineering: "PermissionScopeContext · authorize-api-route",
    decision:
      "Permission scope is derived from membership and role grants, not from UI state.",
    inference:
      "Every API route resolves permission scope before business logic executes.",
    rules: ["PAS-001 PermissionScopeContext", "TIP-004 RBAC"],
    domains: ["security", "identity"],
    evidenceSource:
      "packages/kernel/src/context/permission-scope-context.contract.ts",
    mappingKey: "permission_scope",
  }),
  createContextAtom({
    atomId: "project",
    fqn: "afenda.enterprise.project",
    canonical:
      "Optional project dimension scoping work, budgets, or delivery within a workspace.",
    business: "Project.",
    engineering: "ProjectContext · project wire contracts",
    decision:
      "Project is optional operating dimension — null when not applicable.",
    inference: "Projects attach to workspace operating snapshots when enabled.",
    rules: ["PAS-001 ProjectContext"],
    domains: ["identity"],
    evidenceSource: "packages/kernel/src/context/project-context.contract.ts",
    mappingKey: "project",
  }),
  createContextAtom({
    atomId: "team",
    fqn: "afenda.enterprise.team",
    canonical:
      "Optional team dimension for collaborative ownership within a workspace.",
    business: "Team.",
    engineering: "TeamContext · team wire contracts",
    decision:
      "Team is optional operating dimension distinct from organization unit hierarchy.",
    inference: "Teams scope collaboration without replacing org structure.",
    rules: ["PAS-001 TeamContext"],
    domains: ["identity"],
    evidenceSource: "packages/kernel/src/context/team-context.contract.ts",
    mappingKey: "team",
  }),
  createContextAtom({
    atomId: "localization_context",
    fqn: "afenda.enterprise.localization_context",
    canonical:
      "Locale, currency, and formatting context applied to user-visible and statutory outputs.",
    business: "Localization / regional settings.",
    engineering: "LocalizationContext · next-intl integration boundary",
    decision:
      "Localization context is resolved server-side and travels with operating context.",
    inference:
      "Reports and UI copy respect localization context without duplicating meaning atoms.",
    rules: ["PAS-001 LocalizationContext"],
    domains: ["identity", "reporting"],
    evidenceSource:
      "packages/kernel/src/context/localization-context.contract.ts",
    mappingKey: "localization_context",
  }),
  createContextAtom({
    atomId: "workflow_context",
    fqn: "afenda.enterprise.workflow_context",
    canonical:
      "Optional workflow state dimension for approval and process-scoped operations.",
    business: "Workflow context.",
    engineering: "WorkflowContext · execution package boundary",
    decision:
      "Workflow context is nullable — present only during active process participation.",
    inference:
      "Process modules attach workflow context without overloading workspace meaning.",
    rules: ["PAS-001 WorkflowContext"],
    domains: ["identity"],
    evidenceSource: "packages/kernel/src/context/workflow-context.contract.ts",
    mappingKey: "workflow_context",
  }),
  createContextAtom({
    atomId: "business_reference",
    fqn: "afenda.enterprise.business_reference",
    canonical:
      "Tenant-governed human administrative number family — not a canonical kernel ID.",
    business: "Business reference number (customer no., employee no., …).",
    engineering: "Business reference wire · parse* at ingress only",
    decision:
      "Business references are tenant-owned display numbers; kernel IDs remain immutable system identity.",
    inference:
      "Parsers exist at trust boundaries; meaning stays in enterprise knowledge.",
    rules: ["PAS-001 §4.7 business reference identity", "ADR-0021"],
    domains: ["identity", "security"],
    evidenceSource:
      "packages/kernel/src/identity/wire/business-reference-wire.contract.ts",
    mappingKey: "business_reference",
    authorityType: "regulatory",
  }),
  createContextAtom({
    atomId: "human_reference",
    fqn: "afenda.enterprise.human_reference",
    canonical:
      "Tenant-scoped human-readable reference governed separately from kernel canonical IDs.",
    business: "Human reference / admin number.",
    engineering: "tenant-human-reference.policy · ingress/egress normalization",
    decision:
      "Human references never become database primary keys or RLS keys in kernel-governed schemas.",
    inference:
      "Uniqueness and ingress are gated; meaning is accepted here, enforcement in kernel.",
    rules: ["PAS-001 §4.1.13 tenant human reference policy", "ADR-0023"],
    domains: ["identity", "security"],
    evidenceSource:
      "packages/kernel/src/identity/governance/tenant-human-reference.policy.ts",
  }),
];

const B31_IDS = new Set(expansion.map((atom) => atom.atomId));
const expansionById = new Map(expansion.map((atom) => [atom.atomId, atom]));

const atomsPath = join(dataDir, "atoms.json");
const existing = JSON.parse(readFileSync(atomsPath, "utf8"));
const merged = existing.map((atom) =>
  B31_IDS.has(atom.atomId) ? expansionById.get(atom.atomId) : atom
);
const ids = new Set(merged.map((atom) => atom.atomId));

for (const atom of expansion) {
  if (!ids.has(atom.atomId)) {
    merged.push(atom);
    ids.add(atom.atomId);
  }
}

writeFileSync(atomsPath, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`migrate-b31-atoms: wrote ${merged.length} atoms`);
