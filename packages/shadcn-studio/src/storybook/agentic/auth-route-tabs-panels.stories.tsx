import type { Meta, StoryObj } from "@storybook/react";

import AuthShellSurfaceV1 from "../../components-auth-shell/prelogin-bundle-01";
import { agenticFullscreenMetaParameters } from "./agentic-story-parameters.js";

function AuthShellSurfaceV1DrawerPreview() {
  return (
    <div className="w-full max-w-sm">
      <AuthShellSurfaceV1 mode="drawer" triggerLabel="Open authentication" />
    </div>
  );
}

const meta = {
  title: "Agentic/Auth Shell/Compositions/Auth Shell Surface V1",
  component: AuthShellSurfaceV1DrawerPreview,
  tags: ["autodocs", "ai-generated"],
  parameters: {
    ...agenticFullscreenMetaParameters,
    docs: {
      ...agenticFullscreenMetaParameters.docs,
      description: {
        ...agenticFullscreenMetaParameters.docs.description,
        component:
          "Unified auth shell surface component with card and drawer modes.",
      },
    },
  },
} satisfies Meta<typeof AuthShellSurfaceV1DrawerPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Canonical auth shell drawer composition.
 *
 * @summary for validating unified auth shell surface in drawer mode
 */
export const Canonical: Story = {
  render: () => <AuthShellSurfaceV1DrawerPreview />,
};

/**
 * Card mode variant for standalone prelogin rendering.
 *
 * @summary for validating unified auth shell surface in card mode
 */
export const CardMode: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <AuthShellSurfaceV1 />
    </div>
  ),
};
