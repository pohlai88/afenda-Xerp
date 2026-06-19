// TIP-008 spec-required entry point — re-exports the capability gate evaluator.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility evaluator entry point.
export {
  type EvaluateCapabilityInput,
  evaluateCapability,
} from "./capability-evaluation";
