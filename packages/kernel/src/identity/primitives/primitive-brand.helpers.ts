import type { Brand } from "../brand/brand.contract.js";

export function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, T>;
}

export function brandTrimOptional<T extends string>(
  value: string | Brand<string, T> | null | undefined,
  label: string
): Brand<string, T> | null {
  if (value == null) {
    return null;
  }

  return brandTrimRequired(value, label);
}

export function parsePrimitive<T extends string>(
  value: string,
  label: string
): Brand<string, T> {
  return brandTrimRequired(value, label) as Brand<string, T>;
}
