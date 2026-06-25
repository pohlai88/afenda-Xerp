"use client";

import {
  AppShellAccountSettings02,
  type AppShellAccountSettings02BrowserItem,
  type AppShellAccountSettings02InboxItem,
  type AppShellAccountSettings02NotificationSection,
} from "@afenda/appshell";
import type { TenantNotificationsSettings } from "@afenda/database";
import { useActionState, useMemo, useState } from "react";

import { UPDATE_NOTIFICATIONS_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import { SYSTEM_ADMIN_DND_WEEK_DAYS } from "@/lib/system-admin/system-admin-settings-blocks.contract";
import {
  type UpdateNotificationsSettingsActionState,
  updateNotificationsSettingsAction,
} from "@/lib/system-admin/update-notifications-settings.action";

export interface SystemAdminNotificationsSettingsPanelProps {
  readonly initialSettings: TenantNotificationsSettings;
}

export function SystemAdminNotificationsSettingsPanel({
  initialSettings,
}: SystemAdminNotificationsSettingsPanelProps) {
  const [sections, setSections] = useState<
    AppShellAccountSettings02NotificationSection[]
  >(() => structuredClone(initialSettings.sections));
  const [inboxItems, setInboxItems] = useState<
    AppShellAccountSettings02InboxItem[]
  >(() => initialSettings.inboxItems.map((item) => ({ ...item })));
  const [browserItems, setBrowserItems] = useState<
    AppShellAccountSettings02BrowserItem[]
  >(() => initialSettings.browserItems.map((item) => ({ ...item })));
  const [playSoundOnBlink, setPlaySoundOnBlink] = useState(
    initialSettings.playSoundOnBlink
  );
  const [dndEnabled, setDndEnabled] = useState(initialSettings.dndEnabled);
  const [fromTime, setFromTime] = useState(initialSettings.fromTime);
  const [toTime, setToTime] = useState(initialSettings.toTime);
  const [daysOff, setDaysOff] = useState<string[]>([
    ...initialSettings.daysOff,
  ]);

  const [actionState, formAction, isPending] = useActionState(
    updateNotificationsSettingsAction,
    null satisfies UpdateNotificationsSettingsActionState
  );

  const weekDays = useMemo(
    () => SYSTEM_ADMIN_DND_WEEK_DAYS.map((day) => ({ ...day })),
    []
  );

  const handleSave = () => {
    const formData = new FormData();
    formData.set("intent", UPDATE_NOTIFICATIONS_SETTINGS_INTENT);
    formData.set(
      "payload",
      JSON.stringify({
        sections,
        inboxItems,
        browserItems,
        playSoundOnBlink,
        dndEnabled,
        fromTime,
        toTime,
        daysOff,
      })
    );
    formAction(formData);
  };

  return (
    <>
      <AppShellAccountSettings02
        allNotifications={{
          sections,
          onChannelToggle: (sectionId, itemId, channel, enabled) => {
            setSections((current) =>
              current.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      items: section.items.map((item) =>
                        item.id === itemId
                          ? {
                              ...item,
                              channels: {
                                ...item.channels,
                                [channel]: enabled,
                              },
                            }
                          : item
                      ),
                    }
                  : section
              )
            );
          },
          onColumnToggle: (channel, enabled) => {
            setSections((current) =>
              current.map((section) => ({
                ...section,
                items: section.items.map((item) => ({
                  ...item,
                  channels: { ...item.channels, [channel]: enabled },
                })),
              }))
            );
          },
        }}
        browserNotification={{
          items: browserItems,
          playSoundOnBlink,
          onItemChange: (id, checked) => {
            setBrowserItems((current) =>
              current.map((item) =>
                item.id === id ? { ...item, checked } : item
              )
            );
          },
          onPlaySoundChange: setPlaySoundOnBlink,
        }}
        doNotDisturb={{
          dndEnabled,
          fromTime,
          toTime,
          daysOff,
          weekDays,
          onDndEnabledChange: setDndEnabled,
          onTimeChange: (field, value) => {
            if (field === "from") {
              setFromTime(value);
            } else {
              setToTime(value);
            }
          },
          onDaysOffChange: (days) => setDaysOff([...days]),
        }}
        inboxPreference={{
          items: inboxItems,
          onChange: (id, enabled) => {
            setInboxItems((current) =>
              current.map((item) =>
                item.id === id ? { ...item, enabled } : item
              )
            );
          },
        }}
        onSave={handleSave}
        savePending={isPending}
      />
      {actionState && !actionState.ok ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {actionState.userMessage}
        </p>
      ) : null}
      {actionState?.ok ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Notification settings saved.
        </p>
      ) : null}
    </>
  );
}
