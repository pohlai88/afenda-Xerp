import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AUTH_SHELL_SLOTS,
  AuthShell,
  authShellClassName,
  METRIC_WIDGET_SLOTS,
  MetricWidget,
  metricWidgetValueClassName,
  PAGE_SURFACE_SLOTS,
  PageSurface,
  pageSurfaceClassName,
  workspaceBoardWidgetAdapterClassName,
} from "../index";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(TEST_DIR, "..");
const VIEW_SURFACE_STATES = [
  "loading",
  "empty",
  "error",
  "unavailable",
] as const;
const AUTH_SHELL_STATES = [
  "loading",
  "error",
  "unavailable",
  "disabled",
] as const;
const RAW_COLOR_PATTERN = /#[0-9a-fA-F]{3,8}\b/;
const FORBIDDEN_DASHBOARD_CANVAS_NAME_PATTERN = /DashboardCanvasClient/;
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

describe("Phase 7C auth presentation", () => {
  it("renders a generic auth shell without business policy", () => {
    const markup = renderToStaticMarkup(
      <AuthShell
        actions={<button type="submit">Continue</button>}
        description={<span>Continue to the workspace.</span>}
        footer={<a href="/help">Need help?</a>}
        secondaryActions={<a href="/recover">Recover access</a>}
        title="Welcome"
      >
        Form slot
      </AuthShell>
    );

    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.card}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.title}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.description}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.content}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.actions}"`);
    expect(markup).toContain(
      `data-slot="${AUTH_SHELL_SLOTS.secondaryActions}"`
    );
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.footer}"`);
    expect(markup).toContain('aria-label="Authentication"');
    expect(markup).toContain("Form slot");
    expect(markup).toContain("Continue");
    expect(markup).toContain("Recover access");
    expect(markup).toContain("Need help?");
  });

  it("preserves native auth shell props and governed slot markers", () => {
    const markup = renderToStaticMarkup(
      <AuthShell
        aria-labelledby="auth-title"
        className="custom-auth-shell"
        data-slot="consumer-slot"
        label="Fallback auth label"
        title={<span id="auth-title">Sign in</span>}
      >
        Form slot
      </AuthShell>
    );

    expect(markup).toContain('aria-labelledby="auth-title"');
    expect(markup).toContain("custom-auth-shell");
    expect(markup).not.toContain('aria-label="Fallback auth label"');
    expect(markup).not.toContain('data-slot="consumer-slot"');
    expect(markup).not.toContain(`data-slot="${AUTH_SHELL_SLOTS.description}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.content}"`);
    expect(markup).toContain("<section");
    expect(markup).toContain("<h1");
  });

  it.each(
    AUTH_SHELL_STATES
  )("renders AuthShell %s state without owning auth behavior", (state) => {
    const markup = renderToStaticMarkup(
      <AuthShell
        actions={<button type="submit">Submit</button>}
        state={state}
        stateMessages={{
          [state]: {
            action: <a href="/status">View status</a>,
            description: `${state} auth description`,
            title: `${state} auth title`,
          },
        }}
        title="Sign in"
      >
        Auth form
      </AuthShell>
    );

    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.state}"`);
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.stateAction}"`);
    expect(markup).toContain(`data-state="${state}"`);
    expect(markup).toContain(
      state === "error" ? 'role="alert"' : 'role="status"'
    );
    expect(markup).not.toContain("aria-disabled");
    expect(markup).toContain(`${state} auth title`);
    expect(markup).toContain(`${state} auth description`);
    expect(markup).toContain("View status");
    expect(markup).not.toContain("Auth form");
    expect(markup).not.toContain("Submit");
  });

  it("keeps secondary actions and footer visible in non-ready auth states", () => {
    const markup = renderToStaticMarkup(
      <AuthShell
        footer={<a href="/support">Contact support</a>}
        secondaryActions={<a href="/sign-in">Back to sign in</a>}
        state="loading"
        title="Sign in"
      >
        Auth form
      </AuthShell>
    );

    expect(markup).toContain("Back to sign in");
    expect(markup).toContain("Contact support");
    expect(markup).toContain(
      `data-slot="${AUTH_SHELL_SLOTS.secondaryActions}"`
    );
    expect(markup).toContain(`data-slot="${AUTH_SHELL_SLOTS.footer}"`);
    expect(markup).not.toContain("Auth form");
  });

  it("keeps Phase 7C auth presentation token-safe and provider-neutral", () => {
    const viewFiles = collectSourceFiles(path.join(SRC_ROOT, "views", "auth"));
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

describe("Phase 7A page and widget views", () => {
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
    expect(markup).toContain("<main");
    expect(markup).toContain('aria-label="Page content"');
    expect(markup).toContain(`data-slot="${PAGE_SURFACE_SLOTS.sidebar}"`);
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

  it("preserves PageSurface native main props and empty ReactNode slots", () => {
    const labelledMarkup = renderToStaticMarkup(
      <PageSurface
        aria-labelledby="records-heading"
        mainLabel="Fallback content label"
        sidebar=""
        sidebarLabel="Page secondary navigation"
        sidebarProps={{
          "aria-label": "Explicit sidebar label",
          className: "custom-sidebar",
        }}
        title="Records"
        toolbar={0}
        topbarProps={{
          "aria-label": "Page topbar",
          className: "custom-topbar",
          controls: <button type="button">Control</button>,
          variant: "transparent",
        }}
      >
        Content
      </PageSurface>
    );
    const explicitlyNamedMarkup = renderToStaticMarkup(
      <PageSurface aria-label="Explicit page content" title="Records">
        Content
      </PageSurface>
    );

    expect(labelledMarkup).toContain('aria-labelledby="records-heading"');
    expect(labelledMarkup).toContain('aria-label="Explicit sidebar label"');
    expect(labelledMarkup).toContain("custom-sidebar");
    expect(labelledMarkup).toContain('aria-label="Page topbar"');
    expect(labelledMarkup).toContain("custom-topbar");
    expect(labelledMarkup).toContain("Control");
    expect(labelledMarkup).toContain(
      `data-slot="${PAGE_SURFACE_SLOTS.sidebar}"`
    );
    expect(labelledMarkup).toContain(
      `data-slot="${PAGE_SURFACE_SLOTS.toolbar}"`
    );
    expect(labelledMarkup).toContain(">0</div>");
    expect(labelledMarkup).not.toContain('aria-label="Fallback content label"');
    expect(explicitlyNamedMarkup).toContain(
      'aria-label="Explicit page content"'
    );
  });

  it("hardens PageSurface optional slots and governed main slot", () => {
    const markup = renderToStaticMarkup(
      <PageSurface data-slot="consumer-slot" title="Records">
        Content
      </PageSurface>
    );

    expect(markup).toContain(`data-slot="${PAGE_SURFACE_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${PAGE_SURFACE_SLOTS.main}"`);
    expect(markup).toContain(`data-slot="${PAGE_SURFACE_SLOTS.content}"`);
    expect(markup).toContain(`data-slot="${PAGE_SURFACE_SLOTS.title}"`);
    expect(markup).not.toContain(`data-slot="${PAGE_SURFACE_SLOTS.sidebar}"`);
    expect(markup).not.toContain(`data-slot="${PAGE_SURFACE_SLOTS.toolbar}"`);
    expect(markup).not.toContain('data-slot="consumer-slot"');
  });

  it("renders a metric widget with governed tone classes", () => {
    const markup = renderToStaticMarkup(
      <MetricWidget
        description="Compared with prior period."
        label="Open records"
        layout={{ h: 2, minH: 2, minW: 2, w: 3, x: 0, y: 0 }}
        tone="success"
        useCase="erp-workspace"
        value="128"
      />
    );

    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.title}"`);
    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.description}"`);
    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.content}"`);
    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.value}"`);
    expect(markup).toContain('data-state="ready"');
    expect(markup).toContain('data-tone="success"');
    expect(markup).toContain("Open records");
    expect(markup).toContain("128");
    expect(markup).toContain('data-workspace-board-adapter="true"');
    expect(markup).toContain('data-adapter-kind="metric"');
    expect(markup).toContain('data-workspace-board-use-case="erp-workspace"');
    expect(markup).toContain('data-workspace-board-layout="0,0,3,2"');
    expect(markup).toMatch(/aria-labelledby="[^"]+-title"/);
    expect(markup).toMatch(/aria-describedby="[^"]+-description"/);
    expect(markup).toMatch(/id="[^"]+-title"/);
    expect(markup).toMatch(/id="[^"]+-description"/);
  });

  it("preserves MetricWidget native article props and empty ReactNode slots", () => {
    const markup = renderToStaticMarkup(
      <MetricWidget
        className="custom-metric"
        data-slot="consumer-slot"
        description=""
        label="Open records"
        value={0}
      />
    );

    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.description}"`);
    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.value}"`);
    expect(markup).toContain("custom-metric");
    expect(markup).toContain(">0</p>");
    expect(markup).not.toContain('data-slot="consumer-slot"');
    expect(markup).toMatch(/aria-describedby="[^"]+-description"/);
  });

  it("locks MetricWidget to metric adapter semantics", () => {
    const markup = renderToStaticMarkup(
      <MetricWidget label="Open records" tone="warning" value="128" />
    );
    const viewTypes = readFileSync(
      path.join(SRC_ROOT, "types", "views.ts"),
      "utf8"
    );

    expect(markup).toContain('data-adapter-kind="metric"');
    expect(markup).toContain('data-tone="warning"');
    expect(markup).toContain("text-foreground");
    expect(markup).not.toContain("text-destructive");
    expect(viewTypes).toContain('"adapterKind"');
    expect(viewTypes).toContain("readonly value: MetricWidgetValue;");
    expect(viewTypes).toContain("readonly value?: never;");
    expect(metricWidgetValueClassName({ tone: "warning" })).not.toContain(
      "text-destructive"
    );
  });

  it("keeps widgets grid-compatible without owning board runtime", () => {
    const markup = renderToStaticMarkup(
      <MetricWidget label="Open records" value="128" />
    );

    expect(markup.match(/data-workspace-board-adapter="true"/g)).toHaveLength(
      1
    );
    expect(workspaceBoardWidgetAdapterClassName()).toContain("h-full");
    expect(workspaceBoardWidgetAdapterClassName()).toContain("min-w-0");
    expect(markup).not.toContain("draggable");
    expect(markup).not.toContain("resize");
    expect(markup).not.toContain("DashboardCanvasClient");
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
            action: <button type="button">Retry</button>,
            title: `${state} title`,
          },
        }}
        title="Records"
      >
        Ready content
      </PageSurface>
    );

    expect(markup).toContain('data-slot="page-surface-state"');
    expect(markup).toContain(`data-slot="${PAGE_SURFACE_SLOTS.stateAction}"`);
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
            action: <button type="button">Inspect</button>,
            description: `${state} metric description`,
            title: `${state} metric title`,
          },
        }}
      />
    );

    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.state}"`);
    expect(markup).toContain(`data-slot="${METRIC_WIDGET_SLOTS.stateAction}"`);
    expect(markup).toContain(`data-state="${state}"`);
    expect(markup).toContain(
      state === "error" ? 'role="alert"' : 'role="status"'
    );
    expect(markup).toContain(`${state} metric title`);
    expect(markup).toContain("Inspect");
    expect(markup).not.toContain(`data-slot="${METRIC_WIDGET_SLOTS.value}"`);
    expect(markup).toContain(
      `</div><div class="mt-3" data-slot="${METRIC_WIDGET_SLOTS.stateAction}">`
    );
  });

  it("keeps view class helpers deterministic", () => {
    expect(authShellClassName()).toContain("bg-background");
    expect(pageSurfaceClassName()).toContain("flex");
    expect(metricWidgetValueClassName({ tone: "success" })).toContain(
      "text-primary"
    );
    expect(metricWidgetValueClassName({ tone: "warning" })).toContain(
      "text-foreground"
    );
    expect(workspaceBoardWidgetAdapterClassName()).toContain("flex");
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

      if (FORBIDDEN_DASHBOARD_CANVAS_NAME_PATTERN.test(source)) {
        violations.push(`${relativePath}: forbidden dashboard canvas name`);
      }
    }

    expect(violations).toEqual([]);
  });
});
