import { Separator } from '#/components/shadcn-studio/primitives/separator.tsx'

import TwoFactor from '#/components/shadcn-studio/blocks/account-settings-06/content/two-factor.tsx'
import Sessions from '#/components/shadcn-studio/blocks/account-settings-06/content/all-sessions.tsx'
import ApiKey from '#/components/shadcn-studio/blocks/account-settings-06/content/api-key.tsx'

function Security() {
  return (
    <section className='py-3'>
      <div className='mx-auto max-w-7xl'>
        <TwoFactor />
        <Separator className='my-10' />
        <ApiKey />
        <Separator className='my-10' />
        <Sessions />
      </div>
    </section>
  )
}

export default Security
