import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArchiveIcon,
  BarChart3Icon,
  BoldIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  ExternalLinkIcon,
  EyeIcon,
  FilterIcon,
  ForwardIcon,
  ItalicIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  ListIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  ReplyIcon,
  SaveIcon,
  SendIcon,
  SettingsIcon,
  Trash2Icon,
  UnderlineIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ─── Helpers ───────────────────────────────────────────────────────────────

function SegmentedFilter({
  options,
  defaultValue,
}: {
  readonly options: readonly string[];
  readonly defaultValue: string;
}) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <ButtonGroup>
      {options.map((option) => (
        <Button
          emphasis={selected === option ? "outline" : "ghost"}
          intent={selected === option ? "primary" : "secondary"}
          key={option}
          onClick={() => setSelected(option)}
          size="sm"
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}

function QuantityStepper({
  initial = 1,
  min = 1,
  max = 99,
}: {
  readonly initial?: number;
  readonly min?: number;
  readonly max?: number;
}) {
  const [qty, setQty] = useState(initial);

  return (
    <ButtonGroup>
      <Button
        aria-label="Decrease quantity"
        disabled={qty <= min}
        emphasis="outline"
        intent="secondary"
        onClick={() => setQty((current) => Math.max(min, current - 1))}
        presentation="icon"
        size="sm"
      >
        <MinusIcon />
      </Button>
      <ButtonGroupText aria-live="polite">{qty}</ButtonGroupText>
      <Button
        aria-label="Increase quantity"
        disabled={qty >= max}
        emphasis="outline"
        intent="secondary"
        onClick={() => setQty((current) => Math.min(max, current + 1))}
        presentation="icon"
        size="sm"
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}

function ZoomControl({ initial = 100 }: { readonly initial?: number }) {
  const [zoom, setZoom] = useState(initial);

  return (
    <ButtonGroup>
      <Button
        aria-label="Zoom out"
        disabled={zoom <= 50}
        emphasis="outline"
        intent="secondary"
        onClick={() => setZoom((current) => Math.max(50, current - 10))}
        presentation="icon"
        size="sm"
      >
        <ZoomOutIcon />
      </Button>
      <ButtonGroupText>{zoom}%</ButtonGroupText>
      <Button
        aria-label="Zoom in"
        disabled={zoom >= 200}
        emphasis="outline"
        intent="secondary"
        onClick={() => setZoom((current) => Math.min(200, current + 10))}
        presentation="icon"
        size="sm"
      >
        <ZoomInIcon />
      </Button>
    </ButtonGroup>
  );
}

function InteractiveViewToggle() {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <ButtonGroup aria-label="Record view mode">
      <Button
        aria-label="List view"
        aria-pressed={view === "list"}
        emphasis={view === "list" ? "outline" : "ghost"}
        intent={view === "list" ? "primary" : "secondary"}
        onClick={() => setView("list")}
        presentation="icon"
        size="sm"
      >
        <ListIcon />
      </Button>
      <Button
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        emphasis={view === "grid" ? "outline" : "ghost"}
        intent={view === "grid" ? "primary" : "secondary"}
        onClick={() => setView("grid")}
        presentation="icon"
        size="sm"
      >
        <LayoutGridIcon />
      </Button>
    </ButtonGroup>
  );
}

function InteractivePagination({
  page = 3,
  total = 12,
}: {
  readonly page?: number;
  readonly total?: number;
}) {
  const [current, setCurrent] = useState(page);

  return (
    <ButtonGroup>
      <Button
        aria-label="Previous page"
        disabled={current <= 1}
        emphasis="outline"
        intent="secondary"
        onClick={() => setCurrent((p) => Math.max(1, p - 1))}
        presentation="icon"
        size="sm"
      >
        <ChevronLeftIcon />
      </Button>
      <ButtonGroupText aria-live="polite">
        Page {current} of {total}
      </ButtonGroupText>
      <Button
        aria-label="Next page"
        disabled={current >= total}
        emphasis="outline"
        intent="secondary"
        onClick={() => setCurrent((p) => Math.min(total, p + 1))}
        presentation="icon"
        size="sm"
      >
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
}

// ─── ButtonGroup ───────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed button group for ERP toolbars, segmented controls, joined action strips, and split buttons. Orientation-aware with `ButtonGroupSeparator` and `ButtonGroupText` addons.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: {
    orientation: "horizontal",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button emphasis="outline" intent="secondary" size="sm">
        Day
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        Week
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        Month
      </Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  name: "ButtonGroup — With Separator",
  render: (args) => (
    <ButtonGroup {...args}>
      <Button emphasis="outline" intent="secondary" size="sm">
        <PlusIcon />
        New
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="outline" intent="secondary" size="sm">
        <FilterIcon />
        Filter
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        <DownloadIcon />
        Export
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="outline" intent="secondary" size="sm">
        <PrinterIcon />
        Print
      </Button>
    </ButtonGroup>
  ),
};

export const IconGroup: Story = {
  name: "ButtonGroup — Icon Buttons",
  render: (args) => (
    <ButtonGroup {...args}>
      <Button
        aria-label="List view"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <ListIcon />
      </Button>
      <Button
        aria-label="Grid view"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <LayoutGridIcon />
      </Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  name: "ButtonGroup — Vertical",
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button emphasis="outline" intent="secondary" size="sm">
        Top
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        Middle
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        Bottom
      </Button>
    </ButtonGroup>
  ),
};

export const ButtonGroupWithText: Story = {
  name: "ButtonGroup — With Text Addon",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Sort:</ButtonGroupText>
      <Button emphasis="ghost" intent="secondary" size="sm">
        Name ↑
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        Date
      </Button>
      <Button emphasis="outline" intent="primary" size="sm">
        Amount
      </Button>
    </ButtonGroup>
  ),
};

export const AllOrientations: Story = {
  name: "Matrix — Orientations",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="start" gap="lg" wrap>
      <StoryStack gap="xs">
        <span className="font-medium text-muted-foreground text-xs">
          Horizontal
        </span>
        <ButtonGroup orientation="horizontal">
          <Button emphasis="outline" intent="secondary" size="sm">
            Option A
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            Option B
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            Option C
          </Button>
        </ButtonGroup>
      </StoryStack>
      <StoryStack gap="xs">
        <span className="font-medium text-muted-foreground text-xs">
          Vertical
        </span>
        <ButtonGroup orientation="vertical">
          <Button emphasis="outline" intent="secondary" size="sm">
            Option A
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            Option B
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            Option C
          </Button>
        </ButtonGroup>
      </StoryStack>
    </StoryRow>
  ),
};

