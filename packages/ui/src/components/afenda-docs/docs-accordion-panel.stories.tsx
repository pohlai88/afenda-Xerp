import type { Meta, StoryObj } from "@storybook/react";
import { DocsAccordionPanel } from "./docs-accordion-panel";
import { SAMPLE_FAQ_ITEMS } from "./docs-fixtures";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Accordion Panel",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const FIRST_ITEM = SAMPLE_FAQ_ITEMS[0].title;
const ALL_ITEMS = SAMPLE_FAQ_ITEMS.map((i) => i.title);

/**
 * OpenStateAccent — primary showcase for the /rui accordion-04 improvement.
 *
 * accordion-04 patterns applied:
 *   - Plus/minus icon with path animation (default iconStyle)
 *   - Open trigger receives 5% accent background tint
 *   - 120ms ease transition on background-color (not jarring)
 *   - Closed items remain neutral
 *
 * Compare: item-1 is open (accent tint visible), items 2–3 are closed (neutral).
 */
export const OpenStateAccent: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="contained — open trigger shows accent tint (from accordion-04)">
          <DocsAccordionPanel
            defaultOpenItems={[FIRST_ITEM]}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="contained"
          />
        </DocsVariantSection>

        <DocsVariantSection label="separated — each item is a card; open item gets accent tint">
          <DocsAccordionPanel
            defaultOpenItems={[FIRST_ITEM]}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="separated"
          />
        </DocsVariantSection>

        <DocsVariantSection label="flush — full-width dividers; open item tint against white">
          <DocsAccordionPanel
            defaultOpenItems={[FIRST_ITEM]}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="flush"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};

/**
 * Faq — default FAQ accordion, first item expanded.
 * Primary usage pattern for docs pages.
 */
export const Faq: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsAccordionPanel
        defaultOpenItems={[FIRST_ITEM]}
        items={[...SAMPLE_FAQ_ITEMS]}
      />
    </DocsPreview>
  ),
};

/**
 * VariantMatrix — all three visual variants for selection.
 * Use this to pick which variant fits a docs page's density.
 */
export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="contained (default) — bordered card, items share surface">
          <DocsAccordionPanel
            defaultOpenItems={[FIRST_ITEM]}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="contained"
          />
        </DocsVariantSection>

        <DocsVariantSection label="separated — individual cards with gap (higher visual weight)">
          <DocsAccordionPanel
            defaultOpenItems={[FIRST_ITEM]}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="separated"
          />
        </DocsVariantSection>

        <DocsVariantSection label="flush — borderless strip (lowest visual weight, inline use)">
          <DocsAccordionPanel
            defaultOpenItems={[FIRST_ITEM]}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="flush"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};

/** ChevronIcon — governed default chevrons instead of accordion-04 plus/minus. */
export const ChevronIcon: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsAccordionPanel
        defaultOpenItems={[FIRST_ITEM]}
        iconStyle="chevron"
        items={[...SAMPLE_FAQ_ITEMS]}
      />
    </DocsPreview>
  ),
};

/** AllOpen — all items expanded; verifies padding + layout at max height. */
export const AllOpen: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="contained — all open">
          <DocsAccordionPanel
            defaultOpenItems={ALL_ITEMS}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="contained"
          />
        </DocsVariantSection>

        <DocsVariantSection label="separated — all open">
          <DocsAccordionPanel
            defaultOpenItems={ALL_ITEMS}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="separated"
          />
        </DocsVariantSection>

        <DocsVariantSection label="flush — all open">
          <DocsAccordionPanel
            defaultOpenItems={ALL_ITEMS}
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="flush"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
