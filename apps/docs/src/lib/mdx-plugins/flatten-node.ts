import type { RootContent } from "mdast";

/** Flatten MDAST node text — vendored from Fumadocs remark-block-id utilities. */
export function flattenNode(node: RootContent): string {
  if ("children" in node) {
    return node.children.map(flattenNode).join("");
  }

  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }

  return "";
}
