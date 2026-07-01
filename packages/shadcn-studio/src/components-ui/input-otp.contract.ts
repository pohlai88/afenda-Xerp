export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const INPUT_OTP_PRIMITIVE_ID = "shadcn-studio.ui.input-otp" as const;
export type InputOtpPrimitiveId = typeof INPUT_OTP_PRIMITIVE_ID;

export const INPUT_OTP_SLOTS = {
  root: "input-otp",
  group: "input-otp-group",
  slot: "input-otp-slot",
  separator: "input-otp-separator",
} as const;

export type InputOtpSlotMap = typeof INPUT_OTP_SLOTS;
export type InputOtpSlot = InputOtpSlotMap[keyof InputOtpSlotMap];

export const inputOtpRootClassName = "disabled:cursor-not-allowed" as const;

export const inputOtpContainerClassName =
  "cn-input-otp flex items-center has-disabled:opacity-50" as const;

export const inputOtpGroupClassName =
  "flex items-center rounded-md has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40" as const;

export const inputOtpSlotClassName =
  "relative flex size-9 items-center justify-center border-input border-y border-r text-sm shadow-xs outline-none transition-all first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40" as const;

export const inputOtpCaretWrapperClassName =
  "pointer-events-none absolute inset-0 flex items-center justify-center" as const;

export const inputOtpCaretClassName =
  "h-4 w-px animate-caret-blink bg-foreground duration-1000" as const;

export const inputOtpSeparatorClassName =
  "flex items-center [&_svg:not([class*='size-'])]:size-4" as const;

export function inputOtpPrimitiveMetadata() {
  return {
    id: INPUT_OTP_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: INPUT_OTP_SLOTS,
  } as const;
}
