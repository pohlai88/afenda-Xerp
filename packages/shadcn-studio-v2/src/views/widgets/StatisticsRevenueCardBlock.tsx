// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import { Badge } from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import { cn } from "../../lib/cn";

export interface RevenueChartPoint {
  readonly day: string;
  readonly fill?: string;
  readonly revenue: number;
}

export interface StatisticsRevenueCardProps {
  readonly amount: string;
  readonly changePercentage: number;
  readonly chartData: readonly RevenueChartPoint[];
  readonly className?: string;
  readonly periodLabel?: string;
  readonly title: string;
}

function getChartMaxValue(chartData: readonly RevenueChartPoint[]): number {
  let maxValue = 0;

  for (const point of chartData) {
    if (point.revenue > maxValue) {
      maxValue = point.revenue;
    }
  }

  return maxValue;
}

export function StatisticsRevenueCardBlock({
  amount,
  changePercentage,
  chartData,
  className,
  periodLabel = "Weekly Report",
  title,
}: StatisticsRevenueCardProps) {
  const chartMaxValue = Math.max(getChartMaxValue(chartData), 1);

  return (
    <article aria-label={title} className={className}>
      <Card>
        <CardContent className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-end">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="font-semibold">{title}</p>
              <p className="text-muted-foreground text-sm">{periodLabel}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-2xl">{amount}</p>
              <Badge className="rounded-sm bg-primary/10 text-primary">
                +{changePercentage}%
              </Badge>
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div
              aria-label={`${title} revenue trend`}
              className="flex h-32 items-end gap-2"
              role="img"
            >
              {chartData.map((point) => {
                const height = Math.max(
                  16,
                  Math.round((point.revenue / chartMaxValue) * 128)
                );

                return (
                  <div
                    className="flex flex-1 flex-col items-center justify-end gap-2"
                    key={`${point.day}-${point.revenue}`}
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "w-full rounded-full bg-primary/80",
                        point.fill
                      )}
                      style={{ height }}
                    />
                    <span className="text-muted-foreground text-xs">
                      {point.day.slice(0, 1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
