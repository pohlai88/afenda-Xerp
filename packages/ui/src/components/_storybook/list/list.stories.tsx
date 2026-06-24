import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame, StoryStack } from "../story-frame";
import { LIST_NOTIFICATION_SETTINGS } from "./list-fixtures";
import {
  StorybookListNotifications,
  StorybookListNotificationsWithProfile,
} from "./list-notifications-demo";

const meta = {
  title: "Storybook / List (Notifications)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * ListNotifications — normalized from shadcn-studio list-02.
 *
 * Patterns applied:
 *   - Outline Item rows with icon ItemMedia + Switch in ItemActions
 *   - ERP notification settings copy (approvals, audit, workflow)
 *   - aria-label on each Switch for accessibility
 *
 * Compare with Primitives/Item → ERP — Notification Item for read-only inbox rows.
 */
export const ListNotifications: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookListNotificationsWithProfile />
      </div>
    </StoryFrame>
  ),
};

/** Foundation-only settings — four ERP alert channels. */
export const FoundationSettings: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookListNotifications settings={LIST_NOTIFICATION_SETTINGS} />
      </div>
    </StoryFrame>
  ),
};

/** All switches on by default. */
export const AllEnabled: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookListNotifications
          settings={LIST_NOTIFICATION_SETTINGS.map((setting) => ({
            ...setting,
            defaultChecked: true,
          }))}
        />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsPrimitiveNotification — points to governed primitive story equivalent.
 *
 * Primitives/Item → ERP — Notification Item uses Badge actions instead of Switch.
 */
export const VsPrimitiveNotification: Story = {
  render: () => (
    <StoryFrame width="lg">
      <div className="afenda-docs-preview">
        <StoryStack gap="lg">
          <StorybookListNotificationsWithProfile />
          <p className="text-muted-foreground text-sm">
            Read-only inbox variant: Primitives / Item → ERP — Notification Item
          </p>
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};
