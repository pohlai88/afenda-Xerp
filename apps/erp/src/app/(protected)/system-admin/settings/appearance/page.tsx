import { AppShellMain } from "@afenda/appshell";

export default function SystemAdminSettingsAppearancePage() {
  return (
    <AppShellMain
      contentLabel="Appearance settings"
      description="Theme, branding, and visual customization."
      title="Appearance"
    >
      <div className="app-shell-studio-account-settings">
        <section
          aria-label="Appearance"
          className="app-shell-studio-account-settings__section"
        >
          <p className="app-shell-studio-account-settings__lead">
            Theme density and branding controls — no dedicated Pro block in this
            batch; scaffold only.
          </p>
        </section>
      </div>
    </AppShellMain>
  );
}
