/**
 * Boundary-safe FormData JSON parsing for user-settings server actions.
 */
export function parseFormDataJsonField(
  formData: FormData,
  fieldName: string
): unknown {
  const raw = formData.get(fieldName);

  if (typeof raw !== "string" || raw.length === 0) {
    return;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return;
  }
}
