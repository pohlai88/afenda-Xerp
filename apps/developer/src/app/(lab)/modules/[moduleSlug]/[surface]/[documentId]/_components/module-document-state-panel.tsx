import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import type { ModuleDocumentPageData } from "@/lib/lab/contracts";

interface ModuleDocumentStatePanelProps {
  readonly pageData: ModuleDocumentPageData;
}

const stateCopy = {
  empty: {
    description:
      "The route exists and the composition is valid, but the document payload intentionally demonstrates an empty-state operator screen.",
    title: "Empty-state preview",
  },
  ready: {
    description:
      "The route exists and the composition demonstrates the default ready-state document presentation before ERP authority is connected.",
    title: "Ready-state preview",
  },
  restricted: {
    description:
      "The route exists and the composition intentionally demonstrates a restricted preview without claiming real permission enforcement.",
    title: "Restricted-state preview",
  },
} as const;

export function ModuleDocumentStatePanel({
  pageData,
}: ModuleDocumentStatePanelProps) {
  const copy = stateCopy[pageData.state];

  return (
    <Card className="border-border/60 bg-background/92 backdrop-blur">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
          Route state: {pageData.state}
        </div>
        <div className="rounded-2xl border border-border/60 px-4 py-3 text-sm">
          {pageData.state === "empty"
            ? "The route keeps its loader, metadata, and promotion note even when the document surface has no governed content."
            : null}
          {pageData.state === "ready"
            ? "The route proves the default document composition with optimized media, dynamic metadata, and route-local panels."
            : null}
          {pageData.state === "restricted"
            ? "The route presents a restriction preview as frontend composition only. ERP authorization remains out of scope for the lab."
            : null}
        </div>
      </CardContent>
    </Card>
  );
}
