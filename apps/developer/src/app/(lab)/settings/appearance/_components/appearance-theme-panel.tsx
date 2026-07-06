import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeCustomizer,
} from "@afenda/shadcn-studio-v2";
import { StudioPresentationProviders as ErpPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import type { AppearanceSettingsPageData } from "@/lib/lab/contracts";

interface AppearanceThemePanelProps {
  readonly pageData: AppearanceSettingsPageData;
}

export function AppearanceThemePanel({ pageData }: AppearanceThemePanelProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Theme control surface</CardTitle>
        <CardDescription>{pageData.promotionSummary}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center bg-muted/25 p-6">
        <ErpPresentationProviders>
          <ThemeCustomizer />
        </ErpPresentationProviders>
      </CardContent>
    </Card>
  );
}
