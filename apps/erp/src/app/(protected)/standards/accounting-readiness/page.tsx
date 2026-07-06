import { ErpPageSurfaceLayout } from "@/components/presentation/erp-page-surface-layout.client";
import { AccountingReadinessPanel } from "@/components/standards/accounting-readiness-panel.client";
import { loadAccountingStandardsReadinessPage } from "@/lib/accounting-standards/load-accounting-standards-readiness-page.server";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";

export const metadata = {
  title: "Accounting standards readiness",
};

export default async function AccountingStandardsReadinessPage() {
  const layout = getErpSurfaceLayoutByRoute("/standards/accounting-readiness");
  const data = await loadAccountingStandardsReadinessPage();

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
    description:
      "PAS-003 B20 consumer proof for accounting standards validation.",
    title: "Accounting standards readiness",
  };

  return (
    <ErpPageSurfaceLayout
      description={fixture.description}
      state={fixture.defaultState}
      title={fixture.title}
    >
      <AccountingReadinessPanel
        aggregateStatus={data.aggregateStatus}
        attestationRows={data.attestationRows}
        correlationId={data.correlationId}
        evidenceSnapshotCount={data.evidenceSnapshotCount}
        fingerprint={data.fingerprint}
        jurisdictionCode={data.jurisdictionCode}
        routePattern={data.routePattern}
        spineDelegate={data.spineDelegate}
        tenantId={data.tenantId}
        transactionDate={data.transactionDate}
      />
    </ErpPageSurfaceLayout>
  );
}
