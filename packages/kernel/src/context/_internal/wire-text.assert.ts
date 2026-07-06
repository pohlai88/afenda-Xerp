/** Shared wire text guards for context assert modules (PAS §4.4). */

export function assertWireRequiredText(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function assertWireOptionalText(
  value: string | null,
  label: string
): void {
  if (value !== null && !value.trim()) {
    throw new Error(`${label} must be null or a non-empty string.`);
  }
}
