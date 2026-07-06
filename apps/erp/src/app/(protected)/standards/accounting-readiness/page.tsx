import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2";

import { loadAccountingStandardsReadinessPage } from "@/lib/accounting-standards/load-accounting-standards-readiness-page.server";

export const metadata = {
  title: "Accounting standards readiness",
};

export default async function AccountingStandardsReadinessPage() {
  const data = await loadAccountingStandardsReadinessPage();

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
          PAS-003 B20 consumer proof — validatePostingAgainstAccountingStandards
          via {data.spineDelegate}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validation workflow proof</CardTitle>
          <CardDescription>
            Protected route {data.routePattern} resolves tenant context and runs
            standards-backed validation without journal posting.
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
          <p>
            <span className="text-muted-foreground">Aggregate status:</span>{" "}
            {data.aggregateStatus}
          </p>
          <p>
            <span className="text-muted-foreground">
              Authority fingerprint:
            </span>{" "}
            {data.fingerprint}
          </p>
          <p>
            <span className="text-muted-foreground">Evidence snapshots:</span>{" "}
            {data.evidenceSnapshotCount}
          </p>
          <p>
            <span className="text-muted-foreground">Jurisdiction:</span>{" "}
            {data.jurisdictionCode ?? "unresolved"}
          </p>
          <p>
            <span className="text-muted-foreground">Transaction date:</span>{" "}
            {data.transactionDate ?? "not supplied"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consumer attestation chain</CardTitle>
          <CardDescription>
            Contracts-only validation — no ledger mutation (ADR-0010).
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
