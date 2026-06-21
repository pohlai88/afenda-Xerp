import type { MetadataLayoutProps } from "../contracts/layout-renderer.contract.js";

export function MetadataLayout({ id, type, context, children }: MetadataLayoutProps) {
  return (
    <div
      className="metadata-layout"
      data-metadata-density={context.runtime.density}
      data-metadata-layout={type}
      data-slot="metadata-layout"
      id={id}
    >
      {children}
    </div>
  );
}

export type { MetadataLayoutProps } from "../contracts/layout-renderer.contract.js";
