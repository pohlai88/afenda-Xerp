import type { LabDemoContext } from "./contracts";
import { createCachedLabLoader } from "./create-cached-lab-loader.server";
import { labDemoContextFixture } from "./lab-demo-context";
import type { LabRuntimeAuthorityKind } from "./lab-runtime-authority-policy";
import { labRuntimeAuthorityPolicyRule } from "./lab-runtime-authority-policy";

export interface LabShellOperatingContextResolution {
  authorityKind: LabRuntimeAuthorityKind;
  erpPromotionPath: string;
  operatingContext: LabDemoContext;
}

const resolveLabShellOperatingContextUncached =
  async (): Promise<LabShellOperatingContextResolution> =>
    ({
      authorityKind: labRuntimeAuthorityPolicyRule.authorityKind,
      erpPromotionPath: labRuntimeAuthorityPolicyRule.erpPromotionPath,
      operatingContext: labDemoContextFixture,
    }) satisfies LabShellOperatingContextResolution;

export const resolveLabShellOperatingContext = createCachedLabLoader(
  resolveLabShellOperatingContextUncached
);
