import type { LucideIcon, LucideProps } from "lucide-react";
import { InfoIcon, TriangleAlertIcon, UserCheckIcon } from "lucide-react";
import type { ReactNode } from "react";

export type DocsCalloutTone = "note" | "info" | "warn" | "success";

export type DocsCalloutVariant = "rail" | "soft" | "banner";

export interface DocsCalloutProps {
  /** Optional — title-only callouts (alert-11 success pattern) omit body copy. */
  readonly children?: ReactNode;
  readonly icon?: LucideIcon;
  readonly title?: string;
  readonly tone?: DocsCalloutTone;
  readonly variant?: DocsCalloutVariant;
}

const DEFAULT_ICONS: Record<DocsCalloutTone, LucideIcon> = {
  note: InfoIcon,
  info: InfoIcon,
  warn: TriangleAlertIcon,
  success: UserCheckIcon,
};

function CalloutIcon({
  icon: Icon,
  ...props
}: { readonly icon: LucideIcon } & LucideProps) {
  return (
    <span aria-hidden="true" className="afenda-docs-callout__icon">
      <Icon {...props} />
    </span>
  );
}

export function DocsCallout({
  title,
  tone = "note",
  variant = "rail",
  icon,
  children,
}: DocsCalloutProps): ReactNode {
  const IconComponent = icon ?? DEFAULT_ICONS[tone];

  return (
    <aside
      aria-label={title}
      className="afenda-docs-callout"
      data-tone={tone}
      data-variant={variant}
      role={tone === "warn" ? "alert" : "status"}
    >
      <CalloutIcon icon={IconComponent} size={16} strokeWidth={2} />
      <div className="afenda-docs-callout__inner">
        {title ? <p className="afenda-docs-callout__title">{title}</p> : null}
        {children == null ? null : (
          <div className="afenda-docs-callout__body">{children}</div>
        )}
      </div>
    </aside>
  );
}
