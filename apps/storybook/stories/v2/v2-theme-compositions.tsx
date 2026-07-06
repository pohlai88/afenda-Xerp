"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2";
import {
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from "@afenda/shadcn-studio-v2/clients";

function ThemeCatalogPanel() {
  const { mode, resolvedMode } = useTheme();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="grid gap-1">
          <CardTitle>Theme catalog</CardTitle>
          <CardDescription>
            ThemeProvider from @afenda/shadcn-studio-v2/clients — mode{" "}
            <strong>{mode}</strong> (resolved {resolvedMode}).
          </CardDescription>
        </div>
        <ThemeToggle label="Toggle color mode" />
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          <Button type="button">Primary action</Button>
          <Button type="button" variant="outline">
            Secondary
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Use the Color mode toolbar or ThemeToggle to verify light/dark token
          parity for v2 primitives.
        </p>
      </CardContent>
    </Card>
  );
}

export function ThemeCatalogDemo() {
  return (
    <ThemeProvider storageKey="afenda-storybook-v2-theme-catalog">
      <ThemeCatalogPanel />
    </ThemeProvider>
  );
}
