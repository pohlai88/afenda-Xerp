import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Checkbox } from "./checkbox";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// ─── Helpers ───────────────────────────────────────────────────────────────

const TEXT_LINE_WIDTHS = ["100%", "92%", "78%", "64%"] as const;

function SkeletonAvatar({ size = "2.5rem" }: { readonly size?: string }) {
  return (
    <Skeleton style={{ height: size, width: size, borderRadius: "50%" }} />
  );
}

function SkeletonLine({
  height = "0.75rem",
  width = "100%",
}: {
  readonly height?: string;
  readonly width?: string;
}) {
  return <Skeleton style={{ height, width }} />;
}

function SkeletonButton({ width = "5rem" }: { readonly width?: string }) {
  return <Skeleton style={{ height: "2rem", width }} />;
}

function SkeletonTextBlock({
  lines = 3,
  lineHeight = "0.75rem",
}: {
  readonly lines?: number;
  readonly lineHeight?: string;
}) {
  return (
    <StoryStack gap="xs">
      {Array.from({ length: lines }, (_, index) => {
        const width =
          TEXT_LINE_WIDTHS[index % TEXT_LINE_WIDTHS.length] ?? "100%";
        return <SkeletonLine height={lineHeight} key={index} width={width} />;
      })}
    </StoryStack>
  );
}

function SkeletonTableRows({
  columns,
  rows = 4,
}: {
  readonly columns: readonly string[];
  readonly rows?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
              <TableCell key={column}>
                <SkeletonLine
                  height="0.75rem"
                  width={column === columns[0] ? "70%" : "55%"}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function KpiSkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <StoryStack gap="xs">
          <SkeletonLine height="0.75rem" width="45%" />
          <SkeletonLine height="1.25rem" width="60%" />
        </StoryStack>
      </CardHeader>
      <CardContent>
        <SkeletonLine height="2rem" width="40%" />
      </CardContent>
    </Card>
  );
}

function RecordHeaderLoading() {
  return (
    <StoryRow align="center" gap="sm">
      <SkeletonAvatar />
      <StoryStack className="flex-1" gap="xs">
        <SkeletonLine height="0.875rem" width="55%" />
        <SkeletonLine height="0.75rem" width="35%" />
      </StoryStack>
      <StoryRow gap="sm">
        <SkeletonButton width="4.5rem" />
        <SkeletonButton width="4.5rem" />
      </StoryRow>
    </StoryRow>
  );
}

function ControlledRecordLoadDemo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow justify="between">
          <span className="font-medium text-sm">Invoice INV-2026-0042</span>
          <Button
            emphasis="outline"
            intent="quiet"
            onClick={() => setLoading((current) => !current)}
            size="sm"
          >
            {loading ? "Show loaded" : "Show loading"}
          </Button>
        </StoryRow>
        <div aria-busy={loading}>
          {loading ? (
            <RecordHeaderLoading />
          ) : (
            <StoryRow align="center" gap="sm">
              <SkeletonAvatar />
              <StoryStack className="flex-1" gap="xs">
                <span className="font-medium text-sm">Acme Supplies Ltd.</span>
                <span className="text-muted-foreground text-xs">
                  Due Jul 15, 2026 · $24,850.00
                </span>
              </StoryStack>
              <StoryRow gap="sm">
                <Badge emphasis="soft" tone="warning">
                  Awaiting payment
                </Badge>
                <Button emphasis="outline" intent="primary" size="sm">
                  Pay now
                </Button>
              </StoryRow>
            </StoryRow>
          )}
        </div>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed placeholder for ERP loading states: record headers, data tables, KPI cards, form panels, and master-detail layouts. Size with inline `style` (height/width/borderRadius). Wrap parent regions with `aria-busy` while skeletons are visible. Pair with `Spinner` for indeterminate actions and `Empty` for zero-data — not loading.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="sm">
      <Skeleton style={{ height: "1rem", width: "12rem" }} />
    </StoryFrame>
  ),
};

export const CircleAvatar: Story = {
  name: "Skeleton — Circle (Avatar)",
  render: () => (
    <StoryRow align="center" gap="sm">
      <SkeletonAvatar size="2rem" />
      <SkeletonAvatar />
      <SkeletonAvatar size="3rem" />
    </StoryRow>
  ),
};

