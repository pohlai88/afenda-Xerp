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
          shadcn/studio block pending MCP install — custom Afenda datatables
          removed. Route scaffold only ({data.spineDelegate} · tenant{" "}
          {data.tenantId}).
        </p>
      </div>
    </main>
  );
}
