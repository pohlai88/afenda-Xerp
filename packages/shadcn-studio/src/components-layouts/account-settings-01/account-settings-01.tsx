import { Separator } from "@/components/ui/separator";

import { AccountSettingsPageShell } from "../_shared/account-settings-page-shell.js";
import ConnectAccount from "./content/connect-account";
import DangerZone from "./content/danger-zone";
import EmailPass from "./content/email-password";
import PersonalInfo from "./content/personal-info";
import SocialUrl from "./content/social-url";

const UserGeneral = () => (
  <AccountSettingsPageShell>
    <PersonalInfo />
    <Separator className="my-10" />
    <EmailPass />
    <Separator className="my-10" />
    <ConnectAccount />
    <Separator className="my-10" />
    <SocialUrl />
    <Separator className="my-10" />
    <DangerZone />
  </AccountSettingsPageShell>
);

export default UserGeneral;
