import type { ReactNode } from "react";

export interface DocsFileTreeNode {
  readonly name: string;
  readonly kind: "file" | "folder";
  readonly muted?: boolean;
  readonly children?: readonly DocsFileTreeNode[];
}

export type DocsFileTreeVariant = "default" | "compact";

export interface DocsFileTreeProps {
  readonly nodes: readonly DocsFileTreeNode[];
  readonly variant?: DocsFileTreeVariant;
}

function DocsFileTreeBranch({
  nodes,
}: {
  readonly nodes: readonly DocsFileTreeNode[];
}): ReactNode {
  return (
    <ul className="afenda-docs-file-tree__branch">
      {nodes.map((node) => (
        <li
          key={node.name}
          className="afenda-docs-file-tree__node"
          data-kind={node.kind}
          data-muted={node.muted ? "true" : undefined}
        >
          <span className="afenda-docs-file-tree__label">{node.name}</span>
          {node.children && node.children.length > 0 ? (
            <DocsFileTreeBranch nodes={node.children} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function DocsFileTree({
  nodes,
  variant = "default",
}: DocsFileTreeProps): ReactNode {
  return (
    <div className="afenda-docs-file-tree" data-variant={variant}>
      <DocsFileTreeBranch nodes={nodes} />
    </div>
  );
}
