import { Separator } from '#/components/shadcn-studio/primitives/separator.tsx'
import { Button } from '#/components/shadcn-studio/primitives/button.tsx'

import Notifications from '#/components/shadcn-studio/blocks/account-settings-02/content/all-notifications.tsx'
import InboxPrefrence from '#/components/shadcn-studio/blocks/account-settings-02/content/inbox-preference.tsx'
import BrowserNotification from '#/components/shadcn-studio/blocks/account-settings-02/content/browser-notification.tsx'
import DoNotDisturb from '#/components/shadcn-studio/blocks/account-settings-02/content/do-not-disturb.tsx'

const NotificationsPage = () => {
  return (
    <div>
      <Notifications />
      <Separator className='my-10' />
      <InboxPrefrence />
      <Separator className='my-10' />
      <BrowserNotification />
      <Separator className='my-10' />
      <DoNotDisturb />
      <div className='mt-6 flex justify-end'>
        <Button type='submit' className='max-sm:w-full'>
          Save Changes
        </Button>
      </div>
    </div>
  )
}

export default NotificationsPage
