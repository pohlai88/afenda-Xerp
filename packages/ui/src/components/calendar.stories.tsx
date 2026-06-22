import type { Meta, StoryObj } from "@storybook/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { type ComponentProps, type ReactNode, useState } from "react";
import type { DateRange } from "react-day-picker";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Label } from "./label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

// ─── Helpers ───────────────────────────────────────────────────────────────

const STORY_MONTH = new Date(2026, 5, 1);

function CalendarFrame({
  children,
  width = "sm",
}: {
  children: ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <StoryFrame width={width}>
      <StoryStack className="rounded-lg border border-border" padding="sm">
        {children}
      </StoryStack>
    </StoryFrame>
  );
}

function FieldLabel({
  htmlFor,
  label,
  hint,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
}) {
  return (
    <StoryStack gap="xs">
      <Label htmlFor={htmlFor}>{label}</Label>
      {hint ? (
        <span className="text-muted-foreground text-xs">{hint}</span>
      ) : null}
    </StoryStack>
  );
}

function SingleDatePicker({
  defaultMonth = STORY_MONTH,
  disabled,
  captionLayout,
  showOutsideDays,
}: {
  defaultMonth?: Date;
  disabled?: ComponentProps<typeof Calendar>["disabled"];
  captionLayout?: ComponentProps<typeof Calendar>["captionLayout"];
  showOutsideDays?: boolean;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 21));

  return (
    <CalendarFrame>
      <Calendar
        defaultMonth={defaultMonth}
        mode="single"
        onSelect={setDate}
        selected={date}
        {...(captionLayout === undefined ? {} : { captionLayout })}
        {...(disabled === undefined ? {} : { disabled })}
        {...(showOutsideDays === undefined ? {} : { showOutsideDays })}
      />
    </CalendarFrame>
  );
}

function RangeDatePicker({
  numberOfMonths = 1,
  defaultMonth = STORY_MONTH,
}: {
  numberOfMonths?: number;
  defaultMonth?: Date;
}) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 5, 10),
    to: new Date(2026, 5, 18),
  });

  return (
    <CalendarFrame width={numberOfMonths > 1 ? "lg" : "md"}>
      <Calendar
        defaultMonth={defaultMonth}
        mode="range"
        numberOfMonths={numberOfMonths}
        onSelect={setRange}
        selected={range}
      />
    </CalendarFrame>
  );
}

function CalendarPopoverPicker({
  label,
  placeholder = "Pick a date…",
}: {
  label: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  return (
    <StoryFrame width="sm">
      <StoryStack gap="sm">
        <FieldLabel htmlFor="calendar-popover-trigger" label={label} />
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button
              emphasis="outline"
              id="calendar-popover-trigger"
              intent="secondary"
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>{label}</PopoverTitle>
            </PopoverHeader>
            <Calendar
              mode="single"
              onSelect={(selected) => {
                setDate(selected);
                setOpen(false);
              }}
              selected={date}
            />
          </PopoverContent>
        </Popover>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Calendar ──────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed `react-day-picker` calendar for ERP date selection, reporting periods, leave requests, and scheduling. Supports `mode` (`single` · `range` · `multiple`), `captionLayout` dropdowns, disabled dates, week numbers, and multi-month range views.",
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic modes ───────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <SingleDatePicker />,
};

export const WithDropdown: Story = {
  name: "Calendar — Month/Year Dropdown",
  render: () => <SingleDatePicker captionLayout="dropdown" />,
};

export const RangeSelection: Story = {
  name: "Calendar — Date Range",
  render: () => <RangeDatePicker />,
};

export const TwoMonthRange: Story = {
  name: "Calendar — Two-Month Range",
  render: () => <RangeDatePicker numberOfMonths={2} />,
};

export const MultipleSelection: Story = {
  name: "Calendar — Multiple Dates",
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([
      new Date(2026, 5, 12),
      new Date(2026, 5, 16),
      new Date(2026, 5, 19),
    ]);

    return (
      <CalendarFrame>
        <Calendar mode="multiple" onSelect={setDates} selected={dates} />
      </CalendarFrame>
    );
  },
};

export const WeekNumbers: Story = {
  name: "Calendar — With Week Numbers",
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 21));

    return (
      <CalendarFrame>
        <Calendar
          mode="single"
          onSelect={setDate}
          selected={date}
          showWeekNumber
        />
      </CalendarFrame>
    );
  },
};

