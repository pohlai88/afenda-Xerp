'use client'

import { Label, Pie, PieChart } from 'recharts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { cn } from '@/lib/utils'
import { ShirtIcon, HouseIcon, LaptopIcon, EllipsisVerticalIcon } from "lucide-react"

const listItems = ['Share', 'Update', 'Refresh']

const orderChartData = [
  { month: 'january', order: 340, fill: 'var(--color-january)' },
  { month: 'february', order: 200, fill: 'var(--color-february)' },
  { month: 'march', order: 200, fill: 'var(--color-march)' }
]

const orderChartConfig = {
  order: {
    label: 'Order'
  },
  january: {
    label: 'January',
    color: 'color-mix(in oklab, var(--primary) 60%, transparent)'
  },
  february: {
    label: 'February',
    color: 'var(--primary)'
  },
  march: {
    label: 'March',
    color: 'color-mix(in oklab, var(--primary) 20%, transparent)'
  }
} satisfies ChartConfig

const data = [
  {
    icon: (
      <ShirtIcon className='size-6' />
    ),
    title: 'Fashion',
    department: 'T-shirt, Jeans',
    value: '1.23K'
  },
  {
    icon: (
      <HouseIcon className='size-6' />
    ),
    title: 'Home Appliances',
    department: 'Refrigerator, Washing Machine, Oven',
    value: '2.5K'
  },
  {
    icon: (
      <LaptopIcon className='size-6' />
    ),
    title: 'Computers',
    department: 'Laptops, Desktops, Tablets',
    value: '3.1K'
  }
]

const TotalOrdersCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('gap-4 text-base', className)}>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>Total orders </span>
          <span className='text-muted-foreground text-sm'>42.8K Total sales</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant='ghost' size='icon' className='text-muted-foreground size-6 rounded-full' />}
          >
            <EllipsisVerticalIcon
            />
            <span className='sr-only'>Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup>
              {listItems.map((item, index) => (
                <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col justify-center gap-2'>
            <span className='text-3xl font-semibold'>5,652</span>
            <span className='text-muted-foreground text-sm'>Total orders</span>
          </div>
          <ChartContainer config={orderChartConfig} className='h-30 w-full'>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={orderChartData}
                dataKey='order'
                nameKey='month'
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 7}
                            className='fill-card-foreground text-lg font-semibold'
                          >
                            38%
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className='fill-muted-foreground text-sm'>
                            Weekly
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {data.map((order, index) => (
          <div key={index} className='flex flex-1 items-center justify-between gap-2'>
            <div className='flex items-center justify-between gap-2'>
              <Avatar size='lg' className='rounded-sm after:border-0'>
                <AvatarFallback className='bg-primary/10 text-primary shrink-0 rounded-sm'>{order.icon}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0.5'>
                <span className='font-medium'>{order.title}</span>
                <span className='text-muted-foreground text-sm'>{order.department}</span>
              </div>
            </div>
            <span className='text-sm'>{order.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TotalOrdersCard
