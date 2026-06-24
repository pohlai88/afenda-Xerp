"use client";

import type { ReactNode } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../../item";
import { Switch } from "../../switch";
import {
  LIST_NOTIFICATION_SETTINGS,
  LIST_NOTIFICATIONS_USER_SETTING,
  type ListNotificationSetting,
} from "./list-fixtures";

export interface StorybookListNotificationsProps {
  readonly settings?: readonly ListNotificationSetting[];
}

/**
 * Storybook-only notification settings list — normalized from shadcn-studio list-02.
 *
 * Phase 3 normalization:
 *   - Zero className on Item*, Switch
 *   - Icon sizing via list-preview.css on [data-slot="item-media"] svg
 *   - Item variant="outline", ItemMedia variant="icon" (governed props only)
 */
export function StorybookListNotifications({
  settings = LIST_NOTIFICATION_SETTINGS,
}: StorybookListNotificationsProps): ReactNode {
  return (
    <div className="afenda-storybook-list">
      {settings.map(
        ({ id, title, description, icon: Icon, defaultChecked }) => (
          <Item key={id} variant="outline">
            <ItemMedia variant="icon">
              <Icon aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch
                aria-label={title}
                id={id}
                {...(defaultChecked ? { defaultChecked: true } : {})}
              />
            </ItemActions>
          </Item>
        )
      )}
    </div>
  );
}

/** Four settings plus profile visibility row — matches list-02 item count. */
export function StorybookListNotificationsWithProfile(): ReactNode {
  return (
    <StorybookListNotifications
      settings={[
        ...LIST_NOTIFICATION_SETTINGS,
        LIST_NOTIFICATIONS_USER_SETTING,
      ]}
    />
  );
}