// ─── Composed variants (studio-inspired) ───────────────────────────────────

export const ToolbarWithTooltips: Story = {
  name: "ButtonGroup — Toolbar With Tooltips",
  parameters: { layout: "padded" },
  render: () => (
    <TooltipProvider>
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Bold"
              emphasis="outline"
              intent="secondary"
              presentation="icon"
              size="sm"
            >
              <BoldIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Italic"
              emphasis="outline"
              intent="secondary"
              presentation="icon"
              size="sm"
            >
              <ItalicIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Underline"
              emphasis="outline"
              intent="secondary"
              presentation="icon"
              size="sm"
            >
              <UnderlineIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </TooltipProvider>
  ),
};

export const QuantityControl: Story = {
  name: "ButtonGroup — Quantity Stepper",
  parameters: { layout: "padded" },
  render: () => <QuantityStepper />,
};

export const ZoomControlGroup: Story = {
  name: "ButtonGroup — Zoom Control",
  parameters: { layout: "padded" },
  render: () => <ZoomControl />,
};

export const DownloadWithCount: Story = {
  name: "ButtonGroup — Action With Count",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="outline" intent="secondary" size="sm">
        <DownloadIcon />
        Export
      </Button>
      <ButtonGroupText>248 rows</ButtonGroupText>
    </ButtonGroup>
  ),
};

export const RecordRowActions: Story = {
  name: "ButtonGroup — Row Actions",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button
        aria-label="View record"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <EyeIcon />
      </Button>
      <Button
        aria-label="Edit record"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <EditIcon />
      </Button>
      <Button
        aria-label="Duplicate record"
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <CopyIcon />
      </Button>
      <ButtonGroupSeparator />
      <Button
        aria-label="Delete record"
        emphasis="ghost"
        intent="destructive"
        presentation="icon"
        size="sm"
      >
        <Trash2Icon />
      </Button>
    </ButtonGroup>
  ),
};

export const SplitButtonSave: Story = {
  name: "ButtonGroup — Split Button",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="solid" intent="primary" size="sm">
        <SaveIcon />
        Save
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="More save options"
            emphasis="solid"
            intent="primary"
            presentation="icon"
            size="sm"
          >
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <SaveIcon />
            Save &amp; Close
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SaveIcon />
            Save &amp; New
          </DropdownMenuItem>
          <DropdownMenuItem>Save as Draft</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
};

