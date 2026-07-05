// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

export interface StatisticsSalesOverviewSide {
  readonly count: string;
  readonly label: string;
  readonly percentage: string;
}

export interface StatisticsSalesOverviewCardProps {
  readonly changePercentage: string;
  readonly className?: string;
  readonly deliveredSide: StatisticsSalesOverviewSide;
  readonly orderSide: StatisticsSalesOverviewSide;
  readonly progressValue: number;
  readonly title: string;
  readonly totalValue: string;
}

function normalizeProgressValue(progressValue: number): number {
  return Math.max(0, Math.min(100, progressValue));
}

function OverviewSide({
  align = "start",
  side,
}: {
  readonly align?: "end" | "start";
  readonly side: StatisticsSalesOverviewSide;
}) {
  const containerClassName =
    align === "end"
      ? "flex flex-col items-end gap-2 text-right"
      : "flex flex-col gap-2";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <p className={containerClassName}>
        <span className="text-muted-foreground text-sm">{side.label}</span>
        <span className="font-medium text-xl">{side.percentage}</span>
      </p>
      <p className={containerClassName}>
        <span className="text-muted-foreground text-sm">{side.count}</span>
      </p>
    </div>
  );
}

export function StatisticsSalesOverviewCardBlock({
  changePercentage,
  className,
  deliveredSide,
  orderSide,
  progressValue,
  title,
  totalValue,
}: StatisticsSalesOverviewCardProps) {
  const normalizedProgressValue = normalizeProgressValue(progressValue);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-sm">{changePercentage}</p>
        </div>
        <p className="font-semibold text-2xl">{totalValue}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <OverviewSide side={orderSide} />
          <div className="flex flex-col items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.24em]">
            <div className="h-10 w-px bg-border" />
            <span>VS</span>
            <div className="h-10 w-px bg-border" />
          </div>
          <OverviewSide align="end" side={deliveredSide} />
        </div>
        <div className="space-y-2">
          <div
            aria-label={`${title} progress`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={normalizedProgressValue}
            className="h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${normalizedProgressValue}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Progress: {normalizedProgressValue}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
