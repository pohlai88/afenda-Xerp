import { KeyRoundIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoIcon from "@/components-assets/icon-logo.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import { AuthShellStage } from "./auth-shell-stage.js";
import {
  assertCanonicalMfaRecoveryForm,
  getPreLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import MfaRecoveryFormV1 from "./mfa-recovery-form-v1.js";

const BLOCK_ID = "mfa-recovery-page-01" as const;
const PAGE_MANIFEST = getPreLoginPageManifest(BLOCK_ID);
assertCanonicalMfaRecoveryForm(PAGE_MANIFEST.blockId);

const recoveryMethod = getRequiredLoginMethod(
  PAGE_MANIFEST.blockId,
  "submit-mfa-recovery"
);
const signInMethod = getRequiredLoginMethod(PAGE_MANIFEST.blockId, "sign-in");

export default function MfaRecoveryPage01() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("mfa-recovery-page-01.content")}
      variant="security"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-700">
            <KeyRoundIcon className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("mfa-recovery.form.title")}
              className="font-semibold text-2xl"
            >
              Recovery code
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("mfa-recovery.form.subtitle")}
              className="text-base"
            >
              Use one of your backup codes to complete verification.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("mfa-recovery.code")} />
            <span {...blockSlotDomMarkerProps("mfa-recovery.submit")} />
          </div>
          <MfaRecoveryFormV1 submitLabel={recoveryMethod.label} />
          <p className="text-center text-muted-foreground text-sm">
            Need to restart?{" "}
            <a
              className="text-foreground hover:underline"
              href={signInMethod.href}
            >
              {signInMethod.label}
            </a>
          </p>
        </CardContent>
      </Card>
    </AuthShellStage>
  );
}
