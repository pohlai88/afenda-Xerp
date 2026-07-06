"use client";

import {
  Badge,
  Input,
  Label,
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/shadcn-studio-v2/clients";
import { useMemo, useState } from "react";
import type { IntegrationGraphSnapshotWire } from "@/lib/lab/contracts";
import {
  resolveSurfacePromotionStatus,
  surfaceHasSpineEdge,
} from "@/lib/lab/derive-integration-posture";

interface ArchitectureTraceabilityTablePanelProps {
  readonly graph: IntegrationGraphSnapshotWire;
}

function promotionVariant(
  status: ReturnType<typeof resolveSurfacePromotionStatus>
): "default" | "destructive" | "outline" | "secondary" {
  switch (status) {
    case "matched":
      return "default";
    case "lab-only":
      return "destructive";
    case "erp-only":
      return "secondary";
    default:
      return "outline";
  }
}

export function ArchitectureTraceabilityTablePanel({
  graph,
}: ArchitectureTraceabilityTablePanelProps) {
  const [filter, setFilter] = useState("");

  const surfaces = useMemo(
    () =>
      graph.nodes.filter(
        (node) => node.type === "module-surface" || node.type === "lab-route"
      ),
    [graph.nodes]
  );

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) {
      return surfaces;
    }
    return surfaces.filter(
      (node) =>
        node.label.toLowerCase().includes(query) ||
        node.id.toLowerCase().includes(query) ||
        String(node.metadata?.["routePattern"] ?? "")
          .toLowerCase()
          .includes(query)
    );
  }, [filter, surfaces]);

  return (
    <div className="space-y-4">
      <div className="max-w-md space-y-2">
        <Label htmlFor="architecture-surface-filter">Filter surfaces</Label>
        <Input
          id="architecture-surface-filter"
          onChange={(event) => setFilter(event.target.value)}
          placeholder="surface id, route, or label"
          type="search"
          value={filter}
        />
      </div>
      <ScrollArea className="h-[520px] rounded-xl border">
        <ScrollAreaViewport>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Surface</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead>Spine</TableHead>
                <TableHead>Loader / summary</TableHead>
                <TableHead>Block</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((node) => {
                const promotionStatus = resolveSurfacePromotionStatus(
                  node,
                  graph
                );
                const spineWired =
                  node.type === "module-surface"
                    ? surfaceHasSpineEdge(node.id, graph)
                    : null;

                return (
                  <TableRow key={node.id}>
                    <TableCell>
                      <Badge variant="outline">{node.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{node.label}</TableCell>
                    <TableCell className="max-w-[12rem] truncate text-muted-foreground text-sm">
                      {String(
                        node.metadata?.["routePattern"] ??
                          node.metadata?.["routePath"] ??
                          node.label
                      )}
                    </TableCell>
                    <TableCell>
                      {promotionStatus ? (
                        <Badge variant={promotionVariant(promotionStatus)}>
                          {promotionStatus}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {spineWired === null ? (
                        <span className="text-muted-foreground text-xs">—</span>
                      ) : (
                        <Badge variant={spineWired ? "default" : "destructive"}>
                          {spineWired ? "yes" : "no"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[16rem] truncate text-muted-foreground text-xs">
                      {String(
                        node.metadata?.["loaderPath"] ??
                          node.metadata?.["summary"] ??
                          "—"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {String(node.metadata?.["blockId"] ?? "—")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollAreaViewport>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
