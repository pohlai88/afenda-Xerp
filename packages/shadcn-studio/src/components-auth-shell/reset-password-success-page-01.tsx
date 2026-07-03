import { CheckIcon } from "lucide-react";
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
  getRequiredLoginMethod,
  getResetPasswordPageManifest,
} from "./auth-shell-method-manifest.js";

const BLOCK_ID = "reset-password-success-page-01" as const;
const RESET_PAGE_MANIFEST = getResetPasswordPageManifest(BLOCK_ID);

const signInMethod = getRequiredLoginMethod(
  RESET_PAGE_MANIFEST.blockId,
  "sign-in"
);

export default function ResetPasswordSuccessPage01() {
  return (
    <main
      {...blockSlotDomMarkerProps("reset-password-success-page-01.content")}
      className="flex min-h-dvh items-center justify-center bg-muted px-4 py-10 sm:px-6 lg:px-8"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>

          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <CheckIcon className="size-6" />
          </div>

          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("reset-password-success.title")}
              className="font-semibold text-2xl"
            >
              Password updated
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("reset-password-success.message")}
              className="text-base"
            >
              You can now sign in with your new password.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("reset-password-success.cta")} />
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
    </main>
  );
}
