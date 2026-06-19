import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "./index";

describe("@afenda/metadata-ui", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/metadata-ui");
    expect(getPackageName()).toBe("@afenda/metadata-ui");
  });
});
