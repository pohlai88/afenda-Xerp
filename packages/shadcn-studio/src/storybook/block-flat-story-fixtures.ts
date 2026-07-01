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
