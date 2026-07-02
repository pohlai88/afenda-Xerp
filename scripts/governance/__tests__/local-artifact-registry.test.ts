import { describe, expect, it } from "vitest";

import {
  LOCAL_ARTIFACT_REDIRECT_PREFIXES,
  matchForbiddenArtifactRedirect,
} from "../local-artifact-registry.mjs";

describe("matchForbiddenArtifactRedirect", () => {
  it("returns null for empty or read-only commands", () => {
    expect(matchForbiddenArtifactRedirect("")).toBeNull();
    expect(matchForbiddenArtifactRedirect("pnpm ci:biome")).toBeNull();
    expect(
      matchForbiddenArtifactRedirect("pnpm check:local-artifact-leakage")
    ).toBeNull();
  });

  it("blocks PowerShell Out-File to biome report", () => {
    const command =
      "pnpm ci:biome 2>&1 | Out-File -FilePath .cursor-biome-report.json";
    expect(matchForbiddenArtifactRedirect(command)).toBe(
      ".cursor-biome-report.json"
    );
  });

  it("blocks shell redirect to vibe-coding ledger", () => {
    const command =
      "pnpm test:run > .cursor/audit/vibe-coding-violations.jsonl";
    expect(matchForbiddenArtifactRedirect(command)).toBe(
      ".cursor/audit/vibe-coding-violations.jsonl"
    );
  });

  it("blocks tee to knip audit prefix", () => {
    const command =
      "pnpm housekeeping:knip 2>&1 | tee .cursor/audit/knip-shadcn-studio-latest.txt";
    expect(matchForbiddenArtifactRedirect(command)).toBe(".cursor/audit/knip-");
  });

  it("blocks Set-Content to dsb-state under .cursor", () => {
    const command =
      'Set-Content .cursor/dsb-state-ds-build-afenda-shadcn-2026-001.json "{}"';
    expect(matchForbiddenArtifactRedirect(command)).toBe(".cursor/dsb-state-");
  });

  it("blocks redirect to skills-lock.json", () => {
    const command = "echo '{}' > skills-lock.json";
    expect(matchForbiddenArtifactRedirect(command)).toBe("skills-lock.json");
  });

  it("allows redirects to package state ledger paths", () => {
    const command =
      "echo test > packages/shadcn-studio/src/styles/dsb-state-ds-build-afenda-shadcn-2026-001.json";
    expect(matchForbiddenArtifactRedirect(command)).toBeNull();
  });

  it("allows redirects to audit checkpoints", () => {
    const command =
      "echo '{}' > .cursor/audit/checkpoints/PAS-004A-gate-13.json";
    expect(matchForbiddenArtifactRedirect(command)).toBeNull();
  });

  it("covers every redirect prefix in the registry", () => {
    expect(LOCAL_ARTIFACT_REDIRECT_PREFIXES.length).toBeGreaterThanOrEqual(8);
    for (const prefix of LOCAL_ARTIFACT_REDIRECT_PREFIXES) {
      const command = `echo x > ${prefix}sample`;
      expect(matchForbiddenArtifactRedirect(command)).toBe(prefix);
    }
  });
});
