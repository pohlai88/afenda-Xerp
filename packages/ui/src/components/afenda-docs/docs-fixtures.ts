import type { DocsFileTreeNode } from "./docs-file-tree";
import type { DocsInlineTocItem } from "./docs-inline-toc";
import type { DocsPropTableRow } from "./docs-prop-table";

export const SAMPLE_INLINE_TOC: readonly DocsInlineTocItem[] = [
  { title: "Installation", url: "#installation", depth: 2 },
  { title: "Usage", url: "#usage", depth: 2 },
  { title: "Token swap", url: "#token-swap", depth: 3 },
  { title: "Governance", url: "#governance", depth: 2 },
];

export const SAMPLE_PROP_TABLE: readonly DocsPropTableRow[] = [
  {
    name: "title",
    type: "string",
    description: "Card heading shown in the grid.",
    required: true,
  },
  {
    name: "description",
    type: "string",
    description: "Supporting copy under the title.",
  },
  {
    name: "href",
    type: "string",
    description: "Relative docs route.",
    defaultValue: '"/docs"',
  },
  {
    name: "badge",
    type: "string",
    description: "Optional soft badge label.",
  },
];

export const SAMPLE_FILE_TREE: readonly DocsFileTreeNode[] = [
  {
    name: "content/docs",
    kind: "folder",
    children: [
      {
        name: "getting-started",
        kind: "folder",
        children: [
          { name: "index.mdx", kind: "file" },
          { name: "installation.mdx", kind: "file" },
        ],
      },
      { name: "index.mdx", kind: "file" },
      { name: "meta.json", kind: "file", muted: true },
    ],
  },
];

export const SAMPLE_CODE = `export interface DocsGuideCardItem {
  readonly title: string;
  readonly href: string;
}`;

export const SAMPLE_COPY_WORKFLOW_STEPS = [
  {
    title: "Pick a block in Storybook",
    description:
      "Open Afenda Docs, compare variants on porcelain preview tokens.",
  },
  {
    title: "Copy component source",
    description:
      "Move TSX into apps/docs/src/components/blocks/ — zero @afenda/ui runtime in docs.",
  },
  {
    title: "Swap CSS tokens",
    description:
      "Replace --afenda-docs-preview-* with --docs-editorial-* in docs-editorial-blocks.css.",
  },
  {
    title: "Register in mdx.tsx",
    description:
      "Wire the block into Fumadocs MDX and verify pnpm quality:boundaries.",
  },
] as const;

export const SAMPLE_FAQ_ITEMS = [
  {
    title: "What is a collection?",
    content:
      "A typed group of MDX or meta files defined in source.config.ts.",
  },
  {
    title: "Can docs import @afenda/ui?",
    content:
      "No — copy reference blocks and swap preview tokens to --docs-editorial-*.",
  },
  {
    title: "Where do Fumadocs UI primitives run?",
    content: "On the live docs site via mdx.tsx, not in Storybook previews.",
  },
] as const;
