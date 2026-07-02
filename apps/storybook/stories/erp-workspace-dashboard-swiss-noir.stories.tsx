import type { Meta } from "@storybook/react";

import { ErpWorkspaceDashboardPageSample } from "../../../packages/shadcn-studio/src/storybook/erp-workspace-dashboard.compositions.js";

import "../../../packages/shadcn-studio/docs/swiss-noir.css";

import {
  erpWorkspaceDashboardMeta,
  runErpWorkspaceDashboardSmoke,
  type ErpWorkspaceDashboardStory,
} from "./erp-workspace-dashboard.shared.js";

const meta = {
  ...erpWorkspaceDashboardMeta,
  parameters: {
    ...erpWorkspaceDashboardMeta.parameters,
    docs: {
      ...erpWorkspaceDashboardMeta.parameters.docs,
      description: {
        component:
          "Swiss Noir editorial staging — per-story swiss-noir.css + dark theme-afenda-brand lab canvas.",
      },
    },
  },
} satisfies Meta<typeof ErpWorkspaceDashboardPageSample>;

export default meta;

export const SwissNoir: ErpWorkspaceDashboardStory = {
  tags: ["lab-smoke"],
  render: () => (
    <ErpWorkspaceDashboardPageSample shellClassName="dark theme-afenda-brand lab-noir-canvas min-h-svh" />
  ),
  play: async ({ canvas }) => {
    await runErpWorkspaceDashboardSmoke(canvas);
  },
};
