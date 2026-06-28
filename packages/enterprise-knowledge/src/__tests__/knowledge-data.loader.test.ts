import { describe, expect, it } from "vitest";

import {
  parseAtomCorpus,
  parseEdgeCorpus,
} from "../data/knowledge-data.loader.js";

describe("knowledge-data.loader", () => {
  it("parseAtomCorpus rejects non-array input", () => {
    expect(() => parseAtomCorpus({})).toThrow(/must be a JSON array/);
  });

  it("parseAtomCorpus rejects structurally invalid atoms", () => {
    expect(() => parseAtomCorpus([{ atomId: "" }])).toThrow(
      /validation failed/
    );
  });

  it("parseEdgeCorpus rejects edges referencing unknown atom ids", () => {
    const atomIds = new Set(["legal_entity"]);
    expect(() =>
      parseEdgeCorpus(
        [
          {
            edgeId: "bad_edge",
            type: "contains",
            fromAtomId: "legal_entity",
            toAtomId: "missing_atom",
          },
        ],
        atomIds
      )
    ).toThrow(/validation failed/);
  });
});
