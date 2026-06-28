import { describe, expect, it } from "vitest";
import {
  isLayoutType,
  isMetadataAuthorityKey,
  isMetadataDensityMode,
  isMetadataLifecycle,
  isMetadataRuntimeState,
  isPresentationMode,
  isRendererCapability,
  isSectionType,
  isSurfaceType,
  LAYOUT_TYPES,
  METADATA_AUTHORITY_KEYS,
  METADATA_DENSITY_MODES,
  METADATA_LIFECYCLES,
  METADATA_RUNTIME_STATES,
  PRESENTATION_MODES,
  RENDERER_CAPABILITIES,
  SECTION_TYPES,
  SURFACE_TYPES,
} from "../metadata.constants.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("metadata constants", () => {
  it("declares unique governed vocabularies", () => {
    expectUniqueValues(SURFACE_TYPES);
    expectUniqueValues(LAYOUT_TYPES);
    expectUniqueValues(SECTION_TYPES);
    expectUniqueValues(PRESENTATION_MODES);
    expectUniqueValues(METADATA_DENSITY_MODES);
    expectUniqueValues(METADATA_LIFECYCLES);
    expectUniqueValues(METADATA_RUNTIME_STATES);
    expectUniqueValues(RENDERER_CAPABILITIES);
    expectUniqueValues(METADATA_AUTHORITY_KEYS);
  });

  it("validates governed surface types", () => {
    expect(isSurfaceType("page")).toBe(true);
    expect(isSurfaceType("screen")).toBe(false);
  });

  it("validates governed layout types", () => {
    expect(isLayoutType("dashboard")).toBe(true);
    expect(isLayoutType("masonry")).toBe(false);
  });

  it("validates governed section types", () => {
    expect(isSectionType("list")).toBe(true);
    expect(isSectionType("table")).toBe(false);
  });

  it("validates governed presentation modes", () => {
    expect(isPresentationMode("diagnostic")).toBe(true);
    expect(isPresentationMode("debug")).toBe(false);
  });

  it("validates governed density modes", () => {
    expect(isMetadataDensityMode("comfortable")).toBe(true);
    expect(isMetadataDensityMode("spacious")).toBe(false);
  });

  it("validates governed metadata lifecycles", () => {
    expect(isMetadataLifecycle("active")).toBe(true);
    expect(isMetadataLifecycle("archived")).toBe(false);
  });

  it("validates governed runtime states", () => {
    expect(isMetadataRuntimeState("ready")).toBe(true);
    expect(isMetadataRuntimeState("success")).toBe(false);
  });

  it("validates governed renderer capabilities", () => {
    expect(isRendererCapability("render-list")).toBe(true);
    expect(isRendererCapability("canRenderList")).toBe(false);
  });

  it("validates governed metadata authority keys", () => {
    expect(isMetadataAuthorityKey("runtime")).toBe(true);
    expect(isMetadataAuthorityKey("database")).toBe(false);
  });
});
