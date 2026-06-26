import { createHash } from "node:crypto";
import Slugger from "github-slugger";
import type { Root, RootContent } from "mdast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { flattenNode } from "@/lib/mdx-plugins/flatten-node";

export interface RemarkBlockIdOptions {
  generateId?: (ctx: { node: RootContent; text: string }) => string;
  shouldGenerate?: (node: RootContent) => boolean | "skip";
  /** Add `data-block="…"` to updated nodes; pass `null` to disable. */
  addDataAttribute?: string | null;
}

/**
 * Generate ID for each block node in Markdown/MDX.
 * Vendored from Fumadocs until exported by the installed fumadocs-core version.
 *
 * @see https://fumadocs.dev/docs/integrations/feedback
 */
export function remarkBlockId({
  generateId,
  addDataAttribute = "default",
  shouldGenerate = (node) => {
    switch (node.type) {
      case "mdxJsxFlowElement":
        return "skip";
      case "paragraph":
      case "image":
      case "listItem":
        return true;
      default:
        return false;
    }
  },
}: RemarkBlockIdOptions = {}): Transformer<Root, Root> {
  return (tree: Root) => {
    const slugger = new Slugger();

    visit(tree, (node) => {
      if (node.type === "root" || node.data?.hProperties?.id) {
        return;
      }

      const resolved = shouldGenerate(node);
      if (resolved === false) {
        return;
      }
      if (resolved === "skip") {
        return "skip";
      }

      const text = flattenNode(node).trim();
      if (text.length === 0) {
        return;
      }

      const id = generateId
        ? slugger.slug(generateId({ node, text }))
        : slugger.slug(
            createHash("sha256").update(text).digest("base64url")
          );

      node.data ??= {};
      node.data.hProperties ??= {};
      node.data.hProperties.id = id;
      if (addDataAttribute) {
        node.data.hProperties["data-block"] = addDataAttribute;
      }
    });
  };
}
