import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AUTH_SHELL_SLOTS,
  AuthShell,
  authShellClassName,
  CONFIRM_DIALOG_SURFACE_SLOTS,
  ConfirmDialogSurface,
  confirmDialogSurfaceClassName,
  DATA_TABLE_SURFACE_SLOTS,
  DataTableSurface,
  dataTableSurfaceClassName,
  EVIDENCE_WIDGET_SLOTS,
  EvidenceWidget,
  evidenceWidgetSummaryClassName,
  FORM_SURFACE_SLOTS,
  FormSurface,
  formSurfaceClassName,
  METRIC_WIDGET_SLOTS,
  MetricWidget,
  metricWidgetValueClassName,
  PAGE_SURFACE_SLOTS,
  PageSurface,
  pageSurfaceClassName,
  SETTINGS_SURFACE_SLOTS,
  SettingsSurface,
  settingsSurfaceClassName,
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
    expect(markup).toMatch(/aria-labelledby="[^"]+-title"/);
    expect(markup).toMatch(/aria-describedby="[^"]+-description"/);
    expect(markup).toMatch(/id="[^"]+-title"/);
    expect(markup).toMatch(/id="[^"]+-description"/);
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

  it("supports AuthShell label as an explicit accessible-name override", () => {
    const markup = renderToStaticMarkup(
      <AuthShell label="Workspace sign-in" title="Sign in">
        Form slot
      </AuthShell>
    );

    expect(markup).toContain('aria-label="Workspace sign-in"');
    expect(markup).not.toMatch(/<section[^>]+aria-labelledby="[^"]+-title"/);
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
    expect(markup).toMatch(
      new RegExp(
        `role="${state === "error" ? "alert" : "status"}"[\\s\\S]*</div></div><div class="mt-3" data-slot="${AUTH_SHELL_SLOTS.stateAction}"`
      )
    );
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

describe("Phase 7B workflow views", () => {
  it("renders DataTableSurface with native table semantics and empty state", () => {
    const readyMarkup = renderToStaticMarkup(
      <DataTableSurface
        caption="Two open operational records."
        columns={[
          { header: "Name", id: "name" },
          { align: "end", header: "Amount", id: "amount" },
        ]}
        description="Workflow table description."
        rows={[
          {
            cells: { amount: "$128.00", name: "Invoice 1001" },
            id: "row-1",
          },
          {
            cells: { amount: "$256.00", name: "Invoice 1002" },
            id: "row-2",
          },
        ]}
        title="Open records"
      />
    );
    const emptyMarkup = renderToStaticMarkup(
      <DataTableSurface
        columns={[{ header: "Name", id: "name" }]}
        title="Open records"
      />
    );

    expect(readyMarkup).toContain(
      `data-slot="${DATA_TABLE_SURFACE_SLOTS.root}"`
    );
    expect(readyMarkup).toContain(
      `data-slot="${DATA_TABLE_SURFACE_SLOTS.title}"`
    );
    expect(readyMarkup).toContain(
      `data-slot="${DATA_TABLE_SURFACE_SLOTS.description}"`
    );
    expect(readyMarkup).toContain(
      `data-slot="${DATA_TABLE_SURFACE_SLOTS.table}"`
    );
    expect(readyMarkup).toContain("<table");
    expect(readyMarkup).toContain("<thead");
    expect(readyMarkup).toContain("<tbody");
    expect(readyMarkup).toContain('scope="col"');
    expect(readyMarkup).toContain("Invoice 1001");
    expect(readyMarkup).toContain("Two open operational records.");
    expect(readyMarkup).toMatch(/aria-labelledby="[^"]+-title"/);
    expect(emptyMarkup).toContain('data-state="empty"');
    expect(emptyMarkup).toContain("No rows");
    expect(emptyMarkup).not.toContain("<table");
  });

  it("renders FormSurface as presentational fields without submit ownership", () => {
    const markup = renderToStaticMarkup(
      <FormSurface
        actions={<button type="button">Save draft</button>}
        description="Review fields before consumer-owned submit wiring."
        fields={[
          {
            control: <input id="record-name" name="recordName" />,
            description: "Visible to operators.",
            id: "record-name",
            label: "Record name",
            required: true,
          },
          {
            control: <input aria-invalid="true" id="limit" name="limit" />,
            id: "limit",
            label: "Limit",
            message: "Limit is required.",
            state: "invalid",
          },
        ]}
        title="Record form"
      />
    );

    expect(markup).toContain(`data-slot="${FORM_SURFACE_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${FORM_SURFACE_SLOTS.title}"`);
    expect(markup).toContain(`data-slot="${FORM_SURFACE_SLOTS.field}"`);
    expect(markup).toContain(`data-slot="${FORM_SURFACE_SLOTS.fieldControl}"`);
    expect(markup).toContain(`data-slot="${FORM_SURFACE_SLOTS.fieldMessage}"`);
    expect(markup).toContain(`data-slot="${FORM_SURFACE_SLOTS.actions}"`);
    expect(markup).toContain('for="record-name"');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain("Save draft");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("onSubmit");
  });

  it("renders ConfirmDialogSurface with dialog semantics and safe buttons", () => {
    const markup = renderToStaticMarkup(
      <ConfirmDialogSurface
        description="This is a consumer-owned confirmation prompt."
        intent="destructive"
        title="Archive record?"
      />
    );

    expect(markup).toContain(
      `data-slot="${CONFIRM_DIALOG_SURFACE_SLOTS.root}"`
    );
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain('data-intent="destructive"');
    expect(markup).toContain(
      `data-slot="${CONFIRM_DIALOG_SURFACE_SLOTS.confirmAction}"`
    );
    expect(markup).toContain(
      `data-slot="${CONFIRM_DIALOG_SURFACE_SLOTS.cancelAction}"`
    );
    expect(markup).toContain('type="button"');
    expect(markup).toContain("Archive record?");
    expect(markup).toContain("Confirm");
    expect(markup).toContain("Cancel");
    expect(markup).toMatch(/aria-labelledby="[^"]+-title"/);
    expect(markup).toMatch(/aria-describedby="[^"]+-description"/);
  });

  it("preserves ConfirmDialogSurface modal semantics override", () => {
    const markup = renderToStaticMarkup(
      <ConfirmDialogSurface aria-modal={false} title="Inline confirmation" />
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="false"');
  });

  it("renders SettingsSurface as grouped presentation rows", () => {
    const markup = renderToStaticMarkup(
      <SettingsSurface
        description="Presentation-only settings groups."
        sections={[
          {
            description: "Controls are supplied by consumers.",
            id: "general",
            items: [
              {
                control: <button type="button">Edit</button>,
                description: "Shown in the workspace header.",
                id: "workspace-name",
                label: "Workspace name",
              },
            ],
            title: "General",
          },
        ]}
        title="Workspace settings"
      />
    );

    expect(markup).toContain(`data-slot="${SETTINGS_SURFACE_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${SETTINGS_SURFACE_SLOTS.title}"`);
    expect(markup).toContain(`data-slot="${SETTINGS_SURFACE_SLOTS.section}"`);
    expect(markup).toContain(
      `data-slot="${SETTINGS_SURFACE_SLOTS.itemControl}"`
    );
    expect(markup).toContain("Workspace settings");
    expect(markup).toContain("Workspace name");
    expect(markup).toContain("Edit");
    expect(markup).toMatch(/aria-labelledby="[^"]+-title"/);
  });

  it("preserves workflow surface native props while keeping governed slots", () => {
    const dataTableMarkup = renderToStaticMarkup(
      <DataTableSurface
        aria-describedby="external-description"
        aria-label="External table label"
        className="custom-data-table"
        columns={[{ header: "Name", id: "name" }]}
        data-slot="consumer-slot"
        rows={[{ cells: { name: "Record" }, id: "row-1" }]}
        title="Records"
      />
    );
    const formMarkup = renderToStaticMarkup(
      <FormSurface
        aria-describedby="external-form-description"
        aria-labelledby="external-form-title"
        className="custom-form"
        data-slot="consumer-slot"
        fields={[
          {
            control: <input id="name" name="name" />,
            id: "name",
            label: "Name",
          },
        ]}
        title="Record form"
      />
    );
    const dialogMarkup = renderToStaticMarkup(
      <ConfirmDialogSurface
        aria-label="External dialog label"
        className="custom-dialog"
        data-slot="consumer-slot"
        title="Confirm"
      />
    );
    const settingsMarkup = renderToStaticMarkup(
      <SettingsSurface
        aria-describedby="external-settings-description"
        className="custom-settings"
        data-slot="consumer-slot"
        sections={[
          {
            id: "general",
            items: [{ id: "name", label: "Name" }],
            title: "General",
          },
        ]}
        title="Settings"
      />
    );

    expect(dataTableMarkup).toContain('aria-label="External table label"');
    expect(dataTableMarkup).toContain(
      'aria-describedby="external-description"'
    );
    expect(dataTableMarkup).toContain("custom-data-table");
    expect(dataTableMarkup).toContain(
      `data-slot="${DATA_TABLE_SURFACE_SLOTS.root}"`
    );
    expect(dataTableMarkup).not.toContain('data-slot="consumer-slot"');
    expect(formMarkup).toContain('aria-labelledby="external-form-title"');
    expect(formMarkup).toContain(
      'aria-describedby="external-form-description"'
    );
    expect(formMarkup).toContain("custom-form");
    expect(formMarkup).toContain(`data-slot="${FORM_SURFACE_SLOTS.root}"`);
    expect(formMarkup).not.toContain('data-slot="consumer-slot"');
    expect(dialogMarkup).toContain('aria-label="External dialog label"');
    expect(dialogMarkup).toContain("custom-dialog");
    expect(dialogMarkup).toContain(
      `data-slot="${CONFIRM_DIALOG_SURFACE_SLOTS.root}"`
    );
    expect(dialogMarkup).not.toContain('data-slot="consumer-slot"');
    expect(settingsMarkup).toContain(
      'aria-describedby="external-settings-description"'
    );
    expect(settingsMarkup).toContain("custom-settings");
    expect(settingsMarkup).toContain(
      `data-slot="${SETTINGS_SURFACE_SLOTS.root}"`
    );
    expect(settingsMarkup).not.toContain('data-slot="consumer-slot"');
  });

  it("supports workflow label props as explicit accessible-name overrides", () => {
    const dataTableMarkup = renderToStaticMarkup(
      <DataTableSurface
        columns={[{ header: "Name", id: "name" }]}
        label="Metric source records"
        rows={[{ cells: { name: "Record" }, id: "row-1" }]}
        title="Records"
      />
    );
    const formMarkup = renderToStaticMarkup(
      <FormSurface
        fields={[
          {
            control: <input id="name" name="name" />,
            id: "name",
            label: "Name",
          },
        ]}
        label="Record edit controls"
        title="Record form"
      />
    );
    const dialogMarkup = renderToStaticMarkup(
      <ConfirmDialogSurface label="Archive confirmation" title="Confirm" />
    );
    const settingsMarkup = renderToStaticMarkup(
      <SettingsSurface
        label="Workspace preference groups"
        sections={[
          {
            id: "general",
            items: [{ id: "name", label: "Name" }],
            title: "General",
          },
        ]}
        title="Settings"
      />
    );

    expect(dataTableMarkup).toContain('aria-label="Metric source records"');
    expect(dataTableMarkup).not.toMatch(
      /<section[^>]+aria-labelledby="[^"]+-title"/
    );
    expect(formMarkup).toContain('aria-label="Record edit controls"');
    expect(formMarkup).not.toMatch(
      /<section[^>]+aria-labelledby="[^"]+-title"/
    );
    expect(dialogMarkup).toContain('aria-label="Archive confirmation"');
    expect(dialogMarkup).not.toMatch(
      /<section[^>]+aria-labelledby="[^"]+-title"/
    );
    expect(settingsMarkup).toContain(
      'aria-label="Workspace preference groups"'
    );
    expect(settingsMarkup).not.toMatch(
      /<section[^>]+aria-labelledby="[^"]+-title"/
    );
  });

  it.each(
    VIEW_SURFACE_STATES
  )("renders workflow %s states with accessible semantics", (state) => {
    const action = <button type="button">Retry</button>;
    const stateMessages = {
      [state]: {
        action,
        description: `${state} workflow description`,
        title: `${state} workflow title`,
      },
    };
    const surfaces = [
      {
        markup: renderToStaticMarkup(
          <DataTableSurface
            columns={[{ header: "Name", id: "name" }]}
            state={state}
            stateMessages={stateMessages}
            title="Records"
          />
        ),
        slot: DATA_TABLE_SURFACE_SLOTS.state,
      },
      {
        markup: renderToStaticMarkup(
          <FormSurface
            fields={[
              {
                control: <input id="name" name="name" />,
                id: "name",
                label: "Name",
              },
            ]}
            state={state}
            stateMessages={stateMessages}
            title="Record form"
          />
        ),
        slot: FORM_SURFACE_SLOTS.state,
      },
      {
        markup: renderToStaticMarkup(
          <ConfirmDialogSurface
            state={state}
            stateMessages={stateMessages}
            title="Confirm"
          />
        ),
        slot: CONFIRM_DIALOG_SURFACE_SLOTS.state,
      },
      {
        markup: renderToStaticMarkup(
          <SettingsSurface
            sections={[
              {
                id: "general",
                items: [{ id: "name", label: "Name" }],
                title: "General",
              },
            ]}
            state={state}
            stateMessages={stateMessages}
            title="Settings"
          />
        ),
        slot: SETTINGS_SURFACE_SLOTS.state,
      },
    ];

    for (const surface of surfaces) {
      expect(surface.markup).toContain(`data-slot="${surface.slot}"`);
      expect(surface.markup).toContain(`data-state="${state}"`);
      expect(surface.markup).toContain(
        state === "error" ? 'role="alert"' : 'role="status"'
      );
      expect(surface.markup).toContain(`${state} workflow title`);
      expect(surface.markup).toContain(`${state} workflow description`);
      expect(surface.markup).toContain("Retry");
      expect(surface.markup).toMatch(
        new RegExp(
          `role="${state === "error" ? "alert" : "status"}"[\\s\\S]*</div><div class="mt-3" data-slot="[^"]+state-action"`
        )
      );
    }
  });

  it("keeps workflow class helpers deterministic", () => {
    expect(confirmDialogSurfaceClassName()).toContain("grid");
    expect(dataTableSurfaceClassName()).toContain("grid");
    expect(formSurfaceClassName()).toContain("grid");
    expect(settingsSurfaceClassName()).toContain("grid");
  });

  it("keeps Phase 7B views token-safe and free of app runtime imports", () => {
    const viewFiles = [
      ...collectSourceFiles(path.join(SRC_ROOT, "views", "datatables")),
      ...collectSourceFiles(path.join(SRC_ROOT, "views", "dialogs")),
      ...collectSourceFiles(path.join(SRC_ROOT, "views", "forms")),
      ...collectSourceFiles(path.join(SRC_ROOT, "views", "settings")),
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

  it("locks EvidenceWidget to evidence adapter semantics", () => {
    const markup = renderToStaticMarkup(
      <EvidenceWidget
        items={[{ id: "a", label: "Control A", status: "complete" }]}
        label="Evidence checkpoint"
        summary="3 of 3 controls satisfied"
      />
    );
    const viewTypes = readFileSync(
      path.join(SRC_ROOT, "types", "views.ts"),
      "utf8"
    );

    expect(markup).toContain('data-adapter-kind="evidence"');
    expect(markup).toContain(`data-slot="${EVIDENCE_WIDGET_SLOTS.summary}"`);
    expect(markup).toContain(`data-slot="${EVIDENCE_WIDGET_SLOTS.item}"`);
    expect(viewTypes).toContain("readonly summary: EvidenceWidgetSummary;");
    expect(viewTypes).toContain("readonly summary?: never;");
    expect(evidenceWidgetSummaryClassName()).toContain("font-semibold");
  });

  it.each(
    VIEW_SURFACE_STATES
  )("renders EvidenceWidget %s state with accessible semantics", (state) => {
    const markup = renderToStaticMarkup(
      <EvidenceWidget
        label="Evidence checkpoint"
        state={state}
        stateMessages={{
          [state]: {
            action: <button type="button">Review</button>,
            description: `${state} evidence description`,
            title: `${state} evidence title`,
          },
        }}
      />
    );

    expect(markup).toContain(`data-slot="${EVIDENCE_WIDGET_SLOTS.state}"`);
    expect(markup).toContain(
      `data-slot="${EVIDENCE_WIDGET_SLOTS.stateAction}"`
    );
    expect(markup).toContain(`data-state="${state}"`);
    expect(markup).toContain(
      state === "error" ? 'role="alert"' : 'role="status"'
    );
    expect(markup).toContain(`${state} evidence title`);
    expect(markup).not.toContain(
      `data-slot="${EVIDENCE_WIDGET_SLOTS.summary}"`
    );
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
