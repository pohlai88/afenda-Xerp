import { useId } from 'react'

import { Button } from '#/components/shadcn-studio/primitives/button.tsx'
import { Checkbox } from '#/components/shadcn-studio/primitives/checkbox.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '#/components/shadcn-studio/primitives/dialog.tsx'
import { Label } from '#/components/shadcn-studio/primitives/label.tsx'
import { RadioGroup, RadioGroupItem } from '#/components/shadcn-studio/primitives/radio-group.tsx'
import { Textarea } from '#/components/shadcn-studio/primitives/textarea.tsx'

const DialogRatingDemo = () => {
  const id = useId()

  const ratings = [
    { value: '1', label: 'Angry', icon: '😡' },
    { value: '2', label: 'Sad', icon: '🙁' },
    { value: '3', label: 'Neutral', icon: '🙂' },
    { value: '4', label: 'Happy', icon: '😁' },
    { value: '5', label: 'Laughing', icon: '🤩' }
  ]

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant='outline'>Rating</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Help us improve our product for you</DialogTitle>
          </DialogHeader>
          <form className='flex flex-col gap-4 pt-4'>
            <fieldset className='space-y-4'>
              <legend className='text-foreground text-sm leading-none font-medium'>
                How would you like to describe your experience with the app today?
              </legend>
              <RadioGroup className='flex gap-1.5' defaultValue='5'>
                {ratings.map(rating => (
                  <label
                    key={`${id}-${rating.value}`}
                    className='border-input relative flex size-9 cursor-pointer flex-col items-center justify-center rounded-full border text-center text-xl shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:border-sky-600 has-focus-visible:ring-[3px] has-focus-visible:ring-sky-600/50 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:border-sky-600 has-data-[state=checked]:bg-sky-600/10 dark:has-focus-visible:border-sky-400 dark:has-focus-visible:ring-sky-600/50 dark:has-data-[state=checked]:border-sky-400 dark:has-data-[state=checked]:bg-sky-400/10'
                  >
                    <RadioGroupItem
                      id={`${id}-${rating.value}`}
                      value={rating.value}
                      className='sr-only after:absolute after:inset-0'
                    />
                    {rating.icon}
                  </label>
                ))}
              </RadioGroup>
            </fieldset>
            <div className='grid grow gap-3'>
              <Textarea placeholder='Type your message here.' id='message-2' required />
              <p className='text-muted-foreground text-sm'>500/500 characters left</p>
            </div>
            <div className='flex gap-3'>
              <Checkbox id='terms' />
              <Label htmlFor='terms'>I consent to Shadcn Studio contacting me based on my feedback</Label>
            </div>

            <DialogFooter className='sm:justify-end'>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit'>Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default DialogRatingDemo
