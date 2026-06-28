export const SERVICE_LEVELS = ["basic", "standard", "premium"] as const;

export type ServiceLevel = (typeof SERVICE_LEVELS)[number];

export function isServiceLevel(value: string): value is ServiceLevel {
  return (SERVICE_LEVELS as readonly string[]).includes(value);
}
