import type { Meta } from "@storybook/react";

import type { ErpWorkspaceDashboardPageSample } from "../../../packages/shadcn-studio/src/storybook/erp-workspace-dashboard.compositions.js";

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
          "AdminCN default — preview.css Layer 0–1 only. No per-story noir CSS import.",
      },
    },
  },
} satisfies Meta<typeof ErpWorkspaceDashboardPageSample>;

export default meta;

export const AdminCNBaseline: ErpWorkspaceDashboardStory = {
  tags: ["lab-smoke"],
  play: async ({ canvas }) => {
    await runErpWorkspaceDashboardSmoke(canvas);
  },
};
