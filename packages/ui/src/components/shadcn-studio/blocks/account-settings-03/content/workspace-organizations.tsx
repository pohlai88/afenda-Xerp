import Link from 'next/link'

import { Trash2Icon } from 'lucide-react'

import { Button } from '#/components/shadcn-studio/primitives/button.tsx'
import { Card, CardContent } from '#/components/shadcn-studio/primitives/card.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '#/components/shadcn-studio/primitives/dialog.tsx'
import { Separator } from '#/components/shadcn-studio/primitives/separator.tsx'

const WorkspaceOrganizations = () => {
  const organizations = [
    {
      id: 'notion',
      name: 'Notion',
      img: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/notion-white.png',
      description: 'member and collaborator on product and docs projects'
    },
    {
      id: 'github',
      name: 'Github',
      img: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-white.png',
      description: 'repository collaborator and CI maintainer'
    },
    {
      id: 'discord',
      name: 'Discord',
      img: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/discord-icon.png',
      description: 'community moderator and support channel member'
    }
  ]

  return (
    <div>
      <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
        {/* Workspace Organizations */}
        <div className='flex flex-col space-y-1'>
          <h3 className='font-semibold'>Organizations</h3>
          <p className='text-muted-foreground text-sm'>Manage your workspace organizations and settings.</p>
        </div>
        {/* Content */}
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardContent>
              {organizations.map(org => (
                <div key={org.id}>
                  <div className='flex items-center justify-between gap-4 max-sm:flex-wrap'>
                    <div className='flex items-center gap-4'>
                      <img src={org.img} alt={org.name} className='h-8' />
                      <p className='text-muted-foreground text-sm'>
                        <Link href='#' className='font-medium text-sky-600 hover:underline dark:text-sky-400'>
                          {org.name}
                        </Link>{' '}
                        {org.description}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='hover:bg-destructive/10! text-destructive! border-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-sm:w-full'
                        >
                          <Trash2Icon />
                          Leave
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-md'>
                        <DialogHeader className='space-y-2'>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <div className='text-muted-foreground text-sm'>
                            Are you sure you want to leave this organization?
                          </div>
                        </DialogHeader>
                        <DialogFooter className='mt-4 gap-4 sm:justify-end'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant='destructive'>Leave</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {org !== organizations[organizations.length - 1] && <Separator className='my-4' />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceOrganizations
