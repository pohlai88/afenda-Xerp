import { describe, expect, it } from "vitest";
import {
  ACTION_CONTRACT_OWNERSHIPS,
  ACTION_CONTRACT_PROHIBITIONS,
  actionContract,
  METADATA_ACTION_KINDS,
  METADATA_ACTION_TARGETS,
  METADATA_ACTION_VISIBILITY_STATES,
} from "../action.contract.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("actionContract", () => {
  it("declares action authority", () => {
    expect(actionContract.authority).toBe("action");
  });

  it("uses the canonical metadata contract version", () => {
    expect(actionContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical action responsibilities", () => {
    expect(actionContract.owns).toEqual(ACTION_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical action kinds", () => {
    expect(actionContract.kinds).toEqual(METADATA_ACTION_KINDS);
  });

  it("exposes canonical visibility states", () => {
    expect(actionContract.visibilityStates).toEqual(
      METADATA_ACTION_VISIBILITY_STATES
    );
  });

  it("exposes canonical link targets", () => {
    expect(actionContract.targets).toEqual(METADATA_ACTION_TARGETS);
  });

  it("declares canonical action prohibitions", () => {
    expect(actionContract.prohibits).toEqual(ACTION_CONTRACT_PROHIBITIONS);
  });

  it("does not contain duplicate values in governed arrays", () => {
    expectUniqueValues(actionContract.owns);
    expectUniqueValues(actionContract.kinds);
    expectUniqueValues(actionContract.visibilityStates);
    expectUniqueValues(actionContract.targets);
    expectUniqueValues(actionContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(actionContract.owns);

    for (const prohibited of actionContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("keeps action governance separate from UI, renderer, and business logic concerns", () => {
    expect(actionContract.prohibits).toEqual(
      expect.arrayContaining([
        "permission-execution",
        "audit-writing",
        "handler-implementation",
        "renderer-implementation",
        "ui-implementation",
        "business-logic",
        "server-actions",
        "database-access",
        "react-components",
      ])
    );
  });

  it("includes link as a valid action kind", () => {
    expect(actionContract.kinds).toContain("link");
  });

  it("includes destructive as a valid action kind", () => {
    expect(actionContract.kinds).toContain("destructive");
  });

  it("includes disabled as a valid visibility state", () => {
    expect(actionContract.visibilityStates).toContain("disabled");
  });

  it("includes hidden as a valid visibility state", () => {
    expect(actionContract.visibilityStates).toContain("hidden");
  });
});
