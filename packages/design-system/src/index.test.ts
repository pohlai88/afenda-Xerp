import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "./index";

describe("@afenda/design-system", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/design-system");
    expect(getPackageName()).toBe("@afenda/design-system");
  });
});
