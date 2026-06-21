import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  resolveMetadataUiDensityAttribute,
  resolveMetadataUiGovernedClassName,
} from "../wiring/governance.js";

const srcRoot = join(import.meta.dirname, "..");

describe("metadata-ui density bridge", () => {
  it("maps metadata default runtime density to DOM default attribute", () => {
    expect(resolveMetadataUiDensityAttribute("default")).toBe("default");
  });

  it("maps compact and comfortable without local standard-to-default hardcoding", () => {
    expect(resolveMetadataUiDensityAttribute("compact")).toBe("compact");
    expect(resolveMetadataUiDensityAttribute("comfortable")).toBe("comfortable");
  });

  it("uses densityToAttribute through wiring/governance.ts", () => {
    const wiringSource = readFileSync(
      join(srcRoot, "wiring/governance.ts"),
      "utf8"
    );

    expect(wiringSource).toContain("densityToAttribute");
    expect(wiringSource).not.toMatch(
      /density\s*===\s*["']standard["']\s*\?\s*["']default["']/
    );
    expect(wiringSource).not.toContain("DENSITY_ATTRIBUTES");
  });

  it("applies governed slot classes for structural metadata-ui regions", () => {
    const className = resolveMetadataUiGovernedClassName("surface", {
      structuralClassNames: ["metadata-surface"],
      density: "default",
    });

    expect(className).toContain("metadata-surface");
    expect(className.length).toBeGreaterThan("metadata-surface".length);
  });
});
