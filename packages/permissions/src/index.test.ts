import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "./index";

describe("@afenda/permissions", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/permissions");
    expect(getPackageName()).toBe("@afenda/permissions");
  });
});
