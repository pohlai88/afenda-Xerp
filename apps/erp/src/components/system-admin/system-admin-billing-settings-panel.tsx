"use client";

import { AppShellAccountSettings07 } from "@afenda/appshell";
import type { TenantBillingSettings } from "@afenda/database";
import { useActionState, useState } from "react";
import { UPDATE_BILLING_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import { SYSTEM_ADMIN_BILLING_USAGE_ROWS } from "@/lib/system-admin/system-admin-settings-blocks.contract";
import {
  type UpdateBillingSettingsActionState,
  updateBillingSettingsAction,
} from "@/lib/system-admin/update-billing-settings.action";

export interface SystemAdminBillingSettingsPanelProps {
  readonly initialSettings: TenantBillingSettings;
}

export function SystemAdminBillingSettingsPanel({
  initialSettings,
}: SystemAdminBillingSettingsPanelProps) {
  const [spendEnabled, setSpendEnabled] = useState(
    initialSettings.spendEnabled
  );
  const [setAmount, setSetAmount] = useState(initialSettings.setAmount);
  const [notificationEmail, setNotificationEmail] = useState(
    initialSettings.notificationEmail
  );
  const [addOns, setAddOns] = useState(() =>
    initialSettings.addOns.map(({ badgeLabel, ...addOn }) =>
      badgeLabel === undefined ? addOn : { ...addOn, badgeLabel }
    )
  );
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    initialSettings.selectedPreset
  );
  const [customAmount, setCustomAmount] = useState(
    initialSettings.customAmount
  );
  const [autoPayEnabled, setAutoPayEnabled] = useState(
    initialSettings.autoPayEnabled
  );

  const [actionState, formAction, isPending] = useActionState(
    updateBillingSettingsAction,
    null satisfies UpdateBillingSettingsActionState
  );

  const handleUpdate = () => {
    const formData = new FormData();
    formData.set("intent", UPDATE_BILLING_SETTINGS_INTENT);
    formData.set(
      "payload",
      JSON.stringify({
        spendEnabled,
        setAmount,
        notificationEmail,
        addOns,
        selectedPreset,
        customAmount,
        autoPayEnabled,
      })
    );
    formAction(formData);
  };

  return (
    <>
      <AppShellAccountSettings07
        addOns={{
          addOns,
          onToggle: (addOnId, enabled) => {
            setAddOns((current) =>
              current.map((addOn) =>
                addOn.id === addOnId ? { ...addOn, enabled } : addOn
              )
            );
          },
        }}
        aiGateway={{
          balanceLabel: "$0.00",
          creditPresets: ["$10", "$25", "$50", "$100"],
          customAmount,
          autoPayEnabled,
          autoPayMax: "500",
          autoPayRecharge: "50",
          autoPayThreshold: "10",
          onCustomAmountChange: setCustomAmount,
          onPresetSelect: setSelectedPreset,
          onAutoPayEnabledChange: setAutoPayEnabled,
          ...(selectedPreset === undefined ? {} : { selectedPreset }),
        }}
        allBilling={{
          planName: "Starter plan",
          planDescription:
            "Discounted plan for start-ups and growing companies",
          planPriceLabel: "$90",
          usageRows: SYSTEM_ADMIN_BILLING_USAGE_ROWS,
          extraLineTitle: "Query super caching",
          extraLineDescription: "4 GB query cache, $120/mo",
          extraLinePrice: "$120.00",
          totalLabel: "Total for current cycle",
          totalAmountLabel: "$317.00",
        }}
        paymentMethod={{ methods: [] }}
        planAlert={{
          title: "This workspace is currently on the free plan",
          description:
            "Boost your analytics and unlock advanced features with premium plans.",
        }}
        spendManagement={{
          enabled: spendEnabled,
          progressPercent: spendEnabled ? 79 : 0,
          usedAmountLabel: spendEnabled ? "$317" : "$0",
          limitAmountLabel: spendEnabled ? "$400" : "$0",
          setAmount,
          notificationEmail,
          onEnabledChange: setSpendEnabled,
          onSetAmountChange: setSetAmount,
          onNotificationEmailChange: setNotificationEmail,
          onUpdate: handleUpdate,
          pending: isPending,
        }}
      />
      {actionState && !actionState.ok ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {actionState.userMessage}
        </p>
      ) : null}
      {actionState?.ok ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Billing settings saved.
        </p>
      ) : null}
    </>
  );
}
