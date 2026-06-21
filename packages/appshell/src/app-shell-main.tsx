import type { AppShellMainProps } from "./app-shell.types";

export function AppShellMain({
  title,
  description,
  children,
}: AppShellMainProps) {
  return (
    <section
      aria-labelledby="app-shell-page-title"
      className="flex flex-1 flex-col p-6"
    >
      <h1
        className="mb-2 text-2xl font-semibold tracking-tight"
        id="app-shell-page-title"
      >
        {title}
      </h1>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="rounded-lg border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
