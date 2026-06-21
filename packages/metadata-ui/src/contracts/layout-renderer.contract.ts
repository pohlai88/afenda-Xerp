import type { LayoutType } from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export interface MetadataLayoutProps {
  readonly id: string;
  readonly type: LayoutType;
  readonly context: MetadataUiRenderContext;
  readonly children: ReactNode;
}
