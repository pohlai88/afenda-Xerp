// TIP-008 spec-required service file — re-exports from the usage-limit engine.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility service entry point.
export {
  limit,
  resolveUsageLimit,
  type UsageLimitResolution,
} from "./usage-limit-engine";
