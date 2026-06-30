'use client'

import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

// Types

export type StatisticsRadialCardProps = {
  title: string
  value: number
  primaryLabel: string
  primaryPercent: number
  secondaryLabel: string
  secondaryPercent: number
  className?: string
}

// Helpers

const getChartColor = (value: number): string => {
  if (value >= 80) return 'var(--chart-2)' // green
  if (value >= 50) return 'var(--chart-4)' // orange

  return 'var(--chart-1)' // red
}

const getStatusLabel = (value: number): string => {
  if (value >= 80) return 'Excellent'
  if (value >= 50) return 'Good'

  return 'Fair'
}

const StatisticsRadialCard = ({
  title,
  value,
  primaryLabel,
  primaryPercent,
  secondaryLabel,
  secondaryPercent,
  className
}: StatisticsRadialCardProps) => {
  const fill = getChartColor(value)
  const chartData = [{ value }]

  return (
    <Card className={cn(className)}>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>{title}</CardTitle>
        <Badge variant='outline'>{getStatusLabel(value)}</Badge>
      </CardHeader>

      <CardContent className='flex items-center gap-8'>
        <div className='flex flex-1 flex-col gap-3'>
          {/* Primary metric */}
          <div className='flex gap-2'>
            <div className='flex items-center gap-1.5'>
              <span className='h-9 w-1 rounded-sm' style={{ background: fill }} />
            </div>
            <div>
              <p className='text-muted-foreground text-xs font-medium'>{primaryLabel}</p>
              <p className='text-foreground text-2xl font-semibold'>
                {primaryPercent}
                <span className='text-sm'>%</span>
              </p>
            </div>
          </div>

          <Separator />

          {/* Secondary metric */}
          <div className='flex gap-2'>
            <div className='flex items-center gap-1.5'>
              <span className='bg-muted-foreground/40 h-9 w-1 rounded-sm' />
            </div>
            <div>
              <p className='text-muted-foreground text-xs font-medium'>{secondaryLabel}</p>
              <p className='text-foreground text-2xl font-semibold'>
                {secondaryPercent}
                <span className='text-sm'>%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Radial chart */}
        <ChartContainer config={{ value: { color: fill } }} className='size-27 shrink-0'>
          <RadialBarChart
            innerRadius={42}
            outerRadius={60}
            barSize={6}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type='number' domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey='value'
              cornerRadius={6}
              fill={fill}
              background={{ fill: 'var(--muted)' }}
              isAnimationActive={false}
            />
            <text
              x='50%'
              y='50%'
              textAnchor='middle'
              dominantBaseline='middle'
              className='fill-foreground text-base font-semibold'
            >
              {value}%
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default StatisticsRadialCard
