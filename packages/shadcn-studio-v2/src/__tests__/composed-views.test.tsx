import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(TEST_DIR, "..");
const VIEW_SURFACE_STATES = [
  "loading",
  "empty",
  "error",
  "unavailable",
] as const;
const RAW_COLOR_PATTERN = /#[0-9a-fA-F]{3,8}\b/;
const FORBIDDEN_VIEW_IMPORT_PATTERN =
  /from\s+["'](?:next\/|@\/|.*(?:auth|database|db|permissions|routes))/;

function collectSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const name of readdirSync(directory)) {
    const filePath = path.join(directory, name);

    if (statSync(filePath).isDirectory()) {
      files.push(...collectSourceFiles(filePath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(name)) {
      files.push(filePath);
    }
  }

  return files;
}

describe("Phase 7A page and widget views", () => {
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
      <PageSurface
        description="Operational record overview."
        sidebar="Navigation"
        title="Records"
        toolbar="Actions"
      >
        Content
      </PageSurface>
    );

    expect(markup).toContain('data-slot="page-surface"');
    expect(markup).toContain('data-slot="page-surface-main"');
    expect(markup).toContain('data-slot="page-surface-title"');
    expect(markup).toContain('data-slot="page-surface-description"');
    expect(markup).toContain('data-slot="page-surface-toolbar"');
    expect(markup).toContain("Operational record overview.");
  });

  it("uses the single-column frame when PageSurface has no sidebar", () => {
    const markup = renderToStaticMarkup(
      <PageSurface title="Records">Content</PageSurface>
    );

    expect(markup).toContain("flex flex-col");
    expect(markup).not.toContain("lg:grid-cols-[16rem_minmax(0,1fr)]");
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
    expect(markup).toContain('data-slot="metric-widget-title"');
    expect(markup).toContain('data-slot="metric-widget-description"');
    expect(markup).toContain('data-slot="metric-widget-value"');
    expect(markup).toContain("Open records");
    expect(markup).toContain("128");
  });

  it.each(
    VIEW_SURFACE_STATES
  )("renders PageSurface %s state with accessible semantics", (state) => {
    const markup = renderToStaticMarkup(
      <PageSurface
        state={state}
        stateMessages={{
          [state]: {
            description: `${state} description`,
            title: `${state} title`,
          },
        }}
        title="Records"
      >
        Ready content
      </PageSurface>
    );

    expect(markup).toContain('data-slot="page-surface-state"');
    expect(markup).toContain(`data-state="${state}"`);
    expect(markup).toContain(
      state === "error" ? 'role="alert"' : 'role="status"'
    );
    expect(markup).toContain(`${state} title`);
    expect(markup).not.toContain("Ready content");
  });

  it.each(
    VIEW_SURFACE_STATES
  )("renders MetricWidget %s state with accessible semantics", (state) => {
    const markup = renderToStaticMarkup(
      <MetricWidget
        label="Open records"
        state={state}
        stateMessages={{
          [state]: {
            description: `${state} metric description`,
            title: `${state} metric title`,
          },
        }}
      />
    );

    expect(markup).toContain('data-slot="metric-widget-state"');
    expect(markup).toContain(`data-state="${state}"`);
    expect(markup).toContain(
      state === "error" ? 'role="alert"' : 'role="status"'
    );
    expect(markup).toContain(`${state} metric title`);
  });

  it("keeps view class helpers deterministic", () => {
    expect(authShellClassName()).toContain("bg-background");
    expect(pageSurfaceClassName()).toContain("flex");
    expect(metricWidgetValueClassName({ tone: "success" })).toContain(
      "text-primary"
    );
    expect(metricWidgetValueClassName({ tone: "warning" })).toContain(
      "text-destructive"
    );
  });

  it("keeps Phase 7A views token-safe and free of app runtime imports", () => {
    const viewFiles = [
      ...collectSourceFiles(path.join(SRC_ROOT, "views", "pages")),
      ...collectSourceFiles(path.join(SRC_ROOT, "views", "widgets")),
    ];
    const violations: string[] = [];

    for (const filePath of viewFiles) {
      const source = readFileSync(filePath, "utf8");
      const relativePath = path.relative(SRC_ROOT, filePath);

      if (RAW_COLOR_PATTERN.test(source)) {
        violations.push(`${relativePath}: raw color`);
      }

      if (FORBIDDEN_VIEW_IMPORT_PATTERN.test(source)) {
        violations.push(`${relativePath}: forbidden runtime import`);
      }
    }

    expect(violations).toEqual([]);
  });
});
