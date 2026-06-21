import { AppShellMain } from "@afenda/appshell";

export default function HomePage() {
  return (
    <AppShellMain
      description="Application shell foundation for Afenda ERP. Module surfaces will be added in later phases."
      title="Dashboard"
    >
      <p className="rounded-md border border-border-subtle bg-surface-panel p-4 text-foreground-muted text-sm">
        Placeholder content area for future module pages.
      </p>
    </AppShellMain>
  );
}
