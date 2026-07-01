/** Serializable fixture data for prop-driven MCP flat blocks (Storybook lab). */

export const METRIC_TREND_SERIES = [
  {
    key: "revenue",
    label: "Revenue",
    value: 42_500,
    color: "var(--chart-1)",
  },
  {
    key: "orders",
    label: "Orders",
    value: 8120,
    color: "var(--chart-2)",
  },
] as const;

export const METRIC_TREND_DATA = [
  { time: "Mon", revenue: 4200, orders: 820 },
  { time: "Tue", revenue: 5100, orders: 910 },
  { time: "Wed", revenue: 4800, orders: 870 },
  { time: "Thu", revenue: 5600, orders: 980 },
  { time: "Fri", revenue: 6200, orders: 1040 },
  { time: "Sat", revenue: 3900, orders: 710 },
  { time: "Sun", revenue: 4100, orders: 760 },
] as const;

export const STATISTICS_TREND_DATA = [
  { date: "2026-01-01", value: 1200 },
  { date: "2026-01-08", value: 1800 },
  { date: "2026-01-15", value: 1600 },
  { date: "2026-01-22", value: 2200 },
  { date: "2026-01-29", value: 2600 },
  { date: "2026-02-05", value: 2400 },
  { date: "2026-02-12", value: 3100 },
] as const;

export const CHART_EARNING_DATA = [
  { day: "Mon", earning: 186, fill: "var(--chart-1)" },
  { day: "Tue", earning: 305, fill: "var(--chart-1)" },
  { day: "Wed", earning: 237, fill: "var(--chart-1)" },
  { day: "Thu", earning: 273, fill: "var(--chart-1)" },
  { day: "Fri", earning: 209, fill: "var(--chart-1)" },
  { day: "Sat", earning: 214, fill: "var(--chart-1)" },
  { day: "Sun", earning: 252, fill: "var(--chart-1)" },
] as const;

export const WIDGET_TRANSACTIONS = [
  {
    icon: "CreditCard" as const,
    paymentMethod: "Credit Card",
    platform: "Stripe",
    amount: "+$2,450",
    paymentType: "credit",
    iconClassName: "bg-sky-600/10 text-sky-600",
  },
  {
    icon: "Wallet" as const,
    paymentMethod: "Wallet",
    platform: "PayPal",
    amount: "+$890",
    paymentType: "debit",
    iconClassName: "bg-emerald-600/10 text-emerald-600",
  },
  {
    icon: "Banknote" as const,
    paymentMethod: "Bank transfer",
    platform: "ACH",
    amount: "-$120",
    paymentType: "debit",
    iconClassName: "bg-amber-600/10 text-amber-600",
  },
] as const;

export const WIDGET_SALES_BY_COUNTRIES = [
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/flags/us.png",
    sales: "$12,840",
    country: "United States",
    changePercentage: "+12.5%",
    trend: "up" as const,
  },
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/flags/gb.png",
    sales: "$8,420",
    country: "United Kingdom",
    changePercentage: "+8.1%",
    trend: "up" as const,
  },
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/flags/de.png",
    sales: "$6,110",
    country: "Germany",
    changePercentage: "-2.4%",
    trend: "down" as const,
  },
] as const;

export const WIDGET_TOTAL_EARNING_ROWS = [
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/icon/react.png",
    platform: "React",
    technologies: "Frontend",
    earnings: "$18,240",
    progressPercentage: 72,
  },
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/icon/nextjs.png",
    platform: "Next.js",
    technologies: "Full stack",
    earnings: "$12,680",
    progressPercentage: 58,
  },
] as const;

export const WIDGET_PAYMENT_HISTORY = [
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/cards/visa.png",
    imgWidth: "w-10",
    cardNumber: "**** 4242",
    cardType: "Visa",
    date: "Jun 12, 2026",
    spend: "$1,240",
    remaining: "$3,760",
  },
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/cards/mastercard.png",
    imgWidth: "w-10",
    cardNumber: "**** 8891",
    cardType: "Mastercard",
    date: "Jun 08, 2026",
    spend: "$890",
    remaining: "$4,110",
  },
] as const;

