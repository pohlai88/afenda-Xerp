import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "../index";

describe("@afenda/testing", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/testing");
    expect(getPackageName()).toBe("@afenda/testing");
  });
});
