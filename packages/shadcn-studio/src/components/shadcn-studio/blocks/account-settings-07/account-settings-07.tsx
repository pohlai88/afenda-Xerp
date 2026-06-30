'use client'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import Billing from '@/components/shadcn-studio/blocks/account-settings-07/content/all-billing'
import SpendManagement from '@/components/shadcn-studio/blocks/account-settings-07/content/spend-management'
import PaymentMethod from '@/components/shadcn-studio/blocks/account-settings-07/content/payment-method'
import AiGateway from '@/components/shadcn-studio/blocks/account-settings-07/content/ai-gateway'
import AddOns from '@/components/shadcn-studio/blocks/account-settings-07/content/add-ons'
import { CircleAlertIcon } from "lucide-react"

const BillingUsagePage = () => {
  return (
    <section className='py-3'>
      <div className='mx-auto max-w-7xl'>
        <Alert className='border-accent-foreground/20 from-accent text-accent-foreground mb-6 flex justify-between bg-gradient-to-b to-transparent to-60%'>
          <CircleAlertIcon
          />
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
