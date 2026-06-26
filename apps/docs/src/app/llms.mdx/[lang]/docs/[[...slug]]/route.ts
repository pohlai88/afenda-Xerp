import { getLLMText } from "@/lib/get-llm-text";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import {
  assertDocsOpenApiPageAvailable,
  shouldGenerateDocsOpenApiPage,
} from "@/lib/openapi.server";
import { source } from "@/lib/source";
import { notFound } from "next/navigation";

export const revalidate = false;

interface LlmMdxRouteParams {
  readonly lang: string;
  readonly slug?: readonly string[];
}

function isDocsLocale(value: string): value is DocsLocale {
  return (docsLocales as readonly string[]).includes(value);
}

export async function GET(
  _request: Request,
  context: { params: Promise<LlmMdxRouteParams> }
): Promise<Response> {
  const { slug, lang: rawLang } = await context.params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;
  assertDocsOpenApiPageAvailable(slug, lang);

  const page = source.getPage([...(slug ?? [])], lang);
  if (!page) {
    notFound();
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams(): LlmMdxRouteParams[] {
  return source.generateParams().filter(shouldGenerateDocsOpenApiPage);
}
