import { UserXIcon } from "lucide-react";
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

const BLOCK_ID = "invite-email-mismatch-page-01" as const;
const PAGE_MANIFEST = getPreLoginPageManifest(BLOCK_ID);
const signInMethod = getRequiredLoginMethod(PAGE_MANIFEST.blockId, "sign-in");
const backToWebsiteMethod = getRequiredLoginMethod(
  PAGE_MANIFEST.blockId,
  "back-to-website"
);

export default function InviteEmailMismatchPage01() {
  return (
    <main
      {...blockSlotDomMarkerProps("invite-email-mismatch-page-01.content")}
      className="flex min-h-dvh items-center justify-center bg-muted px-4 py-10 sm:px-6 lg:px-8"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <UserXIcon className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("invite-email-mismatch.title")}
              className="font-semibold text-2xl"
            >
              Invitation email mismatch
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("invite-email-mismatch.message")}
              className="text-base"
            >
              The invitation belongs to a different email address. Use the
              invited email or request a corrected invitation.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("invite-email-mismatch.cta")} />
            <span {...blockSlotDomMarkerProps("invite-email-mismatch.back")} />
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
