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
} from "../index.js";

describe("governed contract arrays", () => {
  it("SURFACE_TYPES contains only approved values", () => {
    expect([...SURFACE_TYPES]).toEqual(["page", "workspace", "module"]);
    expect(isSurfaceType("page")).toBe(true);
    expect(isSurfaceType("invalid")).toBe(false);
  });

  it("LAYOUT_TYPES contains only approved values", () => {
    expect([...LAYOUT_TYPES]).toEqual([
      "dashboard",
      "grid",
      "panel",
      "stack",
      "tabs",
      "wizard",
    ]);
    expect(isLayoutType("tabs")).toBe(true);
    expect(isLayoutType("carousel")).toBe(false);
  });

  it("SECTION_TYPES contains only approved values", () => {
    expect([...SECTION_TYPES]).toEqual([
      "list",
      "stat",
      "chart",
      "form",
      "detail",
      "audit",
      "action",
    ]);
    expect(isSectionType("form")).toBe(true);
    expect(isSectionType("table")).toBe(false);
  });

  it("PRESENTATION_MODES contains only approved values", () => {
    expect([...PRESENTATION_MODES]).toEqual([
      "default",
      "compact",
      "comfortable",
      "readonly",
      "diagnostic",
    ]);
    expect(isPresentationMode("diagnostic")).toBe(true);
    expect(isPresentationMode("standard")).toBe(false);
  });

  it("METADATA_DENSITY_MODES contains only approved values", () => {
    expect([...METADATA_DENSITY_MODES]).toEqual([
      "compact",
      "default",
      "comfortable",
    ]);
    expect(isMetadataDensityMode("default")).toBe(true);
    expect(isMetadataDensityMode("dense")).toBe(false);
  });

  it("METADATA_LIFECYCLES contains only approved values", () => {
    expect([...METADATA_LIFECYCLES]).toEqual([
      "draft",
      "active",
      "deprecated",
      "removed",
    ]);
    expect(isMetadataLifecycle("active")).toBe(true);
    expect(isMetadataLifecycle("retired")).toBe(false);
  });

  it("METADATA_RUNTIME_STATES are complete", () => {
    expect([...METADATA_RUNTIME_STATES]).toEqual([
      "loading",
      "empty",
      "error",
      "forbidden",
      "ready",
      "invalid",
      "degraded",
      "partial",
      "readonly",
      "maintenance",
    ]);
    expect(isMetadataRuntimeState("ready")).toBe(true);
    expect(isMetadataRuntimeState("pending")).toBe(false);
  });

  it("RENDERER_CAPABILITIES align with section types", () => {
    expect(RENDERER_CAPABILITIES).toHaveLength(SECTION_TYPES.length);
    expect(isRendererCapability("render-list")).toBe(true);
    expect(isRendererCapability("canRenderList")).toBe(false);
  });

  it("METADATA_AUTHORITY_KEYS are complete", () => {
    expect([...METADATA_AUTHORITY_KEYS]).toEqual([
      "metadata",
      "surface",
      "layout",
      "section",
      "renderer",
      "registry",
      "presentation",
      "runtime",
      "action",
    ]);
    expect(isMetadataAuthorityKey("renderer")).toBe(true);
    expect(isMetadataAuthorityKey("phantom")).toBe(false);
  });
});
