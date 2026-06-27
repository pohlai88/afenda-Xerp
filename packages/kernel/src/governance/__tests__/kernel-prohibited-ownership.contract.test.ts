import { describe, expect, it } from "vitest";
import {
  getKernelProhibitedOwnershipConcern,
  isKernelProhibitedOwnershipConcernId,
  KERNEL_PROHIBITED_OWNERSHIP_CATEGORIES,
  KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS,
  KERNEL_PROHIBITED_OWNERSHIP_CONCERNS,
  KERNEL_PROHIBITED_OWNERSHIP_POLICY,
  listKernelProhibitedOwnershipConcerns,
} from "../index.js";

const PAS_SECTION_5_LABELS = [
  "Database schema",
  "Database migrations",
  "Database clients",
  "RLS SQL policies",
  "Auth sessions",
  "Auth cookies",
  "Auth providers",
  "Permission evaluation",
  "Feature flag evaluation",
  "Entitlement evaluation",
  "API route handlers",
  "Server actions",
  "React components",
  "UI primitives",
  "App shell navigation behavior",
  "Domain workflows",
  "Business services",
  "Integration SDKs",
  "External API clients",
  "Cron jobs",
  "Queue workers",
  "Outbox publishing",
  "Fiscal calendar setup",
  "Fiscal period close workflow",
  "Functional currency decisions",
  "Reporting currency decisions",
  "Currency conversion",
  "Accounting posting",
  "Ledger calculation",
  "Consolidation elimination",
  "Inventory stock movement logic",
  "HRM payroll logic",
  "CRM pipeline logic",
  "Procurement approval logic",
  "Translation files",
  "Date/number formatting implementation",
  "Country statutory rules",
  "UOM conversion rules",
] as const;

describe("kernel prohibited ownership (PAS §5)", () => {
  it("registers exactly 38 PAS concerns", () => {
    expect(KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS).toHaveLength(38);
    expect(KERNEL_PROHIBITED_OWNERSHIP_POLICY.concernCount).toBe(38);
    expect(listKernelProhibitedOwnershipConcerns()).toHaveLength(38);
  });

  it("matches PAS §5 labels verbatim and in order", () => {
    const labels = listKernelProhibitedOwnershipConcerns().map(
      (concern) => concern.label
    );
    expect(labels).toEqual([...PAS_SECTION_5_LABELS]);
  });

  it("maps every concern id to a registry row", () => {
    for (const id of KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS) {
      expect(KERNEL_PROHIBITED_OWNERSHIP_CONCERNS[id].id).toBe(id);
      expect(isKernelProhibitedOwnershipConcernId(id)).toBe(true);
      expect(
        getKernelProhibitedOwnershipConcern(id).label.length
      ).toBeGreaterThan(0);
    }
  });

  it("uses only approved categories with non-empty owners", () => {
    for (const concern of listKernelProhibitedOwnershipConcerns()) {
      expect(KERNEL_PROHIBITED_OWNERSHIP_CATEGORIES).toContain(
        concern.category
      );
      expect(concern.owner.trim().length).toBeGreaterThan(0);
    }
  });

  it("rejects unknown concern ids", () => {
    expect(isKernelProhibitedOwnershipConcernId("database-schema")).toBe(true);
    expect(isKernelProhibitedOwnershipConcernId("react-runtime")).toBe(false);
  });

  it("remains JSON-serializable for documentation and drift gates", () => {
    const serialized = JSON.parse(
      JSON.stringify({
        policy: KERNEL_PROHIBITED_OWNERSHIP_POLICY,
        concerns: listKernelProhibitedOwnershipConcerns(),
      })
    ) as {
      policy: typeof KERNEL_PROHIBITED_OWNERSHIP_POLICY;
      concerns: ReturnType<typeof listKernelProhibitedOwnershipConcerns>;
    };

    expect(serialized.policy.pasSection).toBe("5");
    expect(serialized.concerns).toHaveLength(38);
  });
});
