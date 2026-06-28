import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isOwnershipInterestEffectiveAt,
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES,
  KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES,
  listKernelOperatingContextModuleFiles,
  listKernelOperatingContextWireIngressFiles,
  OPERATING_CONTEXT_ERROR_CODES,
  OPERATING_CONTEXT_LAYER_IDS,
} from "../context/index.js";
import { KERNEL_PACKAGE_TARGET_PATHS } from "../contracts/kernel-package-layout.contract.js";

const contextRoot = join(dirname(fileURLToPath(import.meta.url)), "../context");

describe("@afenda/kernel context registry", () => {
  it("includes every required module from multi-tenancy.md", () => {
    for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
      expect(
        existsSync(join(contextRoot, module.file)),
        `missing ${module.file}`
      ).toBe(true);
    }

    expect(existsSync(join(contextRoot, "index.ts"))).toBe(true);
  });

  it("includes every supporting module on disk", () => {
    for (const file of KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES) {
      expect(existsSync(join(contextRoot, file)), `missing ${file}`).toBe(true);
    }
  });

  it("re-exports primary types from context/index.ts", () => {
    const indexSource = readFileSync(join(contextRoot, "index.ts"), "utf8");

    for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
      const exportPattern = new RegExp(
        `(export\\s+type\\s+\\{[^}]*\\b${module.primaryType}\\b|export\\s+type\\s+${module.primaryType}\\b|export\\s+\\{[^}]*\\btype\\s+${module.primaryType}\\b)`
      );

      expect(
        exportPattern.test(indexSource),
        `${module.primaryType} not exported from index`
      ).toBe(true);
    }
  });

  it("orders required modules by structural hierarchy before grant/metadata slots", () => {
    const layerOrder = KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES.map(
      (entry) => entry.layerId
    );

    expect(layerOrder.slice(0, 7)).toEqual([
      "tenant",
      "entity-group",
      "legal-entity",
      "ownership-interest",
      "organization-unit",
      "team",
      "project",
    ]);
    expect(layerOrder.at(-2)).toBe("permission-scope");
    expect(layerOrder.at(-1)).toBe("consolidation-scope");
    expect(layerOrder).toContain(null);
  });

  it("marks wire ingress on required modules consistently with wire triad registry", () => {
    const wireRequiredContracts = new Set<string>(
      KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES.filter(
        (entry) => entry.registryKind === "required"
      ).map((entry) => entry.contract)
    );

    for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
      expect(module.wireIngress).toBe(wireRequiredContracts.has(module.file));
    }
  });

  it("lists every wire ingress triad file on disk", () => {
    for (const triad of KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES) {
      for (const file of [
        triad.contract,
        triad.assert,
        triad.parser,
      ] as const) {
        expect(existsSync(join(contextRoot, file)), `missing ${file}`).toBe(
          true
        );
      }
    }
  });

  it("exports wire types from contract modules referenced by the registry", () => {
    for (const triad of KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES) {
      const contractSource = readFileSync(
        join(contextRoot, triad.contract),
        "utf8"
      );

      expect(
        contractSource.includes(`interface ${triad.wireType}`),
        `${triad.contract} missing ${triad.wireType}`
      ).toBe(true);
      expect(
        contractSource.includes(`interface ${triad.primaryType}`),
        `${triad.contract} missing ${triad.primaryType}`
      ).toBe(true);
    }
  });

  it("aligns wire ingress files with KERNEL_PACKAGE_TARGET_PATHS context targets", () => {
    const contextTargetPaths = KERNEL_PACKAGE_TARGET_PATHS.filter((path) =>
      path.startsWith("packages/kernel/src/context/")
    ).map((path) => path.replace("packages/kernel/src/context/", ""));

    for (const file of listKernelOperatingContextWireIngressFiles()) {
      expect(
        contextTargetPaths,
        `registry wire file missing from §6.2 targets: ${file}`
      ).toContain(file);
    }
  });

  it("lists unique module files without duplicates", () => {
    const files = listKernelOperatingContextModuleFiles();
    expect(files.length).toBe(new Set(files).size);
  });
});

describe("operating context contract surface", () => {
  it("exports stable lifecycle and scope vocabularies", () => {
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("MEMBERSHIP_DENIED");
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain(
      "MISSING_LEGAL_ENTITY_SELECTION"
    );
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("ENTITY_GROUP_NOT_FOUND");
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("PROJECT_SCOPE_MISMATCH");
  });

  it("evaluates ownership interest effective dates from the domain contract", () => {
    expect(
      isOwnershipInterestEffectiveAt(
        {
          status: "active",
          effectiveFrom: "2026-01-01",
          effectiveTo: null,
        },
        "2026-06-01"
      )
    ).toBe(true);
  });

  it("keeps permission elevation flags serializable", () => {
    expect(DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS).toEqual({
      consolidationView: false,
      crossCompany: false,
      minorityInterestCompany: false,
      platformAdmin: false,
    });
  });

  it("covers every Step 4 required layer on OPERATING_CONTEXT except runtime and gate-only layers", () => {
    const requiredLayerIds = KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES.flatMap(
      (entry) => (entry.layerId === null ? [] : [entry.layerId])
    );

    const step4LayerIds = OPERATING_CONTEXT_LAYER_IDS.filter(
      (layerId) =>
        layerId !== "workspace" &&
        layerId !== "surface" &&
        layerId !== "workflow" &&
        layerId !== "accounting-readiness"
    );

    for (const layerId of step4LayerIds) {
      expect(requiredLayerIds, `registry missing layer ${layerId}`).toContain(
        layerId
      );
    }
  });
});
