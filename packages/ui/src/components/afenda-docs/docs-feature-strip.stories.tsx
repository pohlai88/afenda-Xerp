import type { Meta, StoryObj } from "@storybook/react";
import {
  FileCode2Icon,
  PaletteIcon,
  ScanSearchIcon,
  SparklesIcon,
} from "lucide-react";
import { DocsFeatureStrip } from "./docs-feature-strip";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Feature Strip",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const STRIP_ITEMS = [
  {
    title: "Porcelain material",
    description:
      "Canvas, rail, and paper layering with prose accent reserved for long-form content.",
    icon: PaletteIcon,
    tone: "info" as const,
  },
  {
    title: "Copy-ready blocks",
    description:
      "Storybook reference catalog with zero runtime import from @afenda/docs.",
    icon: FileCode2Icon,
    tone: "success" as const,
  },
  {
    title: "Governed primitives",
    description:
      "Compositions use Card and Badge props only — no className on @afenda/ui.",
    icon: ScanSearchIcon,
  },
  {
    title: "Studio inspiration",
    description:
      "Layouts adapted from /iui features-section patterns without appshell install.",
    icon: SparklesIcon,
  },
] as const;

export const EditorialHighlights: Story = {
  render: () => (
    <DocsPreview width="xl">
      <DocsFeatureStrip
        items={[...STRIP_ITEMS]}
        subtitle="Horizontal feature strip inspired by shadcn/studio marketing blocks."
        title="What you get in Afenda Docs"
      />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="xl">
      <DocsVariantStack>
        <DocsVariantSection label="bordered (default)">
          <DocsFeatureStrip
            items={[...STRIP_ITEMS]}
            title="Bordered strip"
            variant="bordered"
          />
        </DocsVariantSection>
        <DocsVariantSection label="plain">
          <DocsFeatureStrip
            items={[...STRIP_ITEMS]}
            title="Plain strip"
            variant="plain"
          />
        </DocsVariantSection>
        <DocsVariantSection label="dense">
          <DocsFeatureStrip
            items={[...STRIP_ITEMS]}
            title="Dense strip"
            variant="dense"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
