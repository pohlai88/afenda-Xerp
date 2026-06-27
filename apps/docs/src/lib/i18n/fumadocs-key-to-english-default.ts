/** Derive English default copy from a Fumadocs translation label key. */
export function fumadocsLabelKeyToEnglishDefault(key: string): string {
  if (key === "displayName") {
    return "English";
  }

  let value = key;
  while (/\([^)]*\)\s*$/.test(value)) {
    value = value.replace(/\([^)]*\)\s*$/, "").trim();
  }

  return value.length > 0 ? value : key;
}
