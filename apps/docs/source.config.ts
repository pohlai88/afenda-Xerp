import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { z } from "zod";
import {
  CATALOG_IDS,
  TASK_ARTICLE_AUDIENCES,
} from "./src/lib/docs-product-catalog.contract";
import { remarkBlockId } from "./src/lib/mdx-plugins/remark-block-id";
import { docsTypeGenerator } from "./src/lib/docs-type-generator";

const blockIdOptions = {
  addDataAttribute: "feedback",
} as const;

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: z.object({
      title: z.string(),
      icon: z.string().optional(),
      description: z.string().optional(),
      full: z.boolean().optional(),
      status: z.enum(["draft", "published"]).optional(),
      noIndex: z.boolean().optional(),
      audience: z.enum(TASK_ARTICLE_AUDIENCES).optional(),
      relatedRoutes: z.array(z.string()).optional(),
      catalogBindings: z.array(z.enum(CATALOG_IDS)).optional(),
      _openapi: z
        .object({
          preload: z.array(z.string()).optional(),
          method: z.string().optional(),
          webhook: z.boolean().optional(),
          deprecated: z.boolean().optional(),
        })
        .optional(),
    }),
    postprocess: {
      extractLinkReferences: true,
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [remarkBlockId, blockIdOptions],
      [
        remarkAutoTypeTable,
        {
          generator: docsTypeGenerator,
          options: { basePath: "." },
        },
      ],
    ],
  },
});
