import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "../index";

describe("@afenda/observability", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/observability");
    expect(getPackageName()).toBe("@afenda/observability");
  });
});
