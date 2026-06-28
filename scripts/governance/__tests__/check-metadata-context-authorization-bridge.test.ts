import { describe, expect, it } from "vitest";

import { checkMetadataContextAuthorizationBridge } from "../check-metadata-context-authorization-bridge.mts";

describe("check-metadata-context-authorization-bridge script", () => {
  it("passes on the current repository state", () => {
    expect(checkMetadataContextAuthorizationBridge()).toEqual([]);
  });
});
