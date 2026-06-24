import { Button } from '#/components/shadcn-studio/primitives/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '#/components/shadcn-studio/primitives/dialog.tsx'
import { Input } from '#/components/shadcn-studio/primitives/input.tsx'
import { Label } from '#/components/shadcn-studio/primitives/label.tsx'

const DialogSubscribeDemo = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Subscribe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>Subscribe blog for latest updates</DialogTitle>
          <DialogDescription className='text-center text-base'>
            Subscribe to our blog to stay updated with the latest posts and news. Simply enter your email address and
            click &apos;Subscribe&apos; to receive notifications.
          </DialogDescription>
        </DialogHeader>
        <form className='flex gap-4'>
          <div className='grid grow gap-3'>
            <Label htmlFor='email'>Email</Label>
            <Input type='email' id='email' name='email' placeholder='example@gmail.com' required />
          </div>
          <Button type='submit' className='self-end'>
            Subscribe
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSubscribeDemo
