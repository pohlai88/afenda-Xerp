import {
  MOTION_INTENTS,
  type MotionContract,
  type MotionIntent,
} from "./design-system";

const isDevelopment = process.env["NODE_ENV"] !== "production";

const motionPolicy = Object.freeze([
  {
    intent: "instant",
    durationToken: "motion.duration.instant",
    easingToken: "motion.easing.standard",
    reducedMotionBehavior: "skip-animation",
  },
  {
    intent: "feedback",
    durationToken: "motion.duration.feedback",
    easingToken: "motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
  {
    intent: "navigation",
    durationToken: "motion.duration.navigation",
    easingToken: "motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
  {
    intent: "overlay",
    durationToken: "motion.duration.overlay",
    easingToken: "motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
] as const satisfies readonly MotionContract[]);

const motionByIntent = new Map<MotionIntent, MotionContract>(
  motionPolicy.map((entry) => [entry.intent, entry])
);

function assertMotionPolicyCoverage(): void {
  if (!isDevelopment) {
    return;
  }

  const missingIntents = MOTION_INTENTS.filter(
    (intent) => !motionByIntent.has(intent)
  );

  if (missingIntents.length > 0) {
    throw new Error(
      `TIP-004 motion policy violation. Missing motion intents: ${missingIntents.join(
        ", "
      )}.`
    );
  }
}

export function getMotionIntent(intent: MotionIntent): MotionContract {
  assertMotionPolicyCoverage();

  const entry = motionByIntent.get(intent);

  if (!entry) {
    throw new Error(
      `TIP-004 motion policy violation. Unknown motion intent "${intent}". Allowed: ${MOTION_INTENTS.join(
        ", "
      )}.`
    );
  }

  return entry;
}

export function getMotionPolicy(): readonly MotionContract[] {
  assertMotionPolicyCoverage();
  return motionPolicy;
}
