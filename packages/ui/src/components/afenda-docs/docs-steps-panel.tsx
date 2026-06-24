"use client";

import type { ReactNode } from "react";
import { useId } from "react";

export interface DocsStepsPanelStep {
  readonly description: string;
  readonly title: string;
}

export type DocsStepsPanelVariant = "numbered" | "timeline" | "compact";

export interface DocsStepsPanelProps {
  readonly lead?: string;
  readonly steps: readonly DocsStepsPanelStep[];
  readonly title: string;
  readonly variant?: DocsStepsPanelVariant;
}

export function DocsStepsPanel({
  title,
  lead,
  steps,
  variant = "numbered",
}: DocsStepsPanelProps): ReactNode {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="afenda-docs-steps-panel"
      data-variant={variant}
    >
      <header className="afenda-docs-steps-panel__header">
        <h2 className="afenda-docs-steps-panel__title" id={titleId}>
          {title}
        </h2>
        {lead ? <p className="afenda-docs-steps-panel__lead">{lead}</p> : null}
      </header>
      <ol className="afenda-docs-steps-panel__list">
        {steps.map((step, index) => (
          <li className="afenda-docs-steps-panel__step" key={step.title}>
            <span aria-hidden="true" className="afenda-docs-steps-panel__index">
              {index + 1}
            </span>
            <div className="afenda-docs-steps-panel__content">
              <h3 className="afenda-docs-steps-panel__step-title">
                {step.title}
              </h3>
              <p className="afenda-docs-steps-panel__step-body">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
