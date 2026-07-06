import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, expectTypeOf, it } from "vitest";
import {
  APP_SHELL_01_SLOTS,
  APP_SHELL_FRAME_SLOTS,
  AppShell01,
  type AppShell01Slot,
  type AppShell01SlotName,
  type AppShell01SlotValue,
  AppShellFrame,
  type AppShellFrameClassNameOptions,
  type AppShellFrameSlot,
  type AppShellFrameSlotName,
  type AppShellFrameSlotValue,
  type AppShellFrameStructure,
  appShellFrameClassName,
  IconMark,
  SIDEBAR_SLOTS,
  Sidebar,
  type SidebarSlot,
  type SidebarSlotName,
  type SidebarSlotValue,
  type SidebarVariant,
  sidebarClassName,
  TOPBAR_SLOTS,
  Topbar,
  type TopbarSlot,
  type TopbarSlotName,
  type TopbarSlotValue,
  topbarClassName,
} from "../index";
import type {
  AppShellNavGroupWire,
  AppShellOperatingContextWire,
} from "../types/app-shell";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(TEST_DIR, "..");

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

const NAV_GROUPS = [
  {
    id: "operations",
    items: [
      {
        href: "/records",
        id: "records",
        isActive: true,
        label: "Records",
      },
      {
        href: "/approvals",
        id: "approvals",
        label: "Approvals",
      },
    ],
    label: "Operations",
  },
] as const satisfies readonly AppShellNavGroupWire[];

const OPERATING_CONTEXT = {
  legalEntityLabel: "Afenda Malaysia Sdn. Bhd.",
  tenantLabel: "Afenda Group",
  workspaceLabel: "Finance workspace",
} as const satisfies AppShellOperatingContextWire;

