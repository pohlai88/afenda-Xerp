'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Command,
  CommandList
} from '@/components/ui/command'

type Props = {
  trigger: ReactNode
  customerData: {
    id: number
    name: string
    lastSeen: string
  }[]
  className?: string
}

const CustomerActivityDialog = ({ trigger, customerData, className }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={className}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <CommandDialog open={open} onOpenChange={setOpen} className='w-full -translate-x-1/2 sm:max-w-lg!'>
        <Command className='px-0'>
          <div className='p-1'>
            <CommandInput placeholder='Search by name or last seen...' />
          </div>

          {/* Table header — outside CommandList to avoid cmdk DOM issues */}
          <div className='mt-2 border-y px-6 py-2'>
            <div className='text-muted-foreground grid grid-cols-2 text-xs font-medium uppercase'>
              <span>Customer</span>
              <span className='text-right'>Last Seen</span>
            </div>
          </div>

          <CommandList>
            <CommandEmpty>No customers found.</CommandEmpty>
            <CommandGroup className='px-2 [&_[cmdk-group-items]]:space-y-0'>
              {customerData.map(customer => (
                <CommandItem
                  key={customer.id}
                  value={`${customer.name}}`}
                  className='data-[selected=true]:bg-accent grid grid-cols-2 py-2.5 in-data-[slot=dialog-content]:rounded-none! *:[svg]:hidden'
                >
                  <span className='font-medium'>{customer.name}</span>
                  <span className='text-muted-foreground text-right text-sm'>{customer.lastSeen}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

export default CustomerActivityDialog
