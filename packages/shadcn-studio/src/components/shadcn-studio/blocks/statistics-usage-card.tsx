import type { ReactElement } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export type StatisticsUsageCardProps = {
  icon: ReactElement
  title: string
  current: number
  max: number
  unit: string
  className?: string
}

type Status = 'healthy' | 'warning' | 'critical'

function getStatus(pct: number): Status {
  if (pct >= 90) return 'critical'
  if (pct >= 65) return 'warning'

  return 'healthy'
}

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${+(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}K`

  return String(n)
}

const StatisticsUsageCard = ({ icon, title, current, max, unit, className }: StatisticsUsageCardProps) => {
  const usedPct = (current / max) * 100
  const remainingPct = 100 - usedPct
  const status = getStatus(usedPct)

  return (
    <Card className={className}>
      <CardContent className='flex flex-col gap-4'>
        {/* Header row */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Avatar className='rounded-sm after:border-0'>
              <AvatarFallback className='bg-primary/10 text-primary shrink-0 rounded-sm [&>svg]:size-4.5'>
                {icon}
              </AvatarFallback>
            </Avatar>
            <span className='text-sm font-medium'>{title}</span>
          </div>
          <Badge variant='outline' className='capitalize'>
            {status}
          </Badge>
        </div>

        {/* Remaining highlight */}
        <div>
          <p className='text-muted-foreground text-sm'>Remaining</p>
          <p className='text-2xl font-semibold tracking-tight'>
            {formatCompact(max - current)}
            <span className='text-muted-foreground ml-1.5 text-sm font-normal'>{unit}</span>
          </p>
        </div>

        {/* Progress — shows remaining */}
        <div className='flex flex-col gap-1.5'>
          <Progress value={remainingPct} className='*:data-[slot=progress-track]:h-1.5' />
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs'>{remainingPct.toFixed(0)}% left</span>
            <span className='text-muted-foreground text-xs'>
              {formatCompact(current)} used of {formatCompact(max)} {unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatisticsUsageCard
