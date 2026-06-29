"use client";

import { useCallback, useState } from "react";

import type { ApiPolicyGateDecision } from "./api-envelope.client";
import { isApiPolicyGateError } from "./api-policy-gate.error";
import type { PolicyGateSurfaceVariant } from "./policy-gate-ux.contract";

export interface PolicyGateHandlerState {
  readonly correlationId: string;
  readonly gateDecision: ApiPolicyGateDecision;
  readonly message: string;
  readonly variant: PolicyGateSurfaceVariant;
}

export interface PolicyGateHandlerOptions {
  readonly variant?: PolicyGateSurfaceVariant;
}

export function usePolicyGateHandler() {
  const [gateState, setGateState] = useState<PolicyGateHandlerState | null>(
    null
  );

  const clearGate = useCallback(() => {
    setGateState(null);
  }, []);

  const handleApiError = useCallback(
    (error: unknown, options: PolicyGateHandlerOptions = {}): boolean => {
      if (!isApiPolicyGateError(error)) {
        return false;
      }

      setGateState({
        correlationId: error.correlationId,
        gateDecision: error.gateDecision,
        message: error.message,
        variant: options.variant ?? "inline",
      });

      return true;
    },
    []
  );

  return {
    clearGate,
    gateState,
    handleApiError,
  };
}
