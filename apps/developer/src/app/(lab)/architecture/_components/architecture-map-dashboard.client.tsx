"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@afenda/shadcn-studio-v2/clients";
import { useState } from "react";
import type { ArchitectureMapPageData } from "@/lib/lab/contracts";
import { ArchitectureCcpStatusPanel } from "./architecture-ccp-status-panel";
import { ArchitectureForceGraphPanel } from "./architecture-force-graph-panel.client";
import { ArchitectureLayerMermaidPanel } from "./architecture-layer-mermaid-panel";
import { ArchitectureTraceabilityTablePanel } from "./architecture-traceability-table-panel";

interface ArchitectureMapDashboardProps {
  readonly pageData: ArchitectureMapPageData;
}

function sliceStatusVariant(
  status: ArchitectureMapPageData["slices"][number]["status"]
): "default" | "outline" | "secondary" {
  switch (status) {
    case "delivered":
      return "default";
    case "in-progress":
      return "secondary";
    default:
      return "outline";
  }
}

function gapSeverityVariant(
  severity: ArchitectureMapPageData["posture"]["gaps"][number]["severity"]
): "default" | "destructive" | "secondary" {
  return severity === "high" ? "destructive" : "secondary";
}

export function ArchitectureMapDashboard({
  pageData,
}: ArchitectureMapDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { counts, gaps } = pageData.posture;

  return (
    <Tabs className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="flex h-auto flex-wrap gap-1">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="graph">Dependency graph</TabsTrigger>
        <TabsTrigger value="surfaces">Surfaces</TabsTrigger>
        <TabsTrigger value="ccps">CCPs</TabsTrigger>
        <TabsTrigger value="slices">Slices</TabsTrigger>
      </TabsList>

      <TabsContent className="space-y-4" value="overview">
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="outline">{counts.moduleSurfaces} ERP surfaces</Badge>
          <Badge variant="outline">{counts.labRoutes} lab routes</Badge>
          <Badge variant={counts.gaps > 0 ? "destructive" : "default"}>
            {counts.gaps} posture gap{counts.gaps === 1 ? "" : "s"}
          </Badge>
          <Badge variant="secondary">
            {counts.slicesDelivered} FSI slice
            {counts.slicesDelivered === 1 ? "" : "s"} delivered
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Target ingress (best practice)</CardTitle>
              <CardDescription>
                Blueprint §8 — contract → loader → spine → page → components →
                studio-v2, attested by mechanical proof
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArchitectureLayerMermaidPanel
                chart={pageData.targetIngressMermaid}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current posture (as-built)</CardTitle>
              <CardDescription>
                Gaps derived from integration-graph.snapshot.json at load time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gaps.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No v1 posture gaps detected for lab promotion or spine wiring.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gap</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Advice</TableHead>
                      <TableHead>Slice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gaps.map((gap) => (
                      <TableRow key={gap.id}>
                        <TableCell className="space-y-1">
                          <p className="font-medium font-mono text-xs">
                            {gap.id}
                          </p>
                          <Badge variant={gapSeverityVariant(gap.severity)}>
                            {gap.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {gap.current}
                        </TableCell>
                        <TableCell className="text-sm">{gap.advice}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{gap.sliceId}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground text-sm">
          Authority chain: North Star → Blueprint → registries → snapshot → this
          dashboard. Snapshot fingerprint:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {pageData.graph.fingerprint}
          </code>{" "}
          · generated {pageData.generatedAtLabel} ·{" "}
          {pageData.graph.nodes.length} nodes · {pageData.graph.edges.length}{" "}
          edges
        </p>
      </TabsContent>

      <TabsContent value="graph">
        {activeTab === "graph" ? (
          <ArchitectureForceGraphPanel graph={pageData.graph} />
        ) : null}
      </TabsContent>

      <TabsContent value="surfaces">
        <ArchitectureTraceabilityTablePanel graph={pageData.graph} />
      </TabsContent>

      <TabsContent value="ccps">
        <ArchitectureCcpStatusPanel graph={pageData.graph} />
      </TabsContent>

      <TabsContent className="space-y-4" value="slices">
        <div className="grid gap-4 md:grid-cols-2">
          {pageData.slices.map((slice) => (
            <Card key={slice.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{slice.id}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{slice.priority}</Badge>
                    <Badge variant={sliceStatusVariant(slice.status)}>
                      {slice.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{slice.summary}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
