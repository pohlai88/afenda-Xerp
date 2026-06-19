// TIP-008 spec-required service file — re-exports from the beta-access engine.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility service entry point.
export {
  type BetaAccessContext,
  type BetaAccessResolution,
  beta,
  resolveBetaAccess,
} from "./beta-access-engine";