export const DisabledWeekends: Story = {
  name: "Calendar — Weekends Disabled",
  render: () => (
    <SingleDatePicker
      disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  ),
};

export const DisabledPastDates: Story = {
  name: "Calendar — Past Dates Disabled",
  render: () => (
    <SingleDatePicker disabled={{ before: new Date(2026, 5, 21) }} />
  ),
};

export const HideOutsideDays: Story = {
  name: "Calendar — Hide Outside Days",
  render: () => <SingleDatePicker showOutsideDays={false} />,
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const InvoiceDueDate: Story = {
  name: "ERP — Invoice Due Date",
  parameters: { layout: "padded" },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 6, 15));

    return (
      <StoryFrame width="sm">
        <StoryStack gap="sm">
          <FieldLabel
            hint="Payment terms: Net 30 from invoice date"
            htmlFor="inv-due-date"
            label="Due Date *"
          />
          <CalendarFrame>
            <Calendar
              defaultMonth={new Date(2026, 6, 1)}
              mode="single"
              onSelect={setDate}
              selected={date}
            />
          </CalendarFrame>
          {date ? (
            <StoryRow align="center" gap="sm">
              <Badge emphasis="soft" size="sm" tone="info">
                {format(date, "PPP")}
              </Badge>
              <span className="text-muted-foreground text-xs">
                INV-2026-0142
              </span>
            </StoryRow>
          ) : null}
        </StoryStack>
      </StoryFrame>
    );
  },
};

export const LeaveRequestRange: Story = {
  name: "ERP — Leave Request Range",
  parameters: { layout: "padded" },
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2026, 6, 7),
      to: new Date(2026, 6, 11),
    });

    return (
      <StoryFrame width="md">
        <StoryStack gap="sm">
          <FieldLabel
            hint="Select start and end dates for annual leave"
            htmlFor="leave-range"
            label="Leave Period"
          />
          <CalendarFrame width="md">
            <Calendar mode="range" onSelect={setRange} selected={range} />
          </CalendarFrame>
          {range?.from && range.to ? (
            <span className="text-muted-foreground text-sm">
              {format(range.from, "MMM d")} – {format(range.to, "MMM d, yyyy")}{" "}
              · 5 business days
            </span>
          ) : null}
        </StoryStack>
      </StoryFrame>
    );
  },
};

export const ExpenseReportPeriod: Story = {
  name: "ERP — Expense Report Period",
  parameters: { layout: "padded" },
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2026, 5, 1),
      to: new Date(2026, 5, 30),
    });

    return (
      <StoryFrame width="lg">
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between" wrap>
            <FieldLabel
              hint="Filter reimbursable expenses by submission window"
              htmlFor="expense-period"
              label="Report Period"
            />
            <Badge emphasis="soft" size="sm" tone="neutral">
              Q2 2026
            </Badge>
          </StoryRow>
          <CalendarFrame width="lg">
            <Calendar
              captionLayout="dropdown"
              mode="range"
              numberOfMonths={2}
              onSelect={setRange}
              selected={range}
            />
          </CalendarFrame>
        </StoryStack>
      </StoryFrame>
    );
  },
};

export const PurchaseOrderDelivery: Story = {
  name: "ERP — PO Delivery Date",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      <FieldLabel
        hint="PO-8821 · Acme Supplies · earliest available slot"
        htmlFor="po-delivery"
        label="Requested Delivery Date"
      />
      <SingleDatePicker
        defaultMonth={new Date(2026, 5, 1)}
        disabled={{ before: new Date(2026, 5, 22) }}
      />
    </StoryStack>
  ),
};

