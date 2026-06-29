/**
 * PAS-001 amendment — actor kind vocabulary (Kernel NS §3.1 · E12).
 *
 * Distinguishes human, service, system, and delegated-application initiators at wire boundaries.
 * Session resolution and auth runtime live outside kernel — words only.
 */

export const ACTOR_KINDS = [
  "human",
  "service",
  "system",
  "delegated_application",
] as const;

export type ActorKind = (typeof ACTOR_KINDS)[number];

export function isActorKind(value: string): value is ActorKind {
  return (ACTOR_KINDS as readonly string[]).includes(value);
}

export function assertActorKind(value: string): ActorKind {
  if (!isActorKind(value)) {
    throw new Error(
      `ActorKind must be one of: ${ACTOR_KINDS.join(", ")} — received "${value}".`
    );
  }

  return value;
}

export function parseOptionalActorKind(
  value: string | null | undefined
): ActorKind | undefined {
  if (value == null || value === "") {
    return;
  }

  return assertActorKind(value);
}
