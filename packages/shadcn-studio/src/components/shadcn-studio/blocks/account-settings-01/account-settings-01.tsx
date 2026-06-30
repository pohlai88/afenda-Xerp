import { Separator } from '../../../ui/separator'

import { AccountSettingsPageShell } from '../_shared/account-settings-page-shell.js'
import PersonalInfo from './content/personal-info'
import EmailPass from './content/email-password'
import ConnectAccount from './content/connect-account'
import SocialUrl from './content/social-url'
import DangerZone from './content/danger-zone'

const UserGeneral = () => {
  return (
    <AccountSettingsPageShell>
      <PersonalInfo />
      <Separator className='my-10' />
      <EmailPass />
      <Separator className='my-10' />
      <ConnectAccount />
      <Separator className='my-10' />
      <SocialUrl />
      <Separator className='my-10' />
      <DangerZone />
    </AccountSettingsPageShell>
  )
}

export default UserGeneral
