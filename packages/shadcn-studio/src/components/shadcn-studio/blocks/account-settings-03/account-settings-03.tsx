import DangerZone from "@/components/shadcn-studio/blocks/account-settings-03/content/danger-zone";
import WorkspaceData from "@/components/shadcn-studio/blocks/account-settings-03/content/workspace-data";
import WorkspaceDetail from "@/components/shadcn-studio/blocks/account-settings-03/content/workspace-detail";
import WorkspaceName from "@/components/shadcn-studio/blocks/account-settings-03/content/workspace-name";
import WorkspaceOrganizations from "@/components/shadcn-studio/blocks/account-settings-03/content/workspace-organizations";
import { Separator } from "@/components/ui/separator";

const Workspace = () => (
  <section className="py-3">
    <div className="mx-auto max-w-7xl">
      <WorkspaceName />
      <Separator className="my-10" />
      <WorkspaceDetail />
      <Separator className="my-10" />
      <WorkspaceOrganizations />
      <Separator className="my-10" />
      <WorkspaceData />
      <Separator className="my-10" />
      <DangerZone />
    </div>
  </section>
);

export default Workspace;
