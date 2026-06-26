import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from "ai";
import { Document, type DocumentData } from "flexsearch";
import { z } from "zod";
import {
  type ChatUIMessage,
  type SearchTool,
} from "@/components/ai/search";
import {
  resolveDocsOpenRouterApiKey,
  resolveDocsOpenRouterModel,
} from "@/lib/docs-ai-env";
import { getDocsLlmExportPages } from "@/lib/docs-llm-pages.server";

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const size = 50;
  const out: O[] = [];
  for (let index = 0; index < promises.length; index += size) {
    out.push(...(await Promise.all(promises.slice(index, index + size))));
  }
  return out;
}

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: "url",
      index: ["title", "description", "content"],
      store: true,
    },
  });

  const docs = await chunkedAll(
    getDocsLlmExportPages().map(async (page) => {
      if (!("getText" in page.data)) {
        return null;
      }

      return {
        title: page.data.title,
        description: page.data.description ?? "",
        url: page.url,
        content: await page.data.getText("processed"),
      } satisfies CustomDocument;
    })
  );

  for (const doc of docs) {
    if (doc) {
      search.add(doc);
    }
  }

  return search;
}

const searchServer = createSearchServer();

const systemPrompt = [
  "You are an AI assistant for the Afenda documentation site (@afenda/docs).",
  "Use the `search` tool to retrieve relevant docs context before answering when needed.",
  "The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.",
  "If you cannot find the answer in search results, say you do not know and suggest a better search query.",
].join("\n");

const searchTool = tool({
  description: "Search the docs content and return raw JSON results.",
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;
    return await search.searchAsync(query, { limit, merge: true, enrich: true });
  },
}) satisfies SearchTool;

export async function POST(req: Request): Promise<Response> {
  const apiKey = resolveDocsOpenRouterApiKey();
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Ask AI is not configured. Set OPENROUTER_API_KEY on the docs deployment.",
      },
      { status: 503 }
    );
  }

  const openrouter = createOpenRouter({ apiKey });

  const reqJson = (await req.json()) as { messages?: ChatUIMessage[] };

  const result = streamText({
    model: openrouter.chat(resolveDocsOpenRouterModel()),
    stopWhen: stepCountIs(5),
    tools: {
      search: searchTool,
    },
    messages: [
      { role: "system", content: systemPrompt },
      ...(await convertToModelMessages<ChatUIMessage>(reqJson.messages ?? [], {
        convertDataPart(part) {
          if (part.type === "data-client") {
            return {
              type: "text",
              text: `[Client Context: ${JSON.stringify(part.data)}]`,
            };
          }
        },
      })),
    ],
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}
