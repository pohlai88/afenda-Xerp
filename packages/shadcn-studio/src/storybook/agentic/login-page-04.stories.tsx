import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import LoginPage04 from "../../components-auth-shell/login-page-04.js";
import {
  agenticFullscreenMetaParameters,
} from "./agentic-story-parameters.js";

// SB 10.4 presentational page — stock block, no ERP auth/BFF wiring in CSF.
// https://storybook.js.org/docs/writing-stories/build-pages-with-storybook#pure-presentational-pages
const meta = {
  title: "Agentic/AuthShell",
  component: LoginPage04,
  tags: ["autodocs", "ai-generated"],
  parameters: agenticFullscreenMetaParameters,
} satisfies Meta<typeof LoginPage04>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginPage04Stock: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(
      canvas.getByPlaceholderText(/enter your email address/i)
    ).toBeVisible();
    await expect(canvas.getByPlaceholderText(/•+/)).toBeVisible();
    await expect(canvas.getByRole("button", { name: /sign in/i })).toBeVisible();
  },
};