export const PayrollRunDate: Story = {
  name: "ERP — Payroll Run Date",
  parameters: { layout: "padded" },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 30));

    return (
      <StoryFrame width="sm">
        <StoryStack gap="sm">
          <FieldLabel
            hint="Pay period ending Jun 30, 2026 · 248 employees"
            htmlFor="payroll-run"
            label="Payroll Run Date"
          />
          <CalendarFrame>
            <Calendar
              captionLayout="dropdown"
              disabled={(day) => day.getDay() === 0 || day.getDay() === 6}
              mode="single"
              onSelect={setDate}
              selected={date}
            />
          </CalendarFrame>
        </StoryStack>
      </StoryFrame>
    );
  },
};

export const AccountingPeriodFilter: Story = {
  name: "ERP — Accounting Period Filter",
  parameters: { layout: "padded" },
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2026, 3, 1),
      to: new Date(2026, 3, 30),
    });

    return (
      <StoryFrame width="md">
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between" wrap>
            <span className="font-medium text-sm">
              General Ledger · Period Filter
            </span>
            <Badge emphasis="soft" size="sm" tone="success">
              April 2026 Open
            </Badge>
          </StoryRow>
          <CalendarFrame width="md">
            <Calendar
              defaultMonth={new Date(2026, 3, 1)}
              mode="range"
              onSelect={setRange}
              selected={range}
            />
          </CalendarFrame>
          <Button emphasis="solid" intent="primary" size="sm">
            Apply Period Filter
          </Button>
        </StoryStack>
      </StoryFrame>
    );
  },
};

export const EmployeeStartDate: Story = {
  name: "ERP — Employee Start Date",
  parameters: { layout: "padded" },
  render: () => (
    <CalendarPopoverPicker
      label="Employment Start Date"
      placeholder="Select start date…"
    />
  ),
};

export const ProjectMilestoneDate: Story = {
  name: "ERP — Project Milestone Date",
  parameters: { layout: "padded" },
  render: () => (
    <CalendarPopoverPicker
      label="Go-Live Date"
      placeholder="Schedule milestone…"
    />
  ),
};

export const AuditSchedulePicker: Story = {
  name: "ERP — Audit Schedule Picker",
  parameters: { layout: "padded" },
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([
      new Date(2026, 5, 24),
      new Date(2026, 5, 25),
      new Date(2026, 5, 26),
    ]);

    return (
      <StoryFrame width="sm">
        <StoryStack gap="sm">
          <FieldLabel
            hint="Select on-site audit days for SOX compliance review"
            htmlFor="audit-days"
            label="Audit Visit Days"
          />
          <CalendarFrame>
            <Calendar mode="multiple" onSelect={setDates} selected={dates} />
          </CalendarFrame>
          <span className="text-muted-foreground text-xs">
            {dates?.length ?? 0} day(s) selected
          </span>
        </StoryStack>
      </StoryFrame>
    );
  },
};

export const FiscalCloseCalendar: Story = {
  name: "ERP — Fiscal Close Window",
  parameters: { layout: "padded" },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 30));

    return (
      <StoryFrame width="sm">
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between" wrap>
            <FieldLabel
              hint="Month-end close for June 2026"
              htmlFor="fiscal-close"
              label="Close Date"
            />
            <Badge emphasis="soft" size="sm" tone="warning">
              3 tasks pending
            </Badge>
          </StoryRow>
          <CalendarFrame>
            <Calendar
              captionLayout="dropdown"
              defaultMonth={new Date(2026, 5, 1)}
              disabled={{ after: new Date(2026, 5, 30) }}
              mode="single"
              onSelect={setDate}
              selected={date}
            />
          </CalendarFrame>
        </StoryStack>
      </StoryFrame>
    );
  },
};
