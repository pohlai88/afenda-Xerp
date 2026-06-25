'use client'

import { CircleAlertIcon } from 'lucide-react'

import { Separator } from '#/components/shadcn-studio/primitives/separator.tsx'
import { Alert, AlertDescription, AlertTitle } from '#/components/shadcn-studio/primitives/alert.tsx'

import Billing from '#/components/shadcn-studio/blocks/account-settings-07/content/all-billing.tsx'
import SpendManagement from '#/components/shadcn-studio/blocks/account-settings-07/content/spend-management.tsx'
import PaymentMethod from '#/components/shadcn-studio/blocks/account-settings-07/content/payment-method.tsx'
import AiGateway from '#/components/shadcn-studio/blocks/account-settings-07/content/ai-gateway.tsx'
import AddOns from '#/components/shadcn-studio/blocks/account-settings-07/content/add-ons.tsx'

const BillingUsagePage = () => {
  return (
    <section className='py-3'>
      <div className='mx-auto max-w-7xl'>
        <Alert className='border-accent-foreground/20 from-accent text-accent-foreground mb-6 flex justify-between bg-gradient-to-b to-transparent to-60%'>
          <CircleAlertIcon />
          <div className='flex flex-1 flex-col gap-1'>
            <AlertTitle>This workspace is currently on free plan</AlertTitle>
            <AlertDescription className='text-accent-foreground/60'>
              Boost your analytics and unlock advanced features with our premium plans.
            </AlertDescription>
          </div>
        </Alert>
        <Billing />
        <Separator className='my-10' />
        <SpendManagement />
        <Separator className='my-10' />
        <PaymentMethod />
        <Separator className='my-10' />
        <AiGateway />
        <Separator className='my-10' />
        <AddOns />
      </div>
    </section>
  )
}

export default BillingUsagePage
