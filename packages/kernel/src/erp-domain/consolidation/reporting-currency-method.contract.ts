export const REPORTING_CURRENCY_METHODS = [
  "closing",
  "average",
  "historical",
] as const;

export type ReportingCurrencyMethod =
  (typeof REPORTING_CURRENCY_METHODS)[number];

export function isReportingCurrencyMethod(
  value: string
): value is ReportingCurrencyMethod {
  return (REPORTING_CURRENCY_METHODS as readonly string[]).includes(value);
}
