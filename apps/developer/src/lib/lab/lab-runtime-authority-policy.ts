export type LabRuntimeAuthorityKind = "demo-fixture";

export type LabRuntimeAuthorityForbid =
  | "better-auth-session"
  | "erp-bff-routes"
  | "kernel-operating-context"
  | "live-tenant-resolution";

export interface LabRuntimeAuthorityPolicyRule {
  authorityKind: LabRuntimeAuthorityKind;
  description: string;
  erpPromotionPath: string;
  forbids: readonly LabRuntimeAuthorityForbid[];
}

export const LAB_RUNTIME_AUTHORITY_ADR_ID =
  "ADR-0044-developer-route-lab-runtime-authority-boundary" as const;

/**
 * Demo-safe runtime authority for route-lab (P5).
 * Authority ceiling: ADR-0044 (Accepted) — live auth/kernel/BFF remain ERP-owned.
 */
export const labRuntimeAuthorityPolicyRule = {
  authorityKind: "demo-fixture",
  description:
    "Route-lab uses a static AppShell operating-context wire fixture; ERP owns auth, kernel context, and BFF.",
  erpPromotionPath:
    "apps/erp/src/lib/context/to-shell-operating-context-wire.ts",
  forbids: [
    "better-auth-session",
    "kernel-operating-context",
    "erp-bff-routes",
    "live-tenant-resolution",
  ] as const,
} satisfies LabRuntimeAuthorityPolicyRule;

export const LAB_RUNTIME_FORBIDDEN_PACKAGES = [
  "@afenda/auth",
  "@afenda/kernel",
  "@afenda/database",
  "@afenda/server",
] as const;
