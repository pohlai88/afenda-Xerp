"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2/clients";
import type { IntegrationGraphSnapshotWire } from "@/lib/lab/contracts";

interface ArchitectureCcpStatusPanelProps {
  readonly graph: IntegrationGraphSnapshotWire;
}

export function ArchitectureCcpStatusPanel({
  graph,
}: ArchitectureCcpStatusPanelProps) {
  const ccpNodes = graph.nodes.filter((node) => node.type === "ccp");

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        CCP cards declare registry-attested controls. Pass/fail requires local
        or CI gate execution — not evaluated in the browser.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ccpNodes.map((node) => (
          <Card key={node.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{node.id}</CardTitle>
                <Badge variant="secondary">CCP</Badge>
              </div>
              <CardDescription>
                {String(node.metadata?.["control"] ?? node.label)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Owner:</span>{" "}
                {String(node.metadata?.["owner"] ?? "full-stack-integration")}
              </p>
              <p className="break-all rounded-md bg-muted px-2 py-1 font-mono text-xs">
                pnpm {String(node.metadata?.["gateCommand"] ?? "—")}
              </p>
              <Badge variant="outline">Declared</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
