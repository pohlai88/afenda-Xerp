import { describe, expect, it } from "vitest";
import {
  buildModuleReadinessReportRows,
  PROCUREMENT_FOUNDATION_BUNDLE,
  renderModuleReadinessReport,
} from "../index.js";

describe("renderModuleReadinessReport", () => {
  it("renders markdown table header", () => {
    const report = renderModuleReadinessReport(PROCUREMENT_FOUNDATION_BUNDLE);
    expect(report).toContain("# Procurement Runtime Readiness Report");
    expect(report).toContain(
      "| Dimension | Verdict | Evidence | Missing | Gate |"
    );
  });

  it("includes all 14 readiness dimensions", () => {
    const rows = buildModuleReadinessReportRows(PROCUREMENT_FOUNDATION_BUNDLE);
    expect(rows).toHaveLength(14);
    expect(rows.map((row) => row.dimension)).toContain("authority");
    expect(rows.map((row) => row.dimension)).toContain("operations");
    expect(rows.map((row) => row.dimension)).toContain("registry");
  });

  it("marks required dimensions with evidence as Pass", () => {
    const rows = buildModuleReadinessReportRows(PROCUREMENT_FOUNDATION_BUNDLE);
    const authority = rows.find((row) => row.dimension === "authority");
    expect(authority?.verdict).toBe("Pass");
    expect(authority?.evidence).toContain("PAS-001C");
  });

  it("marks deferred dimensions as Deferred", () => {
    const rows = buildModuleReadinessReportRows(PROCUREMENT_FOUNDATION_BUNDLE);
    const database = rows.find((row) => row.dimension === "database");
    expect(database?.verdict).toBe("Deferred");
  });

  it("maps dimensions to gate commands", () => {
    const rows = buildModuleReadinessReportRows(PROCUREMENT_FOUNDATION_BUNDLE);
    const permissions = rows.find((row) => row.dimension === "permissions");
    expect(permissions?.gate).toBe("pnpm check:erp-module-permission-binding");
  });

  it("accepts custom module title", () => {
    const report = renderModuleReadinessReport(
      PROCUREMENT_FOUNDATION_BUNDLE,
      "KV-PROC"
    );
    expect(report).toContain("# KV-PROC Runtime Readiness Report");
  });
});
