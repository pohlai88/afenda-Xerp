import type { MotionContract } from "../contracts/motion.contract";
import {
  MOTION_INTENTS,
  type MotionIntent,
} from "../contracts/motion.contract";

const motionPatterns: readonly MotionContract[] = [
  {
    intent: "instant",
    durationToken: "afenda.motion.duration.instant",
    easingToken: "afenda.motion.easing.standard",
    reducedMotionBehavior: "skip-animation",
  },
  {
    intent: "feedback",
    durationToken: "afenda.motion.duration.fast",
    easingToken: "afenda.motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
  {
    intent: "overlay",
    durationToken: "afenda.motion.duration.normal",
    easingToken: "afenda.motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
  {
    intent: "navigation",
    durationToken: "afenda.motion.duration.slow",
    easingToken: "afenda.motion.easing.standard",
    reducedMotionBehavior: "remove-transform",
  },
] as const satisfies readonly MotionContract[];

export const AFENDA_MOTION_REGISTRY = motionPatterns;

/** All governed motion intent names. */
export const AFENDA_MOTION_INTENTS =
  MOTION_INTENTS satisfies readonly MotionIntent[];
