"use client";

import {
  AUTH_SHELL_SLOTS,
  CONFIRM_DIALOG_SURFACE_SLOTS,
  DATA_TABLE_SURFACE_SLOTS,
  EVIDENCE_WIDGET_SLOTS,
  FORM_SURFACE_SLOTS,
  Input,
  Label,
  METRIC_WIDGET_SLOTS,
  PAGE_SURFACE_SLOTS,
  SETTINGS_SURFACE_SLOTS,
  Switch,
} from "@afenda/shadcn-studio-v2";
import {
  AppShell01,
  AuthShell,
  Button,
  ConfirmDialogSurface,
  DataTableSurface,
  EvidenceWidget,
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
  v2ProofAuthFixture,
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
import type { V2ProofSurfaceVisibility } from "@/lib/v2-proof/surface-visibility";
import { useV2ProofSurfaceVisibility } from "@/lib/v2-proof/use-v2-proof-surface-visibility.client";
import { V2ProofStateMatrix } from "./v2-proof-state-matrix.client";

const AUTH_SHELL_PREVIEW_CLASS =
  "mx-auto flex min-h-0 w-full max-w-md items-stretch justify-start bg-transparent px-0 py-0 text-foreground";

interface V2ProofRouteProps {
  readonly initialSurfaceVisibility?: Partial<V2ProofSurfaceVisibility>;
  readonly testSurfaceOverrides?: Partial<V2ProofSurfaceVisibility>;
}

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

function VerificationPanel({
  authShellEnabled,
  onAuthShellChange,
}: {
  readonly authShellEnabled: boolean;
  readonly onAuthShellChange: (enabled: boolean) => void;
}) {
  return (
    <section
      className="rounded-lg border border-border border-dashed bg-muted/20 p-4"
      data-proof="verification-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-medium text-sm">Verification surfaces</h2>
          <p className="text-muted-foreground text-xs">
            Optional previews for auth and other heavy surfaces. Off by default
            — enable via toggle or <code className="font-mono">?verify=1</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={authShellEnabled}
            data-proof="auth-shell-toggle"
            id="v2-proof-auth-shell"
            onCheckedChange={onAuthShellChange}
          />
          <Label htmlFor="v2-proof-auth-shell">Auth shell preview</Label>
        </div>
      </div>
    </section>
  );
}

function AuthShellPreview() {
  return (
    <section
      className="overflow-hidden rounded-lg border border-border border-dashed bg-muted/10 p-4"
      data-proof="auth-shell-preview"
      data-v2-proof-surface="auth-shell"
    >
      <AuthShell
        className={AUTH_SHELL_PREVIEW_CLASS}
        description={v2ProofAuthFixture.description}
        footer={
          <p
            className="text-center text-muted-foreground text-xs"
            data-slot={AUTH_SHELL_SLOTS.footer}
          >
            Static fixture — no session or OAuth
          </p>
        }
        title={v2ProofAuthFixture.title}
      >
        <div className="flex flex-col gap-3">
          <Input
            aria-label="Email"
            defaultValue={v2ProofAuthFixture.email}
            readOnly
            type="email"
          />
          <Button disabled type="button">
            Continue (fixture)
          </Button>
        </div>
      </AuthShell>
    </section>
  );
}

export function V2ProofRoute({
  initialSurfaceVisibility,
  testSurfaceOverrides,
}: V2ProofRouteProps = {}) {
  const { setSurface, visibility } = useV2ProofSurfaceVisibility({
    fromUrl: initialSurfaceVisibility,
    testOverrides: testSurfaceOverrides,
  });

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
          <VerificationPanel
            authShellEnabled={visibility.authShell}
            onAuthShellChange={(enabled) => {
              setSurface("authShell", enabled);
            }}
          />

          {visibility.authShell ? <AuthShellPreview /> : null}

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

export { V2ProofRoute as V2ProofRouteClient };
