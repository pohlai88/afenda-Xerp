export const PRIMITIVE_GOVERNANCE_ERROR_PREFIX =
  "Governed UI primitive policy violation" as const;

export const CLASS_NAME_POLICY_ERROR_PREFIX =
  "Governed UI className policy violation" as const;

export function primitiveGovernanceError(detail: string): Error {
  return new Error(`${PRIMITIVE_GOVERNANCE_ERROR_PREFIX}. ${detail}`);
}

export function classNamePolicyError(detail: string): Error {
  return new Error(`${CLASS_NAME_POLICY_ERROR_PREFIX}. ${detail}`);
}

export function unknownPrimitiveError(componentName: string): Error {
  return primitiveGovernanceError(
    `Unknown governed component "${componentName}". Register it in GOVERNED_PRIMITIVE_REGISTRY before calling resolvePrimitiveGovernance().`
  );
}

export function invalidSlotError(
  componentName: string,
  slot: string,
  allowed: readonly string[]
): Error {
  return primitiveGovernanceError(
    `Component "${componentName}" does not allow slot "${slot}". Allowed slots: ${allowed.join(", ")}.`
  );
}

export function invalidSlotKeyError(
  componentName: string,
  slotKey: string
): Error {
  return primitiveGovernanceError(
    `Component "${componentName}" does not define slotKey "${slotKey}".`
  );
}
