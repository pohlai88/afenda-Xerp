import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isDocsAskAiConfigured } from "@/lib/docs-ai-env";

const appRoot = process.cwd();

describe("@afenda/docs AI and LLM integration", () => {
  it("ships llms.txt and llms-full.txt routes", () => {
    expect(existsSync(join(appRoot, "src/app/llms.txt/route.ts"))).toBe(true);
    expect(existsSync(join(appRoot, "src/app/llms-full.txt/route.ts"))).toBe(
      true
    );

    const llmsTxt = readFileSync(
      join(appRoot, "src/app/llms.txt/route.ts"),
      "utf8"
    );
    const llmsFull = readFileSync(
      join(appRoot, "src/app/llms-full.txt/route.ts"),
      "utf8"
    );

    expect(llmsTxt).toContain("llms(source).index()");
    expect(llmsFull).toContain("buildDocsLlmFullText");
  });

  it("wires Ask AI chat route with OpenRouter and flexsearch tool", () => {
    const chatRoute = readFileSync(
      join(appRoot, "src/app/api/chat/route.ts"),
      "utf8"
    );

    expect(chatRoute).toContain("createOpenRouter");
    expect(chatRoute).toContain("streamText");
    expect(chatRoute).toContain("flexsearch");
    expect(chatRoute).toContain("resolveDocsOpenRouterApiKey");
  });

  it("mounts AISearch chrome in docs layout", () => {
    const layout = readFileSync(
      join(appRoot, "src/app/[lang]/docs/layout.tsx"),
      "utf8"
    );

    expect(layout).toContain("DocsAiSearchChrome");
    expect(
      readFileSync(
        join(appRoot, "src/components/docs-ai-search-chrome.client.tsx"),
        "utf8"
      )
    ).toContain("AISearch");
  });

  it("uses MarkdownCopyButton and enhanced ViewOptionsPopover on slug page", () => {
    const slugPage = readFileSync(
      join(appRoot, "src/app/[lang]/docs/[[...slug]]/page.tsx"),
      "utf8"
    );

    expect(slugPage).toContain("MarkdownCopyButton");
    expect(slugPage).toContain('@/components/ai/page-actions');
    expect(slugPage).toContain("ViewOptionsPopover");
  });

  it("documents OPENROUTER env in apps/docs/.env.example", () => {
    const envExample = readFileSync(join(appRoot, ".env.example"), "utf8");
    expect(envExample).toContain("OPENROUTER_API_KEY");
    expect(envExample).toContain("OPENROUTER_MODEL");
  });

  it("reports Ask AI configuration from OPENROUTER_API_KEY", () => {
    const previous = process.env["OPENROUTER_API_KEY"];
    process.env["OPENROUTER_API_KEY"] = "test-key";
    expect(isDocsAskAiConfigured()).toBe(true);
    delete process.env["OPENROUTER_API_KEY"];
    expect(isDocsAskAiConfigured()).toBe(false);
    if (previous !== undefined) {
      process.env["OPENROUTER_API_KEY"] = previous;
    }
  });
});
