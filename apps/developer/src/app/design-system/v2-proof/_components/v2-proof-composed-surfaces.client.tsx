"use client";

import {
  CONFIRM_DIALOG_SURFACE_SLOTS,
  DATA_TABLE_SURFACE_SLOTS,
  EVIDENCE_WIDGET_SLOTS,
  FORM_SURFACE_SLOTS,
  Input,
  METRIC_WIDGET_SLOTS,
  PAGE_SURFACE_SLOTS,
  SETTINGS_SURFACE_SLOTS,
} from "@afenda/shadcn-studio-v2";
import {
  Button,
  ConfirmDialogSurface,
  DataTableSurface,
  EvidenceWidget,
  FormSurface,
  MetricWidget,
  PageSurface,
  SettingsSurface,
} from "@afenda/shadcn-studio-v2/clients";
import {
  v2ProofDialogFixture,
  v2ProofEvidenceFixture,
  v2ProofFormFixture,
  v2ProofMetricFixture,
  v2ProofSettingsFixture,
  v2ProofTableFixture,
} from "@/lib/v2-proof/fixtures";
import { V2ProofStateMatrix } from "./v2-proof-state-matrix.client";

export function V2ProofComposedSurfaces() {
  return (
    <>
      <section className="space-y-4" data-proof="page-surface">
        <PageSurface
          description="PageSurface pattern with toolbar slot and ready content."
          title="Page surface pattern"
          toolbar={
            <Button size="sm" type="button" variant="secondary">
              Static action
            </Button>
          }
        >
          <p className="text-muted-foreground text-sm">
            Shell chrome above is rendered by AppShell01 (Sidebar + Topbar).
            This block proves PageSurface slots independently.
          </p>
        </PageSurface>
      </section>

      <section className="grid gap-4 md:grid-cols-2" data-proof="widgets">
        <div data-slot={METRIC_WIDGET_SLOTS.root}>
          <MetricWidget
            description={v2ProofMetricFixture.description}
            label={v2ProofMetricFixture.label}
            tone={v2ProofMetricFixture.tone}
            value={v2ProofMetricFixture.value}
          />
        </div>
        <div data-slot={EVIDENCE_WIDGET_SLOTS.root}>
          <EvidenceWidget
            description={v2ProofEvidenceFixture.description}
            items={v2ProofEvidenceFixture.items}
            label={v2ProofEvidenceFixture.label}
            summary={v2ProofEvidenceFixture.summary}
          />
        </div>
      </section>

      <V2ProofStateMatrix />

      <section
        data-proof="data-table"
        data-slot={DATA_TABLE_SURFACE_SLOTS.root}
      >
        <DataTableSurface
          caption={v2ProofTableFixture.caption}
          columns={v2ProofTableFixture.columns}
          description={v2ProofTableFixture.description}
          rows={v2ProofTableFixture.rows}
          title={v2ProofTableFixture.title}
        />
      </section>

      <section data-proof="form" data-slot={FORM_SURFACE_SLOTS.root}>
        <FormSurface
          actions={
            <Button disabled type="button" variant="secondary">
              Save draft (fixture)
            </Button>
          }
          description={v2ProofFormFixture.description}
          fields={[
            {
              control: (
                <Input
                  defaultValue={v2ProofFormFixture.recordName}
                  id="v2-proof-record-name"
                  name="recordName"
                  readOnly
                />
              ),
              description: "Static fixture value.",
              id: "v2-proof-record-name",
              label: "Record name",
              required: true,
            },
            {
              control: (
                <Input
                  defaultValue={v2ProofFormFixture.recordLimit}
                  id="v2-proof-record-limit"
                  name="recordLimit"
                  readOnly
                />
              ),
              id: "v2-proof-record-limit",
              label: "Limit",
            },
          ]}
          title={v2ProofFormFixture.title}
        />
      </section>

      <section
        data-proof="confirm-dialog"
        data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.root}
      >
        <ConfirmDialogSurface
          description={v2ProofDialogFixture.description}
          intent={v2ProofDialogFixture.intent}
          title={v2ProofDialogFixture.title}
        />
      </section>

      <section data-proof="settings" data-slot={SETTINGS_SURFACE_SLOTS.root}>
        <SettingsSurface
          description={v2ProofSettingsFixture.description}
          sections={v2ProofSettingsFixture.sections.map((section) => ({
            ...section,
            items: section.items.map((item) => ({
              ...item,
              control: (
                <Button size="sm" type="button" variant="outline">
                  {item.controlLabel}
                </Button>
              ),
            })),
          }))}
          title={v2ProofSettingsFixture.title}
        />
      </section>

      <footer
        className="rounded-md border border-border border-dashed px-4 py-3 text-muted-foreground text-xs"
        data-proof="import-law"
      >
        Public imports only: @afenda/shadcn-studio-v2 and
        @afenda/shadcn-studio-v2/clients. CSS from package exports in
        globals.css. Slots: {PAGE_SURFACE_SLOTS.root},{" "}
        {DATA_TABLE_SURFACE_SLOTS.root}, {FORM_SURFACE_SLOTS.root}.
      </footer>
    </>
  );
}
