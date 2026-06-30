import Link from 'next/link'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2Icon } from "lucide-react"

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
      <div className='grid min-w-0 w-full grid-cols-1 gap-10 xl:grid-cols-3'>
        {/* Workspace Organizations */}
        <div className='flex flex-col space-y-1'>
          <h3 className='font-semibold'>Organizations</h3>
          <p className='text-muted-foreground text-sm'>Manage your workspace organizations and settings.</p>
        </div>
        {/* Content */}
        <div className='space-y-6 min-w-0 xl:col-span-2'>
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
                      <DialogTrigger
                        render={
                          <Button
                            variant='outline'
                            className='border-destructive! text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-sm:w-full'
                          />
                        }
                      >
                        <Trash2Icon
                        />
                        Leave
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-md'>
                        <DialogHeader className='space-y-2'>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <div className='text-muted-foreground text-sm'>
                            Are you sure you want to leave this organization?
                          </div>
                        </DialogHeader>
                        <div className='flex flex-col-reverse gap-4 sm:flex-row sm:justify-end'>
                          <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
                          <DialogClose render={<Button variant='destructive' />}>Leave</DialogClose>
                        </div>
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
