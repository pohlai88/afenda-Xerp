import { MailCheckIcon } from "lucide-react";
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

const BLOCK_ID = "forgot-password-success-page-01" as const;
const FORGOT_PASSWORD_SUCCESS_MANIFEST = getResetPasswordPageManifest(BLOCK_ID);

const signInMethod = getRequiredLoginMethod(
  FORGOT_PASSWORD_SUCCESS_MANIFEST.blockId,
  "sign-in"
);
const backToWebsiteMethod = getRequiredLoginMethod(
  FORGOT_PASSWORD_SUCCESS_MANIFEST.blockId,
  "back-to-website"
);

export default function ForgotPasswordSuccessPage01() {
  return (
    <main
      {...blockSlotDomMarkerProps("forgot-password-success-page-01.content")}
      className="flex min-h-dvh items-center justify-center bg-muted px-4 py-10 sm:px-6 lg:px-8"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>

          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-sky-500/10 text-sky-700">
            <MailCheckIcon className="size-6" />
          </div>

          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("forgot-password-success.title")}
              className="font-semibold text-2xl"
            >
              Check your email
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("forgot-password-success.message")}
              className="text-base"
            >
              If an account exists for that email, reset instructions are on the
              way.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("forgot-password-success.cta")} />
            <span
              {...blockSlotDomMarkerProps("forgot-password-success.back")}
            />
          </div>

          <Button
            className="w-full"
            nativeButton={false}
            render={<a href={signInMethod.href} />}
          >
            {signInMethod.label}
          </Button>
          <Button
            className="w-full"
            nativeButton={false}
            render={<a href={backToWebsiteMethod.href} />}
            variant="outline"
          >
            {backToWebsiteMethod.label}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
