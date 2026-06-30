'use client'

import { Area, AreaChart, XAxis, YAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { cn } from '@/lib/utils'

// ETF market data - Mar 2026
const chartData = [
  { date: 'Mar 2', SPY: 521.4, QQQ: 438.2, VTI: 248.7, GLD: 198.3, TLT: 91.8, ARKK: 54.2 },
  { date: 'Mar 3', SPY: 524.8, QQQ: 441.5, VTI: 250.1, GLD: 200.1, TLT: 90.4, ARKK: 55.1 },
  { date: 'Mar 4', SPY: 523.1, QQQ: 443.8, VTI: 249.6, GLD: 201.7, TLT: 89.2, ARKK: 56.4 },
  { date: 'Mar 5', SPY: 527.6, QQQ: 447.2, VTI: 251.8, GLD: 200.9, TLT: 88.5, ARKK: 55.8 },
  { date: 'Mar 6', SPY: 526.3, QQQ: 445.9, VTI: 252.4, GLD: 203.4, TLT: 87.6, ARKK: 57.3 },
  { date: 'Mar 7', SPY: 529.7, QQQ: 449.1, VTI: 253.9, GLD: 202.8, TLT: 86.9, ARKK: 58.6 },
  { date: 'Mar 8', SPY: 528.2, QQQ: 451.6, VTI: 255.2, GLD: 205.3, TLT: 85.7, ARKK: 57.9 },
  { date: 'Mar 9', SPY: 532.5, QQQ: 454.3, VTI: 256.8, GLD: 204.6, TLT: 84.8, ARKK: 59.4 }
]

const etfData = [
  { ticker: 'SPY', name: 'SPDR S&P 500', price: 532.5, change: 2.13 },
  { ticker: 'QQQ', name: 'Invesco Nasdaq-100', price: 454.3, change: 3.67 },
  { ticker: 'VTI', name: 'Vanguard Total Market', price: 256.8, change: 3.26 },
  { ticker: 'GLD', name: 'SPDR Gold Shares', price: 204.6, change: 3.18 },
  { ticker: 'TLT', name: 'iShares 20Y+ Treasury', price: 84.8, change: -7.63 },
  { ticker: 'ARKK', name: 'ARK Innovation', price: 59.4, change: 9.59 }
]

const chartConfig = {} satisfies ChartConfig

type ETFCardProps = {
  ticker: string
  name: string
  price: number
  change: number
}

const ETFCard = ({ ticker, name, price, change }: ETFCardProps) => {
  const isPositive = change >= 0
  const accentColor = isPositive ? 'var(--color-green-500)' : 'var(--destructive)'
  const formattedChange = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`

  const values = chartData.map(d => d[ticker as keyof typeof d] as number)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = (max - min) * 0.15
  const yDomain: [number, number] = [min - pad, max + pad]

  return (
    <Card className='ring-foreground/10 flex flex-col gap-0 overflow-hidden p-0 shadow-none'>
      {/* Top section: ticker + badge + price + name */}
      <div className='flex flex-col gap-1 px-4 pt-4 pb-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>{ticker}</span>
          <Badge
            variant='outline'
            className={cn(
              'rounded-sm border-0 font-medium tabular-nums',
              isPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-destructive/10 text-destructive'
            )}
          >
            {formattedChange}
          </Badge>
        </div>

        <p className='text-lg font-semibold tabular-nums'>${price.toFixed(2)}</p>
        <p className='text-muted-foreground truncate text-xs'>{name}</p>
      </div>

      {/* Chart anchored to the bottom of the card */}
      <div className='mt-auto h-16 w-full'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`fill-${ticker}`} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={accentColor} stopOpacity={0.25} />
                <stop offset='100%' stopColor={accentColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey='date' hide />
            <YAxis domain={yDomain} hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey={ticker}
              type='monotone'
              fill={`url(#fill-${ticker})`}
              stroke={accentColor}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  )
}

const CompanyStockGraph = ({ className }: { className?: string }) => {
  const gainers = etfData.filter(e => e.change >= 0).length
  const losers = etfData.filter(e => e.change < 0).length

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className='grid-rows-none'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <CardDescription className='uppercase'>ETF Overview</CardDescription>
            <CardTitle className='text-lg font-semibold'>Mar 9, 2026</CardTitle>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Badge
              variant='outline'
              className='gap-1.5 border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
            >
              <span className='size-1.5 rounded-full bg-green-500' />
              {gainers} gaining
            </Badge>
            <Badge variant='outline' className='border-destructive/20 bg-destructive/10 text-destructive gap-1.5'>
              <span className='bg-destructive size-1.5 rounded-full' />
              {losers} declining
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {etfData.map(etf => (
          <ETFCard key={etf.ticker} {...etf} />
        ))}
      </CardContent>
    </Card>
  )
}

export default CompanyStockGraph
