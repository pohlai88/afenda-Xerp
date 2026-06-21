import type { MetadataSectionProps } from "../contracts/section-renderer.contract.js";

export function MetadataSection({
  id,
  type,
  title,
  description,
  context,
  children,
}: MetadataSectionProps) {
  return (
    <section
      aria-labelledby={title ? `${id}-title` : undefined}
      className="metadata-section"
      data-metadata-section={type}
      data-metadata-state={context.runtime.state}
      data-slot="metadata-section"
      id={id}
    >
      {title ? <h2 id={`${id}-title`}>{title}</h2> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </section>
  );
}

export type { MetadataSectionProps } from "../contracts/section-renderer.contract.js";
