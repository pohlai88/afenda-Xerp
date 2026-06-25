'use client'

import { useState, type ReactNode } from 'react'

import { CreditCardIcon } from 'lucide-react'

import Cards from 'react-19-credit-card'

import { usePaymentInputs } from 'react-payment-inputs'

import { Avatar, AvatarFallback } from '#/components/shadcn-studio/primitives/avatar.tsx'
import { Button } from '#/components/shadcn-studio/primitives/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '#/components/shadcn-studio/primitives/dialog.tsx'
import { Input } from '#/components/shadcn-studio/primitives/input.tsx'
import { Label } from '#/components/shadcn-studio/primitives/label.tsx'

import { cn } from '#/lib/utils.ts'

import 'react-19-credit-card/dist/es/index.css'

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  className?: string
}

const AddPaymentMethodDialog = ({ defaultOpen = false, trigger, className }: Props) => {
  const [open, setOpen] = useState(defaultOpen)

  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: ''
  })

  //@ts-expect-error untyped event from payment input
  const handleInputChange = evt => {
    const { name, value } = evt.target

    setState(prev => ({ ...prev, [name]: value }))
  }

  //@ts-expect-error untyped event from payment input
  const handleInputFocus = evt => {
    setState(prev => ({ ...prev, focus: evt.target.name }))
  }

  const { getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs()

  // Transform expiry for Cards component - remove spaces and ensure MM/YY format
  const getFormattedExpiry = (expiry: string) => {
    const cleanExpiry = expiry.replace(/\s/g, '') // Remove spaces

    return cleanExpiry
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className={cn('sm:max-w-155 [&>[data-slot=dialog-close]>svg]:size-5', className)}>
        <DialogHeader className='flex-row items-center gap-4 text-left'>
          <Avatar className='size-11 shrink-0 rounded-md'>
            <AvatarFallback className='text-foreground rounded-md border bg-transparent'>
              <CreditCardIcon className='size-6' />
            </AvatarFallback>
          </Avatar>
          <div className='space-y-2'>
            <DialogTitle className='m-0 text-lg'>Add Payment Method</DialogTitle>
            <DialogDescription className='text-sm'>Add a payment method to active plan</DialogDescription>
          </div>
        </DialogHeader>

        {/* Credit card */}
        <div className='bg-muted flex items-center justify-center rounded-lg p-6 max-[420px]:p-2 sm:min-h-82.5 max-[420px]:[&>div]:w-full! max-[420px]:[&>div>div]:w-full!'>
          <Cards
            number={state.number}
            expiry={getFormattedExpiry(state.expiry)}
            cvc={state.cvc}
            name={state.name}
            focused={state.focus as 'name' | 'number' | 'expiry' | 'cvc' | undefined}
          />
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <div className='col-span-3 space-y-2 max-sm:col-span-4'>
            <Label htmlFor='username'>Name on card</Label>
            <Input
              id='username'
              type='text'
              name='name'
              placeholder='John Doe'
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>

          <div className='space-y-2 max-sm:col-span-4'>
            <Label htmlFor='expiry-date'>Expiry</Label>
            <Input
              {...getExpiryDateProps({
                onChange: handleInputChange,
                onFocus: handleInputFocus
              })}
              id='expiry-date'
              name='expiry'
              value={state.expiry}
              placeholder='MM/YY'
            />
          </div>

          <div className='col-span-3 space-y-2 max-sm:col-span-4'>
            <Label htmlFor='card-number'>Card number</Label>
            <Input
              {...getCardNumberProps()}
              id='card-number'
              name='number'
              value={state.number}
              placeholder='1234 5678 9012 3456'
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>

          <div className='space-y-2 max-sm:col-span-4'>
            <Label htmlFor='cvc'>CVC</Label>
            <Input
              {...getCVCProps()}
              id='cvc'
              name='cvc'
              placeholder='CVC'
              value={state.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>

        <DialogFooter className='gap-4'>
          <DialogClose asChild>
            <Button variant='outline' size='lg'>
              Cancel
            </Button>
          </DialogClose>
          <Button size='lg'>Add card details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddPaymentMethodDialog
