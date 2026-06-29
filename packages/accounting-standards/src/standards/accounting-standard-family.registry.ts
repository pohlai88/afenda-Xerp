import { ACCOUNTING_STANDARD_FAMILIES } from "./accounting-standard.contract.js";

export { ACCOUNTING_STANDARD_FAMILIES };

export function isAccountingStandardFamily(
  value: string
): value is (typeof ACCOUNTING_STANDARD_FAMILIES)[number] {
  return (ACCOUNTING_STANDARD_FAMILIES as readonly string[]).includes(value);
}
