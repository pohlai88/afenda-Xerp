import type {
  PolicyDecision as KernelPolicyDecision,
  OperatingContext,
  PolicyDenialReason,
} from "@afenda/kernel";
import {
  type PolicyWireDecision,
  parseUnknownPolicyDecision,
  serializePolicyDecision,
} from "@afenda/kernel";
import type {
  AuthorizationDecision,
  AuthorizationDenialCode,
} from "@afenda/permissions";
import {
  isPolicyGateDecision,
  type PolicyDecision as PermissionsPolicyDecision,
} from "@afenda/permissions";
import {
  isMetadataRuntimePolicyDenialReason,
  type MetadataRuntimePolicyDecision,
} from "@afenda/ui-composition";
import type { ApiRouteAuthorizationDenialCode } from "@/lib/api/authorize-api-route.contract";

function mapAuthorizationDenialCodeToPolicyReason(
  code: AuthorizationDenialCode
): PolicyDenialReason {
  switch (code) {
    case "missing_actor":
    case "missing_membership":
    case "permission_denied":
      return "unauthorized";
    case "missing_tenant":
    case "inactive_tenant":
      return "tenant_suspended";
    case "company_mismatch":
    case "tenant_mismatch":
      return "outside_scope";
    case "missing_context":
      return "context_required";
    case "inactive_actor":
    case "policy_denied":
      return "forbidden";
    case "policy_gated":
      return "plan_required";
    default: {
      const _exhaustive: never = code;
      return "forbidden";
    }
  }
}

function mapPermissionsPolicyResultToKernelPolicy(input: {
  readonly denialCode?: AuthorizationDenialCode;
  readonly result: PermissionsPolicyDecision;
}): KernelPolicyDecision {
  if (input.result === "allow") {
    return { kind: "allow" };
  }

  if (input.result === "deny") {
    return {
      kind: "deny",
      reason: input.denialCode
        ? mapAuthorizationDenialCodeToPolicyReason(input.denialCode)
        : "forbidden",
    };
  }

  if (isPolicyGateDecision(input.result)) {
    const reason: PolicyDenialReason =
      input.result === "readonly" ? "feature_disabled" : "plan_required";

    return { kind: "gate", reason };
  }

  return { kind: "defer", reason: "context_required" };
}

function toMetadataRuntimePolicyDecision(
  wire: PolicyWireDecision
): MetadataRuntimePolicyDecision {
  const validated = parseUnknownPolicyDecision(wire);

  switch (validated.kind) {
    case "allow":
      return { kind: "allow" };
    case "deny":
    case "gate":
      if (!isMetadataRuntimePolicyDenialReason(validated.reason)) {
        throw new Error("Invalid policy denial reason for metadata runtime.");
      }
      return { kind: validated.kind, reason: validated.reason };
    case "defer":
      if (validated.reason === undefined) {
        return { kind: "defer" };
      }
      if (!isMetadataRuntimePolicyDenialReason(validated.reason)) {
        throw new Error("Invalid policy denial reason for metadata runtime.");
      }
      return { kind: "defer", reason: validated.reason };
    default: {
      const _exhaustive: never = validated;
      throw new Error(`Unknown policy decision kind: ${String(_exhaustive)}.`);
    }
  }
}

/**
 * Maps API-route denial codes (including pre-evaluation) into metadata runtime policy.
 * Evaluated RBAC failures should prefer `resolveMetadataPolicyDecisionFromAuthorizationEvaluation`.
 */
export function resolveMetadataPolicyDecisionFromApiRouteDenialCode(
  denialCode: ApiRouteAuthorizationDenialCode
): MetadataRuntimePolicyDecision {
  if (denialCode === "missing_session") {
    return { kind: "deny", reason: "unauthorized" };
  }

  if (denialCode === "missing_context") {
    return { kind: "defer", reason: "context_required" };
  }

  const reason = mapAuthorizationDenialCodeToPolicyReason(denialCode);

  if (denialCode === "policy_gated") {
    return { kind: "gate", reason };
  }

  return { kind: "deny", reason };
}

/**
 * Maps verified operating context into metadata runtime policy vocabulary.
 *
 * @internal Fixture and legacy sync path only — defaults to allow when no live
 * authorization snapshot is supplied. Production pages must use
 * `resolveMetadataUiRenderContextFromApiRouteAuthorization` or pass `authorization`.
 */
export function resolveMetadataPolicyDecisionFromOperatingContext(input: {
  readonly operatingContext: OperatingContext;
  readonly override?: KernelPolicyDecision;
}): MetadataRuntimePolicyDecision {
  const decision: KernelPolicyDecision = input.override ?? { kind: "allow" };

  return toMetadataRuntimePolicyDecision(serializePolicyDecision(decision));
}

/**
 * Maps live `@afenda/permissions` authorization evaluation into metadata runtime
 * policy vocabulary — gate/deny from API-route class evaluation, not default allow.
 */
export function resolveMetadataPolicyDecisionFromAuthorizationEvaluation(input: {
  readonly decision: AuthorizationDecision;
  readonly denialCode?: AuthorizationDenialCode;
}): MetadataRuntimePolicyDecision {
  const kernelPolicy = mapPermissionsPolicyResultToKernelPolicy({
    result: input.decision.result,
    ...(input.denialCode === undefined ? {} : { denialCode: input.denialCode }),
  });

  return toMetadataRuntimePolicyDecision(serializePolicyDecision(kernelPolicy));
}
