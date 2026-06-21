import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  METADATA_SECTION_CHROME_MODES,
  METADATA_SECTION_VISIBILITY_STATES,
} from "../contracts/section.contract.js";
import { METADATA_LAYOUT_REGIONS } from "../contracts/layout.contract.js";
import {
  METADATA_SURFACE_CHROME_MODES,
  METADATA_SURFACE_VISIBILITY_STATES,
  METADATA_SURFACE_WIDTH_MODES,
} from "../contracts/surface.contract.js";
import {
  METADATA_SECTION_CHROME_MODES as legacySectionChromeModes,
  METADATA_SECTION_VISIBILITY_STATES as legacySectionVisibilityStates,
} from "../contracts/section-renderer.contract.js";
import { METADATA_LAYOUT_REGIONS as legacyLayoutRegions } from "../contracts/layout-renderer.contract.js";
import {
  METADATA_SURFACE_CHROME_MODES as legacySurfaceChromeModes,
  METADATA_SURFACE_VISIBILITY_STATES as legacySurfaceVisibilityStates,
  METADATA_SURFACE_WIDTH_MODES as legacySurfaceWidthModes,
} from "../contracts/surface-renderer.contract.js";

const contractsRoot = join(import.meta.dirname, "../contracts");

const canonicalContractFiles = [
  "action.contract.ts",
  "diagnostics.contract.ts",
  "layout.contract.ts",
  "metadata-ui.contract.ts",
  "render-context.contract.ts",
  "renderer-definition.contract.ts",
  "section.contract.ts",
  "state.contract.ts",
  "surface.contract.ts",
] as const;

const deprecatedContractShims = [
  "action-renderer.contract.ts",
  "layout-renderer.contract.ts",
  "section-renderer.contract.ts",
  "surface-renderer.contract.ts",
] as const;

describe("metadata-ui contracts", () => {
  it("keeps a deterministic canonical contract file set on disk", () => {
    const files = readdirSync(contractsRoot).sort();

    for (const fileName of canonicalContractFiles) {
      expect(files).toContain(fileName);
    }

    for (const fileName of deprecatedContractShims) {
      expect(files).toContain(fileName);
    }
  });

  it("defines governed section, layout, and surface constants without duplicates", () => {
    expect(METADATA_SECTION_VISIBILITY_STATES).toEqual([
      "visible",
      "hidden",
      "collapsed",
      "disabled",
    ]);
    expect(new Set(METADATA_SECTION_VISIBILITY_STATES).size).toBe(
      METADATA_SECTION_VISIBILITY_STATES.length
    );
    expect(METADATA_SECTION_CHROME_MODES).toEqual([
      "none",
      "minimal",
      "card",
      "panel",
    ]);
    expect(METADATA_LAYOUT_REGIONS).toEqual([
      "header",
      "toolbar",
      "body",
      "aside",
      "content",
      "footer",
    ]);
    expect(METADATA_SURFACE_VISIBILITY_STATES).toEqual([
      "visible",
      "hidden",
      "disabled",
      "readonly",
    ]);
    expect(METADATA_SURFACE_CHROME_MODES).toEqual([
      "none",
      "minimal",
      "standard",
      "immersive",
    ]);
    expect(METADATA_SURFACE_WIDTH_MODES).toEqual([
      "fluid",
      "contained",
      "narrow",
      "wide",
    ]);
  });

  it("preserves deprecated renderer contract shims as re-export aliases", () => {
    expect(legacySectionVisibilityStates).toBe(METADATA_SECTION_VISIBILITY_STATES);
    expect(legacySectionChromeModes).toBe(METADATA_SECTION_CHROME_MODES);
    expect(legacyLayoutRegions).toBe(METADATA_LAYOUT_REGIONS);
    expect(legacySurfaceVisibilityStates).toBe(METADATA_SURFACE_VISIBILITY_STATES);
    expect(legacySurfaceChromeModes).toBe(METADATA_SURFACE_CHROME_MODES);
    expect(legacySurfaceWidthModes).toBe(METADATA_SURFACE_WIDTH_MODES);
  });
});
