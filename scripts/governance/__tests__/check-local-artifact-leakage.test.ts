import { describe, expect, it } from "vitest";

import {
  checkLocalArtifactLeakage,
  formatLocalArtifactLeakageViolations,
} from "../check-local-artifact-leakage.mts";
import {
  isForbiddenTrackedArtifactPath,
  LOCAL_ARTIFACT_FORBIDDEN_TRACKED_PATHS,
  LOCAL_ARTIFACT_SURFACE_RULE,
} from "../local-artifact-registry.mjs";

describe("local-artifact-registry", () => {
  it("defines the canonical surface rule", () => {
    expect(LOCAL_ARTIFACT_SURFACE_RULE).toBe(
      "local-artifact-guard-blocks-tracked-agent-debug-dumps"
    );
  });

  it("flags known artifact paths and prefixes", () => {
    expect(isForbiddenTrackedArtifactPath(".cursor-biome-report.json")).toBe(
      true
    );
    expect(
      isForbiddenTrackedArtifactPath(
        ".cursor/audit/knip-shadcn-studio-latest.txt"
      )
    ).toBe(true);
    expect(
      isForbiddenTrackedArtifactPath(
        "packages/shadcn-studio/src/styles/dsb-state-ds-build-afenda-shadcn-2026-001.json"
      )
    ).toBe(false);
    expect(
      isForbiddenTrackedArtifactPath(".cursor/audit/checkpoints/PAS-001.json")
    ).toBe(false);
  });

  it("lists core forbidden tracked paths", () => {
    expect(LOCAL_ARTIFACT_FORBIDDEN_TRACKED_PATHS).toEqual(
      expect.arrayContaining([
        ".cursor-biome-report.json",
        ".cursor/audit/vibe-coding-violations.jsonl",
      ])
    );
  });
});

describe("check-local-artifact-leakage", () => {
  it("passes on the current repository state after cleanup", () => {
    const violations = checkLocalArtifactLeakage();

    expect(
      violations,
      formatLocalArtifactLeakageViolations(violations)
    ).toEqual([]);
  });
});
