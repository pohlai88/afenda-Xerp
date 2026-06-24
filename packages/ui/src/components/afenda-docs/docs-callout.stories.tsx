import type { Meta, StoryObj } from "@storybook/react";
import { DocsCallout } from "./docs-callout";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Callout",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const CALLOUT_BODY =
  "Copy editorial blocks from Storybook into apps/docs — do not import fumadocs-ui in @afenda/ui stories.";

const WARN_BODY =
  "apps/docs must keep zero @afenda/* runtime dependencies unless the dependency registry is updated first.";

/**
 * SuccessIndicator — primary showcase for /rui alert-11.
 *
 * alert-11 patterns applied:
 *   - UserCheckIcon in success foreground color
 *   - 10% success-tinted background
 *   - 4px left border in success tone
 *   - Title in success foreground (body stays muted when present)
 */
export const SuccessIndicator: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsCallout
        title="Your request to join the team is approved."
        tone="success"
      />
    </DocsPreview>
  ),
};

/**
 * ToneMatrix — the primary selection story.
 *
 * Shows all tones (note / info / warn / success) with:
 *   - Tone-matched icon from /rui alert-11 pattern
 *   - 10% tinted background per tone
 *   - 4px left border in tone color
 */
export const ToneMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="note — info icon + accent tint bg">
          <DocsCallout title="Note" tone="note">
            {CALLOUT_BODY}
          </DocsCallout>
        </DocsVariantSection>

        <DocsVariantSection label="info — info icon + accent tint bg">
          <DocsCallout title="Info" tone="info">
            {CALLOUT_BODY}
          </DocsCallout>
        </DocsVariantSection>

        <DocsVariantSection label="success — UserCheck icon + green tint (alert-11)">
          <DocsCallout
            title="Your request to join the team is approved."
            tone="success"
          />
        </DocsVariantSection>

        <DocsVariantSection label="warn — triangle icon + amber tint bg + role=alert">
          <DocsCallout title="Boundary" tone="warn">
            {WARN_BODY}
          </DocsCallout>
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};

/**
 * VariantMatrix — all 3 visual variants × all 3 tones.
 *
 * rail = left border + tint (default)
 * soft = same tint, 1px border all sides
 * banner = centered, rounded xl
 */
export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="rail (default) — 4px left border + tinted bg">
          <DocsVariantStack>
            <DocsCallout title="Note" tone="note" variant="rail">
              {CALLOUT_BODY}
            </DocsCallout>
            <DocsCallout title="Info" tone="info" variant="rail">
              {CALLOUT_BODY}
            </DocsCallout>
            <DocsCallout title="Warn" tone="warn" variant="rail">
              {WARN_BODY}
            </DocsCallout>
          </DocsVariantStack>
        </DocsVariantSection>

        <DocsVariantSection label="soft — full border + accent wash">
          <DocsVariantStack>
            <DocsCallout title="Note" tone="note" variant="soft">
              {CALLOUT_BODY}
            </DocsCallout>
            <DocsCallout title="Info" tone="info" variant="soft">
              {CALLOUT_BODY}
            </DocsCallout>
            <DocsCallout title="Warn" tone="warn" variant="soft">
              {WARN_BODY}
            </DocsCallout>
          </DocsVariantStack>
        </DocsVariantSection>

        <DocsVariantSection label="banner — centered, rounded xl">
          <DocsCallout title="System maintenance window" variant="banner">
            Scheduled downtime on Sunday 02:00–04:00 UTC. Read-only mode active.
          </DocsCallout>
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};

/** Single note callout without title — body-only layout. */
export const BodyOnly: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsCallout>{CALLOUT_BODY}</DocsCallout>
    </DocsPreview>
  ),
};

/** Warn tone — also demonstrates role="alert" on the aside element. */
export const WarnAlert: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsCallout title="Boundary" tone="warn">
        {WARN_BODY}
      </DocsCallout>
    </DocsPreview>
  ),
};
