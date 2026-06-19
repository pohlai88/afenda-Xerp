import { describe, expect, it } from "vitest";

import {
  assertNoOrganizationCycle,
  assertOrganizationSlug,
  buildOrganizationInsertRow,
  OrganizationCycleError,
  OrganizationScopeMismatchError,
} from "../organization/organization.contract.js";

describe("organization contract", () => {
  it("normalizes organization slugs to lowercase kebab-case", () => {
    expect(assertOrganizationSlug("Finance Team")).toBe("finance-team");
  });

  it("builds normalized insert rows", () => {
    const row = buildOrganizationInsertRow({
      tenantId: "00000000-0000-4000-8000-000000000001",
      companyId: "00000000-0000-4000-8000-000000000002",
      slug: "Finance Team",
      name: " Finance ",
      parentOrganizationId: null,
    });

    expect(row).toMatchObject({
      slug: "finance-team",
      name: "Finance",
      type: "department",
      status: "active",
      parentOrganizationId: null,
    });
  });

  it("detects direct and indirect organization cycles", () => {
    expect(() =>
      assertNoOrganizationCycle("org-a", "org-a", () => null)
    ).toThrow(OrganizationCycleError);

    expect(() =>
      assertNoOrganizationCycle("org-a", "org-b", (id) =>
        id === "org-b" ? "org-a" : null
      )
    ).toThrow(OrganizationCycleError);

    expect(() =>
      assertNoOrganizationCycle("org-a", "org-c", (id) => {
        if (id === "org-c") {
          return "org-b";
        }
        if (id === "org-b") {
          return "org-a";
        }
        return null;
      })
    ).toThrow(OrganizationCycleError);
  });

  it("allows acyclic parent assignment", () => {
    expect(() =>
      assertNoOrganizationCycle("org-a", "org-c", (id) => {
        if (id === "org-c") {
          return "org-b";
        }
        return null;
      })
    ).not.toThrow();
  });
});

describe("organization contract errors", () => {
  it("exposes scope mismatch error type", () => {
    expect(new OrganizationScopeMismatchError("test").name).toBe(
      "OrganizationScopeMismatchError"
    );
  });
});