export const TextLine: Story = {
  name: "Skeleton — Text Line",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <SkeletonLine height="0.875rem" width="80%" />
        <SkeletonLine height="0.75rem" width="55%" />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ButtonShape: Story = {
  name: "Skeleton — Button Shape",
  render: () => (
    <StoryRow gap="sm">
      <SkeletonButton />
      <SkeletonButton width="6.5rem" />
      <Skeleton style={{ height: "2rem", width: "2rem" }} />
    </StoryRow>
  ),
};

export const TextBlock: Story = {
  name: "Skeleton — Text Block",
  render: () => (
    <StoryFrame width="md">
      <SkeletonTextBlock lines={4} />
    </StoryFrame>
  ),
};

export const LineHeightMatrix: Story = {
  name: "Matrix — Line Heights",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {(["0.625rem", "0.75rem", "0.875rem", "1rem"] as const).map(
          (height) => (
            <StoryStack gap="xs" key={height}>
              <span className="font-mono text-muted-foreground text-xs">
                height={height}
              </span>
              <SkeletonLine height={height} width="70%" />
            </StoryStack>
          )
        )}
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── Governance ────────────────────────────────────────────────────────────

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="sm">
          <StoryStack gap="xs">
            <span className="font-mono text-muted-foreground text-xs">
              state=&quot;{state}&quot;
            </span>
            <Skeleton
              state={state}
              style={{ height: "0.75rem", width: "12rem" }}
            />
          </StoryStack>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Wrap loading regions with `aria-busy={true}` on a live container. Skeleton divs are decorative — do not rely on them alone for screen-reader status; add visible loading text or `aria-label` on the busy region.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <div aria-busy="true" aria-label="Loading invoice details">
        <StoryStack gap="md">
          <RecordHeaderLoading />
          <SkeletonTextBlock lines={3} />
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};

// ─── ERP loading composites ────────────────────────────────────────────────

export const RecordHeader: Story = {
  name: "ERP — Record Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <RecordHeaderLoading />
    </StoryFrame>
  ),
};

export const ControlledRecordLoad: Story = {
  name: "ERP — Controlled Record Load",
  parameters: { layout: "padded" },
  render: () => <ControlledRecordLoadDemo />,
};

export const InvoiceTableRows: Story = {
  name: "ERP — Invoice Table Rows",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <SkeletonTableRows
        columns={["Invoice", "Vendor", "Amount", "Due", "Status"]}
        rows={5}
      />
    </StoryFrame>
  ),
};

