import type { source } from "@/lib/source";

export async function getLLMText(
  page: (typeof source)["$inferPage"]
): Promise<string> {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})\n\n${processed}`;
}

/** ViewOptionsPopover markdown fetch URL — `.mdx` suffix rewritten to the llms route. */
export function resolveDocsLlmMarkdownUrl(pageUrl: string): string {
  return `${pageUrl}.mdx`;
}
