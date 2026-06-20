"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "#/lib/utils";
import { Button } from "#/components/button";
import type { GovernedButtonProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const CALENDAR_RECIPE_NAME = "surface" as const;

function calendarClass(
  slotKey: string,
  className?: string,
  extra?: string
) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Calendar",
    recipeName: CALENDAR_RECIPE_NAME,
    slotKey,
    className,
  });

  return cn(governed.className, extra);
}

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  readonly buttonVariant?: GovernedButtonProps["emphasis"];
};

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      classNames,
      showOutsideDays = true,
      captionLayout = "label",
      buttonVariant = "ghost",
      locale,
      formatters,
      components,
      ...props
    },
    ref
  ) => {
    const defaultClassNames = getDefaultClassNames();

    const navButtonExtra = calendarClass("nav-button");

    const renderNavButton = (
      buttonProps: React.ComponentProps<"button">
    ) => (
      <Button
        intent="quiet"
        emphasis={buttonVariant ?? "ghost"}
        size="md"
        presentation="icon"
        {...buttonProps}
        className={cn(
          navButtonExtra,
          typeof buttonProps.className === "string" ? buttonProps.className : undefined
        )}
      />
    );

    return (
      <div ref={ref}>
        <DayPicker
          showOutsideDays={showOutsideDays}
        className={calendarClass(
          "root",
          className,
          cn(
            calendarClass("root-rtl-previous"),
            calendarClass("root-rtl-next")
          )
        )}
        captionLayout={captionLayout}
        locale={locale}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString(locale?.code, { month: "short" }),
          ...formatters,
        }}
        classNames={{
          root: cn(calendarClass("picker-root"), defaultClassNames.root),
          months: cn(calendarClass("months"), defaultClassNames.months),
          month: cn(calendarClass("month"), defaultClassNames.month),
          nav: cn(calendarClass("nav"), defaultClassNames.nav),
          button_previous: cn(defaultClassNames.button_previous),
          button_next: cn(defaultClassNames.button_next),
          month_caption: cn(
            calendarClass("month_caption"),
            defaultClassNames.month_caption
          ),
          dropdowns: cn(calendarClass("dropdowns"), defaultClassNames.dropdowns),
          dropdown_root: cn(
            calendarClass("dropdown_root"),
            defaultClassNames.dropdown_root
          ),
          dropdown: cn(calendarClass("dropdown"), defaultClassNames.dropdown),
          caption_label: cn(
            captionLayout === "label"
              ? calendarClass("caption_label-default")
              : calendarClass("caption_label-dropdown"),
            defaultClassNames.caption_label
          ),
          month_grid: cn(calendarClass("month_grid"), defaultClassNames.month_grid),
          weekdays: cn(calendarClass("weekdays"), defaultClassNames.weekdays),
          weekday: cn(calendarClass("weekday"), defaultClassNames.weekday),
          week: cn(calendarClass("week"), defaultClassNames.week),
          week_number_header: cn(
            calendarClass("week_number_header"),
            defaultClassNames.week_number_header
          ),
          week_number: cn(calendarClass("week_number"), defaultClassNames.week_number),
          day: cn(
            calendarClass("day"),
            props.showWeekNumber
              ? calendarClass("day-with-week-number")
              : calendarClass("day-without-week-number"),
            defaultClassNames.day
          ),
          range_start: cn(calendarClass("range_start"), defaultClassNames.range_start),
          range_middle: cn(
            calendarClass("range_middle"),
            defaultClassNames.range_middle
          ),
          range_end: cn(calendarClass("range_end"), defaultClassNames.range_end),
          today: cn(calendarClass("today"), defaultClassNames.today),
          outside: cn(calendarClass("outside"), defaultClassNames.outside),
          disabled: cn(calendarClass("disabled"), defaultClassNames.disabled),
          hidden: cn(calendarClass("hidden"), defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: ({ className: rootClassName, rootRef, ...rootProps }) => {
            const governed = resolvePrimitiveGovernance({
              componentName: "Calendar",
              recipeName: CALENDAR_RECIPE_NAME,
              slot: "body",
              className: rootClassName,
            });

            return (
              <div
                {...applyGovernedPresentation({ ...rootProps, ref: rootRef }, governed)}
              />
            );
          },
          Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
            const icon = calendarClass("chevron-icon", chevronClassName);

            if (orientation === "left") {
              return <ChevronLeftIcon className={icon} {...chevronProps} />;
            }

            if (orientation === "right") {
              return <ChevronRightIcon className={icon} {...chevronProps} />;
            }

            return <ChevronDownIcon className={icon} {...chevronProps} />;
          },
          DayButton: (dayButtonProps) => (
            <CalendarDayButton
              {...dayButtonProps}
              {...(locale !== undefined ? { locale } : {})}
            />
          ),
          PreviousMonthButton: (buttonProps) => renderNavButton(buttonProps),
          NextMonthButton: (buttonProps) => renderNavButton(buttonProps),
          WeekNumber: ({ children, ...weekProps }) => {
            const inner = calendarClass("week-number-inner");

            return (
              <td {...weekProps}>
                <div className={inner}>{children}</div>
              </td>
            );
          },
          ...components,
        }}
        {...props}
      />
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

type CalendarDayButtonProps = React.ComponentProps<typeof DayButton> & {
  readonly locale?: Partial<Locale>;
};

const CalendarDayButton = React.forwardRef<HTMLButtonElement, CalendarDayButtonProps>(
  ({ className, day, modifiers, locale, ...props }, ref) => {
    const defaultClassNames = getDefaultClassNames();

    React.useEffect(() => {
      if (modifiers["focused"]) {
        if (ref && typeof ref !== "function" && ref.current) {
          ref.current.focus();
        }
      }
    }, [modifiers, ref]);

    const governed = resolvePrimitiveGovernance({
      componentName: "Calendar",
      recipeName: CALENDAR_RECIPE_NAME,
      slotKey: "day-button",
      className: cn(className, defaultClassNames.day),
    });

    return (
      <Button
        ref={ref}
        intent="quiet"
        emphasis="ghost"
        size="md"
        presentation="icon"
        {...applyGovernedPresentation(props, governed, {
          "data-day": day.date.toLocaleDateString(locale?.code),
          "data-selected-single":
            modifiers["selected"] &&
            !modifiers["range_start"] &&
            !modifiers["range_end"] &&
            !modifiers["range_middle"],
          "data-range-start": modifiers["range_start"],
          "data-range-end": modifiers["range_end"],
          "data-range-middle": modifiers["range_middle"],
        })}
      />
    );
  }
);

CalendarDayButton.displayName = "CalendarDayButton";

export { Calendar, CalendarDayButton };
