import type { MotionContract } from "../contracts/motion.contract";

/**
 * Motion intent → duration token mapping.
 *
 * Intent names describe purpose; duration token names describe scale.
 * This separation allows intents to remain stable while duration
 * scale names evolve independently.
 *
 *   instant   → 0ms   (zero-cost state reset)
 *   feedback  → fast  (hover / press / focus)
 *   overlay   → normal (dialog entrance/exit)
 *   navigation → slow  (page-level transitions)
 *
 * All intents share the standard easing curve for a coherent feel.
 */
export const motionPolicy = [
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
