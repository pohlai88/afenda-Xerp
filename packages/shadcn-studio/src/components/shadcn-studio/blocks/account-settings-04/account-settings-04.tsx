import { Separator } from '@/components/ui/separator'

import Communication from '@/components/shadcn-studio/blocks/account-settings-04/content/integrations-communication'
import Planning from '@/components/shadcn-studio/blocks/account-settings-04/content/integrations-planning'
import Tools from '@/components/shadcn-studio/blocks/account-settings-04/content/integrations-tools'

const Integrations = () => {
  return (
    <section className='py-3'>
      <div className='mx-auto max-w-7xl'>
        <Communication />
        <Separator className='my-10' />
        <Planning />
        <Separator className='my-10' />
        <Tools />
      </div>
    </section>
  )
}

export default Integrations
