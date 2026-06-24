"use client";

import { Button } from "@afenda/ui";
import { useActionState } from "react";

import {
  ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE,
  ACCOUNTING_READINESS_GATE_REFRESH_PENDING_LABEL,
  ACCOUNTING_READINESS_GATE_REFRESH_SUBMIT_LABEL,
} from "@/lib/system-admin/accounting-readiness-gate.copy.contract";
import {
  type RefreshAccountingReadinessGateFullActionState,
  refreshAccountingReadinessGateFullAction,
} from "@/lib/system-admin/refresh-accounting-readiness-gate-full.action";

export function SystemAdminReadinessGateRefreshForm() {
  const [actionState, formAction, isPending] = useActionState(
    refreshAccountingReadinessGateFullAction,
    null satisfies RefreshAccountingReadinessGateFullActionState
  );

  return (
    <form
      action={formAction}
      aria-busy={isPending}
      className="app-shell-readiness-gate-refresh-form"
    >
      {actionState && !actionState.ok ? (
        <p
          className="app-shell-readiness-gate-refresh-form__message"
          role="alert"
        >
          {actionState.userMessage ??
            ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE}
        </p>
      ) : null}
      <div className="app-shell-readiness-gate-refresh-form__actions">
        <Button
          aria-label={ACCOUNTING_READINESS_GATE_REFRESH_SUBMIT_LABEL}
          disabled={isPending}
          emphasis="outline"
          intent="primary"
          presentation="default"
          size="sm"
          type="submit"
        >
          {isPending
            ? ACCOUNTING_READINESS_GATE_REFRESH_PENDING_LABEL
            : ACCOUNTING_READINESS_GATE_REFRESH_SUBMIT_LABEL}
        </Button>
      </div>
    </form>
  );
}
