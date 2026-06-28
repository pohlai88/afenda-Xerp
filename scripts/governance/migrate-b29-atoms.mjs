#!/usr/bin/env node
/**
 * One-shot B29 corpus migration — legacy evidence/reasoning → typed shapes.
 * Idempotent: skips atoms that already have typedEvidence.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../packages/enterprise-knowledge/src/data"
);

const AUTHORITY_ALIAS = {
  architecture_authority: "afenda_architecture_authority",
  accounting_authority: "afenda_accounting_authority",
  erp_authority: "afenda_erp_authority",
};

function inferType(path) {
  if (path.includes("/schema/")) return "sop";
  if (path.startsWith("docs/adr/")) return "adr";
  if (path.startsWith("packages/kernel/")) return "policy";
  return "decision";
}

function migrateAtom(atom) {
  const next = { ...atom };
  if (!Array.isArray(next.typedEvidence) && Array.isArray(next.evidence)) {
    next.typedEvidence = next.evidence.map((source, index) => ({
      evidenceId: `${next.atomId}_evidence_${index + 1}`,
      type: inferType(source),
      source,
    }));
    next.evidence = undefined;
  }
  if (!next.structuredReasoning && typeof next.reasoning === "string") {
    next.structuredReasoning = {
      premises: [next.reasoning],
      inference: next.knowledgeDecision?.decision ?? next.reasoning,
      rules: [next.ownedByPas ?? "PAS-004", next.authorityType].filter(Boolean),
      conclusion: next.meaning?.canonical ?? next.reasoning,
      alternatives: next.knowledgeDecision?.alternativesConsidered,
    };
    next.reasoning = undefined;
  }
  if (Array.isArray(next.acceptanceChain)) {
    next.acceptanceChain = next.acceptanceChain.map((entry) => ({
      ...entry,
      by: AUTHORITY_ALIAS[entry.by] ?? entry.by,
    }));
  }
  return next;
}

const expansion = [
  {
    atomId: "tenant",
    fqn: "afenda.enterprise.tenant",
    kind: "concept",
    acceptanceChain: [
      { step: "origin", by: "external_source", on: "saas-multi-tenancy" },
      { step: "accepted", by: "afenda_architecture_authority", on: "2026-06" },
    ],
    authorityType: "internal",
    binding: "mandatory",
    confidence: { score: 95, basis: ["afenda_decision"] },
    structuredReasoning: {
      premises: [
        "Afenda isolates customer data at the SaaS subscription boundary.",
      ],
      inference: "Tenant is the root security and commercial isolation unit.",
      rules: ["PAS-004 §2 identity", "multi-tenancy ADR authority"],
      conclusion:
        "A SaaS customer boundary that owns subscription, slug namespace, and security isolation.",
    },
    knowledgeDecision: {
      decision:
        "Model Tenant as SaaS isolation boundary distinct from legal entity.",
      alternativesConsidered: ["Legal entity as tenant"],
      whyRejected: {
        "Legal entity as tenant":
          "Statutory company is not the SaaS account boundary.",
      },
      impact: ["security", "identity", "ai_reasoning"],
    },
    meaning: {
      canonical:
        "SaaS customer boundary — root security and subscription isolation unit.",
      business: "Customer account / tenant.",
      engineering: "tenants table row · tenant context resolution.",
    },
    knowledgeDomain: ["identity", "security"],
    applicability: {
      applicable: ["identity", "security"],
      notApplicable: ["accounting"],
      exceptions: [],
    },
    lifecycle: "accepted",
    lineage: {
      origin: "Multi-tenant SaaS platform design.",
      evolution: [],
      currentAuthority: "PAS-004",
      futureDirection: "Entitlement linkage via approved slice.",
    },
    misconceptions: [
      {
        confusedWith: "Legal Entity",
        why: "UI overload",
        correct: "Tenant is SaaS isolation; legal entity is statutory.",
      },
    ],
    exposure: {
      audience: "both",
      afendaPreferredWording: "Tenant (SaaS customer boundary)",
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
        evidenceId: "tenant_evidence_1",
        type: "sop",
        source: "packages/database/src/schema/tenant.schema.ts",
      },
    ],
    ownedByPas: "PAS-004",
  },
  {
    atomId: "entity_group",
    fqn: "afenda.enterprise.entity_group",
    kind: "concept",
    acceptanceChain: [
      {
        step: "origin",
        by: "external_source",
        on: "corporate-group-reporting",
      },
      { step: "accepted", by: "afenda_accounting_authority", on: "2026-06" },
    ],
    authorityType: "regulatory",
    binding: "mandatory",
    confidence: { score: 92, basis: ["IFRS", "afenda_decision"] },
    structuredReasoning: {
      premises: [
        "Groups of legal entities require a corporate umbrella for consolidation scope.",
      ],
      inference: "Entity Group ties related legal entities under one tenant.",
      rules: ["IFRS 10 group concepts", "PAS-001 hierarchy contracts"],
      conclusion:
        "Corporate umbrella under a tenant that groups related legal entities for reporting.",
    },
    knowledgeDecision: {
      decision:
        "Entity Group is optional corporate umbrella above legal entities.",
      alternativesConsidered: ["Flatten all companies under tenant"],
      whyRejected: {
        "Flatten all companies under tenant":
          "Loses consolidation hierarchy semantics.",
      },
      impact: ["reporting", "consolidation", "identity"],
    },
    meaning: {
      canonical:
        "Corporate group structure under a tenant; may represent a holding group.",
      business: "Entity group / corporate group.",
      engineering: "entity_groups table · consolidation scope parent.",
    },
    knowledgeDomain: ["reporting", "identity", "consolidation"],
    applicability: {
      applicable: ["reporting", "consolidation"],
      notApplicable: ["networking"],
      exceptions: [],
    },
    lifecycle: "accepted",
    lineage: {
      origin: "Foundation phase 08 entity group authority.",
      evolution: [],
      currentAuthority: "PAS-004",
      futureDirection: "Consolidation accounting deferred.",
    },
    misconceptions: [
      {
        confusedWith: "Legal Entity",
        why: "Group label confusion",
        correct: "Entity group is umbrella; legal entity is statutory company.",
      },
    ],
    exposure: {
      audience: "both",
      afendaPreferredWording: "Entity group / corporate group",
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
        evidenceId: "entity_group_evidence_1",
        type: "sop",
        source: "packages/database/src/schema/entity-group.schema.ts",
      },
    ],
    ownedByPas: "PAS-004",
  },
  {
    atomId: "ownership_interest",
    fqn: "afenda.enterprise.ownership_interest",
    kind: "concept",
    acceptanceChain: [
      { step: "origin", by: "standard_body", on: "IFRS-10" },
      { step: "accepted", by: "afenda_accounting_authority", on: "2026-06" },
    ],
    authorityType: "regulatory",
    binding: "mandatory",
    confidence: { score: 90, basis: ["IFRS"] },
    structuredReasoning: {
      premises: [
        "Consolidation requires ownership relationships between legal entities.",
      ],
      inference:
        "Ownership interest encodes parent/subsidiary/associate relationships.",
      rules: ["IFRS 10 control model", "PAS-001 OwnershipInterestContext"],
      conclusion:
        "Typed relationship between legal entities describing control and consolidation treatment.",
    },
    knowledgeDecision: {
      decision:
        "Model ownership interest as first-class enterprise meaning separate from org unit tree.",
      alternativesConsidered: ["Encode only in org hierarchy"],
      whyRejected: {
        "Encode only in org hierarchy":
          "Operating hierarchy != ownership/consolidation.",
      },
      impact: ["consolidation", "reporting"],
    },
    meaning: {
      canonical:
        "Ownership relationship between legal entities for consolidation scope.",
      business: "Ownership / group relationship.",
      engineering: "OwnershipInterestContext · ownership interest persistence.",
    },
    knowledgeDomain: ["consolidation", "reporting", "accounting"],
    applicability: {
      applicable: ["consolidation", "reporting"],
      notApplicable: ["networking"],
      exceptions: [],
    },
    lifecycle: "accepted",
    lineage: {
      origin: "IFRS 10 group structures.",
      evolution: [],
      currentAuthority: "PAS-004",
      futureDirection: "Link to consolidation engine when ADR approved.",
    },
    misconceptions: [],
    exposure: {
      audience: "both",
      afendaPreferredWording: "Ownership interest / group relationship",
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
        evidenceId: "ownership_interest_evidence_1",
        type: "policy",
        source:
          "packages/kernel/src/context/ownership-interest-context.contract.ts",
      },
    ],
    ownedByPas: "PAS-004",
  },
  {
    atomId: "consolidation_scope",
    fqn: "afenda.enterprise.consolidation_scope",
    kind: "concept",
    acceptanceChain: [
      { step: "origin", by: "standard_body", on: "IFRS-10" },
      { step: "accepted", by: "afenda_accounting_authority", on: "2026-06" },
    ],
    authorityType: "regulatory",
    binding: "mandatory",
    confidence: { score: 88, basis: ["IFRS"] },
    structuredReasoning: {
      premises: [
        "Consolidated reporting requires an explicit scope of included entities.",
      ],
      inference:
        "Consolidation scope resolves which legal entities participate in group reporting.",
      rules: [
        "IFRS 10 consolidation boundary",
        "PAS-001 ConsolidationScopeContext",
      ],
      conclusion:
        "Resolved scope of legal entities included in consolidated reporting for a context.",
    },
    knowledgeDecision: {
      decision:
        "Consolidation scope is derived authority context, not a UI label.",
      alternativesConsidered: ["Infer scope from org tree only"],
      whyRejected: {
        "Infer scope from org tree only":
          "Org tree does not encode consolidation treatment.",
      },
      impact: ["consolidation", "reporting"],
    },
    meaning: {
      canonical: "Scope of legal entities included in consolidated reporting.",
      business: "Consolidation scope / reporting group.",
      engineering: "ConsolidationScopeContext resolution.",
    },
    knowledgeDomain: ["consolidation", "reporting"],
    applicability: {
      applicable: ["consolidation", "reporting"],
      notApplicable: ["networking"],
      exceptions: [],
    },
    lifecycle: "accepted",
    lineage: {
      origin: "Group reporting requirements.",
      evolution: [],
      currentAuthority: "PAS-004",
      futureDirection: "Elimination engine deferred.",
    },
    misconceptions: [],
    exposure: {
      audience: "both",
      afendaPreferredWording: "Consolidation scope",
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
        evidenceId: "consolidation_scope_evidence_1",
        type: "policy",
        source:
          "packages/kernel/src/context/consolidation-scope-context.contract.ts",
      },
    ],
    ownedByPas: "PAS-004",
  },
];

const atomsPath = join(dataDir, "atoms.json");
const existing = JSON.parse(readFileSync(atomsPath, "utf8"));
const migrated = existing.map(migrateAtom);
const ids = new Set(migrated.map((atom) => atom.atomId));
for (const atom of expansion) {
  if (!ids.has(atom.atomId)) {
    migrated.push(atom);
  }
}
writeFileSync(atomsPath, `${JSON.stringify(migrated, null, 2)}\n`);
console.log(`migrate-b29-atoms: wrote ${migrated.length} atoms`);
