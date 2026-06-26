import {
  createOpenAPI,
  type OpenAPIOptions,
} from "fumadocs-openapi/server";
import type { DocsLocale } from "@/lib/i18n";

/** Relative to apps/docs cwd — must match MDX `document=` prop and generator script. */
export const OPENAPI_DOCUMENT_ID =
  "./openapi/afenda-internal-v1.openapi.json" as const;

export type OpenApiDocumentId = typeof OPENAPI_DOCUMENT_ID;

const openApiServerOptions = {
  input: [OPENAPI_DOCUMENT_ID],
} satisfies OpenAPIOptions;

export const openapi = createOpenAPI(openApiServerOptions);

export function assertDocsOpenApiPageAvailable(
  _slug: readonly string[] | undefined,
  _lang: DocsLocale
): void {
  // zh and en api-reference operation pages are generated for all locales.
}

export function shouldGenerateDocsOpenApiPage(_params: {
  readonly lang: string;
  readonly slug?: readonly string[];
}): boolean {
  return true;
}
