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
  assertCanonicalResetPasswordForm,
  getRequiredLoginMethod,
  getResetPasswordPageManifest,
} from "./auth-shell-method-manifest.js";
import { AuthShellStage } from "./auth-shell-stage.js";
import ResetPasswordFormV1 from "./reset-password-form-v1.js";

const BLOCK_ID = "reset-password-page-01" as const;
const RESET_PAGE_MANIFEST = getResetPasswordPageManifest(BLOCK_ID);
assertCanonicalResetPasswordForm(RESET_PAGE_MANIFEST.blockId);

const resetPasswordMethod = getRequiredLoginMethod(
  RESET_PAGE_MANIFEST.blockId,
  "reset-password"
);
const signInMethod = getRequiredLoginMethod(
  RESET_PAGE_MANIFEST.blockId,
  "sign-in"
);

export default function ResetPasswordPage01() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("reset-password-page-01.content")}
      variant="recover"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>

          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("reset-password.form.title")}
              className="font-semibold text-2xl"
            >
              Create a new password
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("reset-password.form.subtitle")}
              className="text-base"
            >
              Choose a new password for your Afenda ERP account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("reset-password.password")} />
            <span
              {...blockSlotDomMarkerProps("reset-password.confirmPassword")}
            />
            <span {...blockSlotDomMarkerProps("reset-password.submit")} />
          </div>

          <ResetPasswordFormV1 submitLabel={resetPasswordMethod.label} />

          <p className="text-center text-muted-foreground text-sm">
            Already updated your password?{" "}
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
