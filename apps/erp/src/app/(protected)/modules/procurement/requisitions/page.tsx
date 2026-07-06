import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2/clients";
import { ProcurementListToolbar } from "@/components/procurement/procurement-list-toolbar.client";
import { ProcurementRequisitionsComposer } from "@/components/procurement/procurement-requisitions-composer.client";
import { loadProcurementRequisitionsPage } from "@/lib/procurement/load-procurement-requisitions-page.server";
import { mapRequisitionWireToTableRow } from "@/lib/procurement/map-requisition-wire-to-table-row";

export const metadata = {
  title: "Requisitions",
};

export default async function ProcurementRequisitionsPage() {
  const data = await loadProcurementRequisitionsPage();

  if (data.kind === "error") {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">{data.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">
          Requisition workflow is now routed through v2 DataTableSurface and the
          ERP TanStack composer.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total requisitions</CardTitle>
            <CardDescription>Tenant-scoped list rows</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {data.rows.length} rows · {data.spineDelegate}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approved</CardTitle>
            <CardDescription>Route policy status</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {data.rows.filter((row) => row.status === "approved").length} rows
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tenant</CardTitle>
            <CardDescription>Correlation</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {data.tenantId}
          </CardContent>
        </Card>
      </div>
      <ProcurementListToolbar
        createLabel="Create requisition"
        searchLabel="Search requisitions"
      />
      <ProcurementRequisitionsComposer
        data={data.rows.map(mapRequisitionWireToTableRow)}
      />
      <p className="text-muted-foreground text-xs">
        blockId {data.blockId} · correlation {data.correlationId}
      </p>
    </main>
  );
}
