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
  LogoSvg,
  Error02Illustration,
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
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="BadgeCheckIcon"
      >
        <BadgeCheckIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          BadgeCheckIcon
        </figcaption>
      </figure>
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="FacebookIcon"
      >
        <FacebookIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          FacebookIcon
        </figcaption>
      </figure>
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="FigmaIcon"
      >
        <FigmaIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          FigmaIcon
        </figcaption>
      </figure>
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="InstagramIcon"
      >
        <InstagramIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          InstagramIcon
        </figcaption>
      </figure>
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="LinkedinIcon"
      >
        <LinkedinIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          LinkedinIcon
        </figcaption>
      </figure>
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="TwitterIcon"
      >
        <TwitterIcon className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          TwitterIcon
        </figcaption>
      </figure>
    </div>
  ),
};

export const AllCardIllustrations: Story = {
  render: () => (
    <p className="text-muted-foreground text-sm">No card assets exported.</p>
  ),
};

export const AllIllustrations: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="LogoSvg"
      >
        <LogoSvg className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          LogoSvg
        </figcaption>
      </figure>
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="Error02Illustration"
      >
        <Error02Illustration className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          Error02Illustration
        </figcaption>
      </figure>
      <figure
        className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
        key="MultiStep01Illustration"
      >
        <MultiStep01Illustration className="text-primary" />
        <figcaption className="text-muted-foreground text-xs">
          MultiStep01Illustration
        </figcaption>
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
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="BadgeCheckIcon"
          >
            <BadgeCheckIcon className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              BadgeCheckIcon
            </figcaption>
          </figure>
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="FacebookIcon"
          >
            <FacebookIcon className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              FacebookIcon
            </figcaption>
          </figure>
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="FigmaIcon"
          >
            <FigmaIcon className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              FigmaIcon
            </figcaption>
          </figure>
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="InstagramIcon"
          >
            <InstagramIcon className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              InstagramIcon
            </figcaption>
          </figure>
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="LinkedinIcon"
          >
            <LinkedinIcon className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              LinkedinIcon
            </figcaption>
          </figure>
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="TwitterIcon"
          >
            <TwitterIcon className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              TwitterIcon
            </figcaption>
          </figure>
        </div>
      </section>
      <section>
        <h3 className="mb-3 font-medium text-sm">Card illustrations</h3>
        <p className="text-muted-foreground text-sm">
          No card assets exported.
        </p>
      </section>
      <section>
        <h3 className="mb-3 font-medium text-sm">Illustrations</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="LogoSvg"
          >
            <LogoSvg className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              LogoSvg
            </figcaption>
          </figure>
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="Error02Illustration"
          >
            <Error02Illustration className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              Error02Illustration
            </figcaption>
          </figure>
          <figure
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4"
            key="MultiStep01Illustration"
          >
            <MultiStep01Illustration className="text-primary" />
            <figcaption className="text-muted-foreground text-xs">
              MultiStep01Illustration
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  ),
};
