import type { ReactNode } from "react";

export interface SystemAdminFormSectionProps {
  readonly children: ReactNode;
  readonly description?: string;
  readonly sectionId: string;
  readonly title: string;
}

export function SystemAdminFormSection({
  children,
  description,
  sectionId,
  title,
}: SystemAdminFormSectionProps) {
  const titleId = `system-admin-form-section-${sectionId}`;

  return (
    <section
      aria-labelledby={titleId}
      className="erp-system-admin-form-section"
    >
      <header className="erp-system-admin-form-section__header">
        <h2 className="erp-system-admin-form-section__title" id={titleId}>
          {title}
        </h2>
        {description ? (
          <p className="erp-system-admin-form-section__description">
            {description}
          </p>
        ) : null}
      </header>
      <div className="erp-system-admin-form-section__fields">{children}</div>
    </section>
  );
}
