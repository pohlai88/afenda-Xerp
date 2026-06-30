import { CircleAlertIcon } from "lucide-react";
import VerifyDialog from "@/components/shadcn-studio/blocks/dashboard-dialog-09/dialog-verify";
import { blockSlotDomMarkerProps } from "../../../../../contracts/block-slot-dom-marker.contract.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TwoFactor = () => {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div {...blockSlotDomMarkerProps("profile.avatar")} className="flex flex-col space-y-1">
        <h3 {...blockSlotDomMarkerProps("profile.displayName")} className="font-semibold">
          Two Factor Authentication
        </h3>
        <p {...blockSlotDomMarkerProps("profile.email")} className="text-muted-foreground text-sm">
          Manage Two Factor Authentication (2FA) settings.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Enable Two Factor Authentication */}
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CircleAlertIcon className="size-4" />
              <h4 className="font-medium text-sm">
                You have not enabled Two Factor Authentication
              </h4>
            </div>
            <p className="text-muted-foreground text-sm">
              When you enable Two Factor Authentication, you will be required to
              provide a second form of verification during the login process,
              adding an extra layer of security to your account.
            </p>

            <VerifyDialog
              trigger={
                <Button {...blockSlotDomMarkerProps("profile.save")} className="max-sm:w-full">
                  Enable Two Factor Authentication
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TwoFactor;
