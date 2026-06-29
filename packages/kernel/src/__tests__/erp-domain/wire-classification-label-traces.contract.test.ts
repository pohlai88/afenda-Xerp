import { describe, expect, it } from "vitest";
import { ACCOUNT_TYPES } from "../../erp-domain/accounting/account-type.contract.js";
import {
  ACCOUNT_TYPE_PAS004_LABEL_TRACES,
  WIRE_CLASSIFICATION_PAS004_LABEL_TRACE_ENTRIES,
} from "../../erp-domain/catalog/wire-classification-label-traces.registry.js";

describe("wire classification PAS-004 label traces (PAS-001B §3.1)", () => {
  it("covers every account type value with a PAS-004 deferral trace", () => {
    for (const value of ACCOUNT_TYPES) {
      expect(ACCOUNT_TYPE_PAS004_LABEL_TRACES[value]?.meaningOwner).toBe(
        "PAS-004"
      );
      expect(ACCOUNT_TYPE_PAS004_LABEL_TRACES[value]?.atomId).toBe(
        `wire.accounting.account-type.${value}`
      );
    }
  });

  it("registers every delivered contested classification contract", () => {
    expect(WIRE_CLASSIFICATION_PAS004_LABEL_TRACE_ENTRIES.length).toBe(49);
  });
});
