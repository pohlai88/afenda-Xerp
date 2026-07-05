export type ClassValue =
  | ClassValue[]
  | Record<string, boolean | null | undefined>
  | boolean
  | null
  | string
  | undefined;

function appendClassValue(value: ClassValue, output: string[]): void {
  if (!value) {
    return;
  }

  if (typeof value === "string") {
    output.push(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      appendClassValue(item, output);
    }
    return;
  }

  if (typeof value === "object") {
    for (const [className, enabled] of Object.entries(value)) {
      if (enabled) {
        output.push(className);
      }
    }
  }
}

export function cn(...values: readonly ClassValue[]): string {
  const output: string[] = [];

  for (const value of values) {
    appendClassValue(value, output);
  }

  return output.join(" ");
}
