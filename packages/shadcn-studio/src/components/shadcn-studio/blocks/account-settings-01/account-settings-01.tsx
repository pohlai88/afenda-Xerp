import { Separator } from '../../../ui/separator'

import PersonalInfo from './content/personal-info'
import EmailPass from './content/email-password'
import ConnectAccount from './content/connect-account'
import SocialUrl from './content/social-url'
import DangerZone from './content/danger-zone'

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
