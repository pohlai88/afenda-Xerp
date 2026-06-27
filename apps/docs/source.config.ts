import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { remarkMdxFiles } from "fumadocs-core/mdx-plugins/remark-mdx-files";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import jsonSchema from "fumadocs-mdx/plugins/json-schema";
import lastModified from "fumadocs-mdx/plugins/last-modified";
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
    schema: pageSchema.extend({
      icon: z.string().optional(),
      full: z.boolean().optional(),
      status: z.enum(["draft", "published"]).optional(),
      noIndex: z.boolean().optional(),
      docsType: z.enum(["generated-evidence"]).optional(),
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
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      remarkMdxMermaid,
      remarkMdxFiles,
      [remarkBlockId, blockIdOptions],
      [
        remarkAutoTypeTable,
        {
          generator: docsTypeGenerator,
          options: { basePath: "." },
        },
      ],
    ],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  plugins: [
    lastModified({
      filter: (collection) => collection === "docs",
    }),
    jsonSchema({ insert: true }),
  ],
});