export const PreviewWithLink: Story = {
  name: "ButtonGroup — Preview With Link",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="solid" intent="primary" size="sm">
        Preview Invoice
      </Button>
      <Button
        aria-label="Open in new tab"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <ExternalLinkIcon />
      </Button>
    </ButtonGroup>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const ViewToggle: Story = {
  name: "ERP — View Toggle",
  parameters: { layout: "padded" },
  render: () => <InteractiveViewToggle />,
};

export const DateRangeGroup: Story = {
  name: "ERP — Date Range Quick Select",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="ghost" intent="secondary" size="sm">
        Today
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        7D
      </Button>
      <Button emphasis="outline" intent="primary" size="sm">
        30D
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        90D
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        YTD
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="ghost" intent="secondary" size="sm">
        Custom
      </Button>
    </ButtonGroup>
  ),
};

export const SegmentedStatusFilter: Story = {
  name: "ERP — Segmented Status Filter",
  parameters: { layout: "padded" },
  render: () => (
    <SegmentedFilter
      defaultValue="Active"
      options={["All", "Active", "Pending", "Archived"]}
    />
  ),
};

export const ModuleNavigation: Story = {
  name: "ERP — Module Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="outline" intent="primary" size="sm">
        <LayoutDashboardIcon />
        Dashboard
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        <BarChart3Icon />
        Reports
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        <SettingsIcon />
        Settings
      </Button>
    </ButtonGroup>
  ),
};

export const FiscalPeriodSelector: Story = {
  name: "ERP — Fiscal Period Selector",
  parameters: { layout: "padded" },
  render: () => (
    <SegmentedFilter defaultValue="Q2" options={["Q1", "Q2", "Q3", "Q4"]} />
  ),
};

export const CurrencySelector: Story = {
  name: "ERP — Currency Selector",
  parameters: { layout: "padded" },
  render: () => (
    <SegmentedFilter
      defaultValue="USD"
      options={["USD", "EUR", "GBP", "AUD"]}
    />
  ),
};

export const ExportFormatGroup: Story = {
  name: "ERP — Export Format",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="outline" intent="secondary" size="sm">
        <DownloadIcon />
        PDF
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        CSV
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        Excel
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="ghost" intent="secondary" size="sm">
        <PrinterIcon />
        Print
      </Button>
    </ButtonGroup>
  ),
};

export const ApprovalActions: Story = {
  name: "ERP — Approval Actions",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="solid" intent="primary" size="sm">
        <CheckIcon />
        Approve
      </Button>
      <Button emphasis="outline" intent="destructive" size="sm">
        <XIcon />
        Reject
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="ghost" intent="secondary" size="sm">
        Request Info
      </Button>
    </ButtonGroup>
  ),
};

export const BulkActionsToolbar: Story = {
  name: "ERP — Bulk Actions Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="md" wrap>
        <span className="font-medium text-sm">3 selected</span>
        <ButtonGroup>
          <Button emphasis="outline" intent="secondary" size="sm">
            <CheckIcon />
            Approve
          </Button>
          <Button emphasis="outline" intent="secondary" size="sm">
            <DownloadIcon />
            Export
          </Button>
          <Button emphasis="outline" intent="destructive" size="sm">
            <Trash2Icon />
            Delete
          </Button>
        </ButtonGroup>
      </StoryRow>
    </StoryFrame>
  ),
};

export const TableToolbar: Story = {
  name: "ERP — Data Table Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm" wrap>
      <ButtonGroup>
        <Button emphasis="solid" intent="primary" size="sm">
          <PlusIcon />
          New Record
        </Button>
        <ButtonGroupSeparator />
        <Button emphasis="outline" intent="secondary" size="sm">
          <FilterIcon />
          Filter
        </Button>
        <Button emphasis="outline" intent="secondary" size="sm">
          <DownloadIcon />
          Export
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          aria-label="List view"
          emphasis="ghost"
          intent="secondary"
          presentation="icon"
          size="sm"
        >
          <ListIcon />
        </Button>
        <Button
          aria-label="Grid view"
          emphasis="outline"
          intent="secondary"
          presentation="icon"
          size="sm"
        >
          <LayoutGridIcon />
        </Button>
      </ButtonGroup>
    </StoryRow>
  ),
};

export const TableDensityControl: Story = {
  name: "ERP — Table Density",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="xs">
      <span className="text-muted-foreground text-xs">Row density</span>
      <SegmentedFilter
        defaultValue="Standard"
        options={["Compact", "Standard", "Comfortable"]}
      />
    </StoryStack>
  ),
};

export const PaginationControls: Story = {
  name: "ERP — Pagination Controls",
  parameters: { layout: "padded" },
  render: () => <InteractivePagination />,
};

