import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import type { ModuleDocumentPageData } from "@/lib/lab/contracts";

interface ModuleDocumentProofPanelProps {
  readonly pageData: ModuleDocumentPageData;
}

export function ModuleDocumentProofPanel({
  pageData,
}: ModuleDocumentProofPanelProps) {
  return (
    <Card className="border-border/60 bg-background/92 backdrop-blur">
      <CardHeader>
        <CardTitle>Module route proof</CardTitle>
        <CardDescription>{pageData.promotionSummary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-muted px-4 py-3 text-sm [overflow-wrap:anywhere]">
          ERP target: {pageData.promotion.futureErpPath}
        </div>
        <div className="rounded-2xl border border-border/60 px-4 py-3 text-sm [overflow-wrap:anywhere]">
          Future data source: {pageData.promotion.futureDataSource}
        </div>
        <div className="rounded-2xl border border-border/60 border-dashed px-4 py-3 text-sm [overflow-wrap:anywhere]">
          Canonical route: {pageData.canonicalHref}
        </div>
        <ul className="space-y-3">
          {pageData.verificationChecklist.map((item) => (
            <li
              className="rounded-2xl border border-border/60 px-4 py-3"
              key={item.title}
            >
              <p className="font-medium text-sm">{item.title}</p>
              <p className="mt-1 text-muted-foreground text-sm">
                {item.summary}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
