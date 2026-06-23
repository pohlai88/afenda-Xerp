"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertTitle,
  Button,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import type { ApiPolicyGateDecision } from "@/lib/api/api-envelope.client";
import {
  type PolicyGateSurfaceVariant,
  resolvePolicyGateUxCopy,
} from "@/lib/api/policy-gate-ux.contract";

export type PolicyGateSurfaceGovernedComponents = Extract<
  GovernedUiComponentName,
  "Alert" | "AlertDialog" | "Button"
>;

export interface PolicyGateSurfaceProps {
  readonly correlationId?: string;
  readonly gateDecision: ApiPolicyGateDecision;
  readonly message?: string;
  readonly onDismiss?: () => void;
  readonly onOpenChange?: (open: boolean) => void;
  readonly onPrimaryAction?: () => void;
  readonly open?: boolean;
  readonly variant?: PolicyGateSurfaceVariant;
}

function PolicyGateInlineSurface({
  correlationId,
  gateDecision,
  message,
  onDismiss,
  onPrimaryAction,
}: Omit<PolicyGateSurfaceProps, "onOpenChange" | "open" | "variant">) {
  const copy = resolvePolicyGateUxCopy(gateDecision);
  const detailMessage = message?.trim() ?? copy.description;

  return (
    <div className="erp-policy-gate erp-policy-gate--inline">
      <Alert role="alert" tone={copy.tone}>
        <AlertTitle>{copy.title}</AlertTitle>
        <AlertDescription>{detailMessage}</AlertDescription>
        {correlationId === undefined ? null : (
          <AlertDescription>
            Reference: <code>{correlationId}</code>
          </AlertDescription>
        )}
        <AlertAction>
          {copy.primaryActionLabel === null ? null : (
            <Button
              emphasis="solid"
              intent="primary"
              onClick={onPrimaryAction}
              size="sm"
            >
              {copy.primaryActionLabel}
            </Button>
          )}
          {onDismiss === undefined ? null : (
            <Button
              emphasis="outline"
              intent="secondary"
              onClick={onDismiss}
              size="sm"
            >
              Dismiss
            </Button>
          )}
        </AlertAction>
      </Alert>
    </div>
  );
}

function PolicyGateDialogSurface({
  correlationId,
  gateDecision,
  message,
  onDismiss,
  onOpenChange,
  onPrimaryAction,
  open = true,
}: Omit<PolicyGateSurfaceProps, "variant">) {
  const copy = resolvePolicyGateUxCopy(gateDecision);
  const detailMessage = message?.trim() ?? copy.description;

  return (
    <AlertDialog
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);
        if (!nextOpen) {
          onDismiss?.();
        }
      }}
      open={open}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>{detailMessage}</AlertDialogDescription>
          {correlationId === undefined ? null : (
            <AlertDialogDescription>
              Reference: <code>{correlationId}</code>
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="secondary">
            Close
          </AlertDialogCancel>
          {copy.primaryActionLabel === null ? null : (
            <AlertDialogAction onClick={onPrimaryAction}>
              {copy.primaryActionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PolicyGateSurface({
  variant = "inline",
  ...props
}: PolicyGateSurfaceProps) {
  if (variant === "dialog") {
    return <PolicyGateDialogSurface {...props} />;
  }

  return <PolicyGateInlineSurface {...props} />;
}
