import { ArrowLeftIcon } from "lucide-react";
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
  AUTH_RESET_PASSWORD_PATH,
  assertCanonicalForgotPasswordForm,
  getRequiredLoginMethod,
  getResetPasswordPageManifest,
} from "./auth-shell-method-manifest.js";
import { AuthShellStage } from "./auth-shell-stage.js";
import ForgotPasswordFormV1 from "./forgot-password-form-v1.js";

const BLOCK_ID = "forgot-password-page-01" as const;
const RESET_PAGE_MANIFEST = getResetPasswordPageManifest(BLOCK_ID);
assertCanonicalForgotPasswordForm(RESET_PAGE_MANIFEST.blockId);

const requestResetMethod = getRequiredLoginMethod(
  RESET_PAGE_MANIFEST.blockId,
  "request-password-reset"
);
const signInMethod = getRequiredLoginMethod(
  RESET_PAGE_MANIFEST.blockId,
  "sign-in"
);
const backToWebsiteMethod = getRequiredLoginMethod(
  RESET_PAGE_MANIFEST.blockId,
  "back-to-website"
);

export default function ForgotPasswordPage01() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("forgot-password-page-01.content")}
      variant="recover"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>

          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("forgot-password.form.title")}
              className="font-semibold text-2xl"
            >
              Reset your password
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("forgot-password.form.subtitle")}
              className="text-base"
            >
              Enter your work email and we will send the reset instructions.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("forgot-password.email")} />
            <span {...blockSlotDomMarkerProps("forgot-password.submit")} />
          </div>

          <ForgotPasswordFormV1
            callbackUrl={AUTH_RESET_PASSWORD_PATH}
            submitLabel={requestResetMethod.label}
          />

          <div className="space-y-3 text-center text-muted-foreground text-sm">
            <Button
              nativeButton={false}
              render={<a href={signInMethod.href} />}
              variant="link"
            >
              <ArrowLeftIcon className="size-4" />
              {signInMethod.label}
            </Button>
            <br />
            <a
              className="inline-flex text-foreground hover:underline"
              href={backToWebsiteMethod.href}
            >
              {backToWebsiteMethod.label}
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthShellStage>
  );
}
