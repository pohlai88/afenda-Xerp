import { describe, expect, it } from "vitest";

import {
  parseSurfaceId,
  toSurfaceContext,
} from "../surface-context.resolution.server.js";
import {
  parseWorkflowId,
  toWorkflowContext,
} from "../workflow-context.resolution.server.js";

describe("runtime surface and workflow resolution", () => {
  it("validates runtime surface and workflow identifiers", () => {
    expect(parseSurfaceId("accounting.journal.list")).toBe(
      "accounting.journal.list"
    );
    expect(parseSurfaceId("page/sample/orders")).toBe("page.sample.orders");
    expect(parseSurfaceId("page-sample-orders")).toBe("page.sample.orders");
    expect(parseSurfaceId("Invalid Surface")).toBe("invalid.surface");
    expect(parseSurfaceId("!!!")).toBeNull();
    expect(toSurfaceContext("inventory.warehouse.detail")).toEqual({
      surfaceId: "inventory.warehouse.detail",
    });

    expect(parseWorkflowId("procurement.approval.review")).toBe(
      "procurement.approval.review"
    );
    expect(parseWorkflowId("procurement/approval/review")).toBe(
      "procurement.approval.review"
    );
    expect(
      toWorkflowContext({
        workflowId: "procurement.approval.review",
        surfaceId: "procurement.po.detail",
      })
    ).toEqual({
      workflowId: "procurement.approval.review",
      surfaceId: "procurement.po.detail",
    });
  });
});
