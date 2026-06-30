import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

// Zone definitions
const ZONES = [
  { label: 'Fast', range: '<50 ms', bar: 'bg-green-600 dark:bg-green-400' },
  { label: 'Normal', range: '50-200 ms', bar: 'bg-sky-600 dark:bg-sky-400' },
  { label: 'Slow', range: '200-500 ms', bar: 'bg-amber-600 dark:bg-amber-400' },
  { label: 'Critical', range: '>500 ms', bar: 'bg-destructive' }
] as const

export type ZoneShares = {
  fast: number
  normal: number
  slow: number
  critical: number
}

export type StatisticsLatencyCardProps = {
  endpoint: string
  avgLatency: number
  totalRequests: string
  shares: ZoneShares
  className?: string
}

const StatisticsLatencyCard = ({
  endpoint,
  avgLatency,
  totalRequests,
  shares,
  className
}: StatisticsLatencyCardProps) => {
  const rows = [
    { ...ZONES[0], pct: shares.fast },
    { ...ZONES[1], pct: shares.normal },
    { ...ZONES[2], pct: shares.slow },
    { ...ZONES[3], pct: shares.critical }
  ]

  return (
    <Card className={cn(className)}>
      {/* Header */}
      <CardHeader className='flex items-start justify-between gap-2'>
        <div>
          <p className='text-muted-foreground text-sm font-medium'>{endpoint}</p>
          <div className='flex items-baseline gap-1.5'>
            <span className='text-3xl font-semibold tracking-tight'>{avgLatency}</span>
            <span className='text-muted-foreground text-sm'>ms avg</span>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-muted-foreground text-sm font-medium'>Requests</p>
          <p className='text-base font-medium'>{totalRequests}</p>
        </div>
      </CardHeader>

      <CardContent className='flex flex-col gap-2'>
        {/* Column headers */}
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>Zone</span>
          <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>Range / Share</span>
        </div>

        <Separator />

        {/* Rows */}
        <div>
          {rows.map(row => (
            <div key={row.label} className='flex items-center justify-between gap-3 py-2.5 last:pb-0'>
              <div className='flex items-center gap-3'>
                <span className={cn('h-5 w-1 shrink-0 rounded-full', row.bar)} />
                <span className='text-sm'>{row.label}</span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-muted-foreground text-sm tabular-nums'>{row.range}</span>
                <span className='w-14 text-right text-sm font-semibold tabular-nums'>{row.pct.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatisticsLatencyCard
