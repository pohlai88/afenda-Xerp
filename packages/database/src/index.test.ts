import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "./index";

describe("@afenda/database", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/database");
    expect(getPackageName()).toBe("@afenda/database");
  });
});