export const STATISTICS_REVENUE_CHART_DATA = [
  {
    day: "Monday",
    revenue: 150,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Tuesday",
    revenue: 250,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Wednesday",
    revenue: 190,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  { day: "Thursday", revenue: 290 },
  {
    day: "Friday",
    revenue: 220,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Saturday",
    revenue: 350,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
  {
    day: "Sunday",
    revenue: 250,
    fill: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
] as const;

export const STATISTICS_ACTIVITY_CHART_DATA = [
  { day: "Monday", sales: 260 },
  { day: "Tuesday", sales: 380 },
  { day: "Wednesday", sales: 250 },
  { day: "Thursday", sales: 580 },
  { day: "Friday", sales: 370 },
  { day: "Saturday", sales: 420 },
  { day: "Sunday", sales: 300 },
] as const;

export const STATISTICS_INCOME_CHART_DATA = [
  { date: "2024-06-24", income: 190 },
  { date: "2024-06-25", income: 285 },
  { date: "2024-06-26", income: 420 },
  { date: "2024-06-27", income: 280 },
  { date: "2024-06-28", income: 250 },
  { date: "2024-06-29", income: 500 },
  { date: "2024-06-30", income: 550 },
  { date: "2024-06-31", income: 300 },
] as const;

export const STATISTICS_EXPENSE_CHART_DATA = [
  { date: "2024-06-14", expense: 290 },
  { date: "2024-06-15", expense: 360 },
  { date: "2024-06-16", expense: 360 },
  { date: "2024-06-17", expense: 360 },
  { date: "2024-06-18", expense: 400 },
  { date: "2024-06-19", expense: 550 },
  { date: "2024-06-20", expense: 590 },
  { date: "2024-06-21", expense: 500 },
  { date: "2024-06-22", expense: 450 },
  { date: "2024-06-23", expense: 460 },
  { date: "2024-06-24", expense: 400 },
  { date: "2024-06-25", expense: 350 },
  { date: "2024-06-26", expense: 320 },
  { date: "2024-06-27", expense: 300 },
] as const;

export const STATISTICS_LEADS_CHART_DATA = [
  { month: "january", sales: 340, fill: "var(--color-january)" },
  { month: "february", sales: 200, fill: "var(--color-february)" },
  { month: "march", sales: 200, fill: "var(--color-march)" },
] as const;

export const STATISTICS_PROFILE_TRAFFIC_CHART_DATA = [
  { index: "01", traffic: 150 },
  { index: "02", traffic: 250 },
  { index: "03", traffic: 190 },
  { index: "04", traffic: 290 },
  { index: "05", traffic: 220 },
  { index: "06", traffic: 350 },
  { index: "07", traffic: 250 },
] as const;

export const CHART_SALES_METRICS_PIE_DATA = [
  { month: "january", sales: 340, fill: "var(--color-january)" },
  { month: "february", sales: 200, fill: "var(--color-february)" },
  { month: "march", sales: 200, fill: "var(--color-march)" },
] as const;

export const CHART_TOTAL_REVENUE_BAR_DATA = [
  { name: "January", uv: -13, pv: 21, amt: 2210 },
  { name: "February", uv: -16, pv: 10, amt: 2290 },
  { name: "March", uv: -14, pv: 13, amt: 2210 },
  { name: "April", uv: -10, pv: 12, amt: 2500 },
  { name: "May", uv: -17, pv: 20, amt: 2100 },
  { name: "June", uv: -13, pv: 12, amt: 2100 },
  { name: "July", uv: -12, pv: 15, amt: 2100 },
] as const;

export const CHART_TOTAL_REVENUE_GROWTH_DATA = [
  { date: "2023-11-30", revenue: 20, fill: "var(--primary)" },
  { date: "2023-12-12", revenue: 20, fill: "var(--primary)" },
  { date: "2023-11-20", revenue: 20, fill: "var(--primary)" },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 90%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 80%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 70%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 60%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 50%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 40%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 30%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 20%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 10%, var(--background))",
  },
  {
    date: "2023-12-12",
    revenue: 20,
    fill: "color-mix(in oklab, var(--primary) 5%, var(--background))",
  },
] as const;
