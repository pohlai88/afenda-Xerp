import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { TrendingUpIcon, MinusIcon, TrendingDownIcon, ShieldAlertIcon, ChevronRightIcon } from "lucide-react"

// Types

export type StatisticsFinanceCardProps = {
  region: string
  value: string
  goalsAchieved: number
  goalsTotal: number
  status: 'within' | 'observe' | 'critical' | 'review'
  className?: string
}

// Status Config

const statusConfig = {
  within: {
    label: 'On Track',
    icon: (
      <TrendingUpIcon
      />
    ),
    iconBg: 'bg-green-600 dark:bg-green-400',
    textColor: 'text-green-600 dark:text-green-400'
  },
  observe: {
    label: 'Monitoring',
    icon: (
      <MinusIcon
      />
    ),
    iconBg: 'bg-amber-500 dark:bg-amber-400',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  critical: {
    label: 'At Risk',
    icon: (
      <TrendingDownIcon
      />
    ),
    iconBg: 'bg-destructive',
    textColor: 'text-destructive'
  },
  review: {
    label: 'Under Review',
    icon: (
      <ShieldAlertIcon
      />
    ),
    iconBg: 'bg-sky-600 dark:bg-sky-400',
    textColor: 'text-sky-600 dark:text-sky-400'
  }
}

// Component

const StatisticsFinanceCard = ({
  region,
  value,
  goalsAchieved,
  goalsTotal,
  status,
  className
}: StatisticsFinanceCardProps) => {
  const cfg = statusConfig[status]

  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription>{region}</CardDescription>
        <CardTitle className='text-2xl font-semibold tracking-tight'>{value}</CardTitle>
      </CardHeader>

      <CardContent>
        <button className='bg-muted/60 hover:bg-muted flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors'>
          <span
            className={cn(
              cfg.iconBg,
              'flex size-8 shrink-0 items-center justify-center rounded-lg text-white [&>svg]:size-4'
            )}
          >
            {cfg.icon}
          </span>

          <span className='flex flex-1 flex-col items-start leading-tight'>
            <span className='text-foreground text-xs font-medium'>
              {goalsAchieved}/{goalsTotal} goals
            </span>
            <span className={cn('text-xs font-medium', cfg.textColor)}>{cfg.label}</span>
          </span>

          <ChevronRightIcon className='text-muted-foreground size-4 shrink-0' />
        </button>
      </CardContent>
    </Card>
  )
}

export default StatisticsFinanceCard
