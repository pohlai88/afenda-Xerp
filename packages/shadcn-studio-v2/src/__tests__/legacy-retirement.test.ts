import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, "..", "..", "..", "..");
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const PACKAGE_DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const ADR_0040_PATH = path.join(
  REPO_ROOT,
  "docs",
  "adr",
  "ADR-0040-promote-shadcn-studio-v2-and-deprecate-legacy.md"
);
const PHASE_9_PATH = path.join(
  PACKAGE_DOCS_ROOT,
  "slices",
  "PHASE-9-ENTERPRISE-ACCEPTANCE-GATE.md"
);
const CLOSING_GATE_PATH = path.join(
  PACKAGE_DOCS_ROOT,
  "slices",
  "CLOSING-SYNCHRONIZATION-GATE.md"
);

describe("legacy retirement boundary", () => {
  it("keeps legacy shadcn-studio deprecation behind ADR acceptance and registry proof", () => {
    const adr = readFileSync(ADR_0040_PATH, "utf8");

    expect(adr).toContain("| **Status** | Proposed |");
    expect(adr).toContain("Deprecate legacy `@afenda/shadcn-studio`");
    expect(adr).toContain("Promote `@afenda/shadcn-studio-v2`");
    expect(adr).toContain("Registry and package truth updates");
    expect(adr).toContain("Consumption migration is complete");
  });

  it("keeps enterprise acceptance non-destructive", () => {
    const phaseNine = readFileSync(PHASE_9_PATH, "utf8");

    expect(phaseNine).toContain("## Non-goals");
    expect(phaseNine).toContain("Legacy deletion.");
    expect(phaseNine).toContain("Enterprise acceptance is rejected");
  });

  it("keeps final synchronization separate from legacy deletion", () => {
    const closingGate = readFileSync(CLOSING_GATE_PATH, "utf8");

    expect(closingGate).toContain("## Non-goals");
    expect(closingGate).toContain("Legacy deletion.");
    expect(closingGate).toContain("migration ledger");
    expect(closingGate).toContain("proof route");
  });
});
