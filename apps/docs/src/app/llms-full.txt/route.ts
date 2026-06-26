import { buildDocsLlmFullText } from "@/lib/docs-llm-pages.server";

export const revalidate = false;

export async function GET(): Promise<Response> {
  return new Response(await buildDocsLlmFullText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
