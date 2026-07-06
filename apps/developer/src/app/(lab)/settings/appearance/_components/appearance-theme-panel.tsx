import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeCustomizer,
} from "@afenda/shadcn-studio-v2/clients";
import type { AppearanceSettingsPageData } from "@/lib/lab/contracts";

interface AppearanceThemePanelProps {
  readonly pageData: AppearanceSettingsPageData;
}

export function AppearanceThemePanel({ pageData }: AppearanceThemePanelProps) {
  return (
    <Card className="h-fit min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Theme control surface</CardTitle>
        <CardDescription>{pageData.promotionSummary}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-w-0 justify-center overflow-x-auto bg-muted/25 p-4 sm:p-6">
        <div className="min-w-0 max-w-full">
          <ThemeCustomizer />
        </div>
      </CardContent>
    </Card>
  );
}
