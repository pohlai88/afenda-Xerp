import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ThemeCustomizer,
} from "@afenda/shadcn-studio";

export function AppearanceThemePanel() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Theme control surface</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center bg-muted/25 p-6">
        <ThemeCustomizer />
      </CardContent>
    </Card>
  );
}
