import type { ReactNode } from "react";

interface LabRouteLoadingStateProps {
  readonly children: ReactNode;
  readonly description: string;
  readonly eyebrow: string;
  readonly headingLevel?: 1 | 2;
  readonly title: string;
  readonly titleId: string;
}

export function LabRouteLoadingState({
  children,
  description,
  eyebrow,
  headingLevel = 2,
  title,
  titleId,
}: LabRouteLoadingStateProps) {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";
  const headingClassName =
    headingLevel === 1
      ? "font-semibold text-3xl tracking-tight"
      : "font-semibold text-2xl tracking-tight";

  return (
    <section
      aria-busy="true"
      aria-labelledby={titleId}
      aria-live="polite"
      className="space-y-6"
    >
      <div className="space-y-3" role="status">
        <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
          {eyebrow}
        </p>
        <HeadingTag className={headingClassName} id={titleId}>
          {title}
        </HeadingTag>
        <p className="max-w-3xl text-muted-foreground">{description}</p>
        <span className="sr-only">
          Route composition is loading without ERP runtime authority.
        </span>
      </div>
      {children}
    </section>
  );
}
