import { ShieldIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoIcon from "@/components-assets/icon-logo.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalMfaOtpForm,
  getPreLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import MfaOtpFormV1 from "./mfa-otp-form-v1.js";

const BLOCK_ID = "mfa-page-01" as const;
const PAGE_MANIFEST = getPreLoginPageManifest(BLOCK_ID);
assertCanonicalMfaOtpForm(PAGE_MANIFEST.blockId);

const mfaMethod = getRequiredLoginMethod(
  PAGE_MANIFEST.blockId,
  "submit-mfa-otp"
);
const signInMethod = getRequiredLoginMethod(PAGE_MANIFEST.blockId, "sign-in");

export default function MfaPage01() {
  return (
    <main
      {...blockSlotDomMarkerProps("mfa-page-01.content")}
      className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-sky-500/10 text-sky-700">
            <ShieldIcon className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("mfa.form.title")}
              className="font-semibold text-2xl"
            >
              Multi-factor verification
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("mfa.form.subtitle")}
              className="text-base"
            >
              Enter your verification code to continue to your workspace.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("mfa.code")} />
            <span {...blockSlotDomMarkerProps("mfa.submit")} />
          </div>
          <MfaOtpFormV1 submitLabel={mfaMethod.label} />
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
    </main>
  );
}