describe("Phase 5 layout chrome", () => {
  it("renders layout components with governed slots", () => {
    const markup = renderToStaticMarkup(
      <AppShellFrame>
        <Sidebar groups={NAV_GROUPS}>Navigation</Sidebar>
        <main>
          <Topbar heading="Header" />
        </main>
      </AppShellFrame>
    );

    expect(markup).toContain(`data-slot="${APP_SHELL_FRAME_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${SIDEBAR_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.root}"`);
    expect(markup).toContain(`data-slot="${SIDEBAR_SLOTS.nav}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.heading}"`);
  });

  it("supports explicit frame structures without boolean layout props", () => {
    const singleFrame = renderToStaticMarkup(
      <AppShellFrame structure="single">Content</AppShellFrame>
    );
    const sidebarFrame = renderToStaticMarkup(
      <AppShellFrame structure="sidebar">Content</AppShellFrame>
    );

    expect(singleFrame).toContain("flex flex-col");
    expect(singleFrame).not.toContain("lg:grid-cols-[16rem_minmax(0,1fr)]");
    expect(sidebarFrame).toContain("lg:grid-cols-[16rem_minmax(0,1fr)]");
  });

  it("renders grouped navigation with active semantics and native anchors", () => {
    const markup = renderToStaticMarkup(
      <Sidebar groups={NAV_GROUPS} navLabel="Workspace navigation" />
    );

    expect(markup).toContain('aria-label="Workspace navigation"');
    expect(markup).toContain("Operations");
    expect(markup).toContain(`data-slot="${SIDEBAR_SLOTS.navGroupLabel}"`);
    expect(markup).toContain(`data-slot="${SIDEBAR_SLOTS.navItem}"`);
    expect(markup).toContain(`data-slot="${SIDEBAR_SLOTS.navLink}"`);
    expect(markup).toContain('href="/records"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('href="/approvals"');
    expect(markup.match(/aria-current=/g) ?? []).toHaveLength(1);
    expect(markup).not.toContain("<h2");
    expect(markup).not.toContain("tabIndex");
  });

  it("uses the default navigation label only when navigation exists", () => {
    const sidebarWithNavigation = renderToStaticMarkup(
      <Sidebar groups={NAV_GROUPS} />
    );
    const sidebarWithoutNavigation = renderToStaticMarkup(<Sidebar />);

    expect(sidebarWithNavigation).toContain('aria-label="Primary navigation"');
    expect(sidebarWithoutNavigation).not.toContain(
      `data-slot="${SIDEBAR_SLOTS.nav}"`
    );
    expect(sidebarWithoutNavigation).not.toContain("aria-label=");
  });

  it("renders sidebar footer for valid empty ReactNode values", () => {
    const markup = renderToStaticMarkup(<Sidebar footer={0} />);

    expect(markup).toContain(`data-slot="${SIDEBAR_SLOTS.footer}"`);
  });

  it("renders topbar title, actions, and control slots", () => {
    const markup = renderToStaticMarkup(
      <Topbar
        actions={<button type="button">Action</button>}
        aria-label="Application toolbar"
        content={<span>Context</span>}
        controls={<button type="button">Control</button>}
        description="Workspace"
        heading="Afenda"
        title="Native tooltip"
      />
    );

    expect(markup).toContain('aria-label="Application toolbar"');
    expect(markup).toContain('title="Native tooltip"');
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.headingArea}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.heading}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.content}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.actionArea}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.controls}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.actions}"`);
    expect(markup.indexOf("Control")).toBeLessThan(markup.indexOf("Action"));
    expect(markup).toContain("Context");
    expect(markup).toContain("Action");
    expect(markup).toContain("Control");
  });

  it("renders valid empty ReactNode values in topbar slots", () => {
    const markup = renderToStaticMarkup(
      <Topbar actions="" content="" controls={0} description="" heading={0} />
    );

    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.headingArea}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.heading}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.description}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.content}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.actionArea}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.actions}"`);
    expect(markup).toContain(`data-slot="${TOPBAR_SLOTS.controls}"`);
  });

  it("omits optional topbar regions when no title or action content is provided", () => {
    const markup = renderToStaticMarkup(<Topbar />);

    expect(markup).not.toContain(`data-slot="${TOPBAR_SLOTS.headingArea}"`);
    expect(markup).not.toContain(`data-slot="${TOPBAR_SLOTS.content}"`);
    expect(markup).not.toContain(`data-slot="${TOPBAR_SLOTS.actionArea}"`);
  });

  it("preserves native layout props and className extensions", () => {
    const markup = renderToStaticMarkup(
      <AppShellFrame aria-label="Workspace shell" className="custom-shell">
        <Sidebar className="custom-sidebar" />
        <Topbar aria-label="Workspace toolbar" className="custom-topbar" />
      </AppShellFrame>
    );

    expect(markup).toContain('aria-label="Workspace shell"');
    expect(markup).toContain("custom-shell");
    expect(markup).toContain("custom-sidebar");
    expect(markup).toContain('aria-label="Workspace toolbar"');
    expect(markup).toContain("custom-topbar");
  });

  it("composes AppShell01 without direct theme runtime coupling", () => {
    const markup = renderToStaticMarkup(
      <AppShell01
        navGroups={NAV_GROUPS}
        operatingContext={OPERATING_CONTEXT}
        topbarContent={<span>Surface context</span>}
        topbarControls={<button type="button">Theme</button>}
      >
        Workspace content
      </AppShell01>
    );
    const appShell01Source = readSource(
      "components",
      "layout",
      "appshell-01.tsx"
    );

    expect(markup).toContain("Workspace content");
    expect(markup).toContain("Surface context");
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('aria-label="Workspace content"');
    expect(markup).toContain(`data-slot="${APP_SHELL_01_SLOTS.brand}"`);
    expect(markup).toContain(`data-slot="${APP_SHELL_01_SLOTS.brandMark}"`);
    expect(markup).toContain(`data-slot="${APP_SHELL_01_SLOTS.brandText}"`);
    expect(markup).toContain(`data-slot="${APP_SHELL_01_SLOTS.content}"`);
    expect(markup).toContain(`data-slot="${APP_SHELL_01_SLOTS.footer}"`);
    expect(markup).toContain(`data-slot="${APP_SHELL_01_SLOTS.main}"`);
    expect(markup).toContain('data-slot="topbar-controls"');
    expect(appShell01Source).not.toContain('"use client"');
    expect(appShell01Source).not.toContain("ThemeToggle");
    expect(appShell01Source).not.toContain("../shared/");
  });

  it("allows AppShell01 shell slots and labels to be composed without route logic", () => {
    const markup = renderToStaticMarkup(
      <AppShell01
        brand={<span>Custom brand</span>}
        frameDensity="compact"
        mainLabel="Operations content"
        mainProps={{ className: "custom-main" }}
        navGroups={NAV_GROUPS}
        navLabel="Operations navigation"
        operatingContext={OPERATING_CONTEXT}
        sidebarFooter={0}
      >
        Workflow area
      </AppShell01>
    );

    expect(markup).toContain("gap-4 p-4");
    expect(markup).toContain('aria-label="Operations navigation"');
    expect(markup).toContain('aria-label="Operations content"');
    expect(markup).toContain("custom-main");
    expect(markup).toContain("Custom brand");
    expect(markup).toContain(`data-slot="${APP_SHELL_01_SLOTS.footer}"`);
    expect(markup).toContain(">0</div>");
    expect(markup).not.toContain(`data-slot="${APP_SHELL_01_SLOTS.brandMark}"`);
    expect(markup).not.toContain("Afenda ERP mark");
  });

  it("preserves explicit AppShell01 main labelling over fallback labels", () => {
    const labelledMain = renderToStaticMarkup(
      <AppShell01
        mainLabel="Fallback main label"
        mainProps={{ "aria-labelledby": "workspace-heading" }}
        navGroups={NAV_GROUPS}
        operatingContext={OPERATING_CONTEXT}
      >
        Content
      </AppShell01>
    );
    const explicitlyNamedMain = renderToStaticMarkup(
      <AppShell01
        mainLabel="Fallback main label"
        mainProps={{ "aria-label": "Explicit main label" }}
        navGroups={NAV_GROUPS}
        operatingContext={OPERATING_CONTEXT}
      >
        Content
      </AppShell01>
    );

    expect(labelledMain).toContain('aria-labelledby="workspace-heading"');
    expect(labelledMain).not.toContain('aria-label="Fallback main label"');
    expect(explicitlyNamedMain).toContain('aria-label="Explicit main label"');
  });

  it("keeps layout class helpers token-driven", () => {
    expect(appShellFrameClassName({ density: "compact" })).toContain(
      "bg-background"
    );
    expect(sidebarClassName()).toContain("bg-card");
    expect(topbarClassName({ variant: "transparent" })).toContain(
      "bg-transparent"
    );
  });

  it("keeps app shell and sidebar slots as typed public contracts", () => {
    expectTypeOf<AppShellFrameClassNameOptions>().toMatchTypeOf<{
      readonly className?: string;
      readonly density?: "comfortable" | "compact";
      readonly structure?: "sidebar" | "single";
    }>();
    expectTypeOf<AppShellFrameStructure>().toEqualTypeOf<
      "sidebar" | "single"
    >();
    expectTypeOf<AppShell01SlotName>().toEqualTypeOf<
      "brand" | "brandMark" | "brandText" | "content" | "footer" | "main"
    >();
    expectTypeOf<AppShell01Slot>().toMatchTypeOf<AppShell01SlotValue>();
    expectTypeOf<AppShellFrameSlotName>().toEqualTypeOf<"root">();
    expectTypeOf<AppShellFrameSlot>().toMatchTypeOf<AppShellFrameSlotValue>();
    expectTypeOf<SidebarSlotName>().toEqualTypeOf<
      | "footer"
      | "nav"
      | "navGroup"
      | "navGroupItems"
      | "navGroupLabel"
      | "navItem"
      | "navLink"
      | "root"
    >();
    expectTypeOf<SidebarSlot>().toMatchTypeOf<SidebarSlotValue>();
    expect(Object.values(APP_SHELL_01_SLOTS)).toEqual([
      "appshell-01-brand",
      "appshell-01-brand-mark",
      "appshell-01-brand-text",
      "appshell-01-content",
      "appshell-01-footer",
      "appshell-01-main",
    ]);
    expect(Object.values(APP_SHELL_FRAME_SLOTS)).toEqual(["appshell-frame"]);
    expect(
      Object.values(SIDEBAR_SLOTS).every(
        (slot) => slot === "sidebar" || slot.startsWith("sidebar-")
      )
    ).toBe(true);
  });

  it("keeps topbar slots as a typed public contract", () => {
    expectTypeOf<TopbarSlotName>().toEqualTypeOf<
      | "actionArea"
      | "actions"
      | "content"
      | "controls"
      | "description"
      | "heading"
      | "headingArea"
      | "root"
    >();
    expectTypeOf<TopbarSlot>().toMatchTypeOf<TopbarSlotValue>();
    expect(
      Object.values(TOPBAR_SLOTS).every(
        (slot) => slot === "topbar" || slot.startsWith("topbar-")
      )
    ).toBe(true);
  });

  it("does not expose a rail sidebar variant before a collapsed nav contract exists", () => {
    const sidebarSource = readSource("components", "layout", "Sidebar.tsx");

    expectTypeOf<SidebarVariant>().toEqualTypeOf<"default">();
    expect(sidebarSource).not.toContain('"rail"');
    expect(sidebarSource).not.toContain("lg:w-16");
  });

  it("renders the shared icon asset accessibly", () => {
    const markup = renderToStaticMarkup(<IconMark label="Afenda studio" />);

    expect(markup).toContain('role="img"');
    expect(markup).toContain("Afenda studio");
    expect(markup).toContain('data-slot="icon-mark"');
  });

  it("does not reuse fixed title ids for repeated icon marks", () => {
    const markup = renderToStaticMarkup(
      <>
        <IconMark label="First mark" />
        <IconMark label="Second mark" />
      </>
    );

    expect(markup).not.toContain("afenda-icon-mark-title");
    expect(markup).toContain("First mark");
    expect(markup).toContain("Second mark");
  });

  it("keeps the shared ThemeToggle client-only and out of neutral/server surfaces", () => {
    const sharedSource = readSource("components", "shared", "theme-toggle.tsx");

    expect(sharedSource).toContain('"use client"');
    expect(sharedSource).toContain('import { Button } from "../ui/button"');
    expect(sharedSource).toContain("useTheme()");
    expect(readSource("clients.ts")).toContain("ThemeToggle");
    expect(readSource("index.ts")).not.toContain("ThemeToggle");
    expect(readSource("server.ts")).not.toContain("ThemeToggle");
  });
});
