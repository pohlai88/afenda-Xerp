import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import type { SalesDashboardPageData } from "@/lib/lab/contracts";

interface SalesProofPanelProps {
  readonly pageData: SalesDashboardPageData;
}

export function SalesProofPanel({ pageData }: SalesProofPanelProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>{pageData.proof.title}</CardTitle>
        <CardDescription>{pageData.proof.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pageData.proof.checklist.map((item) => (
          <div
            className="rounded-3xl border border-border/70 bg-muted/35 px-4 py-4"
            key={item.title}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-medium">{item.title}</h2>
              <span className="rounded-full bg-background px-3 py-1 text-xs">
                {item.status}
              </span>
            </div>
            <p className="mt-2 text-muted-foreground text-sm">{item.summary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
