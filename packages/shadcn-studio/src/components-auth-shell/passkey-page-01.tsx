import { KeyRoundIcon } from "lucide-react";
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
import {
  getPreLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import { AuthShellStage } from "./auth-shell-stage.js";

const BLOCK_ID = "passkey-page-01" as const;
const PAGE_MANIFEST = getPreLoginPageManifest(BLOCK_ID);
const passkeyMethod = getRequiredLoginMethod(
  PAGE_MANIFEST.blockId,
  "start-passkey"
);
const signInMethod = getRequiredLoginMethod(PAGE_MANIFEST.blockId, "sign-in");

export default function PasskeyPage01() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("passkey-page-01.content")}
      variant="security"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRoundIcon className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("passkey.title")}
              className="font-semibold text-2xl"
            >
              Use a passkey
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("passkey.message")}
              className="text-base"
            >
              Continue with the passkey already registered for this operator
              account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("passkey.cta")} />
            <span {...blockSlotDomMarkerProps("passkey.fallback")} />
          </div>
          <Button
            className="w-full"
            nativeButton={false}
            render={<a href={passkeyMethod.href} />}
          >
            {passkeyMethod.label}
          </Button>
          <Button
            className="w-full"
            nativeButton={false}
            render={<a href={signInMethod.href} />}
            variant="outline"
          >
            {signInMethod.label}
          </Button>
        </CardContent>
      </Card>
    </AuthShellStage>
  );
}
