import { describe, expect, it } from "vitest";

import { formatWorkspaceDisplayLabel } from "../context/index.js";

describe("formatWorkspaceDisplayLabel", () => {
  it("returns legal entity label when no organization unit is selected", () => {
    expect(
      formatWorkspaceDisplayLabel({
        legalEntityLabel: "Dev Company",
      })
    ).toBe("Dev Company");
  });

  it("joins legal entity and organization unit with a middle dot", () => {
    expect(
      formatWorkspaceDisplayLabel({
        legalEntityLabel: "Dev Company",
        organizationUnitLabel: "Dev HQ",
      })
    ).toBe("Dev Company · Dev HQ");
  });
});
