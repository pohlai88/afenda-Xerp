import {
  MOTION_INTENTS,
  type MotionContract,
  type MotionIntent,
  motionPolicy,
} from "./design-system";
import {
  enforceGovernanceOr,
  reportGovernanceRuntimeViolation,
} from "./dev-env";

const motionByIntent = new Map<MotionIntent, MotionContract>(
  motionPolicy.map((entry) => [entry.intent, entry])
);

function formatMissingMotionIntents(
  missingIntents: readonly MotionIntent[]
): string {
  return `Governed UI motion policy violation. Missing motion intents: ${missingIntents.join(
    ", "
  )}. Every motion intent declared by @afenda/design-system must have a motion policy entry.`;
}

function formatUnknownMotionIntent(intent: string): string {
  return `Governed UI motion policy violation. Unknown motion intent "${intent}". Allowed: ${MOTION_INTENTS.join(
    ", "
  )}.`;
}

export function getMissingMotionIntents(): readonly MotionIntent[] {
  return MOTION_INTENTS.filter((intent) => !motionByIntent.has(intent));
}

function assertMotionPolicyCoverage(): void {
  const missingIntents = getMissingMotionIntents();

  if (missingIntents.length > 0) {
    reportGovernanceRuntimeViolation(
      formatMissingMotionIntents(missingIntents)
    );
  }
}

export function assertMotionPolicyCoverageStrict(): void {
  const missingIntents = getMissingMotionIntents();

  if (missingIntents.length > 0) {
    throw new Error(formatMissingMotionIntents(missingIntents));
  }
}

export function isMotionIntent(intent: string): intent is MotionIntent {
  return (MOTION_INTENTS as readonly string[]).includes(intent);
}

export function getMotionIntent(intent: MotionIntent): MotionContract {
  assertMotionPolicyCoverage();

  const entry = motionByIntent.get(intent);

  if (!entry) {
    return enforceGovernanceOr(
      formatUnknownMotionIntent(intent),
      motionByIntent.get("instant") ?? motionPolicy[0]!
    );
  }

  return entry;
}

export function resolveMotionIntent(
  intent: MotionIntent | undefined,
  fallback: MotionIntent = "instant"
): MotionContract {
  return getMotionIntent(intent ?? fallback);
}

export function getMotionPolicy(): readonly MotionContract[] {
  assertMotionPolicyCoverage();
  return motionPolicy;
}
