import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "../index";

describe("@afenda/ui", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/ui");
    expect(getPackageName()).toBe("@afenda/ui");
  });
});
