import { ShieldAlertIcon } from "lucide-react";
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

const BLOCK_ID = "security-review-page-01" as const;
const PAGE_MANIFEST = getPreLoginPageManifest(BLOCK_ID);
const signInMethod = getRequiredLoginMethod(PAGE_MANIFEST.blockId, "sign-in");

export default function SecurityReviewPage01() {
  return (
    <main
      {...blockSlotDomMarkerProps("security-review-page-01.content")}
      className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8"
    >
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="gap-5 px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon className="size-8" variant="brand" />
          </div>
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-700">
            <ShieldAlertIcon className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle
              {...blockSlotDomMarkerProps("security-review.title")}
              className="font-semibold text-2xl"
            >
              Security review required
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("security-review.message")}
              className="text-base"
            >
              This sign-in needs an additional security check before workspace
              access can continue.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div aria-hidden="true" className="sr-only">
            <span {...blockSlotDomMarkerProps("security-review.cta")} />
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
