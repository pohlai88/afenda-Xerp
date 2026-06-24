import type { Density } from "@afenda/ui/governance";
import {
  APP_SHELL_RECIPE_SLOTS,
  DENSITIES,
  densityAttributeSelector,
  densityFromAttribute,
  densityToAttribute,
  METADATA_UI_RECIPE_SLOTS,
  resolveAppShellSlotClassName,
  resolveAuthorityRecipeSlotClassName,
  resolveGovernedRecipe,
  resolveMetadataUiSlotClassName,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  StoryFrame,
  StoryRow,
  StoryStack,
} from "../components/_storybook/story-frame";

const DENSITY_LABELS: Record<Density, string> = {
  compact: "Compact",
  standard: "Standard (DOM: default)",
  comfortable: "Comfortable",
};

function SlotPreview({
  label,
  className,
}: {
  readonly label: string;
  readonly className: string;
}) {
  return (
    <div className="min-w-0 rounded-md border border-border border-dashed p-3">
      <p className="mb-2 font-medium text-sm">{label}</p>
      <div
        className={`min-h-16 rounded-sm border border-border/70 p-3 ${className}`}
      >
        <span className="text-xs opacity-80">Token-backed recipe slot</span>
      </div>
    </div>
  );
}

function DensityPreview({ density }: { readonly density: Density }) {
  const attribute = densityToAttribute(density);

  return (
    <div
      className="min-w-0 rounded-md border border-border p-4"
      data-afenda-density={attribute}
    >
      <p className="mb-1 font-medium text-sm">{DENSITY_LABELS[density]}</p>
      <p className="mb-3 text-xs opacity-75">
        <code>data-afenda-density=&quot;{attribute}&quot;</code>
      </p>
      <div
        className="rounded-sm border border-border/70 px-3 py-2"
        style={{
          gap: "var(--afenda-density-standard-gap)",
          paddingInline: "var(--afenda-density-standard-padding-x)",
        }}
      >
        Density-scoped spacing via standard token aliases
      </div>
    </div>
  );
}

const meta = {
  title: "Governance/Authority Recipes",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Runtime slot maps for `app-shell` and `metadata-ui` recipes declared in `@afenda/design-system`. Downstream packages (`@afenda/appshell`, `@afenda/metadata-ui`) should consume `resolveAppShellSlotClassName`, `resolveMetadataUiSlotClassName`, and `densityToAttribute` from `@afenda/ui/governance` — not duplicate token maps locally.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppShellSlots: Story = {
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <p className="text-sm opacity-80">
          Root recipe:{" "}
          <code>
            {resolveGovernedRecipe("app-shell", {
              density: "standard",
            }).className.slice(0, 48)}
            …
          </code>
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {APP_SHELL_RECIPE_SLOTS.map((slot) => (
            <SlotPreview
              className={resolveAppShellSlotClassName(slot)}
              key={slot}
              label={slot}
            />
          ))}
        </div>
      </StoryStack>
    </StoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Every AppShell recipe slot from design-system authority with token-backed Tailwind arbitrary utilities.",
      },
    },
  },
};

export const MetadataUiSlots: Story = {
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <p className="text-sm opacity-80">
          Container recipe:{" "}
          <code>
            {resolveGovernedRecipe("metadata-ui", {
              density: "standard",
            }).className.slice(0, 48)}
            …
          </code>
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {METADATA_UI_RECIPE_SLOTS.map((slot) => (
            <SlotPreview
              className={resolveMetadataUiSlotClassName(slot)}
              key={slot}
              label={slot}
            />
          ))}
        </div>
      </StoryStack>
    </StoryFrame>
  ),
};

export const AuthoritySlotRouter: Story = {
  render: () => (
    <StoryRow gap="md" wrap>
      <div
        className={resolveAuthorityRecipeSlotClassName("app-shell", "topbar")}
      >
        app-shell / topbar
      </div>
      <div
        className={resolveAuthorityRecipeSlotClassName(
          "metadata-ui",
          "diagnostics"
        )}
      >
        metadata-ui / diagnostics
      </div>
    </StoryRow>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`resolveAuthorityRecipeSlotClassName(recipe, slot)` is the shared entry for downstream wiring.",
      },
    },
  },
};

export const DensityBridge: Story = {
  render: () => (
    <StoryStack gap="lg">
      <p className="max-w-2xl text-sm opacity-80">
        TS/API uses <code>standard</code>; DOM hooks use{" "}
        <code>data-afenda-density=&quot;default&quot;</code>. Round-trip:{" "}
        <code>
          densityFromAttribute(&quot;{densityToAttribute("standard")}&quot;) →
          &quot;
          {densityFromAttribute("default")}&quot;
        </code>
        . Selector helper: <code>{densityAttributeSelector("compact")}</code>
      </p>
      <StoryRow gap="md" wrap>
        {DENSITIES.map((density) => (
          <DensityPreview density={density} key={density} />
        ))}
      </StoryRow>
    </StoryStack>
  ),
};