export const POLineQuantity: Story = {
  name: "ERP — PO Line Quantity",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow align="center" justify="between">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Office paper — A4 ream</span>
          <span className="font-mono text-muted-foreground text-xs">
            SKU-1042
          </span>
        </StoryStack>
        <QuantityStepper initial={4} max={50} />
      </StoryRow>
    </StoryFrame>
  ),
};

export const DocumentZoomToolbar: Story = {
  name: "ERP — Document Preview Zoom",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md">
      <ZoomControl />
      <ButtonGroup>
        <Button emphasis="outline" intent="secondary" size="sm">
          Fit width
        </Button>
        <Button emphasis="ghost" intent="secondary" size="sm">
          100%
        </Button>
      </ButtonGroup>
    </StoryRow>
  ),
};

export const TextFormattingGroup: Story = {
  name: "ERP — Text Formatting Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button
        aria-label="Bold"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <BoldIcon />
      </Button>
      <Button
        aria-label="Italic"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <ItalicIcon />
      </Button>
      <Button
        aria-label="Underline"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <UnderlineIcon />
      </Button>
      <ButtonGroupSeparator />
      <Button
        aria-label="Align left"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <AlignLeftIcon />
      </Button>
      <Button
        aria-label="Align center"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <AlignCenterIcon />
      </Button>
      <Button
        aria-label="Align right"
        emphasis="outline"
        intent="secondary"
        presentation="icon"
        size="sm"
      >
        <AlignRightIcon />
      </Button>
    </ButtonGroup>
  ),
};

export const SidebarVerticalActions: Story = {
  name: "ERP — Sidebar Vertical Actions",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button emphasis="ghost" intent="secondary" size="sm">
        <PlusIcon />
        New
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        <FilterIcon />
        Filter
      </Button>
      <Button emphasis="ghost" intent="secondary" size="sm">
        <DownloadIcon />
        Export
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="ghost" intent="secondary" size="sm">
        <SettingsIcon />
        Settings
      </Button>
    </ButtonGroup>
  ),
};

export const RecordDetailToolbar: Story = {
  name: "ERP — Record Detail Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" justify="between" wrap>
        <StoryStack gap="xs">
          <span className="font-mono text-muted-foreground text-xs">
            PO-1042
          </span>
          <span className="font-semibold">Office supplies — Q2 restock</span>
        </StoryStack>
        <StoryRow align="center" gap="sm" wrap>
          <ButtonGroup>
            <Button emphasis="solid" intent="primary" size="sm">
              <CheckIcon />
              Approve
            </Button>
            <Button emphasis="outline" intent="destructive" size="sm">
              <XIcon />
              Reject
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button emphasis="outline" intent="secondary" size="sm">
              <EditIcon />
              Edit
            </Button>
            <Button emphasis="outline" intent="secondary" size="sm">
              <CopyIcon />
              Duplicate
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="More actions"
                  emphasis="ghost"
                  intent="quiet"
                  presentation="icon"
                  size="sm"
                >
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <DownloadIcon />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PrinterIcon />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  Void PO
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </StoryRow>
      </StoryRow>
    </StoryFrame>
  ),
};

export const WorkflowStageSelector: Story = {
  name: "ERP — Workflow Stage Selector",
  parameters: { layout: "padded" },
  render: () => (
    <SegmentedFilter
      defaultValue="In Review"
      options={["Draft", "In Review", "Approved", "Posted"]}
    />
  ),
};

export const JournalEntryActions: Story = {
  name: "ERP — Journal Entry Actions",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="solid" intent="primary" size="sm">
        <SendIcon />
        Post Entry
      </Button>
      <Button emphasis="outline" intent="destructive" size="sm">
        <XIcon />
        Void
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="ghost" intent="secondary" size="sm">
        Reverse
      </Button>
    </ButtonGroup>
  ),
};

export const ReportComparisonPeriod: Story = {
  name: "ERP — Report Comparison Period",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="xs">
      <span className="text-muted-foreground text-xs">Compare to</span>
      <SegmentedFilter
        defaultValue="MoM"
        options={["MoM", "QoQ", "YoY", "Custom"]}
      />
    </StoryStack>
  ),
};

