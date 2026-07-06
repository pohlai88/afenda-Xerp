import type {
  LabRequestPolicyBehavior,
  LabRequestPolicyForbid,
} from "./lab-request-policy";

export interface LabRequestPolicyRegistryEntry {
  behaviors: readonly LabRequestPolicyBehavior[];
  filePath: string;
  forbids: readonly LabRequestPolicyForbid[];
  policyId: string;
  summary: string;
}

/**
 * Governed request-policy surface for route-lab (runtime-parity slice P4).
 */
export const labRequestPolicyRegistry = [
  {
    behaviors: [
      "correlation-id-pass-through",
      "strip-spoof-tenant-headers",
    ] as const,
    filePath: "proxy.ts",
    forbids: ["auth-redirect", "session-gate", "tenant-injection"] as const,
    policyId: "lab.request-policy.edge-proxy",
    summary:
      "Next.js proxy pass-through — correlation id only; strips spoof tenant/context headers.",
  },
] as const satisfies readonly LabRequestPolicyRegistryEntry[];
