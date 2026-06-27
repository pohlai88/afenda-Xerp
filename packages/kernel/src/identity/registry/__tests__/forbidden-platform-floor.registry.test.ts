import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  brandFiscalCalendarId,
  brandFiscalPeriodId,
  toFiscalCalendarId,
  toFiscalPeriodId,
} from "../../../erp-domain/accounting/index.js";
import {
  ENTERPRISE_ID_FAMILIES,
  FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
  ID_FAMILIES,
  IDENTITY_PROHIBITED_PATTERNS,
  IDENTITY_PROMOTION_REQUIREMENTS,
  isForbiddenPlatformFloorIdSymbol,
} from "../id-family.registry.js";

const kernelRoot = fileURLToPath(new URL("../../../..", import.meta.url));

describe("PAS-001 §4.1.6 forbidden platform-floor IDs", () => {
  it("freezes FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS", () => {
    expect(FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS).toEqual([
      "FiscalCalendarId",
      "FiscalPeriodId",
    ]);
  });

  it("guards forbidden symbols via isForbiddenPlatformFloorIdSymbol", () => {
    for (const symbol of FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS) {
      expect(isForbiddenPlatformFloorIdSymbol(symbol)).toBe(true);
    }

    expect(isForbiddenPlatformFloorIdSymbol("TenantId")).toBe(false);
    expect(isForbiddenPlatformFloorIdSymbol("FiscalCalendar")).toBe(false);
    expect(isForbiddenPlatformFloorIdSymbol("")).toBe(false);
  });

  it("excludes fiscal type names from ID_FAMILIES", () => {
    const enterpriseTypeNames = ENTERPRISE_ID_FAMILIES.map(
      (family) => ID_FAMILIES[family].typeName
    );

    for (const forbidden of FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS) {
      expect(enterpriseTypeNames).not.toContain(forbidden);
    }
  });

  it("keeps fiscal IDs on accounting-domain only — not main kernel barrel", () => {
    const mainKernelIndex = readFileSync(
      join(kernelRoot, "src/index.ts"),
      "utf8"
    );

    for (const forbidden of FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS) {
      expect(mainKernelIndex).not.toContain(`export type ${forbidden}`);
    }
  });

  it("brands fiscal calendar and period IDs via accounting-domain vocabulary", () => {
    expect(toFiscalCalendarId(brandFiscalCalendarId("fc-2026"))).toBe(
      "fc-2026"
    );
    expect(toFiscalPeriodId(brandFiscalPeriodId("fp-2026-01"))).toBe(
      "fp-2026-01"
    );
  });

  it("links forbidden-floor enforcement to governance manifest", () => {
    expect(
      IDENTITY_PROHIBITED_PATTERNS["forbidden-platform-floor-id-export"]
        .enforcementGate
    ).toBe("check:forbidden-platform-ids");
    expect(
      IDENTITY_PROMOTION_REQUIREMENTS["forbidden-fiscal-ids-off-floor"]
        .evidenceGate
    ).toBe("check:forbidden-platform-ids");
  });
});
