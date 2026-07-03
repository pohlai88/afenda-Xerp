import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ProcurementListToolbarBlock as ProcurementListToolbar,
  ProcurementPurchaseOrdersTableBlock as ProcurementPurchaseOrdersTable,
} from "@afenda/shadcn-studio";
import { loadProcurementPurchaseOrdersPage } from "@/lib/procurement/load-procurement-purchase-orders-page.server";

export const metadata = {
  title: "Purchase orders",
};

export default async function ProcurementPurchaseOrdersPage() {
  const data = await loadProcurementPurchaseOrdersPage();

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
          Purchase-order workflow is now routed through governed presentation
          blocks.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total purchase orders</CardTitle>
            <CardDescription>Tenant-scoped list rows</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {data.rows.length} rows · {data.spineDelegate}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open</CardTitle>
            <CardDescription>Route policy status</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {data.rows.filter((row) => row.status === "open").length} rows
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
        createLabel="Create purchase order"
        searchLabel="Search purchase orders"
      />
      <ProcurementPurchaseOrdersTable rows={data.rows} />
      <p className="text-muted-foreground text-xs">
        blockId {data.blockId} · correlation {data.correlationId}
      </p>
    </main>
  );
}
