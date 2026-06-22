import {
  densityToAttribute,
  resolveMetadataUiSlotClassName,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { withRawStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataFullscreenLayout,
  metadataStoryA11y,
} from "./_storybook/metadata-story.parameters";

const meta = {
  title: "Metadata/Authority Preview",
  tags: ["autodocs"],
  decorators: [withRawStoryCanvas],
  parameters: {
    ...metadataFullscreenLayout,
    a11y: metadataStoryA11y,
    docs: {
      description: {
        component:
          "Pre-wiring preview: structural `metadata-*` hooks from `@afenda/metadata-ui/afenda-metadata-ui.css` plus token-backed recipe slots from `@afenda/ui/governance`. Downstream components will merge these class sources before visual styling moves out of fixture CSS.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function joinClasses(...values: readonly string[]): string {
  return values.filter(Boolean).join(" ");
}

export const LayoutWithRecipeSlots: Story = {
  render: () => (
    <div
      className={joinClasses(
        "metadata-container metadata-layout metadata-layout-contained metadata-layout-padded",
        resolveMetadataUiSlotClassName("container")
      )}
      data-afenda-density={densityToAttribute("standard")}
    >
      <header
        className={joinClasses(
          "metadata-layout-header",
          resolveMetadataUiSlotClassName("section-header")
        )}
      >
        <h1 className="metadata-layout-title">Warehouse operations</h1>
        <p className="metadata-layout-description">
          Structural hooks + authority recipe slots
        </p>
      </header>
      <div
        className={joinClasses(
          "metadata-layout-body",
          resolveMetadataUiSlotClassName("layout")
        )}
      >
        <section
          className={joinClasses(
            "metadata-section",
            resolveMetadataUiSlotClassName("section")
          )}
        >
          <h2 className="metadata-section-title">Pick lines</h2>
          <div
            className={joinClasses(
              "metadata-section-content",
              resolveMetadataUiSlotClassName("surface")
            )}
          >
            <p>Surface content region</p>
          </div>
        </section>
        <aside
          className={joinClasses(
            "metadata-layout-aside",
            resolveMetadataUiSlotClassName("diagnostics")
          )}
        >
          <p className="text-sm">Diagnostics panel slot</p>
        </aside>
      </div>
      <div
        className={joinClasses(
          "metadata-action-bar",
          resolveMetadataUiSlotClassName("action-bar")
        )}
      >
        <span className="text-sm">Action bar slot</span>
      </div>
    </div>
  ),
};

export const StateAndNumericSlots: Story = {
  render: () => (
    <div
      className={joinClasses(
        "metadata-container metadata-layout-padded",
        resolveMetadataUiSlotClassName("container", { density: "compact" })
      )}
      data-afenda-density={densityToAttribute("compact")}
    >
      <div
        className={joinClasses(
          "metadata-state",
          resolveMetadataUiSlotClassName("state")
        )}
      >
        <p>No records match the current filter.</p>
      </div>
      <table className="mt-4 w-full">
        <tbody>
          <tr>
            <td
              className={joinClasses(
                "metadata-numeric",
                resolveMetadataUiSlotClassName("numeric")
              )}
            >
              128,450.00
            </td>
            <td
              className={resolveMetadataUiSlotClassName("readonly")}
            >
              Read-only label
            </td>
            <td className={resolveMetadataUiSlotClassName("disabled")}>
              Disabled field
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
