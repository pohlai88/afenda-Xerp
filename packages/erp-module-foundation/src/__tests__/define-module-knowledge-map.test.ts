import { describe, expect, it } from "vitest";

import { defineModuleKnowledgeMap } from "../define-module-knowledge-map.js";
import { PROCUREMENT_FOUNDATION_BUNDLE } from "../reference/build-procurement-foundation-bundle.js";

describe("defineModuleKnowledgeMap", () => {
  it("preserves PAS-004E linkage metadata on terms", () => {
    const map = defineModuleKnowledgeMap({
      module: "procurement",
      kvId: "KV-PROC",
      terms: [
        {
          term: "purchase_order",
          termId: "purchase_order_preferred",
          conceptId: "purchase_order",
          atomId: "purchase_order",
          status: "accepted",
          appliesTo: ["procurement"],
          requiredAction: "Accepted — test fixture.",
        },
      ],
    });

    expect(map.terms[0]).toMatchObject({
      term: "purchase_order",
      termId: "purchase_order_preferred",
      conceptId: "purchase_order",
      atomId: "purchase_order",
      appliesTo: ["procurement"],
    });
  });

  it("keeps linkage metadata on procurement reference bundle", () => {
    const purchaseOrder = PROCUREMENT_FOUNDATION_BUNDLE.knowledge.terms.find(
      (term) => term.term === "purchase_order"
    );

    expect(purchaseOrder).toMatchObject({
      termId: "purchase_order_preferred",
      conceptId: "purchase_order",
      atomId: "purchase_order",
      appliesTo: ["procurement"],
    });
  });
});
