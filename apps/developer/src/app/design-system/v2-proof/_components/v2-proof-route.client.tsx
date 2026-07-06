"use client";

import {
  CONFIRM_DIALOG_SURFACE_SLOTS,
  DATA_TABLE_SURFACE_SLOTS,
  FORM_SURFACE_SLOTS,
  Input,
  METRIC_WIDGET_SLOTS,
  PAGE_SURFACE_SLOTS,
  SETTINGS_SURFACE_SLOTS,
} from "@afenda/shadcn-studio-v2";
import {
  AppShell01,
  Button,
  ConfirmDialogSurface,
  DataTableSurface,
  FormSurface,
  MetricWidget,
  PageSurface,
  SettingsSurface,
  ThemeCustomizer,
  ThemeToggle,
  useTheme,
} from "@afenda/shadcn-studio-v2/clients";
import { useMounted } from "@/lib/lab/use-mounted.client";
import {
  V2_PROOF_ROUTE_MARKER,
  v2ProofDialogFixture,
  v2ProofEvidenceFixture,
  v2ProofFormFixture,
  v2ProofMetricFixture,
  v2ProofNavGroups,
  v2ProofOperatingContext,
  v2ProofRequiredThemes,
  v2ProofSettingsFixture,
  v2ProofTableFixture,
} from "@/lib/v2-proof/fixtures";

function ThemeStateProbe() {
  const { mode, resolvedMode, themeId } = useTheme();
  const mounted = useMounted();

  return (
    <output
      className="rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs"
      data-mode={mounted ? mode : undefined}
      data-proof="theme-state"
      data-resolved-mode={mounted ? resolvedMode : undefined}
      data-theme-id={mounted ? themeId : undefined}
      suppressHydrationWarning
    >
      {mounted ? `${themeId} · ${resolvedMode}` : "Resolving theme…"}
    </output>
  );
}

function RequiredThemeChecklist() {
  const { themeId } = useTheme();
  const mounted = useMounted();

  const activeThemeId = mounted ? themeId : null;

  return (
    <ul className="grid gap-2 sm:grid-cols-2" data-proof="theme-checklist">
      {v2ProofRequiredThemes.map((requiredThemeId) => (
        <li
          className="rounded-md border border-border px-3 py-2 text-sm"
          data-active={activeThemeId === requiredThemeId ? "true" : "false"}
          data-proof-theme={requiredThemeId}
          key={requiredThemeId}
        >
          <span className="font-medium">{requiredThemeId}</span>
          {activeThemeId === requiredThemeId ? (
            <span className="ml-2 text-muted-foreground">active</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function V2ProofRoute() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-proof="v2-proof-root"
    >
      <AppShell01
        navGroups={v2ProofNavGroups}
        operatingContext={v2ProofOperatingContext}
        topbarControls={
          <>
            <ThemeStateProbe />
            <ThemeToggle label="Toggle color mode" />
          </>
        }
        topbarDescription={V2_PROOF_ROUTE_MARKER}
        topbarHeading="V2 design system consumer proof"
      >
        <div className="flex flex-col gap-10">
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
            <div data-proof="evidence-widget-stand-in">
              <MetricWidget
                description={v2ProofEvidenceFixture.description}
                label={v2ProofEvidenceFixture.label}
                tone={v2ProofEvidenceFixture.tone}
                value={v2ProofEvidenceFixture.value}
              />
            </div>
          </section>

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

          <section
            data-proof="settings"
            data-slot={SETTINGS_SURFACE_SLOTS.root}
          >
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

          <section className="space-y-4" data-proof="theme-controls">
            <div className="space-y-2">
              <h2 className="font-semibold text-lg tracking-tight">
                Theme controls
              </h2>
              <p className="max-w-3xl text-muted-foreground text-sm">
                Prove light/dark mode, default brand overlay, neutral baseline,
                and editorial noir presets through public ThemeProvider runtime
                only.
              </p>
            </div>
            <RequiredThemeChecklist />
            <div className="flex flex-wrap items-start gap-6">
              <ThemeCustomizer />
            </div>
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
        </div>
      </AppShell01>
    </div>
  );
}
