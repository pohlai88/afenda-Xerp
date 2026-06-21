import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  joinAppShellGovernedClassName,
  resolveAppShellDensityAttribute,
} from "../wiring/governance.js";

const srcRoot = join(import.meta.dirname, "..");

describe("appshell density bridge", () => {
  it("maps standard shell density to DOM default attribute", () => {
    expect(resolveAppShellDensityAttribute("standard")).toBe("default");
  });

  it("maps compact and comfortable without local standard-to-default hardcoding", () => {
    expect(resolveAppShellDensityAttribute("compact")).toBe("compact");
    expect(resolveAppShellDensityAttribute("comfortable")).toBe("comfortable");
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

  it("applies governed slot classes for structural app-shell regions", () => {
    const className = joinAppShellGovernedClassName("app-shell-root", "root", {
      density: "standard",
    });

    expect(className).toContain("app-shell-root");
    expect(className.length).toBeGreaterThan("app-shell-root".length);
  });
});
