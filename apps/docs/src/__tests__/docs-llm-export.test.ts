import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveDocsLlmMarkdownUrl } from "@/lib/get-llm-text";

const appRoot = process.cwd();

describe("@afenda/docs LLM markdown export", () => {
  it("enables includeProcessedMarkdown in source.config.ts", () => {
    const sourceConfig = readFileSync(
      join(appRoot, "source.config.ts"),
      "utf8"
    );

    expect(sourceConfig).toContain("includeProcessedMarkdown: true");
  });

  it("exports getLLMText using page.data.getText('processed')", () => {
    const llmTextSource = readFileSync(
      join(appRoot, "src/lib/get-llm-text.ts"),
      "utf8"
    );

    expect(llmTextSource).toContain("getText(\"processed\")");
    expect(llmTextSource).toContain("export async function getLLMText");
  });

  it("ships locale-aware llms.mdx route with SSG params and markdown response", () => {
    const routePath = join(
      appRoot,
      "src/app/llms.mdx/[lang]/docs/[[...slug]]/route.ts"
    );

    expect(existsSync(routePath)).toBe(true);

    const routeSource = readFileSync(routePath, "utf8");
    expect(routeSource).toContain("export async function GET");
    expect(routeSource).toContain("generateStaticParams");
    expect(routeSource).toContain("getLLMText");
    expect(routeSource).toContain("text/markdown");
    expect(routeSource).toContain("shouldGenerateDocsOpenApiPage");
  });

  it("passes markdownUrl to ViewOptionsPopover on the docs slug page", () => {
    const slugPage = readFileSync(
      join(appRoot, "src/app/[lang]/docs/[[...slug]]/page.tsx"),
      "utf8"
    );

    expect(slugPage).toContain("resolveDocsLlmMarkdownUrl");
    expect(slugPage).toContain(
      "const markdownUrl = resolveDocsLlmMarkdownUrl(page.url)"
    );
    expect(slugPage).toContain("markdownUrl={markdownUrl}");
  });

  it("rewrites .mdx suffix docs URLs to the llms route", () => {
    const nextConfig = readFileSync(join(appRoot, "next.config.ts"), "utf8");

    expect(nextConfig).toContain("/:lang/docs/:path*.mdx");
    expect(nextConfig).toContain("/llms.mdx/:lang/docs/:path*");
  });

  it("negotiates Accept: text/markdown via middleware rewrite", () => {
    const middlewareSource = readFileSync(
      join(appRoot, "src/middleware.ts"),
      "utf8"
    );

    expect(middlewareSource).toContain("isMarkdownPreferred");
    expect(middlewareSource).toContain("rewritePath");
    expect(middlewareSource).toContain("/llms.mdx/{lang}/docs{/*path}");
    expect(middlewareSource).toContain("llms-full\\\\.txt");
    expect(middlewareSource).toContain("llms\\\\.txt");
  });

  it("appends .mdx to page URLs for markdown copy affordance", () => {
    expect(resolveDocsLlmMarkdownUrl("/en/docs/getting-started")).toBe(
      "/en/docs/getting-started.mdx"
    );
  });
});
