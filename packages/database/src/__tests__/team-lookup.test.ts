import { describe, expect, it } from "vitest";

import { isTeamOrganizationRow } from "../team/team-lookup.service.js";
import { TEAM_ORGANIZATION_UNIT_TYPE } from "../team/team.constants.js";

describe("team lookup", () => {
  it("identifies team organization rows by governed type constant", () => {
    expect(
      isTeamOrganizationRow({ type: TEAM_ORGANIZATION_UNIT_TYPE })
    ).toBe(true);
    expect(isTeamOrganizationRow({ type: "department" })).toBe(false);
  });
});
