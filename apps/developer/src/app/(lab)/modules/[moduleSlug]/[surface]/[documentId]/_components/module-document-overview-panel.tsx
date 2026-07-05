import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import Image from "next/image";
import type { ModuleDocumentPageData } from "@/lib/lab/contracts";

interface ModuleDocumentOverviewPanelProps {
  readonly pageData: ModuleDocumentPageData;
}

export function ModuleDocumentOverviewPanel({
  pageData,
}: ModuleDocumentOverviewPanelProps) {
  return (
    <Card className="border-border/60 bg-background/92 backdrop-blur">
      <CardHeader>
        <CardTitle>Document route overview</CardTitle>
        <CardDescription>{pageData.routeSummary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-muted/40">
          <Image
            alt={pageData.previewImage.alt}
            className="h-auto w-full"
            height={pageData.previewImage.height}
            loading="eager"
            sizes="(min-width: 1280px) 36rem, (min-width: 768px) 50vw, 100vw"
            src={pageData.previewImage.src}
            width={pageData.previewImage.width}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-muted px-4 py-3">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">
              Module
            </p>
            <p className="mt-2 font-medium text-lg">{pageData.moduleLabel}</p>
          </div>
          <div className="rounded-2xl bg-muted px-4 py-3">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">
              Surface
            </p>
            <p className="mt-2 font-medium text-lg">{pageData.surfaceLabel}</p>
          </div>
          <div className="rounded-2xl bg-muted px-4 py-3">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">
              Document
            </p>
            <p className="mt-2 font-medium text-lg">{pageData.documentLabel}</p>
          </div>
        </div>

        <dl className="grid gap-3">
          {pageData.documentFacts.map((fact) => (
            <div
              className="grid gap-1 rounded-2xl border border-border/60 px-4 py-3"
              key={fact.label}
            >
              <dt className="text-muted-foreground text-xs uppercase tracking-[0.22em]">
                {fact.label}
              </dt>
              <dd className="font-medium text-sm">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
