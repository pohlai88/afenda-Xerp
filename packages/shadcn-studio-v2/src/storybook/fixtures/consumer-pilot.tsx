import {
  AuthShell,
  Button,
  IconMark,
  MetricWidget,
  PageSurface,
  ThemeProvider,
  ThemeToggle,
} from "../../clients";
import {
  defineAuthViewMetadata,
  defineMetricWidgetMetadata,
  definePageViewMetadata,
} from "../../metadata";

export const consumerPilotMetadata = {
  auth: defineAuthViewMetadata({
    description: "Validate a V2 public import path.",
    kind: "auth",
    submitLabel: "Continue",
    title: "Consumer pilot",
  }),
  page: definePageViewMetadata({
    kind: "page",
    navigation: [{ href: "/studio", id: "studio", label: "Studio" }],
    title: "V2 pilot",
    toolbarActions: [{ id: "theme", label: "Theme", variant: "secondary" }],
  }),
  widget: defineMetricWidgetMetadata({
    description: "Public clients and metadata imports are connected.",
    kind: "widget",
    label: "Pilot checks",
    tone: "success",
    value: "1",
    widget: "metric",
  }),
} as const;

export function ConsumerPilotView() {
  return (
    <ThemeProvider>
      <PageSurface
        sidebar={<IconMark label="Afenda studio pilot" />}
        title={consumerPilotMetadata.page.title}
        toolbar={<ThemeToggle />}
      >
        <AuthShell
          description="Validate a V2 public import path."
          title={consumerPilotMetadata.auth.title}
        >
          <Button>{consumerPilotMetadata.auth.submitLabel}</Button>
        </AuthShell>
        <MetricWidget
          description="Public clients and metadata imports are connected."
          label={consumerPilotMetadata.widget.label}
          tone="success"
          value={consumerPilotMetadata.widget.value}
        />
      </PageSurface>
    </ThemeProvider>
  );
}
