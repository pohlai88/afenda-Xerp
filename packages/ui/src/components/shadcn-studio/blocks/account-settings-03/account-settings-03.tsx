import { Separator } from '#/components/shadcn-studio/primitives/separator.tsx'

import WorkspaceName from '#/components/shadcn-studio/blocks/account-settings-03/content/workspace-name.tsx'
import WorkspaceDetail from '#/components/shadcn-studio/blocks/account-settings-03/content/workspace-detail.tsx'
import WorkspaceOrganizations from '#/components/shadcn-studio/blocks/account-settings-03/content/workspace-organizations.tsx'
import WorkspaceData from '#/components/shadcn-studio/blocks/account-settings-03/content/workspace-data.tsx'
import DangerZone from '#/components/shadcn-studio/blocks/account-settings-03/content/danger-zone.tsx'

const Workspace = () => {
  return (
    <section className='py-3'>
      <div className='mx-auto max-w-7xl'>
        <WorkspaceName />
        <Separator className='my-10' />
        <WorkspaceDetail />
        <Separator className='my-10' />
        <WorkspaceOrganizations />
        <Separator className='my-10' />
        <WorkspaceData />
        <Separator className='my-10' />
        <DangerZone />
      </div>
    </section>
  )
}

export default Workspace
