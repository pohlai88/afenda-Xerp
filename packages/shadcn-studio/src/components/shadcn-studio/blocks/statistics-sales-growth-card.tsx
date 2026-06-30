'use client'

import { Area, AreaChart } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Sales growth chart data
const salesGrowthChartData = [
  { date: '2024-06-14', sales: 280 },
  { date: '2024-06-15', sales: 270 },
  { date: '2024-06-16', sales: 350 },
  { date: '2024-06-17', sales: 290 },
  { date: '2024-06-18', sales: 400 },
  { date: '2024-06-19', sales: 570 },
  { date: '2024-06-20', sales: 500 },
  { date: '2024-06-22', sales: 380 },
  { date: '2024-06-21', sales: 480 },
  { date: '2024-06-23', sales: 470 },
  { date: '2024-06-24', sales: 420 },
  { date: '2024-06-25', sales: 380 }
]

const salesGrowthChartConfig = {
  sales: {
    label: 'Sales'
  }
} satisfies ChartConfig

const StatisticsCardData = {
  title: 'Sales Growth',
  description: 'Last 12 Days',
  children: (
    <>
      <ChartContainer config={salesGrowthChartConfig} className='h-21 w-full'>
        <AreaChart
          data={salesGrowthChartData}
          margin={{
            left: 0,
            right: 0
          }}
        >
          <defs>
            <linearGradient id='fillSales' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='10%' stopColor='var(--chart-4)' stopOpacity={0.4} />
              <stop offset='90%' stopColor='var(--chart-4)' stopOpacity={0} />
            </linearGradient>
          </defs>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Area
            dataKey='sales'
            type='natural'
            fill='url(#fillSales)'
            stroke='var(--chart-4)'
            strokeWidth={2}
            stackId='a'
          />
        </AreaChart>
      </ChartContainer>
    </>
  ),
  value: '$12K',
  changePercentage: '-18%'
}

const StatisticsSalesGrowthCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{StatisticsCardData.title}</CardTitle>
        <CardDescription className='text-muted-foreground text-base'>{StatisticsCardData.description}</CardDescription>
      </CardHeader>
      {StatisticsCardData.children}

      <CardContent className='flex items-center justify-between'>
        <span className='text-xl font-semibold'>{StatisticsCardData.value}</span>
        <span className='text-primary text-base'>{StatisticsCardData.changePercentage}</span>
      </CardContent>
    </Card>
  )
}

export default StatisticsSalesGrowthCard
