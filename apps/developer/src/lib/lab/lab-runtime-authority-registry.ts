import type {
  LabRuntimeAuthorityForbid,
  LabRuntimeAuthorityKind,
} from "./lab-runtime-authority-policy";

export interface LabRuntimeAuthorityRegistryEntry {
  authorityId: string;
  authorityKind: LabRuntimeAuthorityKind;
  erpPromotionPath: string;
  filePath: string;
  forbids: readonly LabRuntimeAuthorityForbid[];
  summary: string;
}

/**
 * Governed demo-safe runtime authority surfaces (runtime-parity slice P5).
 */
export const labRuntimeAuthorityRegistry = [
  {
    authorityId: "lab.runtime-authority.demo-operating-context",
    authorityKind: "demo-fixture",
    erpPromotionPath:
      "apps/erp/src/lib/context/to-shell-operating-context-wire.ts",
    filePath: "lib/lab/resolve-lab-shell-operating-context.server.ts",
    forbids: [
      "better-auth-session",
      "kernel-operating-context",
      "erp-bff-routes",
      "live-tenant-resolution",
    ] as const,
    summary:
      "Demo AppShell operating-context wire — promotes to ERP kernel resolver, not live spine.",
  },
] as const satisfies readonly LabRuntimeAuthorityRegistryEntry[];
