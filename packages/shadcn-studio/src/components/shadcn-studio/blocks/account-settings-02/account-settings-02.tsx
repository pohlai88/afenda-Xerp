import { blockSlotDomMarkerProps } from "@/contracts/block-slot-dom-marker.contract.js";
import Notifications from "@/components/shadcn-studio/blocks/account-settings-02/content/all-notifications";
import BrowserNotification from "@/components/shadcn-studio/blocks/account-settings-02/content/browser-notification";
import DoNotDisturb from "@/components/shadcn-studio/blocks/account-settings-02/content/do-not-disturb";
import InboxPrefrence from "@/components/shadcn-studio/blocks/account-settings-02/content/inbox-preference";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NotificationsPage = () => (
  <div>
    <Notifications />
    <Separator className="my-10" />
    <InboxPrefrence />
    <Separator className="my-10" />
    <BrowserNotification />
    <Separator className="my-10" />
    <DoNotDisturb />
    <div className="mt-6 flex justify-end">
      <Button {...blockSlotDomMarkerProps("profile.save")} className="max-sm:w-full" type="submit">
        Save Changes
      </Button>
    </div>
  </div>
);

export default NotificationsPage;
