import { describe, expect, it } from "vitest";
import {
  CROSS_REPRESENTATION_ROUTING,
  REPORTING_CONTEXT_PROCESS_ROUTING,
  resolveCrossRepresentationRoute,
  resolveReportingContextProcessRoute,
  resolveStandardProcessRoute,
  STANDARD_PROCESS_ROUTING,
} from "../routing/standard-process-routing.registry.js";

describe("standard process routing (B4 · B13 · B16)", () => {
  it("routes subsidiary relationships to IFRS 10", () => {
    expect(STANDARD_PROCESS_ROUTING.holding_relationship_subsidiary).toEqual([
      "IFRS_10",
    ]);
    expect(
      resolveStandardProcessRoute("holding_relationship_subsidiary")
    ).toEqual(["IFRS_10"]);
  });

  it("routes lease recognition to IFRS 16", () => {
    expect(STANDARD_PROCESS_ROUTING.lease_contract_recognition).toEqual([
      "IFRS_16",
    ]);
  });

  it("supports reporting context profile routing (B13)", () => {
    expect(
      resolveReportingContextProcessRoute(
        "group_consolidation",
        "holding_relationship_joint_venture"
      )
    ).toEqual(["IFRS_11", "IAS_28"]);
    expect(
      REPORTING_CONTEXT_PROCESS_ROUTING[
        "profile:statutory:lease_contract_recognition"
      ]
    ).toEqual(["IFRS_16"]);
  });

  it("supports cross-representation routing (B16)", () => {
    expect(
      resolveCrossRepresentationRoute(
        "statutory_to_group",
        "holding_relationship_subsidiary"
      )
    ).toEqual(["IFRS_10"]);
    expect(
      CROSS_REPRESENTATION_ROUTING[
        "cross_rep:tax_to_statutory:lease_contract_recognition"
      ]
    ).toEqual(["IFRS_16"]);
  });
});
