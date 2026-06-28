import {
  createMetadataRuntimeContext,
  type MetadataRuntimeState,
} from "@afenda/ui-composition";
import { describe, expect, it } from "vitest";
import {
  sampleReadonlyRenderContext,
  sampleRenderContext,
  sampleRuntimeContextInput,
} from "../fixtures/sample-runtime-context.fixture.js";
import {
  METADATA_VISIBILITY_REASONS,
  METADATA_VISIBILITY_STATES,
  normalizeLegacyVisibilityInput,
  resolveDensityMode,
  resolvePresentationMode,
  resolveReadonlyMode,
  resolveVisibility,
} from "../presentation/index.js";
import { createMetadataUiRenderContext } from "../runtime/index.js";

function createRenderContextWithState(state: MetadataRuntimeState) {
  return createMetadataUiRenderContext({
    runtime: createMetadataRuntimeContext({
      ...sampleRuntimeContextInput,
      state,
    }),
    source: "static-preview",
    hydration: "none",
    diagnosticsLevel: "off",
  });
}

describe("resolvePresentationMode", () => {
  it("returns governed runtime presentation mode", () => {
    expect(resolvePresentationMode(sampleRenderContext)).toBe("compact");
    expect(resolveDensityMode(sampleRenderContext)).toBe("comfortable");
    expect(resolveReadonlyMode(sampleRenderContext)).toBe(false);
    expect(resolveReadonlyMode(sampleReadonlyRenderContext)).toBe(true);
  });
});

describe("resolveVisibility", () => {
  it("returns visible by default", () => {
    expect(resolveVisibility({}, sampleRenderContext)).toEqual({
      visibility: "visible",
      visible: true,
      disabled: false,
    });
  });

  it("hides explicitly hidden input", () => {
    expect(
      resolveVisibility({ visibility: "hidden" }, sampleRenderContext)
    ).toEqual({
      visibility: "hidden",
      visible: false,
      disabled: false,
      reason: METADATA_VISIBILITY_REASONS.hidden,
    });
  });

  it("disables when permission is missing", () => {
    expect(
      resolveVisibility(
        { requiredPermission: "fixture.orders.write" },
        sampleRenderContext
      )
    ).toEqual({
      visibility: "disabled",
      visible: true,
      disabled: true,
      reason: METADATA_VISIBILITY_REASONS.permissionRequired,
    });
  });

  it("disables when capability is missing", () => {
    expect(
      resolveVisibility(
        { requiredCapability: "fixture.orders.edit" },
        sampleRenderContext
      )
    ).toEqual({
      visibility: "disabled",
      visible: true,
      disabled: true,
      reason: METADATA_VISIBILITY_REASONS.capabilityRequired,
    });
  });

  it("disables when feature flag is missing", () => {
    expect(
      resolveVisibility(
        { requiredFeatureFlag: "fixture.metadata-ui.experimental" },
        sampleRenderContext
      )
    ).toEqual({
      visibility: "disabled",
      visible: true,
      disabled: true,
      reason: METADATA_VISIBILITY_REASONS.featureFlagRequired,
    });
  });

  it("hides forbidden runtime state before readonly logic", () => {
    expect(
      resolveVisibility({}, createRenderContextWithState("forbidden"))
    ).toEqual({
      visibility: "hidden",
      visible: false,
      disabled: false,
      reason: METADATA_VISIBILITY_REASONS.forbidden,
    });
  });

  it("returns readonly when runtime is readonly", () => {
    expect(resolveVisibility({}, sampleReadonlyRenderContext)).toEqual({
      visibility: "readonly",
      visible: true,
      disabled: true,
      reason: METADATA_VISIBILITY_REASONS.readonlyMode,
    });
  });

  it("disables during maintenance runtime state", () => {
    expect(
      resolveVisibility({}, createRenderContextWithState("maintenance"))
    ).toEqual({
      visibility: "disabled",
      visible: true,
      disabled: true,
      reason: METADATA_VISIBILITY_REASONS.maintenanceMode,
    });
  });
});

describe("normalizeLegacyVisibilityInput", () => {
  it("maps legacy hidden and disabled booleans to governed visibility", () => {
    expect(
      normalizeLegacyVisibilityInput({
        hidden: true,
        reason: "Legacy hidden",
      })
    ).toEqual({
      visibility: "hidden",
      reason: "Legacy hidden",
    });

    expect(
      normalizeLegacyVisibilityInput({
        disabled: true,
        requiredPermission: "fixture.orders.read",
      })
    ).toEqual({
      visibility: "disabled",
      requiredPermission: "fixture.orders.read",
    });

    expect(normalizeLegacyVisibilityInput({})).toEqual({
      visibility: "visible",
    });
  });
});

describe("METADATA_VISIBILITY_STATES", () => {
  it("defines governed visibility states without duplicates", () => {
    expect(METADATA_VISIBILITY_STATES).toEqual([
      "visible",
      "hidden",
      "disabled",
      "readonly",
    ]);
    expect(new Set(METADATA_VISIBILITY_STATES).size).toBe(
      METADATA_VISIBILITY_STATES.length
    );
  });
});
