import { describe, expect, it } from "vitest";

import {
  assertMotionPolicyCoverageStrict,
  getMissingMotionIntents,
  getMotionIntent,
  getMotionPolicy,
  isMotionIntent,
  MOTION_INTENTS,
  resolveMotionIntent,
} from "../../governance";

describe("motion governance", () => {
  it("has policy coverage for every governed motion intent", () => {
    expect(getMissingMotionIntents()).toEqual([]);
    expect(() => assertMotionPolicyCoverageStrict()).not.toThrow();
  });

  it("resolves a known motion intent", () => {
    expect(getMotionIntent("instant").intent).toBe("instant");
  });

  it("resolves fallback motion intent", () => {
    expect(resolveMotionIntent(undefined, "instant").intent).toBe("instant");
  });

  it("narrows known motion intent strings", () => {
    expect(isMotionIntent("instant")).toBe(true);
    expect(isMotionIntent("random-motion")).toBe(false);
  });

  it("returns the governed motion policy", () => {
    expect(getMotionPolicy().length).toBeGreaterThan(0);
  });

  it("covers every governed motion intent", () => {
    const policyIntents = getMotionPolicy().map((entry) => entry.intent);

    expect(policyIntents).toEqual(expect.arrayContaining([...MOTION_INTENTS]));
    expect(policyIntents).toHaveLength(MOTION_INTENTS.length);
  });

  it("aligns with internal design-authority motion policy", async () => {
    const { motionPolicy: authorityPolicy } = await import(
      "../../design-authority/index.js"
    );

    expect(getMotionPolicy()).toEqual(authorityPolicy);
  });

  it("returns governed feedback motion", () => {
    expect(getMotionIntent("feedback")).toMatchObject({
      intent: "feedback",
      durationToken: "afenda.motion.duration.fast",
      easingToken: "afenda.motion.easing.standard",
      reducedMotionBehavior: "remove-transform",
    });
  });

  it("returns skip-animation for instant motion", () => {
    expect(getMotionIntent("instant")).toMatchObject({
      reducedMotionBehavior: "skip-animation",
    });
  });

  it("rejects unknown runtime motion intent", () => {
    expect(() => getMotionIntent("bounce" as never)).toThrow(
      "Governed UI motion policy violation"
    );
  });
});
