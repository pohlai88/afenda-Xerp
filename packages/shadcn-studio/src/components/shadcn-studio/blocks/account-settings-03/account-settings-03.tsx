import { Separator } from '@/components/ui/separator'

import WorkspaceName from '@/components/shadcn-studio/blocks/account-settings-03/content/workspace-name'
import WorkspaceDetail from '@/components/shadcn-studio/blocks/account-settings-03/content/workspace-detail'
import WorkspaceOrganizations from '@/components/shadcn-studio/blocks/account-settings-03/content/workspace-organizations'
import WorkspaceData from '@/components/shadcn-studio/blocks/account-settings-03/content/workspace-data'
import DangerZone from '@/components/shadcn-studio/blocks/account-settings-03/content/danger-zone'

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
