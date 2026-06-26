import type { LoaderPlugin } from "fumadocs-core/source";
import type { Item } from "fumadocs-core/page-tree";

function isDraftPageData(data: unknown): boolean {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return "status" in data && (data as { status?: unknown }).status === "draft";
}

/**
 * Hides `status: draft` pages from the sidebar page tree.
 * Draft routes may still SSG when present in content — nav-only filter.
 */
export function docsDraftTreeFilterPlugin(): LoaderPlugin {
  return {
    name: "afenda:docs-draft-tree-filter",
    transformPageTree: {
      file(node: Item, filePath?: string): Item {
        if (!filePath) {
          return node;
        }

        const file = this.storage.read(filePath);
        if (file?.format === "page" && isDraftPageData(file.data)) {
          // Fumadocs page-tree builder omits nodes when file transformer returns undefined.
          return undefined as unknown as Item;
        }

        return node;
      },
    },
  };
}
