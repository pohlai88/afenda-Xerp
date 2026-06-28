import { createMetadataUiRenderContext } from "@afenda/metadata-ui/server";
import { createMetadataRuntimeContext } from "@afenda/ui-composition";
import { describe, expect, it } from "vitest";

import { isMetadataAuthorizationDenialPreviewContext } from "../metadata-authorization-preview.server";

describe("isMetadataAuthorizationDenialPreviewContext", () => {
  it("returns true for forbidden runtime with verbose diagnostics", () => {
    const context = createMetadataUiRenderContext({
      runtime: createMetadataRuntimeContext({
        state: "forbidden",
        readonlyMode: true,
        diagnosticsEnabled: true,
      }),
      source: "server",
      diagnosticsLevel: "verbose",
    });

    expect(isMetadataAuthorizationDenialPreviewContext(context)).toBe(true);
  });

  it("returns false for ready production context", () => {
    const context = createMetadataUiRenderContext({
      runtime: createMetadataRuntimeContext({
        state: "ready",
        readonlyMode: false,
        diagnosticsEnabled: false,
      }),
      source: "server",
      diagnosticsLevel: "off",
    });

    expect(isMetadataAuthorizationDenialPreviewContext(context)).toBe(false);
  });
});
