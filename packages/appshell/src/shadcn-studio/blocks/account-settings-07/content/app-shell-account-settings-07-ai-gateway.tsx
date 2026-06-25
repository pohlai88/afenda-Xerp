"use client";

import {
  Button,
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Label,
  Separator,
  Switch,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { ChevronDownIcon } from "lucide-react";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings07AiGatewayProps {
  readonly autoPayEnabled: boolean;
  readonly autoPayMax: string;
  readonly autoPayRecharge: string;
  readonly autoPayThreshold: string;
  readonly balanceLabel: string;
  readonly creditPresets: readonly string[];
  readonly customAmount: string;
  readonly onAutoPayEnabledChange?: (enabled: boolean) => void;
  readonly onAutoPayMaxChange?: (value: string) => void;
  readonly onAutoPayRechargeChange?: (value: string) => void;
  readonly onAutoPaySave?: () => void;
  readonly onAutoPayThresholdChange?: (value: string) => void;
  readonly onContinueToPayment?: (amount: string) => void;
  readonly onCustomAmountChange?: (value: string) => void;
  readonly onPresetSelect?: (amount: string) => void;
  readonly pending?: boolean;
  readonly selectedPreset?: string;
}

export function AppShellAccountSettings07AiGateway({
  autoPayEnabled,
  autoPayMax,
  autoPayRecharge,
  autoPayThreshold,
  balanceLabel,
  creditPresets,
  customAmount,
  onAutoPayEnabledChange,
  onAutoPayMaxChange,
  onAutoPayRechargeChange,
  onAutoPaySave,
  onAutoPayThresholdChange,
  onContinueToPayment,
  onCustomAmountChange,
  onPresetSelect,
  pending = false,
  selectedPreset,
}: AppShellAccountSettings07AiGatewayProps) {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage AI gateway credits and auto-reload settings."
      title="AI gateway"
      titleId={sectionId}
    >
      <Card>
        <div className="app-shell-studio-account-settings-06__panel">
          <p className="app-shell-studio-account-settings-02__item-title">
            Balance: {balanceLabel}
          </p>
          <div className="app-shell-studio-account-settings-07__credit-presets">
            {creditPresets.map((preset) => (
              <Button
                disabled={pending || !onPresetSelect}
                emphasis={selectedPreset === preset ? "solid" : "outline"}
                intent="secondary"
                key={preset}
                onClick={() => onPresetSelect?.(preset)}
                presentation="default"
                size="sm"
                type="button"
              >
                {preset}
              </Button>
            ))}
          </div>
          <div className="app-shell-studio-account-settings-03__field">
            <Label htmlFor={`${sectionId}-custom`}>Custom amount</Label>
            <Input
              disabled={pending || !onCustomAmountChange}
              id={`${sectionId}-custom`}
              onChange={(event) =>
                onCustomAmountChange?.(event.currentTarget.value)
              }
              value={customAmount}
            />
          </div>
          {onContinueToPayment ? (
            <Button
              disabled={pending}
              emphasis="solid"
              intent="primary"
              onClick={() =>
                onContinueToPayment(selectedPreset ?? customAmount)
              }
              presentation="default"
              size="md"
              type="button"
            >
              Continue to payment
            </Button>
          ) : null}
          <Separator />
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <Button
                emphasis="ghost"
                intent="secondary"
                presentation="default"
                size="sm"
                type="button"
              >
                Auto reload
                <ChevronDownIcon aria-hidden />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="app-shell-studio-account-settings-07__auto-pay">
                <div className="app-shell-studio-account-settings-02__toggle-row">
                  <Switch
                    checked={autoPayEnabled}
                    disabled={pending || !onAutoPayEnabledChange}
                    size="md"
                    {...(onAutoPayEnabledChange
                      ? { onCheckedChange: onAutoPayEnabledChange }
                      : {})}
                  />
                  <p className="app-shell-studio-account-settings-06__description">
                    Enable automatic credit reload
                  </p>
                </div>
                <div className="app-shell-studio-account-settings-07__auto-pay-fields">
                  <div className="app-shell-studio-account-settings-03__field">
                    <Label>Threshold ($)</Label>
                    <Input
                      disabled={pending || !onAutoPayThresholdChange}
                      onChange={(event) =>
                        onAutoPayThresholdChange?.(event.currentTarget.value)
                      }
                      value={autoPayThreshold}
                    />
                  </div>
                  <div className="app-shell-studio-account-settings-03__field">
                    <Label>Recharge ($)</Label>
                    <Input
                      disabled={pending || !onAutoPayRechargeChange}
                      onChange={(event) =>
                        onAutoPayRechargeChange?.(event.currentTarget.value)
                      }
                      value={autoPayRecharge}
                    />
                  </div>
                  <div className="app-shell-studio-account-settings-03__field">
                    <Label>Max monthly ($)</Label>
                    <Input
                      disabled={pending || !onAutoPayMaxChange}
                      onChange={(event) =>
                        onAutoPayMaxChange?.(event.currentTarget.value)
                      }
                      value={autoPayMax}
                    />
                  </div>
                </div>
                {onAutoPaySave ? (
                  <Button
                    disabled={pending}
                    emphasis="solid"
                    intent="primary"
                    onClick={onAutoPaySave}
                    presentation="default"
                    size="sm"
                    type="button"
                  >
                    Save auto reload
                  </Button>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings07AiGatewayGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Card"
  | "Collapsible"
  | "CollapsibleContent"
  | "CollapsibleTrigger"
  | "Input"
  | "Label"
  | "Separator"
  | "Switch"
>;
