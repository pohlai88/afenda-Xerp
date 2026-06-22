import {
  densityToAttribute,
  resolveAppShellSlotClassName,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta = {
  title: "ERP/ApplicationShell/Authority Preview",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Pre-wiring preview: combines `@afenda/appshell/afenda-appshell.css` structural classes with `@afenda/ui/governance` app-shell recipe slot maps. Production `ApplicationShell` will adopt this pattern before removing duplicate visual hooks.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function joinClasses(...values: readonly string[]): string {
  return values.filter(Boolean).join(" ");
}

export const ShellChromeWithRecipeSlots: Story = {
  render: () => (
    <div
      className={joinClasses(
        "app-shell-root",
        resolveAppShellSlotClassName("root")
      )}
      data-afenda-density={densityToAttribute("standard")}
    >
      <aside
        className={joinClasses(
          "app-shell-sidebar",
          resolveAppShellSlotClassName("sidebar")
        )}
      >
        <nav className="app-shell-authority-preview-sidebar-nav">
          <div className={resolveAppShellSlotClassName("navigation-item")}>
            Dashboard
          </div>
          <div className={resolveAppShellSlotClassName("active-item")}>Finance</div>
          <div className={resolveAppShellSlotClassName("attention-item")}>
            3 approvals pending
          </div>
        </nav>
      </aside>
      <div className="app-shell-authority-preview-main-column">
        <header
          className={joinClasses(
            "app-shell-header",
            resolveAppShellSlotClassName("topbar")
          )}
        >
          <div className="app-shell-authority-preview-topbar-inner">
            <span className="app-shell-authority-preview-topbar-title">Afenda ERP</span>
            <div className={resolveAppShellSlotClassName("command-center")}>
              Search…
            </div>
          </div>
        </header>
        <main className="app-shell-main app-shell-authority-preview-main">
          <p className="app-shell-authority-preview-main-copy">
            Main workspace — presentation CSS owns layout; recipe slots own
            token-backed surfaces.
          </p>
        </main>
        <footer
          className={joinClasses(
            "app-shell-footer",
            resolveAppShellSlotClassName("utility-bar")
          )}
        >
          <p className="app-shell-authority-preview-footer-copy">© Afenda</p>
        </footer>
      </div>
    </div>
  ),
};

export const CompactDensity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Compact density on shell root — spacing tokens follow `[data-afenda-density=\"compact\"]`.",
      },
    },
  },
  render: () => (
    <div
      className={joinClasses(
        "app-shell-root",
        resolveAppShellSlotClassName("root", { density: "compact" })
      )}
      data-afenda-density={densityToAttribute("compact")}
    >
      <main className="app-shell-main app-shell-authority-preview-compact-main">
        <p className="app-shell-authority-preview-main-copy">
          Compact density — verify spacing tokens via{" "}
          <code>{densityToAttribute("compact")}</code> attribute hook.
        </p>
      </main>
    </div>
  ),
};
