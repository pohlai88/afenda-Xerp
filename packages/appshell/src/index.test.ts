import { describe, expect, it } from "vitest";
import { getPackageName, PACKAGE_NAME } from "./index";

describe("@afenda/appshell", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/appshell");
    expect(getPackageName()).toBe("@afenda/appshell");
  });
});
