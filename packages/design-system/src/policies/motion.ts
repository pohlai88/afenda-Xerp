import type { MotionContract } from "../contracts/motion.contract";

/**
 * Each motion intent maps to its own governed duration token so that
 * "instant" interactions feel snappy, "feedback" interactions feel responsive,
 * and "overlay"/"navigation" transitions have enough time to be perceived
 * without feeling slow on enterprise-density screens.
 *
 * All intents share the same easing curve to maintain a coherent feel.
 * Reduced-motion behavior degrades gracefully without hard-coding durations.
 */
export const motionPolicy = [
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
] as const satisfies readonly MotionContract[];