export const SelectableDataGrid: Story = {
  name: "ERP — Selectable Data Grid",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox aria-label="Select all" disabled />
            </TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }, (_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton style={{ height: "1rem", width: "1rem" }} />
              </TableCell>
              <TableCell>
                <StoryRow align="center" gap="sm">
                  <SkeletonAvatar size="2rem" />
                  <StoryStack gap="xs">
                    <SkeletonLine height="0.75rem" width="5rem" />
                    <SkeletonLine height="0.625rem" width="3.5rem" />
                  </StoryStack>
                </StoryRow>
              </TableCell>
              <TableCell>
                <SkeletonLine width="4rem" />
              </TableCell>
              <TableCell>
                <Skeleton style={{ height: "1.25rem", width: "4.5rem" }} />
              </TableCell>
              <TableCell>
                <Skeleton style={{ height: "1.75rem", width: "1.75rem" }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const KpiDashboardCards: Story = {
  name: "ERP — KPI Dashboard Cards",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <div className="grid grid-cols-2 gap-3">
        <KpiSkeletonCard />
        <KpiSkeletonCard />
        <KpiSkeletonCard />
        <KpiSkeletonCard />
      </div>
    </StoryFrame>
  ),
};

export const FormFieldsLoading: Story = {
  name: "ERP — Form Fields Loading",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {["Vendor name", "Payment terms", "Tax code", "Notes"].map((label) => (
          <StoryStack gap="xs" key={label}>
            <SkeletonLine height="0.625rem" width="30%" />
            <Skeleton style={{ height: "2.25rem", width: "100%" }} />
          </StoryStack>
        ))}
        <StoryRow gap="sm" justify="end">
          <SkeletonButton width="4.5rem" />
          <SkeletonButton width="5.5rem" />
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const RecordDetailPage: Story = {
  name: "ERP — Record Detail Page",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="lg">
        <RecordHeaderLoading />
        <StoryRow gap="sm">
          <SkeletonButton width="4rem" />
          <SkeletonButton width="5rem" />
          <SkeletonButton width="4.5rem" />
        </StoryRow>
        <StoryStack gap="md">
          <SkeletonLine height="0.875rem" width="25%" />
          <SkeletonTextBlock lines={4} />
        </StoryStack>
        <StoryStack gap="md">
          <SkeletonLine height="0.875rem" width="30%" />
          <SkeletonTableRows
            columns={["Line", "Description", "Qty", "Amount"]}
            rows={3}
          />
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SidebarNavigation: Story = {
  name: "ERP — Sidebar Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack
        className="rounded-md border border-border"
        gap="sm"
        padding="md"
      >
        <SkeletonLine height="1rem" width="50%" />
        {Array.from({ length: 6 }, (_, index) => (
          <StoryRow align="center" gap="sm" key={index}>
            <Skeleton style={{ height: "1.25rem", width: "1.25rem" }} />
            <SkeletonLine width="65%" />
          </StoryRow>
        ))}
        <SkeletonLine height="0.625rem" width="40%" />
        {Array.from({ length: 3 }, (_, index) => (
          <StoryRow align="center" gap="sm" key={`sub-${index}`}>
            <Skeleton style={{ height: "1rem", width: "1rem" }} />
            <SkeletonLine width="55%" />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const ChartPlaceholder: Story = {
  name: "ERP — Chart Placeholder",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Card>
        <CardHeader>
          <StoryStack gap="xs">
            <SkeletonLine height="0.875rem" width="35%" />
            <SkeletonLine height="0.625rem" width="50%" />
          </StoryStack>
        </CardHeader>
        <CardContent>
          <Skeleton
            style={{ height: "12rem", width: "100%", borderRadius: "0.375rem" }}
          />
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const DocumentPreview: Story = {
  name: "ERP — Document Preview",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryRow justify="between">
          <StoryStack gap="xs">
            <SkeletonLine height="0.875rem" width="8rem" />
            <SkeletonLine height="0.625rem" width="5rem" />
          </StoryStack>
          <StoryRow gap="sm">
            <Skeleton style={{ height: "2rem", width: "2rem" }} />
            <Skeleton style={{ height: "2rem", width: "2rem" }} />
          </StoryRow>
        </StoryRow>
        <Skeleton
          style={{
            height: "16rem",
            width: "100%",
            borderRadius: "0.375rem",
          }}
        />
        <SkeletonTextBlock lineHeight="0.625rem" lines={2} />
      </StoryStack>
    </StoryFrame>
  ),
};

export const SearchResultsList: Story = {
  name: "ERP — Search Results List",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <SkeletonLine height="0.625rem" width="40%" />
        {Array.from({ length: 5 }, (_, index) => (
          <StoryStack
            className="border-border border-b"
            gap="xs"
            key={index}
            paddingY="sm"
          >
            <SkeletonLine height="0.875rem" width="70%" />
            <SkeletonLine height="0.625rem" width="90%" />
            <SkeletonLine height="0.625rem" width="45%" />
          </StoryStack>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const ApprovalQueueCards: Story = {
  name: "ERP — Approval Queue Cards",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index}>
            <CardHeader>
              <StoryRow align="center" gap="sm">
                <SkeletonAvatar size="2rem" />
                <StoryStack className="flex-1" gap="xs">
                  <SkeletonLine height="0.75rem" width="60%" />
                  <SkeletonLine height="0.625rem" width="40%" />
                </StoryStack>
                <Skeleton style={{ height: "1.25rem", width: "4rem" }} />
              </StoryRow>
            </CardHeader>
            <CardContent>
              <SkeletonTextBlock lineHeight="0.625rem" lines={2} />
            </CardContent>
            <CardFooter>
              <StoryRow gap="sm">
                <SkeletonButton width="4rem" />
                <SkeletonButton width="4.5rem" />
              </StoryRow>
            </CardFooter>
          </Card>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const SettingsPanel: Story = {
  name: "ERP — Settings Panel",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        {["Notifications", "Security", "Integrations"].map((section) => (
          <StoryStack gap="md" key={section}>
            <SkeletonLine height="0.875rem" width="35%" />
            {Array.from({ length: 2 }, (_, index) => (
              <StoryRow align="center" justify="between" key={index}>
                <StoryStack gap="xs">
                  <SkeletonLine height="0.75rem" width="8rem" />
                  <SkeletonLine height="0.625rem" width="12rem" />
                </StoryStack>
                <Skeleton style={{ height: "1.25rem", width: "2.25rem" }} />
              </StoryRow>
            ))}
          </StoryStack>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const MasterDetailLayout: Story = {
  name: "ERP — Master Detail Layout",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="start" gap="md">
        <StoryStack
          className="w-56 rounded-md border border-border"
          gap="sm"
          padding="sm"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <StoryStack gap="xs" key={index}>
              <SkeletonLine height="0.75rem" width="80%" />
              <SkeletonLine height="0.625rem" width="50%" />
            </StoryStack>
          ))}
        </StoryStack>
        <StoryStack className="flex-1" gap="md">
          <RecordHeaderLoading />
          <SkeletonTextBlock lines={5} />
          <SkeletonTableRows
            columns={["Item", "Qty", "Unit price", "Total"]}
            rows={4}
          />
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ActivityFeed: Story = {
  name: "ERP — Activity Feed",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {Array.from({ length: 5 }, (_, index) => (
          <StoryRow align="start" gap="sm" key={index}>
            <SkeletonAvatar size="2rem" />
            <StoryStack className="flex-1" gap="xs">
              <SkeletonLine height="0.75rem" width="75%" />
              <SkeletonLine height="0.625rem" width="90%" />
              <SkeletonLine height="0.625rem" width="30%" />
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const LineItemsTable: Story = {
  name: "ERP — PO Line Items Table",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <StoryRow justify="between">
          <SkeletonLine height="0.875rem" width="8rem" />
          <SkeletonButton width="6rem" />
        </StoryRow>
        <SkeletonTableRows
          columns={["SKU", "Description", "Qty", "Unit", "Extended"]}
          rows={5}
        />
        <StoryRow justify="end">
          <StoryStack gap="xs">
            <StoryRow gap="md" justify="between">
              <SkeletonLine height="0.625rem" width="4rem" />
              <SkeletonLine height="0.75rem" width="5rem" />
            </StoryRow>
            <StoryRow gap="md" justify="between">
              <SkeletonLine height="0.625rem" width="3rem" />
              <SkeletonLine height="0.875rem" width="6rem" />
            </StoryRow>
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ExportJobPreview: Story = {
  name: "ERP — Export Job Preview",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <CardTitle>Exporting invoices</CardTitle>
          <CardDescription>
            284 records · CSV · Finance workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryStack gap="md">
            <Progress value={38} />
            <StoryStack gap="xs">
              <SkeletonLine height="0.625rem" width="50%" />
              <SkeletonLine height="0.625rem" width="35%" />
            </StoryStack>
          </StoryStack>
        </CardContent>
        <CardFooter>
          <SkeletonButton width="5rem" />
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const UserProfilePanel: Story = {
  name: "ERP — User Profile Panel",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryRow align="center" gap="md">
          <SkeletonAvatar size="4rem" />
          <StoryStack gap="xs">
            <SkeletonLine height="1rem" width="8rem" />
            <SkeletonLine height="0.75rem" width="10rem" />
            <Skeleton style={{ height: "1.25rem", width: "5rem" }} />
          </StoryStack>
        </StoryRow>
        <StoryStack gap="md">
          {["Email", "Phone", "Department", "Manager"].map((field) => (
            <StoryStack gap="xs" key={field}>
              <SkeletonLine height="0.625rem" width="25%" />
              <SkeletonLine height="0.75rem" width="60%" />
            </StoryStack>
          ))}
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const LoadingSkeletonCard: Story = {
  name: "ERP — Loading Card (inline)",
  parameters: {
    docs: {
      description: {
        story:
          "Card-shaped loading shell. A fuller card loading example also lives in Primitives/Card → ERP — Loading Skeleton Card.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Card>
        <CardHeader>
          <StoryRow align="center" gap="sm">
            <SkeletonAvatar />
            <StoryStack className="flex-1" gap="xs">
              <SkeletonLine height="0.875rem" width="60%" />
              <SkeletonLine height="0.75rem" width="40%" />
            </StoryStack>
          </StoryRow>
        </CardHeader>
        <CardContent>
          <SkeletonTextBlock lines={3} />
        </CardContent>
        <CardFooter>
          <StoryRow gap="sm">
            <SkeletonButton />
            <SkeletonButton />
          </StoryRow>
        </CardFooter>
      </Card>
    </StoryFrame>
  ),
};

// ─── Guidance ──────────────────────────────────────────────────────────────

export const SkeletonVsSpinner: Story = {
  name: "ERP — Skeleton vs Spinner",
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton: layout-preserving placeholders while record structure is known. Spinner: indeterminate action feedback (save, validate, refresh) without mimicking content shape.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Skeleton — invoice list loading
          </span>
          <SkeletonLine height="0.75rem" width="70%" />
          <SkeletonLine height="0.625rem" width="90%" />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Spinner — posting payment batch
          </span>
          <StoryRow align="center" gap="sm">
            <Spinner />
            <span className="text-muted-foreground text-sm">
              Posting 24 payments…
            </span>
          </StoryRow>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SkeletonVsEmpty: Story = {
  name: "ERP — Skeleton vs Empty",
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton: transient loading. Empty: stable zero-data or error states with actions — see Primitives/Empty.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Loading (Skeleton)</span>
          <SkeletonTextBlock lines={2} />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">No data (Empty)</span>
          <span className="text-muted-foreground text-xs">
            Use Primitives/Empty when the fetch completed with zero records
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SkeletonVsProgress: Story = {
  name: "ERP — Skeleton vs Progress",
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton mirrors final layout. Progress shows known completion percentage for uploads, imports, and batch jobs — see Primitives/Progress.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Layout placeholder (Skeleton)
          </span>
          <Skeleton
            style={{ height: "6rem", width: "100%", borderRadius: "0.375rem" }}
          />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Known progress (Progress)</span>
          <Progress value={62} />
          <span className="text-muted-foreground text-xs">
            Importing 156 of 250 vendors
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
