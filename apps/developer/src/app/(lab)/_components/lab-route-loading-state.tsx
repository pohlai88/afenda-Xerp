import type { ReactNode } from "react";

interface LabRouteLoadingStateProps {
  readonly children: ReactNode;
  readonly description: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly titleId: string;
}

export function LabRouteLoadingState({
  children,
  description,
  eyebrow,
  title,
  titleId,
}: LabRouteLoadingStateProps) {
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
        <h2 className="font-semibold text-2xl tracking-tight" id={titleId}>
          {title}
        </h2>
        <p className="max-w-3xl text-muted-foreground">{description}</p>
        <span className="sr-only">
          Route composition is loading without ERP runtime authority.
        </span>
      </div>
      {children}
    </section>
  );
}
