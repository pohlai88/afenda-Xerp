import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";

import { loadProcurementFoundationReadinessPage } from "@/lib/procurement/load-procurement-foundation-readiness-page.server";

export const metadata = {
  title: "Procurement foundation readiness",
};

export default async function ProcurementFoundationReadinessPage() {
  const data = await loadProcurementFoundationReadinessPage();

  if (data.kind === "error") {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">{data.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">
          ERP-PROC-OP-005 context spine consumer proof — PAS-001A IS-002
          assembly via {data.spineDelegate}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operating context proof</CardTitle>
          <CardDescription>
            Protected route {data.routePattern} resolved tenant context through
            the canonical spine (no header bypass).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p>
            <span className="text-muted-foreground">Tenant:</span>{" "}
            {data.tenantId}
          </p>
          <p>
            <span className="text-muted-foreground">Correlation:</span>{" "}
            {data.correlationId}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foundation attestation chain</CardTitle>
          <CardDescription>
            Scaffold-only — business runtime remains deferred per ADR-0031.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-sm">
            {data.attestationRows.map((row) => (
              <li className="flex justify-between gap-4" key={row.sliceId}>
                <span>{row.label}</span>
                <span className="text-muted-foreground">
                  {row.sliceId} · {row.status}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
