'use client'

import { useState } from 'react'

import { BadgeCheckIcon, EllipsisVerticalIcon, MailIcon, PlusIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/shadcn-studio/primitives/avatar.tsx'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '#/components/shadcn-studio/primitives/dropdown-menu.tsx'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#/components/shadcn-studio/primitives/input-group.tsx'
import { Label } from '#/components/shadcn-studio/primitives/label.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '#/components/shadcn-studio/primitives/select.tsx'
import { Separator } from '#/components/shadcn-studio/primitives/separator.tsx'

const Members = () => {
  const [role, setRole] = useState('')

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Om Patel',
      email: 'ompatel@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Hallie Richards',
      email: 'hallierichards@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',
      role: 'viewer'
    },
    {
      id: 3,
      name: 'Dana Lee',
      email: 'danalee@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
      role: 'contributor'
    },
    {
      id: 4,
      name: 'Alina Morris',
      email: 'alinamorris@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',
      role: 'contributor'
    },
    {
      id: 5,
      name: 'Jason Lee',
      email: 'jasonlee@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',
      role: 'no-access'
    },
    {
      id: 6,
      name: 'Sophia Turner',
      email: 'sophiaturner@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',
      role: 'member'
    }
  ])

  const [pending, setPending] = useState([
    {
      id: 'p1',
      name: 'Chris Ford',
      email: 'chrisford@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',
      role: 'viewer'
    },
    {
      id: 'p2',
      name: 'Alex Kim',
      email: 'alex.kim@example.com',
      avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',
      role: 'viewer'
    }
  ])

  const removeMember = (id: number) => setMembers(prev => prev.filter(m => m.id !== id))
  const revokeInvite = (id: string) => setPending(prev => prev.filter(p => p.id !== id))

  return (
    <section className='py-3'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div className='space-y-1'>
            <h3 className='font-semibold'>Members</h3>
            <p className='text-muted-foreground text-sm'>Manage your team members and their permissions.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='max-sm:w-full'>
                <PlusIcon />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg [&>[data-slot=dialog-close]>svg]:size-5'>
              <DialogHeader>
                <div className='space-y-1'>
                  <DialogTitle className='m-0 text-lg'>Invite people to your workspace</DialogTitle>
                  <DialogDescription className='text-sm'>
                    With free plan, you can add up to 10 users to each workspace.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className='mt-4 grid grid-cols-1 gap-4'>
                <div className='w-full space-y-2'>
                  <Label htmlFor='email' className='gap-1'>
                    Email<span className='text-destructive'>*</span>
                  </Label>
                  <InputGroup>
                    <InputGroupInput id='email' type='email' placeholder='Email address' required />
                    <InputGroupAddon align='inline-end'>
                      <MailIcon className='size-4' />
                      <span className='sr-only'>Email</span>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className='w-full space-y-2'>
                  <Label htmlFor='invite-role'>Select role</Label>
                  <Select value={role} onValueChange={val => setRole(val)}>
                    <SelectTrigger id='invite-role' className='w-full'>
                      <SelectValue placeholder='Select role...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='contributor'>Contributor</SelectItem>
                        <SelectItem value='viewer'>Viewer</SelectItem>
                        <SelectItem value='member'>Member</SelectItem>
                        <SelectItem value='no-access'>No access</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className='mt-6 gap-4'>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Add user</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {members.map((member, idx) => {
          const isAdmin = member.role === 'admin'

          return (
            <div key={member.id}>
              <div className='flex items-center justify-between gap-3 py-1'>
                <div className='flex items-center gap-3'>
                  <div className='relative w-fit'>
                    <Avatar className='size-9.5'>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                      <span className='absolute -top-1.5 -right-1.5'>
                        <span className='sr-only'>Verified</span>
                        <BadgeCheckIcon className='text-background size-5 fill-sky-500' />
                      </span>
                    )}
                  </div>
                  <div className='flex flex-col items-start max-sm:max-w-30'>
                    <p className='text-sm font-medium'>{member.name}</p>
                    <p className='text-muted-foreground text-xs'>{member.email}</p>
                  </div>
                </div>

                <div className={isAdmin ? 'flex cursor-not-allowed items-center opacity-60' : 'flex items-center'}>
                  <Select defaultValue={member.role} disabled={isAdmin}>
                    <SelectTrigger className='w-30 px-2 py-1 max-sm:w-20'>
                      <SelectValue placeholder='Select a access' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='contributor'>Contributor</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='viewer'>Viewer</SelectItem>
                        <SelectItem value='member'>Member</SelectItem>
                        <SelectItem value='no-access'>No access</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='rounded-full' disabled={isAdmin}>
                        <EllipsisVerticalIcon />
                        <span className='sr-only'>Edit menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-20' align='end'>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive hover:bg-destructive/10! hover:text-destructive! transition-colors duration-300'
                          onClick={() => removeMember(member.id)}
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {idx !== members.length - 1 && <Separator className='my-2' />}
            </div>
          )
        })}

        <div className='mt-10'>
          <h3 className='font-medium'>Pending invitations</h3>
          <div className='mt-6'>
            {pending.map((invite, idx) => (
              <div key={invite.id}>
                <div className='flex items-center justify-between gap-3 py-1'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='border-primary size-9.5 border border-dashed'>
                      <AvatarImage src={invite.avatar} />
                      <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-start max-sm:max-w-30'>
                      <p className='text-sm font-medium'>{invite.name}</p>
                      <p className='text-muted-foreground text-xs'>{invite.email}</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <Select defaultValue={invite.role}>
                      <SelectTrigger className='w-30 px-2 py-1 max-sm:w-20'>
                        <SelectValue placeholder='Select a access' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='contributor'>Contributor</SelectItem>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='viewer'>Viewer</SelectItem>
                          <SelectItem value='member'>Member</SelectItem>
                          <SelectItem value='no-access'>No access</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='rounded-full'>
                          <EllipsisVerticalIcon />
                          <span className='sr-only'>Edit menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='w-20' align='end'>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className='text-destructive hover:bg-destructive/10! hover:text-destructive! transition-colors duration-300'
                            onClick={() => revokeInvite(invite.id)}
                          >
                            Revoke
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {idx !== pending.length - 1 && <Separator className='my-2' />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Members
