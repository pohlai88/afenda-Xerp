'use client'

import type { FormEvent, ReactNode } from 'react'
import { useCallback, useState } from 'react'

import {
  ChevronRightIcon,
  CircleUserRoundIcon,
  KeyRoundIcon,
  MailCheckIcon,
  ShieldCheckIcon,
  UserRoundPlusIcon,
} from 'lucide-react'
import { motion } from 'motion/react'

import LogoSvg from '@/assets/svg/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import ForgotPasswordFormV1 from './forgot-password-form-v1.js'
import LoginFormV1 from './login-form-v1.js'
import RegisterFormV1 from './register-form-v1.js'
import VerifyEmailFormV1 from './verify-email-form-v1.js'
import { cn } from '@/lib/utils'

type AuthShellSurfaceV1Mode = 'card' | 'drawer'

export interface AuthShellSurfaceV1Props {
  readonly mode?: AuthShellSurfaceV1Mode
  readonly triggerClassName?: string
  readonly triggerLabel?: string
}

type AuthStepId = 'signin' | 'reset-password' | 'register' | 'verify-email'

type AuthStepMeta = {
  readonly id: AuthStepId
  readonly title: string
  readonly description: string
  readonly actionLabel: string
  readonly icon: ReactNode
  readonly renderForm: (onSubmit: (event: FormEvent<HTMLFormElement>) => void) => ReactNode
}

const authSteps: readonly AuthStepMeta[] = [
  {
    id: 'signin',
    title: 'SignIn',
    description: 'Sign in to continue',
    actionLabel: 'Sign in',
    icon: <CircleUserRoundIcon />,
    renderForm: (onSubmit) => (
      <LoginFormV1
        className='space-y-4'
        forgotPasswordHref='#reset-password'
        submitLabel='Sign in'
        onSubmit={onSubmit}
      />
    ),
  },
  {
    id: 'reset-password',
    title: 'Reset Password',
    description: 'Recover access securely',
    actionLabel: 'Send reset link',
    icon: <KeyRoundIcon />,
    renderForm: (onSubmit) => (
      <ForgotPasswordFormV1
        className='space-y-4'
        emailPlaceholder='operator@company.com'
        submitLabel='Send reset link'
        onSubmit={onSubmit}
      />
    ),
  },
  {
    id: 'register',
    title: 'Register',
    description: 'Create a new account',
    actionLabel: 'Create account',
    icon: <UserRoundPlusIcon />,
    renderForm: (onSubmit) => (
      <RegisterFormV1
        className='space-y-4'
        emailPlaceholder='jordan@company.com'
        namePlaceholder='Jordan Lee'
        submitLabel='Create account'
        onSubmit={onSubmit}
      />
    ),
  },
  {
    id: 'verify-email',
    title: 'Verify Email',
    description: 'Confirm your inbox',
    actionLabel: 'Verify email',
    icon: <MailCheckIcon />,
    renderForm: (onSubmit) => (
      <VerifyEmailFormV1
        className='space-y-4'
        emailPlaceholder='operator@company.com'
        submitLabel='Verify email'
        verificationCodePlaceholder='6-digit code'
        onSubmit={onSubmit}
      />
    ),
  },
] as const

const authStepMetaById = Object.fromEntries(authSteps.map((step) => [step.id, step])) as Record<
  AuthStepId,
  AuthStepMeta
>

const authNavTriggerClassName =
  'group w-full justify-start rounded-[1rem] border-0 px-3 py-3 text-left transition-colors data-active:bg-background data-active:shadow-sm'

const authPanelShellClassName =
  'space-y-4 rounded-[1.75rem] border border-border/60 bg-background/90 p-5 shadow-sm'

const authDrawerTabsRailClassName =
  'h-auto w-full shrink-0 rounded-[1.5rem] border border-border/60 bg-muted/30 p-2'

const authSurfaceRevealInitial = {
  y: 30,
  opacity: 0,
} as const

const authSurfaceRevealAnimate = {
  y: 0,
  opacity: 1,
} as const

const authSurfaceRevealTransition = (delay: number) => ({
  duration: 0.35,
  ease: 'easeOut' as const,
  delay,
})

const AuthShellBrand = ({ className }: { readonly className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoSvg className='size-8.5' />
      <span className='text-xl font-bold'>shadcn/studio</span>
    </div>
  )
}

const AuthSurfaceReveal = ({
  children,
  className,
  delay,
}: {
  readonly children: ReactNode
  readonly className?: string
  readonly delay: number
}) => (
  <motion.div
    className={className}
    initial={authSurfaceRevealInitial}
    animate={authSurfaceRevealAnimate}
    transition={authSurfaceRevealTransition(delay)}
  >
    {children}
  </motion.div>
)

const AuthShellDrawerPanel = ({
  step,
  onSubmit,
}: {
  readonly step: AuthStepMeta
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) => {
  return (
    <div className='mt-0 min-w-0 rounded-[1.75rem] border border-border/60 bg-background/90 p-5 shadow-sm'>
      <div className='mb-4 space-y-1'>
        <p className='text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground'>
          Authentication step
        </p>
        <h3 className='font-medium text-base leading-tight'>{step.description}</h3>
      </div>

      {step.renderForm(onSubmit)}

      <div className='mt-4 rounded-2xl border border-dashed border-border/70 bg-background/70 px-3 py-2'>
        <p className='text-muted-foreground text-xs leading-5'>
          {step.title}: {step.actionLabel}
        </p>
      </div>
    </div>
  )
}

const AuthShellDrawerV1 = ({
  triggerClassName,
  triggerLabel = 'Open Drawer',
}: {
  readonly triggerClassName?: string | undefined
  readonly triggerLabel?: string | undefined
}) => {
  const [activeStepId, setActiveStepId] = useState<AuthStepId>('signin')
  const activeStep = authStepMetaById[activeStepId]

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      alert(`${activeStep.title} submitted`)
    },
    [activeStep.title]
  )

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className={triggerClassName}>{triggerLabel}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-full max-w-4xl px-4 pb-6'>
          <AuthSurfaceReveal delay={0.15}>
            <DrawerHeader className='px-0 text-left'>
              <div className='flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.26em]'>
                <ShieldCheckIcon className='size-3.5' />
                Authentication
              </div>
              <DrawerTitle className='text-balance text-left text-2xl font-medium leading-tight'>
                Authenticate without leaving the drawer.
              </DrawerTitle>
              <DrawerDescription className='max-w-2xl text-left text-sm leading-6'>
                Unified auth shell surface for SignIn, Reset Password, Register, and Verify Email.
              </DrawerDescription>
            </DrawerHeader>
          </AuthSurfaceReveal>

          <AuthSurfaceReveal className='mt-3' delay={0.2}>
            <Tabs
              value={activeStepId}
              onValueChange={(value) => setActiveStepId(value as AuthStepId)}
              orientation='vertical'
              className='w-full items-stretch'
            >
              <div className='grid gap-4 rounded-[2rem] border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 p-3 shadow-2xl shadow-black/10 lg:grid-cols-[17rem_minmax(0,1fr)]'>
                <div className='rounded-[1.5rem] border border-border/60 bg-muted/25 p-2'>
                  <div className='mb-3 px-2 pt-1'>
                    <p className='text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground'>
                      Navigation
                    </p>
                    <p className='mt-1 text-sm text-foreground/80'>
                      Switch between auth modes without leaving the drawer.
                    </p>
                  </div>

                  <TabsList variant='line' className={authDrawerTabsRailClassName}>
                    {authSteps.map((step) => (
                      <TabsTrigger
                        key={step.id}
                        value={step.id}
                        className={authNavTriggerClassName}
                      >
                        <span className='flex min-w-0 items-center gap-3'>
                          <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-data-active:bg-primary group-data-active:text-primary-foreground'>
                            {step.icon}
                          </span>
                          <span className='min-w-0 flex-1'>
                            <span className='block truncate font-medium'>{step.title}</span>
                            <span className='block truncate text-xs text-muted-foreground'>
                              {step.actionLabel}
                            </span>
                          </span>
                          <ChevronRightIcon className='size-4 shrink-0 text-muted-foreground' />
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <AuthShellDrawerPanel step={activeStep} onSubmit={handleSubmit} />
              </div>
            </Tabs>
          </AuthSurfaceReveal>

          <AuthSurfaceReveal delay={0.36}>
            <DrawerFooter className='mt-3 px-0 pb-0'>
              <DrawerClose asChild>
                <Button className='w-full rounded-xl' variant='outline'>
                  Close authentication drawer
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </AuthSurfaceReveal>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const AuthShellSurfaceV1 = ({
  mode = 'card',
  triggerClassName,
  triggerLabel = 'Open Drawer',
}: AuthShellSurfaceV1Props) => {
  if (mode === 'drawer') {
    const drawerProps =
      triggerClassName === undefined
        ? { triggerLabel }
        : { triggerClassName, triggerLabel }

    return (
      <AuthShellDrawerV1 {...drawerProps} />
    )
  }

  const [activeStepId, setActiveStepId] = useState<AuthStepId>('signin')

  const activeStep = authStepMetaById[activeStepId]

  const handleStepNavigation = useCallback((targetStepId: AuthStepId) => {
    setActiveStepId(targetStepId)
  }, [])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      alert(`${activeStep.title} submitted`)
    },
    [activeStep.title]
  )

  return (
    <Card className='w-full max-w-167'>
      <CardContent className='flex gap-2 max-md:flex-col max-md:px-4'>
        <nav aria-label='Authentication modes' className='space-y-6 rounded-md border p-3'>
          <a href='#signin'>
            <AuthShellBrand className='mb-6 gap-3' />
          </a>

          <ol className='flex flex-col justify-between gap-1'>
            {authSteps.map((step) => {
              const isActive = step.id === activeStepId

              return (
                <li key={step.id}>
                  <button
                    type='button'
                    className={cn(authNavTriggerClassName, {
                      'bg-accent': isActive,
                    })}
                    onClick={() => handleStepNavigation(step.id)}
                  >
                    <div className='flex min-w-0 gap-2 *:[svg]:size-4.5'>
                      {step.icon}
                      <span className='min-w-0'>
                        <span className='block truncate text-sm text-foreground'>{step.title}</span>
                        <span className='block truncate text-xs text-muted-foreground'>{step.actionLabel}</span>
                      </span>
                    </div>
                    <ChevronRightIcon className='size-4.5' />
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className='flex flex-1 flex-col gap-4 max-md:pt-6 md:p-3'>
          <div className={authPanelShellClassName}>
            <p className='text-lg font-medium'>{activeStep.description}</p>
            <p className='text-sm text-muted-foreground'>{activeStep.title}</p>
          </div>

          <>{activeStep.renderForm(handleSubmit)}</>

          <div className='rounded-2xl border border-dashed border-border/70 bg-background/70 px-3 py-2'>
            <p className='text-muted-foreground text-xs leading-5'>
              Use the left rail to switch between SignIn, Reset Password, Register, and Verify Email.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AuthShellSurfaceV1