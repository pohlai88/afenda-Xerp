'use client'

import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'

import { cn } from '@/lib/utils'

// Types

export type StatisticsScoreCardProps = {
  label: string
  description: string
  score: number
  maxScore?: number
  className?: string
}

// Helpers

const getScoreColor = (score: number) => {
  if (score >= 75) return 'var(--chart-2)' // green
  if (score >= 50) return 'var(--chart-4)' // orange

  return 'var(--chart-1)' // red
}

// Component

const StatisticsScoreCard = ({ label, description, score, maxScore = 100, className }: StatisticsScoreCardProps) => {
  const color = getScoreColor(score)
  const chartData = [{ value: score }]

  return (
    <Card className={cn('gap-3', className)}>
      <CardHeader className='grid-rows-none'>
        <CardTitle className='font-semibold'>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className='flex items-center justify-between gap-4'>
        {/* Score value */}
        <p className='text-3xl font-semibold tracking-tight'>
          {score}
          <span className='text-muted-foreground text-base font-normal'>/{maxScore}</span>
        </p>

        {/* Radial chart */}
        <ChartContainer config={{ score: { color } }} className='size-18 shrink-0'>
          <RadialBarChart
            innerRadius={28}
            outerRadius={36}
            barSize={7}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type='number' domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey='value'
              cornerRadius={6}
              fill={color}
              background={{ fill: 'var(--muted)' }}
              isAnimationActive={false}
            />
            <text
              x='50%'
              y='50%'
              textAnchor='middle'
              dominantBaseline='middle'
              className='fill-foreground text-sm font-semibold'
            >
              {score}%
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default StatisticsScoreCard
