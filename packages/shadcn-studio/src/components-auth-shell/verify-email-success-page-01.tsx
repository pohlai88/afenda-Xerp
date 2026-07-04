import { BadgeCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  getPreLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";

const BLOCK_ID = "verify-email-success-page-01" as const;
const PAGE_MANIFEST = getPreLoginPageManifest(BLOCK_ID);
const signInMethod = getRequiredLoginMethod(PAGE_MANIFEST.blockId, "sign-in");

export default function VerifyEmailSuccessPage01() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("verify-email-success-page-01.content")}
      variant="verify"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <BadgeCheckIcon className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("verify-email-success.title")}
              className="font-semibold text-2xl"
            >
              Email verified
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("verify-email-success.message")}
              className="text-base"
            >
              Your email is verified. Continue to sign in to Afenda ERP.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("verify-email-success.cta")} />
          </div>
          <Button
            className="w-full"
            nativeButton={false}
            render={<a href={signInMethod.href} />}
          >
            {signInMethod.label}
          </Button>
        </CardContent>
      </Card>
    </AuthShellStage>
  );
}