export const FormFooterActions: Story = {
  name: "ERP — Form Footer Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="sm" justify="end" wrap>
        <Button emphasis="ghost" intent="secondary" size="sm">
          <XIcon />
          Cancel
        </Button>
        <ButtonGroup>
          <Button emphasis="outline" intent="secondary" size="sm">
            Save Draft
          </Button>
          <Button emphasis="solid" intent="primary" size="sm">
            <SaveIcon />
            Save &amp; Close
          </Button>
        </ButtonGroup>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ExportSplitButton: Story = {
  name: "ERP — Export Split Button",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="outline" intent="secondary" size="sm">
        <DownloadIcon />
        Export CSV
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="More export formats"
            emphasis="outline"
            intent="secondary"
            presentation="icon"
            size="sm"
          >
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Export as PDF</DropdownMenuItem>
          <DropdownMenuItem>Export as Excel</DropdownMenuItem>
          <DropdownMenuItem>Export as JSON</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
};

export const InboxQuickActions: Story = {
  name: "ERP — Inbox Quick Actions",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button emphasis="outline" intent="secondary" size="sm">
        <ReplyIcon />
        Reply
      </Button>
      <Button emphasis="outline" intent="secondary" size="sm">
        <ForwardIcon />
        Forward
      </Button>
      <ButtonGroupSeparator />
      <Button emphasis="ghost" intent="secondary" size="sm">
        <ArchiveIcon />
        Archive
      </Button>
    </ButtonGroup>
  ),
};

export const TimesheetPeriodSelector: Story = {
  name: "ERP — Timesheet Period",
  parameters: { layout: "padded" },
  render: () => (
    <SegmentedFilter
      defaultValue="Bi-weekly"
      options={["Weekly", "Bi-weekly", "Monthly"]}
    />
  ),
};

export const KanbanCardActions: Story = {
  name: "ERP — Kanban Card Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack
        className="rounded-md border border-border"
        gap="sm"
        padding="sm"
      >
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">INV-0892 approval</span>
          <Badge emphasis="soft" size="sm" tone="warning">
            Pending
          </Badge>
        </StoryRow>
        <span className="text-muted-foreground text-xs">
          Due Friday · $4,850
        </span>
        <ButtonGroup>
          <Button
            aria-label="View"
            emphasis="ghost"
            intent="quiet"
            presentation="icon"
            size="sm"
          >
            <EyeIcon />
          </Button>
          <Button
            aria-label="Edit"
            emphasis="ghost"
            intent="quiet"
            presentation="icon"
            size="sm"
          >
            <EditIcon />
          </Button>
          <Button emphasis="solid" intent="primary" size="sm">
            <CheckIcon />
            Approve
          </Button>
        </ButtonGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const TableRowActionColumn: Story = {
  name: "ERP — Table Row Action Column",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Table size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>PO Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { id: "PO-1042", vendor: "Acme Supplies", status: "Pending" },
            { id: "PO-1041", vendor: "Global Parts", status: "Approved" },
          ].map(({ id, vendor, status }) => (
            <TableRow key={id}>
              <TableCell className="font-mono text-sm">{id}</TableCell>
              <TableCell>{vendor}</TableCell>
              <TableCell>
                <Badge
                  emphasis="soft"
                  size="sm"
                  tone={status === "Approved" ? "success" : "warning"}
                >
                  {status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <StoryRow gap="xs" justify="end">
                  <ButtonGroup>
                    <Button
                      aria-label={`View ${id}`}
                      emphasis="ghost"
                      intent="quiet"
                      presentation="icon"
                      size="sm"
                    >
                      <EyeIcon />
                    </Button>
                    <Button
                      aria-label={`Edit ${id}`}
                      emphasis="ghost"
                      intent="quiet"
                      presentation="icon"
                      size="sm"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      aria-label={`Delete ${id}`}
                      emphasis="ghost"
                      intent="destructive"
                      presentation="icon"
                      size="sm"
                    >
                      <Trash2Icon />
                    </Button>
                  </ButtonGroup>
                </StoryRow>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const LoadingButtonGroup: Story = {
  name: "ERP — Async Save (Disabled Group)",
  parameters: { layout: "padded" },
  render: () => (
    <ButtonGroup>
      <Button
        disabled
        emphasis="solid"
        intent="primary"
        size="sm"
        state="loading"
      >
        Saving…
      </Button>
      <Button disabled emphasis="outline" intent="secondary" size="sm">
        <XIcon />
        Cancel
      </Button>
    </ButtonGroup>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'ButtonGroup renders `role="group"`. Icon-only buttons require `aria-label`. Quantity and zoom controls use `aria-live` on the value display.',
      },
    },
  },
  render: () => (
    <StoryStack gap="md">
      <ButtonGroup aria-label="Record view mode">
        <Button
          aria-label="List view"
          emphasis="outline"
          intent="primary"
          presentation="icon"
          size="sm"
        >
          <ListIcon />
        </Button>
        <Button
          aria-label="Grid view"
          emphasis="ghost"
          intent="secondary"
          presentation="icon"
          size="sm"
        >
          <LayoutGridIcon />
        </Button>
      </ButtonGroup>
      <QuantityStepper />
    </StoryStack>
  ),
};
