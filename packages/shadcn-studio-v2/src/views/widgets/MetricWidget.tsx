// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { cn } from "../../lib/cn";

export type MetricWidgetTone = "default" | "success" | "warning";

export interface MetricWidgetProps extends ComponentProps<"article"> {
  readonly description?: string;
  readonly label: string;
  readonly tone?: MetricWidgetTone;
  readonly value: string;
}

const METRIC_WIDGET_TONE_CLASSES = {
  default: "text-foreground",
  success: "text-emerald-700 dark:text-emerald-300",
  warning: "text-amber-700 dark:text-amber-300",
} satisfies Record<MetricWidgetTone, string>;

export function metricWidgetValueClassName({
  className,
  tone = "default",
}: Pick<MetricWidgetProps, "className" | "tone"> = {}): string {
  return cn(
    "font-semibold text-2xl tracking-tight",
    METRIC_WIDGET_TONE_CLASSES[tone],
    className
  );
}

export function MetricWidget({
  className,
  description,
  label,
  tone = "default",
  value,
  ...props
}: MetricWidgetProps) {
  return (
    <article {...props} data-slot="metric-widget">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{label}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <p className={metricWidgetValueClassName({ className, tone })}>
            {value}
          </p>
        </CardContent>
      </Card>
    </article>
  );
}
