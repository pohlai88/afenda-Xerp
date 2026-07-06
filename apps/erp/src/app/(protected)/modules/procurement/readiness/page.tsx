import { ErpPageSurfaceLayout } from "@/components/presentation/erp-page-surface-layout.client";
import { ProcurementReadinessComposer } from "@/components/procurement/procurement-readiness-composer.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import type { ProcurementReadinessTableRow } from "@/lib/presentation/procurement-readiness-table-row";
import { loadProcurementFoundationReadinessPage } from "@/lib/procurement/load-procurement-foundation-readiness-page.server";

export const metadata = {
  title: "Procurement foundation readiness",
};

function mapAttestationRowsToTableRows(
  rows: readonly {
    readonly label: string;
    readonly sliceId: string;
    readonly status: string;
  }[]
): readonly ProcurementReadinessTableRow[] {
  return rows.map((row) => ({
    id: row.sliceId,
    label: row.label,
    sliceId: row.sliceId,
    status: row.status,
  }));
}

export default async function ProcurementFoundationReadinessPage() {
  const layout = getErpSurfaceLayoutByRoute("/modules/procurement/readiness");
  const data = await loadProcurementFoundationReadinessPage();

  if (data.kind === "error") {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">{data.message}</p>
      </main>
    );
  }

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description: "Procurement module readiness checklist.",
    title: "Procurement readiness",
  };

  return (
    <ErpPageSurfaceLayout
      description={`${fixture.description ?? ""} Spine delegate ${data.spineDelegate}.`}
      state={fixture.defaultState}
      title={fixture.title}
    >
      <ProcurementReadinessComposer
        data={mapAttestationRowsToTableRows(data.attestationRows)}
        description={`Tenant ${data.tenantId} · correlation ${data.correlationId}`}
        title={data.title}
      />
    </ErpPageSurfaceLayout>
  );
}
