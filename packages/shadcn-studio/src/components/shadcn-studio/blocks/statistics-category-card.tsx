import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryBar } from '@/components/ui/category-bar'

import { cn } from '@/lib/utils'

export type CategorySegment = {
  label: string
  value: number
  color: string
}

export type StatisticsCategoryCardProps = {
  title: string
  value: string
  period: string
  segments: CategorySegment[]
  className?: string
}

const StatisticsCategoryCard = ({ title, value, period, segments, className }: StatisticsCategoryCardProps) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0)

  return (
    <Card className={className}>
      <CardHeader className='gap-1'>
        <p className='text-sm'>{title}</p>
        <CardTitle className='text-3xl font-semibold tracking-tight'>{value}</CardTitle>
        <CardDescription className='text-muted-foreground text-xs'>{period}</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        {/* Category bar */}
        <CategoryBar values={segments.map(s => s.value)} colors={segments.map(s => s.color)} showLabels={false} />

        {/* Legend */}
        <div className='flex gap-10'>
          {segments.map(s => {
            const pct = total > 0 ? ((s.value / total) * 100).toFixed(1) : '0'

            return (
              <div key={s.label} className='flex flex-col'>
                <p className='text-base font-semibold tabular-nums'>{pct}%</p>
                <div className='flex items-center gap-1.5'>
                  <span className={cn('size-2 shrink-0 rounded-sm', s.color)} />
                  <span className='text-muted-foreground text-sm'>{s.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatisticsCategoryCard
