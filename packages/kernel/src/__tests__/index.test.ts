import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "../index";

describe("@afenda/kernel", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/kernel");
    expect(getPackageName()).toBe("@afenda/kernel");
  });
});
