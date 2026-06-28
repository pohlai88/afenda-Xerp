import { describe, expect, it } from "vitest";

import {
  METADATA_UI_DIAGNOSTICS_LEVELS,
  METADATA_UI_HYDRATION_MODES,
  METADATA_UI_RENDER_SOURCES,
} from "../contracts/render-context.contract.js";
import {
  sampleRuntimeContext,
  sampleRuntimeContextFixture,
} from "../fixtures/sample-runtime-context.fixture.js";
import {
  createMetadataUiRenderContext,
  getDefaultMetadataUiHydrationMode,
} from "../runtime/index.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("render context vocabulary", () => {
  it("defines governed render sources without duplicates", () => {
    expect(METADATA_UI_RENDER_SOURCES).toEqual([
      "client",
      "server",
      "static-preview",
    ]);
    expectUniqueValues(METADATA_UI_RENDER_SOURCES);
  });

  it("defines governed hydration modes without duplicates", () => {
    expect(METADATA_UI_HYDRATION_MODES).toEqual(["none", "partial", "full"]);
    expectUniqueValues(METADATA_UI_HYDRATION_MODES);
  });

  it("defines governed diagnostics levels without duplicates", () => {
    expect(METADATA_UI_DIAGNOSTICS_LEVELS).toEqual([
      "off",
      "summary",
      "verbose",
    ]);
    expectUniqueValues(METADATA_UI_DIAGNOSTICS_LEVELS);
  });
});

describe("getDefaultMetadataUiHydrationMode", () => {
  it("defaults client renders to full hydration", () => {
    expect(getDefaultMetadataUiHydrationMode("client")).toBe("full");
  });

  it("defaults server and static-preview renders to none", () => {
    expect(getDefaultMetadataUiHydrationMode("server")).toBe("none");
    expect(getDefaultMetadataUiHydrationMode("static-preview")).toBe("none");
  });
});

describe("createMetadataUiRenderContext", () => {
  it("wraps runtime context without flattening it", () => {
    const context = createMetadataUiRenderContext({
      runtime: sampleRuntimeContext,
      source: "server",
      strict: true,
      diagnosticsLevel: "summary",
      diagnosticsNamespace: "metadata-ui.surface",
    });

    expect(context.runtime).toBe(sampleRuntimeContext);
    expect(context.environment).toEqual({
      source: "server",
      hydration: "none",
      interactive: false,
    });
    expect(context.policy).toEqual({
      strict: true,
      diagnosticsLevel: "summary",
      allowExperimentalRenderers: false,
      allowDeprecatedRenderers: false,
    });
    expect(context.diagnostics).toEqual({
      enabled: true,
      level: "summary",
      namespace: "metadata-ui.surface",
    });
  });

  it("carries optional theme preset slug in presentation (PAS-005A B42)", () => {
    const context = createMetadataUiRenderContext({
      runtime: sampleRuntimeContext,
      source: "static-preview",
      themePresetSlug: "modern-minimal",
    });

    expect(context.presentation).toEqual({
      themePresetSlug: "modern-minimal",
    });
  });

  it("defaults strict mode and diagnostics to conservative values", () => {
    const context = createMetadataUiRenderContext({
      runtime: sampleRuntimeContext,
      source: "client",
    });

    expect(context.policy.strict).toBe(false);
    expect(context.policy.diagnosticsLevel).toBe("off");
    expect(context.diagnostics.enabled).toBe(false);
    expect(context.environment.interactive).toBe(true);
    expect(context.environment.hydration).toBe("full");
  });
});

describe("sample runtime context fixture", () => {
  it("builds governed runtime and render context variants", () => {
    expect(sampleRuntimeContextFixture.constants.correlationId).toBe(
      "corr_fixture_sample_001"
    );
    expect(sampleRuntimeContextFixture.constants.diagnosticsNamespace).toBe(
      "metadata-ui.fixture"
    );
    expect(sampleRuntimeContextFixture.runtime.context.workspaceId).toBe(
      "workspace_fixture_sample"
    );
    expect(sampleRuntimeContextFixture.runtime.input.density).toBe(
      "comfortable"
    );
    expect(sampleRuntimeContextFixture.runtime.input.presentationMode).toBe(
      "compact"
    );
    expect(sampleRuntimeContextFixture.render.context.diagnostics.enabled).toBe(
      false
    );
    expect(sampleRuntimeContextFixture.render.input.hydration).toBe("none");
    expect(
      sampleRuntimeContextFixture.diagnosticsRender.context.diagnostics.level
    ).toBe("summary");
    expect(
      sampleRuntimeContextFixture.verboseDiagnosticsRender.context.diagnostics
        .level
    ).toBe("verbose");
    expect(
      sampleRuntimeContextFixture.clientRender.context.environment
    ).toEqual({
      source: "client",
      hydration: "full",
      interactive: true,
    });
    expect(sampleRuntimeContextFixture.strictRender.context.policy.strict).toBe(
      true
    );
    expect(
      sampleRuntimeContextFixture.readonlyRender.context.runtime.readonlyMode
    ).toBe(true);
  });
});
