export const MOTION_INTENTS = [
  "instant",
  "feedback",
  "navigation",
  "overlay",
] as const;

export type MotionIntent = (typeof MOTION_INTENTS)[number];

export interface MotionContract {
  readonly durationToken: `motion.duration.${string}`;
  readonly easingToken: `motion.easing.${string}`;
  readonly intent: MotionIntent;
  readonly reducedMotionBehavior: "remove-transform" | "skip-animation";
}
