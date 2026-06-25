import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  GOVERNED_DIAGNOSTIC_API_MODULES,
  GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS,
  GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE,
  GOVERNED_DIAGNOSTIC_LOGGING_GATE_SCRIPT,
  GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES,
} from "../surface/governed-diagnostic-logging-registry.js";
import {
  GOVERNED_MUTATION_API_AUDIT_MODULES,
  GOVERNED_MUTATION_SERVER_ACTION_MODULES,
} from "../surface/governed-mutation-audit-registry.js";

const repoRoot = fileURLToPath(new URL("../../../..", import.meta.url));

function sourceContainsAnySymbol(
  source: string,
  symbols: readonly string[]
): boolean {
  return symbols.some((symbol) => source.includes(symbol));
}

describe("governed-diagnostic-logging-registry", () => {
  it("declares enforcement and gate script paths that exist", () => {
    expect(
      existsSync(join(repoRoot, GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE))
    ).toBe(true);
    expect(
      existsSync(join(repoRoot, GOVERNED_DIAGNOSTIC_LOGGING_GATE_SCRIPT))
    ).toBe(true);
  });

  it("byte-aligns server action paths with audit registry", () => {
    const auditPaths = GOVERNED_MUTATION_SERVER_ACTION_MODULES.map(
      (module) => module.path
    );
    const diagnosticPaths = GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES.map(
      (module) => module.path
    );

    expect(diagnosticPaths).toEqual(auditPaths);
  });

  it("shares protected API handler path with audit registry", () => {
    const auditApiPaths = GOVERNED_MUTATION_API_AUDIT_MODULES.map(
      (module) => module.path
    );
    const diagnosticApiPaths = GOVERNED_DIAGNOSTIC_API_MODULES.map(
      (module) => module.path
    );

    for (const path of auditApiPaths) {
      if (path.endsWith("create-api-handler.ts")) {
        expect(diagnosticApiPaths, path).toContain(path);
      }
    }
  });

  it("lists diagnostic API wiring modules with required symbols", () => {
    for (const module of GOVERNED_DIAGNOSTIC_API_MODULES) {
      expect(existsSync(join(repoRoot, module.path)), module.path).toBe(true);

      const source = readFileSync(join(repoRoot, module.path), "utf8");

      for (const symbol of module.requiredSymbols) {
        expect(source, module.path).toContain(symbol);
      }
    }
  });

  it("lists governed server actions that exist on disk", () => {
    for (const module of GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES) {
      expect(existsSync(join(repoRoot, module.path)), module.path).toBe(true);
    }
  });

  it("requires loggingExemptionReason when loggingRequired is false", () => {
    for (const module of GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES) {
      if (module.loggingRequired) {
        continue;
      }

      expect(
        module.loggingExemptionReason,
        `${module.path} must declare loggingExemptionReason`
      ).toBeTruthy();
    }
  });

  it("requires diagnostic emission on logging-required server actions", () => {
    for (const module of GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES) {
      if (!module.loggingRequired) {
        continue;
      }

      const actionSource = readFileSync(join(repoRoot, module.path), "utf8");
      const loggingWiringPath =
        "loggingWiringPath" in module &&
        typeof module.loggingWiringPath === "string"
          ? module.loggingWiringPath
          : undefined;
      const wiringSource =
        loggingWiringPath === undefined
          ? actionSource
          : readFileSync(join(repoRoot, loggingWiringPath), "utf8");

      expect(
        sourceContainsAnySymbol(wiringSource, [
          ...GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS,
          "failServerAction",
        ]),
        loggingWiringPath ?? module.path
      ).toBe(true);

      for (const symbol of module.requiredSymbols) {
        expect(wiringSource, loggingWiringPath ?? module.path).toContain(
          symbol
        );
      }
    }
  });
});
