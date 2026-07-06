import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2/clients";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ModuleDocumentRouteParams } from "@/lib/lab/contracts";
import {
  loadModuleDocumentPage,
  resolveModuleDocumentRoute,
} from "@/lib/lab/load-module-document-page.server";
import { ModuleDocumentOverviewPanel } from "./_components/module-document-overview-panel";
import { ModuleDocumentProofPanel } from "./_components/module-document-proof-panel";
import { ModuleDocumentStatePanel } from "./_components/module-document-state-panel";

interface ModuleDocumentPageProps {
  readonly params: Promise<ModuleDocumentRouteParams>;
}

export async function generateMetadata({
  params,
}: ModuleDocumentPageProps): Promise<Metadata> {
  const routeParams = await params;
  const routeResult = resolveModuleDocumentRoute(routeParams);

  if (routeResult.status === "not-found") {
    return {
      title: "Module document not found",
      description:
        "The requested route-lab module document fixture does not exist or does not match the governed route contract.",
      robots: {
        follow: false,
        index: false,
      },
    };
  }

  const { pageData, status } = routeResult;

  return {
    title: `${pageData.documentLabel} ${pageData.surfaceLabel} surface`,
    description: pageData.stateSummary,
    alternates: {
      canonical: pageData.canonicalHref,
    },
    openGraph: {
      description: pageData.stateSummary,
      images: [
        {
          alt: pageData.previewImage.alt,
          height: pageData.previewImage.height,
          url: pageData.previewImage.src,
          width: pageData.previewImage.width,
        },
      ],
      title: `${pageData.documentLabel} · ${pageData.surfaceLabel} · ${pageData.moduleLabel}`,
      type: "article",
    },
    robots: {
      follow: false,
      index: false,
    },
    twitter: {
      card: "summary_large_image",
      description: pageData.stateSummary,
      images: [pageData.previewImage.src],
      title: `${pageData.documentLabel} · ${status} preview`,
    },
  };
}

export default async function ModuleDocumentPage({
  params,
}: ModuleDocumentPageProps) {
  const routeParams = await params;
  const routeResult = await loadModuleDocumentPage(routeParams);

  if (routeResult.status === "not-found") {
    notFound();
  }

  const { pageData } = routeResult;

  return (
    <section className="min-w-0 space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
            Module Document Surface
          </p>
          <h1 className="font-semibold text-3xl tracking-tight">
            {pageData.title}
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            {pageData.description}
          </p>
          <p className="max-w-3xl text-muted-foreground text-sm">
            {pageData.stateSummary}
          </p>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Future ERP integration</CardTitle>
            <CardDescription>{pageData.promotionSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="rounded-2xl bg-muted px-3 py-2 [overflow-wrap:anywhere]">
              ERP target: {pageData.promotion.futureErpPath}
            </p>
            <p className="text-muted-foreground">{pageData.promotion.notes}</p>
          </CardContent>
        </Card>
      </header>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ModuleDocumentOverviewPanel pageData={pageData} />
        <div className="min-w-0 space-y-6">
          <ModuleDocumentStatePanel pageData={pageData} />
          <ModuleDocumentProofPanel pageData={pageData} />
        </div>
      </div>
    </section>
  );
}
