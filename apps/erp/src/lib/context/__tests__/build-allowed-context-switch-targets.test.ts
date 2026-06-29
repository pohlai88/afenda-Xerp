import { describe, expect, it } from "vitest";

import { buildAllowedContextSwitchTargets } from "../build-allowed-context-switch-targets";

describe("buildAllowedContextSwitchTargets", () => {
  it("returns company-only targets when no organization memberships exist", () => {
    const targets = buildAllowedContextSwitchTargets({
      companies: [
        {
          slug: "alpha-co",
          label: "Alpha Co",
          status: "active",
        },
        {
          slug: "beta-co",
          label: "Beta Co",
          status: "active",
        },
      ],
      organizations: [],
      selectedCompanySlug: "alpha-co",
      selectedOrganizationSlug: null,
    });

    expect(targets).toEqual([
      {
        companySlug: "alpha-co",
        label: "Alpha Co",
        isSelected: true,
      },
      {
        companySlug: "beta-co",
        label: "Beta Co",
        isSelected: false,
      },
    ]);
  });

  it("returns organization targets when organization access exists for a company", () => {
    const targets = buildAllowedContextSwitchTargets({
      companies: [
        {
          slug: "alpha-co",
          label: "Alpha Co",
          status: "active",
        },
      ],
      organizations: [
        {
          companySlug: "alpha-co",
          slug: "hq",
          label: "HQ",
          status: "active",
        },
        {
          companySlug: "alpha-co",
          slug: "branch",
          label: "Branch",
          status: "active",
        },
      ],
      selectedCompanySlug: "alpha-co",
      selectedOrganizationSlug: "branch",
    });

    expect(targets).toEqual([
      {
        companySlug: "alpha-co",
        organizationSlug: "branch",
        label: "Alpha Co · Branch",
        isSelected: true,
      },
      {
        companySlug: "alpha-co",
        organizationSlug: "hq",
        label: "Alpha Co · HQ",
        isSelected: false,
      },
    ]);
  });

  it("excludes suspended and archived companies and organizations", () => {
    const targets = buildAllowedContextSwitchTargets({
      companies: [
        {
          slug: "active-co",
          label: "Active Co",
          status: "active",
        },
        {
          slug: "suspended-co",
          label: "Suspended Co",
          status: "suspended",
        },
      ],
      organizations: [
        {
          companySlug: "active-co",
          slug: "archived-org",
          label: "Archived Org",
          status: "archived",
        },
      ],
      selectedCompanySlug: "active-co",
      selectedOrganizationSlug: null,
    });

    expect(targets).toEqual([
      {
        companySlug: "active-co",
        label: "Active Co",
        isSelected: true,
      },
    ]);
  });
});
