import type { Meta } from "@storybook/react";

import { ErpWorkspaceDashboardPageSample } from "../../../packages/shadcn-studio/src/storybook/erp-workspace-dashboard.compositions.js";

import "../../../packages/shadcn-studio/docs/verdant-noir.css";

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
          "Verdant Milk Noir editorial staging — per-story verdant-noir.css + verdant canvas utilities.",
      },
    },
  },
} satisfies Meta<typeof ErpWorkspaceDashboardPageSample>;

export default meta;

export const VerdantNoir: ErpWorkspaceDashboardStory = {
  tags: ["lab-smoke"],
  render: () => (
    <ErpWorkspaceDashboardPageSample shellClassName="theme-afenda-verdant-milk-noir verdant-canvas min-h-svh" />
  ),
  play: async ({ canvas }) => {
    await runErpWorkspaceDashboardSmoke(canvas);
  },
};
