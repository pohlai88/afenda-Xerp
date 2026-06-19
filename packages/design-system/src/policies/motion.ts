import type { MotionContract } from "../contracts/motion.contract";

export const motionPolicy = [
  {
    intent: "instant",
    durationToken: "motion.duration.feedback",
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
    durationToken: "motion.duration.feedback",
    easingToken: "motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
  {
    intent: "overlay",
    durationToken: "motion.duration.feedback",
    easingToken: "motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
] as const satisfies readonly MotionContract[];
