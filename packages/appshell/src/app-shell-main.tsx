import { Card, CardContent, CardDescription, CardHeader } from "@afenda/ui";

import type { AppShellMainProps } from "./app-shell.types";

export function AppShellMain({
  title,
  description,
  children,
}: AppShellMainProps) {
  return (
    <section
      aria-labelledby="app-shell-page-title"
      className="flex flex-1 flex-col"
    >
      <Card>
        <CardHeader>
          <h1 id="app-shell-page-title">{title}</h1>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  );
}
