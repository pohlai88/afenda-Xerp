import { THEME_PRESET_SLUGS } from "@afenda/shadcn-studio";
import { describe, expect, it } from "vitest";

import {
  isMetadataUiThemePresetSlug,
  METADATA_UI_THEME_PRESET_SLUGS,
} from "../contracts/theme-presentation.contract.js";
import { createMetadataDiagnosticsSnapshot } from "../diagnostics/create-metadata-diagnostics-snapshot.js";
import { sampleRenderContextInput } from "../fixtures/sample-runtime-context.fixture.js";
import { createMetadataUiRenderContext } from "../runtime/index.js";

describe("METADATA_UI_THEME_PRESET_SLUGS", () => {
  it("stays aligned with @afenda/shadcn-studio THEME_PRESET_SLUGS", () => {
    expect([...METADATA_UI_THEME_PRESET_SLUGS]).toEqual([
      ...THEME_PRESET_SLUGS,
    ]);
  });

  it("rejects unknown preset slugs", () => {
    expect(isMetadataUiThemePresetSlug("modern-minimal")).toBe(true);
    expect(isMetadataUiThemePresetSlug("not-a-preset")).toBe(false);
  });
});

describe("theme preset diagnostics snapshot", () => {
  it("includes themePresetSlug when present on render context", () => {
    const context = createMetadataUiRenderContext({
      ...sampleRenderContextInput,
      themePresetSlug: "corporate",
    });

    const snapshot = createMetadataDiagnosticsSnapshot(context);

    expect(snapshot.presentation.themePresetSlug).toBe("corporate");
  });
});
