import { Separator } from '#/components/shadcn-studio/primitives/separator.tsx'

import PersonalInfo from '#/components/shadcn-studio/blocks/account-settings-01/content/personal-info.tsx'
import EmailPass from '#/components/shadcn-studio/blocks/account-settings-01/content/email-password.tsx'
import ConnectAccount from '#/components/shadcn-studio/blocks/account-settings-01/content/connect-account.tsx'
import SocialUrl from '#/components/shadcn-studio/blocks/account-settings-01/content/social-url.tsx'
import DangerZone from '#/components/shadcn-studio/blocks/account-settings-03/content/danger-zone.tsx'

const UserGeneral = () => {
  return (
    <section className='py-3'>
      <div className='mx-auto max-w-7xl'>
        <PersonalInfo />
        <Separator className='my-10' />
        <EmailPass />
        <Separator className='my-10' />
        <ConnectAccount />
        <Separator className='my-10' />
        <SocialUrl />
        <Separator className='my-10' />
        <DangerZone />
      </div>
    </section>
  )
}

export default UserGeneral
