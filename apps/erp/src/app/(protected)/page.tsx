import { AppShellMain } from "@afenda/appshell";
import { Badge } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

export type HomePageGovernedComponents = Extract<GovernedUiComponentName, "Badge">;

export default function HomePage() {
  return (
    <AppShellMain
      badge={
        <Badge emphasis="soft" tone="info">
          Operating context
        </Badge>
      }
      description="Welcome, recent work, and attention-required items will render here as ERP modules are wired."
      title="Workspace home"
    >
      <p className="rounded-md border border-border-subtle bg-surface-panel p-4 text-foreground-muted text-sm">
        Module routes replace this integration placeholder. The protected shell
        remains chrome-only; dashboard demos live at `/appshell-demo` and
        `/appshell-canvas`.
      </p>
    </AppShellMain>
  );
}
