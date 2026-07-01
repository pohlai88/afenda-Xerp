import { describe, expect, it } from "vitest";

import {
  assertStudioBlockPreviewComponentsRegistered,
  assertSurfaceTemplateBlockComponentsRegistered,
  isStudioBlockComponentId,
  listStudioBlockPreviewIds,
  listSurfaceTemplateBlockComponentIds,
  resolveStudioBlockComponent,
  STUDIO_BLOCK_COMPONENT_REGISTRY,
} from "../meta-registry/studio-block-component.registry.js";

describe("studio block component registry (PAS-006D R1c-2)", () => {
  it("registers all surface-template block ids", () => {
    const missing = assertSurfaceTemplateBlockComponentsRegistered();

    expect(missing).toEqual([]);
  });

  it("registers all MCP seed block ids for metadata-workspace preview", () => {
    const missing = assertStudioBlockPreviewComponentsRegistered();

    expect(missing).toEqual([]);
  });

  it("resolves known surface-template blocks", () => {
    for (const blockId of listSurfaceTemplateBlockComponentIds()) {
      expect(isStudioBlockComponentId(blockId)).toBe(true);
      expect(typeof resolveStudioBlockComponent(blockId)).toBe("function");
    }
  });

  it("resolves every MCP seed preview block", () => {
    for (const blockId of listStudioBlockPreviewIds()) {
      expect(isStudioBlockComponentId(blockId)).toBe(true);
      expect(typeof resolveStudioBlockComponent(blockId)).toBe("function");
    }
  });

  it("returns undefined for unknown block ids", () => {
    expect(resolveStudioBlockComponent("unknown-block-id")).toBeUndefined();
  });

  it("keeps registry keys aligned with MCP seed block manifest", () => {
    expect(Object.keys(STUDIO_BLOCK_COMPONENT_REGISTRY).sort()).toEqual(
      [...listStudioBlockPreviewIds()].sort()
    );
  });
});
