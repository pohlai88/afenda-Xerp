import type { KnowledgeAtomId } from "@afenda/enterprise-knowledge";
import type { ReactNode } from "react";
import {
  resolveDocsKnowledgeAtomDefinition,
  resolveDocsKnowledgeAtomTitle,
} from "@/lib/knowledge/docs-vocabulary";

export interface DocsKnowledgeAtomBlockProps {
  readonly atomId: KnowledgeAtomId;
}

export function DocsKnowledgeAtomBlock({
  atomId,
}: DocsKnowledgeAtomBlockProps): ReactNode {
  return (
    <figure className="afenda-docs-knowledge-atom-block">
      <dl>
        <dt>
          <code translate="no">{atomId}</code>
        </dt>
        <dd>
          <strong>{resolveDocsKnowledgeAtomTitle(atomId)}</strong>
          {" — "}
          {resolveDocsKnowledgeAtomDefinition(atomId)}
        </dd>
      </dl>
    </figure>
  );
}
