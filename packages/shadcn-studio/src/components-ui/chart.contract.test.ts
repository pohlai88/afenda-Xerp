import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CHART_PRIMITIVE_ID,
  CHART_SLOTS,
  chartContainerClassName,
  chartPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "./chart.contract.js";
import type { ChartContainerProps, ChartSlot } from "./chart.js";

describe("chart primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CHART_PRIMITIVE_ID for metadata registries", () => {
    expect(CHART_PRIMITIVE_ID).toBe("shadcn-studio.ui.chart");
  });

  it("exports CHART_SLOTS", () => {
    expect(CHART_SLOTS).toEqual({ root: "chart" });
  });

  it("exports governed class constants", () => {
    expect(chartContainerClassName).toContain("aspect-video");
  });

  it("chartPrimitiveMetadata is JSON-serializable", () => {
    const payload = chartPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ChartSlot is a governed slot literal union", () => {
    expectTypeOf<ChartSlot>().toEqualTypeOf<"chart">();
  });

  it("ChartContainerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ChartContainerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
