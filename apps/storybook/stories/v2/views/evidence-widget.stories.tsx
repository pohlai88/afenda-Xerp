import { EvidenceWidget } from "@afenda/shadcn-studio-v2";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

const sampleItems = [
  { id: "policy", label: "Policy attestation", status: "complete" as const },
  { id: "audit", label: "Audit trail export", status: "pending" as const },
  { id: "signature", label: "Operator signature", status: "missing" as const },
];

const meta = {
  title: "Shadcn Studio V2/Views/EvidenceWidget",
  component: EvidenceWidget,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "L4 evidence widget adapter with item status variants and non-ready states.",
      },
    },
  },
  args: {
    label: "Compliance evidence",
    description: "Readiness checks for operator workspace approval.",
    summary: "2 of 3 complete",
    items: sampleItems,
  },
} satisfies Meta<typeof EvidenceWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready", summary: "2 of 3 complete", items: sampleItems },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Compliance evidence" })
    ).toBeVisible();
    await expect(canvas.getByText("2 of 3 complete")).toBeVisible();
    await expect(canvas.getByText("Policy attestation")).toBeVisible();
  },
};

export const ReadyAllComplete: Story = {
  args: {
    state: "ready",
    summary: "3 of 3 complete",
    items: sampleItems.map((item) => ({
      ...item,
      status: "complete" as const,
    })),
  },
};

export const ReadyAllMissing: Story = {
  args: {
    state: "ready",
    summary: "0 of 3 complete",
    items: sampleItems.map((item) => ({ ...item, status: "missing" as const })),
  },
};

export const Loading: Story = {
  args: { state: "loading", summary: undefined, items: undefined },
};

export const Empty: Story = {
  args: { state: "empty", summary: undefined, items: undefined },
};

export const ErrorState: Story = {
  args: { state: "error", summary: undefined, items: undefined },
};

export const Unavailable: Story = {
  args: { state: "unavailable", summary: undefined, items: undefined },
};
