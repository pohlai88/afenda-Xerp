import { createOpenAPI } from "fumadocs-openapi/server";

/** Relative to apps/docs cwd — must match MDX `document=` prop and generator script. */
export const OPENAPI_DOCUMENT_ID = "./openapi/afenda-internal-v1.openapi.json";

export const openapi = createOpenAPI({
  input: [OPENAPI_DOCUMENT_ID],
});
