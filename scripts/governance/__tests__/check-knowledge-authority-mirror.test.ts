import { describe, expect, it } from "vitest";

import {
  checkKnowledgeAuthorityMirror,
  formatKnowledgeAuthorityMirrorViolations,
} from "../check-knowledge-authority-mirror.mts";
import {
  EK_SEMANTIC_SCORECARD,
  KNOWLEDGE_AUTHORITY_MIRROR_SURFACE_RULE,
} from "../knowledge-authority-mirror-registry.mts";

describe("check-knowledge-authority-mirror", () => {
  it("passes on the current repository state", () => {
    const violations = checkKnowledgeAuthorityMirror();
    expect(
      violations,
      formatKnowledgeAuthorityMirrorViolations(violations)
    ).toEqual([]);
  });

  it("exports the mirror surface rule", () => {
    expect(KNOWLEDGE_AUTHORITY_MIRROR_SURFACE_RULE).toBe(
      "knowledge-authority-mirror-sync-is-canonical-pas-skill-index-alignment"
    );
  });

  it("targets PAS-004C semantic scorecard until B54 extends it", () => {
    expect(EK_SEMANTIC_SCORECARD).toBe("58/58");
  });
});
