import type { SurfaceType } from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export interface MetadataSurfaceProps {
  readonly id: string;
  readonly type: SurfaceType;
  readonly title: string;
  readonly description?: string;
  readonly context: MetadataUiRenderContext;
  readonly children: ReactNode;
}
