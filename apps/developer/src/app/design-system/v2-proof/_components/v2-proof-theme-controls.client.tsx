"use client";

import { AUTH_SHELL_SLOTS, Label, Switch } from "@afenda/shadcn-studio-v2";
import {
  AuthShell,
  Button,
  Input,
  ThemeCustomizer,
  ThemeToggle,
  useTheme,
} from "@afenda/shadcn-studio-v2/clients";
import { useMounted } from "@/lib/lab/use-mounted.client";
import {
  v2ProofAuthFixture,
  v2ProofRequiredThemes,
} from "@/lib/v2-proof/fixtures";

const AUTH_SHELL_PREVIEW_CLASS =
  "mx-auto flex min-h-0 w-full max-w-md items-stretch justify-start bg-transparent px-0 py-0 text-foreground";

export function ThemeStateProbe() {
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

export function VerificationPanel({
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

export function AuthShellPreview() {
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

export function V2ProofThemeControlsSection() {
  return (
    <section className="space-y-4" data-proof="theme-controls">
      <div className="space-y-2">
        <h2 className="font-semibold text-lg tracking-tight">Theme controls</h2>
        <p className="max-w-3xl text-muted-foreground text-sm">
          Prove light/dark mode, default brand overlay, neutral baseline, and
          editorial noir presets through public ThemeProvider runtime only.
        </p>
      </div>
      <RequiredThemeChecklist />
      <div className="flex flex-wrap items-start gap-6">
        <ThemeCustomizer />
      </div>
    </section>
  );
}

export function V2ProofTopbarControls() {
  return (
    <>
      <ThemeStateProbe />
      <ThemeToggle label="Toggle color mode" />
    </>
  );
}
