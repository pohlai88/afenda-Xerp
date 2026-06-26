import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { z } from "zod";
import { docsTypeGenerator } from "./src/lib/docs-type-generator";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      full: z.boolean().optional(),
      status: z.enum(["draft", "published"]).optional(),
      noIndex: z.boolean().optional(),
    }),
    postprocess: {
      extractLinkReferences: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkAutoTypeTable, { generator: docsTypeGenerator }]],
  },
});
