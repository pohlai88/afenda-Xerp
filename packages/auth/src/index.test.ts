import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "./index";

describe("@afenda/auth", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/auth");
    expect(getPackageName()).toBe("@afenda/auth");
  });
});
