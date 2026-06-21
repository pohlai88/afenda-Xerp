import type { SectionType } from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export interface MetadataSectionProps {
  readonly id: string;
  readonly type: SectionType;
  readonly title?: string;
  readonly description?: string;
  readonly context: MetadataUiRenderContext;
  readonly children?: ReactNode;
}
