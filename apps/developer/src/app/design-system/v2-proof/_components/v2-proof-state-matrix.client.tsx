"use client";

import {
  AUTH_SHELL_SLOTS,
  DATA_TABLE_SURFACE_SLOTS,
  EVIDENCE_WIDGET_SLOTS,
  FORM_SURFACE_SLOTS,
  METRIC_WIDGET_SLOTS,
  PAGE_SURFACE_SLOTS,
} from "@afenda/shadcn-studio-v2";
import {
  AuthShell,
  DataTableSurface,
  EvidenceWidget,
  FormSurface,
  MetricWidget,
  PageSurface,
} from "@afenda/shadcn-studio-v2/clients";
import {
  V2_PROOF_STATE_MATRIX,
  v2ProofStateMatrixAuth,
  v2ProofStateMatrixEvidence,
  v2ProofStateMatrixForm,
  v2ProofStateMatrixMeta,
  v2ProofStateMatrixMetric,
  v2ProofStateMatrixPage,
  v2ProofStateMatrixTable,
  v2ProofTableFixture,
} from "@/lib/v2-proof/fixtures";

const AUTH_MATRIX_PREVIEW_CLASS =
  "mx-auto flex min-h-0 w-full max-w-md items-stretch justify-start bg-transparent px-0 py-0 text-foreground";

function StateMatrixFamilyHeading({
  label,
  proofFamily,
}: {
  readonly label: string;
  readonly proofFamily: string;
}) {
  return (
    <h3
      className="font-medium text-sm tracking-tight"
      data-proof-state-family={proofFamily}
    >
      {label}
    </h3>
  );
}

export function V2ProofStateMatrix() {
  return (
    <section className="space-y-8" data-proof="state-matrix">
      <div className="space-y-2">
        <h2 className="font-semibold text-lg tracking-tight">
          {v2ProofStateMatrixMeta.title}
        </h2>
        <p className="max-w-3xl text-muted-foreground text-sm">
          {v2ProofStateMatrixMeta.description}
        </p>
      </div>

      {V2_PROOF_STATE_MATRIX.map((group) => (
        <div
          className="space-y-4"
          data-proof-state-group={group.family}
          key={group.family}
        >
          <StateMatrixFamilyHeading
            label={group.label}
            proofFamily={group.family}
          />

          {group.family === "page" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div data-proof-state="page-loading">
                <PageSurface
                  description={v2ProofStateMatrixPage.loading.description}
                  state="loading"
                  title={v2ProofStateMatrixPage.loading.title}
                >
                  <p className="text-muted-foreground text-sm">
                    Ready content is replaced when state is non-ready.
                  </p>
                </PageSurface>
              </div>
              <div data-proof-state="page-error">
                <PageSurface
                  description={v2ProofStateMatrixPage.error.description}
                  state="error"
                  title={v2ProofStateMatrixPage.error.title}
                >
                  <p className="text-muted-foreground text-sm">
                    Ready content is replaced when state is non-ready.
                  </p>
                </PageSurface>
              </div>
            </div>
          ) : null}

          {group.family === "metric" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div
                data-proof-state="metric-empty"
                data-slot={METRIC_WIDGET_SLOTS.root}
              >
                <MetricWidget
                  description={v2ProofStateMatrixMetric.empty.description}
                  label={v2ProofStateMatrixMetric.empty.label}
                  state="empty"
                />
              </div>
              <div
                data-proof-state="metric-unavailable"
                data-slot={METRIC_WIDGET_SLOTS.root}
              >
                <MetricWidget
                  description={v2ProofStateMatrixMetric.unavailable.description}
                  label={v2ProofStateMatrixMetric.unavailable.label}
                  state="unavailable"
                />
              </div>
            </div>
          ) : null}

          {group.family === "evidence" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div
                data-proof-state="evidence-loading"
                data-slot={EVIDENCE_WIDGET_SLOTS.root}
              >
                <EvidenceWidget
                  description={v2ProofStateMatrixEvidence.loading.description}
                  label={v2ProofStateMatrixEvidence.loading.label}
                  state="loading"
                />
              </div>
              <div
                data-proof-state="evidence-error"
                data-slot={EVIDENCE_WIDGET_SLOTS.root}
              >
                <EvidenceWidget
                  description={v2ProofStateMatrixEvidence.error.description}
                  label={v2ProofStateMatrixEvidence.error.label}
                  state="error"
                />
              </div>
            </div>
          ) : null}

          {group.family === "data-table" ? (
            <div
              data-proof-state="data-table-empty"
              data-slot={DATA_TABLE_SURFACE_SLOTS.root}
            >
              <DataTableSurface
                caption={v2ProofStateMatrixTable.caption}
                columns={v2ProofTableFixture.columns}
                description={v2ProofStateMatrixTable.description}
                rows={[]}
                state="empty"
                title={v2ProofStateMatrixTable.title}
              />
            </div>
          ) : null}

          {group.family === "form" ? (
            <div
              data-proof-state="form-unavailable"
              data-slot={FORM_SURFACE_SLOTS.root}
            >
              <FormSurface
                description={v2ProofStateMatrixForm.description}
                state="unavailable"
                title={v2ProofStateMatrixForm.title}
              />
            </div>
          ) : null}

          {group.family === "auth-shell" ? (
            <div
              className="overflow-hidden rounded-lg border border-border border-dashed bg-muted/10 p-4"
              data-proof-state="auth-shell-loading"
              data-v2-proof-surface="auth-shell-matrix"
            >
              <AuthShell
                className={AUTH_MATRIX_PREVIEW_CLASS}
                description={v2ProofStateMatrixAuth.description}
                state="loading"
                title={v2ProofStateMatrixAuth.title}
              >
                <p
                  className="text-center text-muted-foreground text-xs"
                  data-slot={AUTH_SHELL_SLOTS.content}
                >
                  Ready auth fields render only when state is ready.
                </p>
              </AuthShell>
            </div>
          ) : null}
        </div>
      ))}

      <p
        className="text-muted-foreground text-xs"
        data-proof="state-matrix-index"
      >
        Slot markers: {PAGE_SURFACE_SLOTS.state}, {METRIC_WIDGET_SLOTS.state},{" "}
        {EVIDENCE_WIDGET_SLOTS.state}, {DATA_TABLE_SURFACE_SLOTS.state},{" "}
        {FORM_SURFACE_SLOTS.state}, {AUTH_SHELL_SLOTS.state}.
      </p>
    </section>
  );
}
