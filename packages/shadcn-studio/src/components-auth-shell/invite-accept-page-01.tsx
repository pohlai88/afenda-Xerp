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
  assertCanonicalInviteAcceptForm,
  getPreLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import { AuthShellStage } from "./auth-shell-stage.js";
import RegisterFormV1 from "./register-form-v1.js";

const BLOCK_ID = "invite-accept-page-01" as const;
const PAGE_MANIFEST = getPreLoginPageManifest(BLOCK_ID);
assertCanonicalInviteAcceptForm(PAGE_MANIFEST.blockId);

const acceptMethod = getRequiredLoginMethod(
  PAGE_MANIFEST.blockId,
  "accept-invitation"
);
const signInMethod = getRequiredLoginMethod(PAGE_MANIFEST.blockId, "sign-in");
const backToWebsiteMethod = getRequiredLoginMethod(
  PAGE_MANIFEST.blockId,
  "back-to-website"
);

export default function InviteAcceptPage01() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("invite-accept-page-01.content")}
      variant="invite"
    >
      <Card className="w-full max-w-lg gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>
          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("invite-accept.form.title")}
              className="font-semibold text-2xl"
            >
              Accept your invitation
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("invite-accept.form.subtitle")}
              className="text-base"
            >
              Create credentials for the workspace your team approved.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("invite-accept.name")} />
            <span {...blockSlotDomMarkerProps("invite-accept.email")} />
            <span {...blockSlotDomMarkerProps("invite-accept.password")} />
            <span
              {...blockSlotDomMarkerProps("invite-accept.confirmPassword")}
            />
            <span
              {...blockSlotDomMarkerProps("invite-accept.invitationCode")}
            />
            <span {...blockSlotDomMarkerProps("invite-accept.submit")} />
          </div>
          <RegisterFormV1 submitLabel={acceptMethod.label} />
          <div className="space-y-2 text-center text-muted-foreground text-sm">
            <a
              className="text-foreground hover:underline"
              href={signInMethod.href}
            >
              {signInMethod.label}
            </a>
            <div>
              <Button
                nativeButton={false}
                render={<a href={backToWebsiteMethod.href} />}
                variant="link"
              >
                {backToWebsiteMethod.label}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthShellStage>
  );
}
