/**
 * Shared FormData parser for tenant settings tab actions that submit
 * `intent` + JSON `payload` via useActionState forms.
 */
export function parseTenantSettingsPayloadFormData(
  formData: FormData
): unknown {
  const payloadRaw = formData.get("payload");
  let payload: unknown;

  if (typeof payloadRaw === "string" && payloadRaw.length > 0) {
    try {
      payload = JSON.parse(payloadRaw) as unknown;
    } catch {
      payload = undefined;
    }
  }

  return {
    intent: formData.get("intent"),
    payload,
  };
}
