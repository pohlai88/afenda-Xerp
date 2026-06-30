/** Vendor boundary (Gold v1.2.0): react-day-picker — adapter owns styling; do not fork vendor internals. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CALENDAR_PRIMITIVE_ID = "shadcn-studio.ui.calendar" as const;
export type CalendarPrimitiveId = typeof CALENDAR_PRIMITIVE_ID;

export const CALENDAR_SLOTS = {
  root: "calendar",
  weekNumber: "calendar-week-number",
} as const;

export type CalendarSlotMap = typeof CALENDAR_SLOTS;
export type CalendarSlot = CalendarSlotMap[keyof CalendarSlotMap];

export const calendarRootClassName =
  "group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)]" as const;

export const calendarRtlNextClassName =
  "rtl:**:[.rdp-button\\_next>svg]:rotate-180" as const;

export const calendarRtlPreviousClassName =
  "rtl:**:[.rdp-button\\_previous>svg]:rotate-180" as const;

export const calendarDayPickerRootClassName = "w-fit" as const;

export const calendarMonthsClassName =
  "relative flex flex-col gap-4 md:flex-row" as const;

export const calendarMonthClassName = "flex w-full flex-col gap-4" as const;

export const calendarNavClassName =
  "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1" as const;

export const calendarButtonNavClassName =
  "size-(--cell-size) select-none p-0 aria-disabled:opacity-50" as const;

export const calendarMonthCaptionClassName =
  "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)" as const;

export const calendarDropdownsClassName =
  "flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm" as const;

export const calendarDropdownRootClassName =
  "relative rounded-(--cell-radius)" as const;

export const calendarDropdownClassName =
  "absolute inset-0 bg-popover opacity-0" as const;

export const calendarCaptionLabelClassName = "select-none font-medium" as const;

export const calendarCaptionLabelTextClassName = "text-sm" as const;

export const calendarCaptionLabelDropdownClassName =
  "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground" as const;

export const calendarMonthGridClassName = "w-full border-collapse" as const;

export const calendarWeekdaysClassName = "flex" as const;

export const calendarWeekdayClassName =
  "flex-1 select-none rounded-(--cell-radius) font-normal text-[0.8rem] text-muted-foreground" as const;

export const calendarWeekClassName = "mt-2 flex w-full" as const;

export const calendarWeekNumberHeaderClassName =
  "w-(--cell-size) select-none" as const;

export const calendarWeekNumberClassName =
  "select-none text-[0.8rem] text-muted-foreground" as const;

export const calendarDayClassName =
  "group/day relative aspect-square h-full w-full select-none rounded-(--cell-radius) p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)" as const;

export const calendarDayWithWeekNumberClassName =
  "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)" as const;

export const calendarDayWithoutWeekNumberClassName =
  "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)" as const;

export const calendarRangeStartClassName =
  "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted" as const;

export const calendarRangeMiddleClassName = "rounded-none" as const;

export const calendarRangeEndClassName =
  "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted" as const;

export const calendarTodayClassName =
  "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none" as const;

export const calendarOutsideClassName =
  "text-muted-foreground aria-selected:text-muted-foreground" as const;

export const calendarDisabledClassName =
  "text-muted-foreground opacity-50" as const;

export const calendarHiddenClassName = "invisible" as const;

export const calendarDayButtonClassName =
  "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none data-[range-end=true]:rounded-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-end=true]:bg-primary data-[range-middle=true]:bg-muted data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70" as const;

export const calendarChevronClassName = "size-4" as const;

export const calendarWeekNumberCellClassName =
  "flex size-(--cell-size) items-center justify-center text-center" as const;

export function calendarPrimitiveMetadata() {
  return {
    id: CALENDAR_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CALENDAR_SLOTS,
  } as const;
}
