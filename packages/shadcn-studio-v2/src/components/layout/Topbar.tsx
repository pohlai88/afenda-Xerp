import { cn } from "../../lib/cn";
import type { TopbarProps, TopbarVariant } from "../../types/layout";
import { TOPBAR_SLOTS } from "../../types/layout";

const TOPBAR_BASE_CLASS =
  "flex min-h-14 items-center gap-3 rounded-lg border border-border px-4 py-3";

const TOPBAR_VARIANT_CLASSES = {
  default: "bg-card text-card-foreground shadow-sm",
  transparent: "border-transparent bg-transparent shadow-none",
} satisfies Record<TopbarVariant, string>;

export function topbarClassName({
  className,
  variant = "default",
}: Pick<TopbarProps, "className" | "variant"> = {}): string {
  return cn(TOPBAR_BASE_CLASS, TOPBAR_VARIANT_CLASSES[variant], className);
}

export function Topbar({
  actions,
  className,
  content,
  controls,
  description,
  heading,
  variant = "default",
  ...props
}: TopbarProps) {
  const hasHeadingArea = heading != null || description != null;
  const hasContentArea = content != null;
  const hasActionArea = controls != null || actions != null;

  return (
    <header
      {...props}
      className={topbarClassName({ className, variant })}
      data-slot={TOPBAR_SLOTS.root}
    >
      {hasHeadingArea ? (
        <div className="min-w-0 shrink" data-slot={TOPBAR_SLOTS.headingArea}>
          {heading == null ? null : (
            <div
              className="truncate font-semibold text-base tracking-tight"
              data-slot={TOPBAR_SLOTS.heading}
            >
              {heading}
            </div>
          )}
          {description == null ? null : (
            <div
              className="truncate text-muted-foreground text-xs"
              data-slot={TOPBAR_SLOTS.description}
            >
              {description}
            </div>
          )}
        </div>
      ) : null}
      {hasContentArea ? (
        <div
          className="flex min-w-0 flex-1 items-center gap-2"
          data-slot={TOPBAR_SLOTS.content}
        >
          {content}
        </div>
      ) : null}
      {hasActionArea ? (
        <div
          className="ml-auto flex shrink-0 items-center gap-2"
          data-slot={TOPBAR_SLOTS.actionArea}
        >
          {controls == null ? null : (
            <div
              className="flex items-center gap-2"
              data-slot={TOPBAR_SLOTS.controls}
            >
              {controls}
            </div>
          )}
          {actions == null ? null : (
            <div
              className="flex items-center gap-2"
              data-slot={TOPBAR_SLOTS.actions}
            >
              {actions}
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
}
