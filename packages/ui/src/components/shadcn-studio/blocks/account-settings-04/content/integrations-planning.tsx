'use client'

import { useState } from 'react'

import { ChevronRightIcon, CheckIcon, CreditCardIcon, MessageCircleIcon, LinkIcon, ZapIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '#/components/shadcn-studio/primitives/avatar.tsx'
import { Button } from '#/components/shadcn-studio/primitives/button.tsx'
import { Badge } from '#/components/shadcn-studio/primitives/badge.tsx'
import { Card, CardContent, CardDescription, CardTitle } from '#/components/shadcn-studio/primitives/card.tsx'
import { cn } from '#/lib/utils.ts'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '#/components/shadcn-studio/primitives/dialog.tsx'

const IntegrationsPlanning = () => {
  const partnerApps = [
    {
      name: 'Notion',
      description: 'Organize your notes, tasks, and projects in one place',
      image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/notion-white.png',
      bgColor: 'bg-primary/10',
      link: '#'
    },
    {
      name: 'Asana',
      description: 'Manage your tasks and projects efficiently',
      image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/asana-icon-circle.png',
      bgColor: 'bg-destructive/10',
      link: '#'
    },
    {
      name: 'Dropbox',
      description: 'Store and share files securely in the cloud',
      image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/dropbox-icon-circle.png',
      bgColor: 'bg-blue-600/10 dark:bg-blue-400/10',
      link: '#'
    },
    {
      name: 'Google Meet',
      description: 'Host and join video meetings seamlessly',
      image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/meet-icon.png',
      bgColor: 'bg-green-600/10 dark:bg-green-400/10',
      link: '#'
    },
    {
      name: 'Zoom',
      description: 'Connect with your team and clients through video call',
      image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/camera-icon.png',
      bgColor: 'bg-sky-600/10 dark:bg-sky-400/10',
      link: '#'
    },
    {
      name: 'Microsoft',
      description: 'Integrate with Microsoft tools for enhanced productivity',
      image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/microsoft-icon.png',
      bgColor: 'bg-green-600/10 dark:bg-green-400/10',
      link: '#'
    }
  ]

  const [connected, setConnected] = useState<boolean[]>(partnerApps.map(() => false))

  return (
    <div>
      <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
        {/* Vertical Tabs List */}
        <div className='flex flex-col space-y-1'>
          <h3 className='font-semibold'>Planning & Productivity</h3>
          <p className='text-muted-foreground text-sm'>
            Manage your planning and productivity integrations and settings.
          </p>
        </div>
        {/* Content */}
        <div className='lg:col-span-2'>
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {partnerApps.map((app, index) => (
              <Card key={index} className='hover:border-primary group transition-colors'>
                <CardContent className='flex flex-col gap-6'>
                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <Avatar size='lg' className='rounded-lg'>
                      <AvatarFallback className={cn('rounded-lg', app.bgColor)}>
                        <img src={app.image} alt={app.name} className='size-6 object-contain' />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant='outline'
                      onClick={() =>
                        setConnected(prev => {
                          const next = [...prev]

                          next[index] = !next[index]

                          return next
                        })
                      }
                      aria-label={`Toggle connect for ${app.name}`}
                      className={cn(
                        connected[index]
                          ? 'border-sky-600 text-sky-600! hover:bg-sky-600/10 focus-visible:border-sky-600 focus-visible:ring-sky-600/20 dark:border-sky-400 dark:text-sky-400! dark:hover:bg-sky-400/10 dark:focus-visible:border-sky-400 dark:focus-visible:ring-sky-400/40'
                          : ''
                      )}
                    >
                      {connected[index] ? <CheckIcon /> : <LinkIcon />}
                      {connected[index] ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                  <div>
                    <CardTitle className='mb-3.5 font-medium'>{app.name}</CardTitle>
                    <CardDescription className='text-sm'>{app.description}</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline' className='h-7 w-full gap-1.5 px-2 py-1 text-xs'>
                        View Integration
                        <ChevronRightIcon className='transition-transform group-hover:translate-x-1' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='w-[95%] gap-0 overflow-hidden p-0 max-lg:h-[70%] md:max-w-3xl'>
                      {/* Header */}
                      <div className='flex items-start gap-4 border-b p-4 md:p-6'>
                        <Avatar className='size-12 rounded-xl'>
                          <AvatarFallback className={cn('rounded-xl', app.bgColor)}>
                            <img src={app.image} alt={app.name} className='size-7 object-contain' />
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0 flex-1'>
                          <DialogTitle className='text-lg font-bold'>{app.name}</DialogTitle>
                          <DialogDescription className='mt-0.5'>
                            Create {app.name} Issues from Intercom and automate with Workflows
                          </DialogDescription>
                          <div className='mt-1.5 flex items-center gap-3'>
                            <span className='text-muted-foreground text-xs'>Built by {app.name}</span>
                            <Badge variant='secondary' className='gap-1 text-xs'>
                              <CheckIcon className='size-3' /> Free
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className='flex overflow-hidden max-sm:flex-col'>
                        {/* Left Column */}
                        <div className='max-h-[60vh] flex-1 space-y-5 overflow-y-auto p-4 md:p-6 lg:max-h-[65vh]'>
                          <p className='text-muted-foreground text-sm'>
                            Seamlessly bridge the gap between your support and engineering teams. This integration
                            connects your ticketing system with {app.name}, enabling real-time syncing and powerful
                            automation capabilities.
                          </p>
                          <ul className='space-y-2.5'>
                            {[
                              'Automate syncing between platforms to keep issues up to date',
                              'Use pre-built workflow templates to get started quickly',
                              `Link ${app.name} issues directly to conversations for full context`,
                              'Access beta features for advanced automation pipelines (beta)'
                            ].map((item, i) => (
                              <li key={i} className='flex items-start gap-2 text-sm'>
                                <CheckIcon className='mt-0.5 size-4 shrink-0' />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Feature Highlight */}
                          <div className='bg-muted rounded-xl p-6'>
                            <h4 className='mb-4 text-center text-sm font-semibold'>
                              Speed up your team with custom automations using {app.name} Workflow templates
                            </h4>
                            <div className='grid gap-3 md:grid-cols-2'>
                              {[
                                {
                                  icon: <CreditCardIcon />,
                                  title: `Create ${app.name} issue`,
                                  desc: 'Automatically create issues from conversations'
                                },
                                {
                                  icon: <MessageCircleIcon />,
                                  title: `Comment on ${app.name} issue`,
                                  desc: 'Add notes and updates directly to issues'
                                },
                                {
                                  icon: <LinkIcon />,
                                  title: 'Link existing issue',
                                  desc: 'Connect conversations to existing issues instantly'
                                },
                                {
                                  icon: <ZapIcon />,
                                  title: 'Trigger automations',
                                  desc: 'Kick off workflows based on status changes'
                                }
                              ].map((card, i) => (
                                <div key={i} className='bg-background rounded-lg p-3.5'>
                                  <div className='mb-2 text-lg'>{card.icon}</div>
                                  <p className='mb-1 text-xs font-semibold'>{card.title}</p>
                                  <p className='text-muted-foreground text-xs'>{card.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className='flex w-52 shrink-0 flex-col gap-5 border-l p-5 max-sm:w-full'>
                          <Button>Install now</Button>
                          <div className='max-sm:hidden'>
                            <p className='mb-2 text-xs font-semibold'>Works with</p>
                            <ul className='text-muted-foreground space-y-1.5 text-xs'>
                              {['Inbox', 'Automations'].map(item => (
                                <li key={item} className='flex items-center gap-1.5'>
                                  <CheckIcon className='size-3' />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className='max-sm:hidden'>
                            <p className='mb-2 text-xs font-semibold'>Categories</p>
                            <div className='flex flex-wrap gap-1.5'>
                              {['Conversation management', 'Issue tracking & ticketing', 'For Support Agents'].map(
                                tag => (
                                  <Badge key={tag} variant='secondary' className='rounded-full text-xs font-normal'>
                                    {tag}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegrationsPlanning
