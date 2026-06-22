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
  resolvePolicyGateUxCopy,
  type PolicyGateSurfaceVariant,
} from "@/lib/api/policy-gate-ux.contract";

export type PolicyGateSurfaceGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Alert"
  | "AlertDialog"
  | "Button"
>;

export interface PolicyGateSurfaceProps {
  readonly correlationId?: string;
  readonly gateDecision: ApiPolicyGateDecision;
  readonly message?: string;
  readonly onDismiss?: () => void;
  readonly onPrimaryAction?: () => void;
  readonly onOpenChange?: (open: boolean) => void;
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
        {correlationId !== undefined ? (
          <AlertDescription>
            Reference: <code>{correlationId}</code>
          </AlertDescription>
        ) : null}
        <AlertAction>
          {copy.primaryActionLabel !== null ? (
            <Button
              emphasis="solid"
              intent="primary"
              onClick={onPrimaryAction}
              size="sm"
            >
              {copy.primaryActionLabel}
            </Button>
          ) : null}
          {onDismiss !== undefined ? (
            <Button
              emphasis="outline"
              intent="secondary"
              onClick={onDismiss}
              size="sm"
            >
              Dismiss
            </Button>
          ) : null}
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
          {correlationId !== undefined ? (
            <AlertDialogDescription>
              Reference: <code>{correlationId}</code>
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="secondary">
            Close
          </AlertDialogCancel>
          {copy.primaryActionLabel !== null ? (
            <AlertDialogAction
              onClick={onPrimaryAction}
            >
              {copy.primaryActionLabel}
            </AlertDialogAction>
          ) : null}
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
