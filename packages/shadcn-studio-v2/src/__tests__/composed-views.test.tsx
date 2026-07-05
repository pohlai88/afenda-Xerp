import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AuthShell,
  authShellClassName,
  MetricWidget,
  metricWidgetValueClassName,
  PageSurface,
  pageSurfaceClassName,
} from "../index";

describe("Slice 5 first composed views", () => {
  it("renders a generic auth shell without business policy", () => {
    const markup = renderToStaticMarkup(
      <AuthShell description="Continue to the workspace." title="Welcome">
        Form slot
      </AuthShell>
    );

    expect(markup).toContain('data-slot="auth-shell"');
    expect(markup).toContain('data-slot="auth-shell-card"');
    expect(markup).toContain("Form slot");
  });

  it("renders a generic page surface from layout parts", () => {
    const markup = renderToStaticMarkup(
      <PageSurface sidebar="Navigation" title="Records" toolbar="Actions">
        Content
      </PageSurface>
    );

    expect(markup).toContain('data-slot="page-surface"');
    expect(markup).toContain('data-slot="page-surface-main"');
    expect(markup).toContain('data-slot="page-surface-toolbar"');
  });

  it("renders a metric widget with governed tone classes", () => {
    const markup = renderToStaticMarkup(
      <MetricWidget
        description="Compared with prior period."
        label="Open records"
        tone="success"
        value="128"
      />
    );

    expect(markup).toContain('data-slot="metric-widget"');
    expect(markup).toContain("Open records");
    expect(markup).toContain("128");
  });

  it("keeps view class helpers deterministic", () => {
    expect(authShellClassName()).toContain("bg-background");
    expect(pageSurfaceClassName()).toContain("flex");
    expect(metricWidgetValueClassName({ tone: "warning" })).toContain(
      "text-amber"
    );
  });
});
