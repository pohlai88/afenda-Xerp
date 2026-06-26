import {
  createOpenAPI,
  type OpenAPIOptions,
} from "fumadocs-openapi/server";
import { notFound } from "next/navigation";
import { isEnglishOnlyDocsSlug } from "@/lib/docs-nav.contract";
import type { DocsLocale } from "@/lib/i18n";
import { docsDefaultLocale } from "@/lib/i18n";

/** Relative to apps/docs cwd — must match MDX `document=` prop and generator script. */
export const OPENAPI_DOCUMENT_ID =
  "./openapi/afenda-internal-v1.openapi.json" as const;

export type OpenApiDocumentId = typeof OPENAPI_DOCUMENT_ID;

const openApiServerOptions = {
  input: [OPENAPI_DOCUMENT_ID],
} satisfies OpenAPIOptions;

export const openapi = createOpenAPI(openApiServerOptions);

export function assertDocsOpenApiPageAvailable(
  slug: readonly string[] | undefined,
  lang: DocsLocale
): void {
  if (isEnglishOnlyDocsSlug(slug) && lang !== docsDefaultLocale) {
    notFound();
  }
}

export function shouldGenerateDocsOpenApiPage(params: {
  readonly lang: string;
  readonly slug?: readonly string[];
}): boolean {
  if (
    isEnglishOnlyDocsSlug(params.slug) &&
    params.lang !== docsDefaultLocale
  ) {
    return false;
  }

  return true;
}
