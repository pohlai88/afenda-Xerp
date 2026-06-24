import type { ReactNode } from "react";
import { StoryFrame, StoryStack } from "../_storybook/story-frame";

export function DocsPreview({
  children,
  width = "lg",
}: {
  readonly children: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "xl" | "full";
}) {
  return (
    <StoryFrame width={width}>
      <div className="afenda-docs-preview">{children}</div>
    </StoryFrame>
  );
}

export function DocsVariantStack({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <StoryStack gap="lg">{children}</StoryStack>;
}

export function DocsVariantSection({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="afenda-docs-variant-section">
      <p className="afenda-docs-variant-section__label">{label}</p>
      {children}
    </section>
  );
}
