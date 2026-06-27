import { describe, expect, it } from "vitest";

import {
  compareEnterpriseHierarchyTierOrder,
  compareOperatingContextLayerOrder,
  ENTERPRISE_HIERARCHY_TIERS,
  getOperatingContextLayer,
  isOperatingContextLayerId,
  OPERATING_CONTEXT_LAYER_IDS,
  OPERATING_CONTEXT_LAYERS,
  OPERATING_CONTEXT_OWNERSHIP_SPLIT,
  OPERATING_CONTEXT_POLICY,
  type OperatingContext,
} from "../context/index.js";

type AssertOperatingContextComposition = OperatingContext extends {
  readonly tenant: unknown;
  readonly entityGroup: unknown;
  readonly legalEntity: unknown;
  readonly ownershipInterests: readonly unknown[];
  readonly organizationUnit: unknown;
  readonly team: unknown;
  readonly project: unknown;
  readonly workspace: unknown;
  readonly surface: unknown;
  readonly workflow: unknown;
  readonly permissionScope: unknown;
  readonly consolidationScope: unknown;
}
  ? true
  : false;

type _OperatingContextComposition = AssertOperatingContextComposition;

describe("operating context hierarchy (PAS-001 §4.4)", () => {
  it("registers the canonical PAS §4.4 layer order", () => {
    expect(OPERATING_CONTEXT_LAYER_IDS).toEqual([
      "tenant",
      "entity-group",
      "legal-entity",
      "ownership-interest",
      "organization-unit",
      "team",
      "project",
      "workspace",
      "surface",
      "workflow",
      "permission-scope",
      "consolidation-scope",
      "accounting-readiness",
    ]);
    expect(OPERATING_CONTEXT_POLICY.layerCount).toBe(13);
    expect(OPERATING_CONTEXT_POLICY.pasSection).toBe("4.4");
  });

  it("maps structural tiers through workflow onto enterprise hierarchy tiers", () => {
    const structuralLayerIds = OPERATING_CONTEXT_LAYER_IDS.slice(0, 10);
    const expectedEnterpriseTiers = [
      "tenant",
      "entity_group",
      "legal_entity",
      "ownership_interest",
      "organization_unit",
      "team",
      "project",
      "workspace",
      "surface",
      "workflow",
    ] as const;

    expect(structuralLayerIds).toHaveLength(ENTERPRISE_HIERARCHY_TIERS.length);
    expect(expectedEnterpriseTiers).toEqual([...ENTERPRISE_HIERARCHY_TIERS]);
    expect(
      compareOperatingContextLayerOrder("tenant", "legal-entity")
    ).toBeLessThan(0);
    expect(
      compareEnterpriseHierarchyTierOrder("tenant", "legal_entity")
    ).toBeLessThan(0);
  });

  it("keeps grant, metadata, and gate layers after runtime scopes", () => {
    expect(getOperatingContextLayer("permission-scope").kind).toBe("grant");
    expect(getOperatingContextLayer("consolidation-scope").kind).toBe(
      "metadata"
    );
    expect(getOperatingContextLayer("accounting-readiness").kind).toBe("gate");
    expect(
      getOperatingContextLayer("accounting-readiness").operatingContextField
    ).toBeNull();
  });

  it("records the PAS §4.4 ownership split without resolver logic in kernel", () => {
    expect(OPERATING_CONTEXT_OWNERSHIP_SPLIT.operatingContextShape).toBe(
      "kernel"
    );
    expect(OPERATING_CONTEXT_OWNERSHIP_SPLIT.operatingContextResolver).toBe(
      "apps/erp"
    );
    expect(OPERATING_CONTEXT_OWNERSHIP_SPLIT.permissionEvaluation).toBe(
      "@afenda/permissions"
    );
    expect(OPERATING_CONTEXT_POLICY.prohibitedKernelBehaviors).toContain(
      "permission evaluation inside kernel contracts"
    );
  });

  it("narrows layer id strings at the boundary", () => {
    expect(isOperatingContextLayerId("tenant")).toBe(true);
    expect(isOperatingContextLayerId("permission-scope")).toBe(true);
    expect(isOperatingContextLayerId("unknown-layer")).toBe(false);
  });

  it("maps composed operating-context fields for every non-gate layer", () => {
    for (const layerId of OPERATING_CONTEXT_LAYER_IDS) {
      const layer = OPERATING_CONTEXT_LAYERS[layerId];
      if (layerId === "accounting-readiness") {
        expect(layer.operatingContextField).toBeNull();
        continue;
      }
      expect(layer.operatingContextField).not.toBeNull();
    }
  });
});
