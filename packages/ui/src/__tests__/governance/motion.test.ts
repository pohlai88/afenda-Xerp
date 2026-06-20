import { describe, expect, it } from "vitest";

import {
  MOTION_INTENTS,
  getMotionIntent,
  getMotionPolicy,
} from "../../governance";

describe("motion governance", () => {
  it("covers every governed motion intent", () => {
    const policyIntents = getMotionPolicy().map((entry) => entry.intent);

    expect(policyIntents).toEqual(expect.arrayContaining([...MOTION_INTENTS]));
    expect(policyIntents).toHaveLength(MOTION_INTENTS.length);
  });

  it("aligns with design-system motion authority", async () => {
    const { motionPolicy: authorityPolicy } = await import("@afenda/design-system");

    expect(getMotionPolicy()).toEqual(authorityPolicy);
  });

  it("returns governed feedback motion", () => {
    expect(getMotionIntent("feedback")).toMatchObject({
      intent: "feedback",
      durationToken: "motion.duration.feedback",
      easingToken: "motion.easing.standard",
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
      "TIP-004 motion policy violation"
    );
  });
});
