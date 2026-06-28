import { describe, expect, it } from "vitest";
import { sampleRuntimeContext } from "../fixtures/sample-runtime-context.fixture.js";
import {
  assertMetadataUiBoundary,
  createMetadataUiRenderContext,
  getDefaultMetadataUiHydrationMode,
  isMetadataUiError,
  METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS,
  MetadataUiError,
  resolveMetadataRenderState,
} from "../runtime/index.js";

describe("runtime boundary contracts", () => {
  it("defines governed forbidden package imports without duplicates", () => {
    expect(METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS).toEqual([
      "@afenda/database",
      "@afenda/permissions",
      "@afenda/appshell",
    ]);
    expect(new Set(METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS).size).toBe(
      METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS.length
    );
  });
});

describe("assertMetadataUiBoundary", () => {
  it("allows metadata-ui dependencies", () => {
    expect(() =>
      assertMetadataUiBoundary("@afenda/ui-composition")
    ).not.toThrow();
  });

  it("rejects forbidden package imports", () => {
    expect(() => assertMetadataUiBoundary("@afenda/database")).toThrow(
      MetadataUiError
    );
    expect(() => assertMetadataUiBoundary("@afenda/appshell/client")).toThrow(
      /@afenda\/metadata-ui must not depend on @afenda\/appshell\/client/
    );
  });
});

describe("MetadataUiError", () => {
  it("identifies metadata-ui errors with a type guard", () => {
    const error = new MetadataUiError("Boundary violation.");

    expect(error.name).toBe("MetadataUiError");
    expect(isMetadataUiError(error)).toBe(true);
    expect(isMetadataUiError(new Error("Other"))).toBe(false);
  });
});

describe("resolveMetadataRenderState", () => {
  it("returns governed runtime state from render context", () => {
    const context = createMetadataUiRenderContext({
      runtime: sampleRuntimeContext,
      source: "static-preview",
    });

    expect(resolveMetadataRenderState(context)).toBe("ready");
    expect(getDefaultMetadataUiHydrationMode("static-preview")).toBe("none");
  });
});
