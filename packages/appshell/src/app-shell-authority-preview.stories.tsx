import {
  densityToAttribute,
  resolveAppShellSlotClassName,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "ERP/ApplicationShell/Authority Preview",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Pre-wiring preview: combines existing `app-shell.presentation.css` structural classes with `@afenda/ui/governance` app-shell recipe slot maps. Production `ApplicationShell` will adopt this pattern before removing duplicate visual hooks.",
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
        <nav className="flex flex-col gap-2 p-4">
          <div
            className={resolveAppShellSlotClassName("navigation-item")}
          >
            Dashboard
          </div>
          <div className={resolveAppShellSlotClassName("active-item")}>
            Finance
          </div>
          <div
            className={resolveAppShellSlotClassName("attention-item")}
          >
            3 approvals pending
          </div>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={joinClasses(
            "app-shell-header",
            resolveAppShellSlotClassName("topbar")
          )}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="font-medium text-sm">Afenda ERP</span>
            <div
              className={resolveAppShellSlotClassName("command-center")}
            >
              Search…
            </div>
          </div>
        </header>
        <main className="app-shell-main flex-1 p-6">
          <p className="text-sm">
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
          <p className="px-4 py-2 text-xs">© Afenda</p>
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
      <main className="app-shell-main p-4">
        <p className="text-sm">
          Compact density — verify spacing tokens via{" "}
          <code>{densityToAttribute("compact")}</code> attribute hook.
        </p>
      </main>
    </div>
  ),
};
