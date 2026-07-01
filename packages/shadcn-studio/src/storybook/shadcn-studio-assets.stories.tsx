/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-svg-gallery.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import {
  BadgeCheckIcon,
  FacebookIcon,
  FigmaIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  CustomersCardSvg,
  RatingsCardSvg,
  SessionCardSvg,
  TotalOrdersCardSvg,
  Error02Illustration,
  LogoSvg,
  MultiStep01Illustration,
} from "../components-assets/index.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Assets",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "SVG React assets (icons, card illustrations, lab graphics) using theme CSS variables.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <figure key="BadgeCheckIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <BadgeCheckIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">BadgeCheckIcon</figcaption>
      </figure>
      <figure key="FacebookIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <FacebookIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">FacebookIcon</figcaption>
      </figure>
      <figure key="FigmaIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <FigmaIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">FigmaIcon</figcaption>
      </figure>
      <figure key="InstagramIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <InstagramIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">InstagramIcon</figcaption>
      </figure>
      <figure key="LinkedinIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <LinkedinIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">LinkedinIcon</figcaption>
      </figure>
      <figure key="TwitterIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <TwitterIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">TwitterIcon</figcaption>
      </figure>
    </div>
  ),
};

export const AllCardIllustrations: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <figure key="CustomersCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <CustomersCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">CustomersCardSvg</figcaption>
      </figure>
      <figure key="RatingsCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <RatingsCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">RatingsCardSvg</figcaption>
      </figure>
      <figure key="SessionCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <SessionCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">SessionCardSvg</figcaption>
      </figure>
      <figure key="TotalOrdersCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <TotalOrdersCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">TotalOrdersCardSvg</figcaption>
      </figure>
    </div>
  ),
};

export const AllIllustrations: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <figure key="Error02Illustration" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <Error02Illustration className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">Error02Illustration</figcaption>
      </figure>
      <figure key="LogoSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <LogoSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">LogoSvg</figcaption>
      </figure>
      <figure key="MultiStep01Illustration" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <MultiStep01Illustration className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">MultiStep01Illustration</figcaption>
      </figure>
    </div>
  ),
};

export const AllAssetsDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 font-medium text-sm">Icons</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <figure key="BadgeCheckIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <BadgeCheckIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">BadgeCheckIcon</figcaption>
      </figure>
      <figure key="FacebookIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <FacebookIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">FacebookIcon</figcaption>
      </figure>
      <figure key="FigmaIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <FigmaIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">FigmaIcon</figcaption>
      </figure>
      <figure key="InstagramIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <InstagramIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">InstagramIcon</figcaption>
      </figure>
      <figure key="LinkedinIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <LinkedinIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">LinkedinIcon</figcaption>
      </figure>
      <figure key="TwitterIcon" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <TwitterIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">TwitterIcon</figcaption>
      </figure>
    </div>
      </section>
      <section>
        <h3 className="mb-3 font-medium text-sm">Card illustrations</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <figure key="CustomersCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <CustomersCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">CustomersCardSvg</figcaption>
      </figure>
      <figure key="RatingsCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <RatingsCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">RatingsCardSvg</figcaption>
      </figure>
      <figure key="SessionCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <SessionCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">SessionCardSvg</figcaption>
      </figure>
      <figure key="TotalOrdersCardSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <TotalOrdersCardSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">TotalOrdersCardSvg</figcaption>
      </figure>
    </div>
      </section>
      <section>
        <h3 className="mb-3 font-medium text-sm">Illustrations</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <figure key="Error02Illustration" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <Error02Illustration className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">Error02Illustration</figcaption>
      </figure>
      <figure key="LogoSvg" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <LogoSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">LogoSvg</figcaption>
      </figure>
      <figure key="MultiStep01Illustration" className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
        <MultiStep01Illustration className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">MultiStep01Illustration</figcaption>
      </figure>
    </div>
      </section>
    </div>
  ),
};
