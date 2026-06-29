import { describe, expect, it } from "vitest";

import type { KnowledgeAtom } from "../../../packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import {
  B53_ERP_DOMAIN_BRIDGE_ATOM_IDS,
  B53_ERP_DOMAIN_KV_ID_BY_ATOM,
  formatKnowledgeErpDomainBridgeErrors,
  KNOWLEDGE_ERP_DOMAIN_BRIDGE_RULE,
  validateKnowledgeErpDomainBridge,
} from "../../../packages/enterprise-knowledge/src/policy/knowledge-erp-domain-bridge.policy.ts";
import { checkKnowledgeErpDomainBridge } from "../check-knowledge-erp-domain-bridge.mts";

describe("check-knowledge-erp-domain-bridge", () => {
  it("passes on the current repository state", () => {
    const errors = checkKnowledgeErpDomainBridge();
    expect(errors, formatKnowledgeErpDomainBridgeErrors(errors)).toEqual([]);
  });

  it("exports the ERP-domain bridge rule identifier", () => {
    expect(KNOWLEDGE_ERP_DOMAIN_BRIDGE_RULE).toBe(
      "knowledge-erp-domain-bridge-kv-pairs-slug-to-kernel-contract"
    );
  });

  it("requires all B53 bridge atom IDs in the corpus", () => {
    const atomIds = new Set(
      ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => atom.atomId)
    );
    for (const requiredId of B53_ERP_DOMAIN_BRIDGE_ATOM_IDS) {
      expect(atomIds.has(requiredId)).toBe(true);
    }
  });

  it("fails when a bridge atom is missing KV-* trace in notes", () => {
    const inventoryAtom = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (atom) => atom.atomId === "inventory_item"
    );
    expect(inventoryAtom).toBeDefined();
    if (!inventoryAtom) {
      throw new Error("expected inventory_item atom");
    }

    const strippedNotes: KnowledgeAtom = {
      ...inventoryAtom,
      realizationMapping: inventoryAtom.realizationMapping?.map((entry) => ({
        ...entry,
        notes: "PAS-001B inventory domain authority without KV id",
      })),
    };

    const errors = validateKnowledgeErpDomainBridge(
      ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) =>
        atom.atomId === "inventory_item" ? strippedNotes : atom
      ),
      { repoRoot: process.cwd() }
    );

    expect(
      errors.some((error) =>
        error.includes(B53_ERP_DOMAIN_KV_ID_BY_ATOM.inventory_item)
      )
    ).toBe(true);
  });

  it("fails when a bridge atom cites a parser path", () => {
    const procurementAtom = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (atom) => atom.atomId === "procurement_requisition"
    );
    expect(procurementAtom).toBeDefined();
    if (!procurementAtom) {
      throw new Error("expected procurement_requisition atom");
    }

    const parserPath =
      "packages/kernel/src/erp-domain/procurement/procurement-id.parser.ts";
    const withParser: KnowledgeAtom = {
      ...procurementAtom,
      realizationMapping: [
        {
          realizationKind: "kernel",
          reference: parserPath,
          contractPath: parserPath,
          notes: `PAS-001B procurement KV-PROC via parser ${B53_ERP_DOMAIN_KV_ID_BY_ATOM.procurement_requisition}`,
        },
      ],
    };

    const errors = validateKnowledgeErpDomainBridge(
      ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) =>
        atom.atomId === "procurement_requisition" ? withParser : atom
      ),
      {
        repoRoot: process.cwd(),
        fileExists: (absolutePath) =>
          !absolutePath.endsWith("procurement-id.parser.ts"),
      }
    );

    expect(errors.some((error) => error.includes("parser"))).toBe(true);
  });
});
