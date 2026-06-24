import type { Meta, StoryObj } from "@storybook/react";
import { GOVERNED_STATES } from "@afenda/ui/governance";
import { useState } from "react";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { Badge } from "./badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// ─── Helpers ───────────────────────────────────────────────────────────────

function getVisiblePages(
  page: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  if (page > 3) {
    pages.push("ellipsis");
  }
  for (
    let index = Math.max(2, page - 1);
    index <= Math.min(totalPages - 1, page + 1);
    index += 1
  ) {
    pages.push(index);
  }
  if (page < totalPages - 2) {
    pages.push("ellipsis");
  }
  pages.push(totalPages);
  return pages;
}

function RecordRangeSummary({
  end,
  page,
  perPage,
  start,
  totalRecords,
}: {
  readonly end: number;
  readonly page: number;
  readonly perPage: number;
  readonly start: number;
  readonly totalRecords: number;
}) {
  return (
    <StoryStack gap="xs">
      <span className="text-muted-foreground text-xs tabular-nums">
        Showing {start.toLocaleString()}–{end.toLocaleString()} of{" "}
        {totalRecords.toLocaleString()} records
      </span>
      <span className="text-muted-foreground text-xs tabular-nums">
        Page {page} · {perPage} rows per page
      </span>
    </StoryStack>
  );
}

function PaginatedControls({
  onPageChange,
  page,
  totalPages,
}: {
  readonly onPageChange: (nextPage: number) => void;
  readonly page: number;
  readonly totalPages: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page <= 1 ? true : undefined}
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page > 1) {
                onPageChange(page - 1);
              }
            }}
          />
        </PaginationItem>
        {getVisiblePages(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            aria-disabled={page >= totalPages ? true : undefined}
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page < totalPages) {
                onPageChange(page + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function PageSizeSelector({
  onChange,
  value,
}: {
  readonly onChange: (value: string) => void;
  readonly value: string;
}) {
  return (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-xs">Rows per page</span>
      <Select onValueChange={onChange} value={value}>
        <div className="w-20">
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </div>
        <SelectContent>
          {["10", "25", "50", "100"].map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </StoryRow>
  );
}

function InteractiveInvoiceTableFooter() {
  const totalRecords = 284;
  const [page, setPage] = useState(3);
  const perPage = 25;
  const totalPages = Math.ceil(totalRecords / Number(perPage));
  const pageSize = perPage;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRecords);

  const rows = Array.from({ length: 5 }, (_, index) => ({
    id: `INV-2026-${String((page - 1) * pageSize + index + 1).padStart(4, "0")}`,
    amount: (index + 1) * 480 + page * 100,
    date: `Jun ${15 + index}, 2026`,
    status: index % 2 === 0 ? "Pending" : "Approved",
  }));

  return (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Badge
                      emphasis="soft"
                      size="sm"
                      tone={row.status === "Approved" ? "success" : "warning"}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${row.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{row.date}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <StoryRow align="center" justify="between" wrap>
          <RecordRangeSummary
            end={end}
            page={page}
            perPage={pageSize}
            start={start}
            totalRecords={totalRecords}
          />
          <PaginatedControls
            onPageChange={setPage}
            page={page}
            totalPages={totalPages}
          />
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Governed pagination controls for ERP data tables and list views. Wraps page links in `<nav role="navigation">` with governed prev/next, numbered links, and ellipsis. Pair with page-size selectors and record summaries in table footers.',
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
      table: { defaultValue: { summary: "ready" } },
    },
  },
  args: {
    state: "ready",
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground & governance probes ────────────────────────────────────────

function PaginationStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryRow align="center" gap="md">
      <StoryCaption>{state}</StoryCaption>
      <Pagination state={state}>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {state}
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </StoryRow>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Pagination state={args.state}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` on root and content — governed attributes must win.',
      },
    },
  },
  render: () => (
    <Pagination
      data-component="Override"
      data-recipe="override"
      data-slot="override"
      data-state="fake"
      state="ready"
    >
      <PaginationContent data-slot="override">
        <PaginationItem>
          <PaginationLink data-slot="override" href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    docs: {
      description: {
        story:
          "Reference map of emitted `data-slot` values. Internal roles: root → pagination, body → pagination-content, icon → pagination-ellipsis. slotKey map: link-text / link-padding-* → pagination-link, ellipsis-label → pagination-ellipsis. PaginationItem is passthrough → pagination-item.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → pagination · body → pagination-content · icon →
          pagination-ellipsis · link-text → pagination-link · ellipsis-label →
          pagination-ellipsis · item passthrough → pagination-item
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <PaginationStateProbe key={state} state={state} />
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
          'Root renders `<nav aria-label="pagination">`. Active page uses `aria-current="page"`. Prev/next expose `aria-label`; disabled boundaries use `aria-disabled`. Ellipsis exposes sr-only "More pages" while the icon is `aria-hidden`.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious aria-disabled href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <span className="text-muted-foreground text-xs">
          Screen readers announce the navigation landmark, active page, and
          ellipsis overflow.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const WithEllipsis: Story = {
  name: "Pagination — With Ellipsis",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">6</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">20</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const FirstPage: Story = {
  name: "Pagination — First Page",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious aria-disabled href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">50</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const LastPage: Story = {
  name: "Pagination — Last Page",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">48</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">49</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            50
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext aria-disabled href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const IconOnlyControls: Story = {
  name: "Pagination — Icon-only Prev/Next",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" presentation="icon" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            4
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" presentation="icon" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const SinglePage: Story = {
  name: "Pagination — Single Page",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious aria-disabled href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext aria-disabled href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const ManyPages: Story = {
  name: "Pagination — Large Dataset",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">846</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            847
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">848</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1200</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

function InteractiveControlledComponent() {
  const [page, setPage] = useState(5);
  const totalPages = 20;

  return (
    <StoryStack gap="sm">
      <PaginatedControls
        onPageChange={setPage}
        page={page}
        totalPages={totalPages}
      />
      <span className="text-muted-foreground text-xs">
        Active page: {page} of {totalPages}
      </span>
    </StoryStack>
  );
}

export const InteractiveControlled: Story = {
  name: "Pagination — Interactive",
  parameters: { layout: "padded" },
  render: () => <InteractiveControlledComponent />,
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const DataTableFooter: Story = {
  name: "ERP — Invoice Table Footer",
  parameters: { layout: "padded" },
  render: () => <InteractiveInvoiceTableFooter />,
};

export const PaginationWithPageSize: Story = {
  name: "ERP — Pagination + Page Size",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" justify="between" wrap>
        <StoryRow align="center" gap="sm" wrap>
          <PageSizeSelector onChange={() => undefined} value="25" />
          <span className="text-muted-foreground text-xs">of 284 records</span>
        </StoryRow>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">12</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StoryRow>
    </StoryFrame>
  ),
};

export const CompactPagination: Story = {
  name: "ERP — Compact Prev/Next",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-xs">Page 5 of 20</span>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" text="Prev" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" text="Next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </StoryRow>
  ),
};

export const EmployeeRosterFooter: Story = {
  name: "ERP — Employee Roster Footer",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" justify="between" wrap>
        <span className="text-muted-foreground text-xs">
          Showing 51–100 of 412 employees
        </span>
        <PaginatedControls
          onPageChange={() => undefined}
          page={3}
          totalPages={9}
        />
      </StoryRow>
    </StoryFrame>
  ),
};

export const VendorListFooter: Story = {
  name: "ERP — Vendor List Footer",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" justify="between" wrap>
        <span className="text-muted-foreground text-xs">
          148 approved vendors · page 2 of 6
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ApprovalInboxFooter: Story = {
  name: "ERP — Approval Inbox Footer",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" justify="between" wrap>
        <StoryRow align="center" gap="sm">
          <span className="text-muted-foreground text-xs">
            12 pending approvals
          </span>
          <Badge emphasis="soft" size="sm" tone="warning">
            Action required
          </Badge>
        </StoryRow>
        <PaginatedControls
          onPageChange={() => undefined}
          page={1}
          totalPages={3}
        />
      </StoryRow>
    </StoryFrame>
  ),
};

export const JournalEntriesFooter: Story = {
  name: "ERP — Journal Entries Footer",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" justify="between" wrap>
        <span className="text-muted-foreground text-xs">
          FY2026-Q2 · 1,024 posted entries
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                11
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">12</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StoryRow>
    </StoryFrame>
  ),
};

export const SearchResultsFooter: Story = {
  name: "ERP — Search Results Footer",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <span className="text-muted-foreground text-xs">
          37 results for &quot;Acme Supplies&quot;
        </span>
        <StoryRow justify="center">
          <PaginatedControls
            onPageChange={() => undefined}
            page={2}
            totalPages={4}
          />
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SelectionSummaryFooter: Story = {
  name: "ERP — Selection + Pagination",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" justify="between" wrap>
        <span className="text-muted-foreground text-sm">
          3 of 25 row(s) selected on this page
        </span>
        <PaginatedControls
          onPageChange={() => undefined}
          page={4}
          totalPages={18}
        />
      </StoryRow>
    </StoryFrame>
  ),
};

export const EmptyResultsFooter: Story = {
  name: "ERP — Empty Results",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" justify="between" wrap>
        <span className="text-muted-foreground text-xs">
          0 records match the current filter
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious aria-disabled href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext aria-disabled href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StoryRow>
    </StoryFrame>
  ),
};

export const CenteredPagination: Story = {
  name: "ERP — Centered Pagination",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow justify="center">
        <PaginatedControls
          onPageChange={() => undefined}
          page={6}
          totalPages={14}
        />
      </StoryRow>
    </StoryFrame>
  ),
};

export const CardListFooter: Story = {
  name: "ERP — Card List Footer",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack
          className="rounded-md border border-border"
          gap="xs"
          padding="md"
        >
          <span className="font-medium text-sm">PO-2026-1184</span>
          <span className="text-muted-foreground text-xs">
            Global Parts Co. · $12,400.00
          </span>
        </StoryStack>
        <StoryStack
          className="rounded-md border border-border"
          gap="xs"
          padding="md"
        >
          <span className="font-medium text-sm">PO-2026-1183</span>
          <span className="text-muted-foreground text-xs">
            Acme Supplies · $4,850.00
          </span>
        </StoryStack>
        <StoryRow align="center" justify="between" wrap>
          <span className="text-muted-foreground text-xs">Page 2 of 8</span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" presentation="icon" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" presentation="icon" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

function PageSizeInteractiveComponent() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("25");
  const totalRecords = 284;
  const totalPages = Math.max(1, Math.ceil(totalRecords / Number(perPage)));

  return (
    <StoryFrame width="xl">
      <StoryRow align="center" justify="between" wrap>
        <StoryRow align="center" gap="md" wrap>
          <PageSizeSelector
            onChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
            value={perPage}
          />
          <span className="text-muted-foreground text-xs">
            {totalRecords.toLocaleString()} purchase orders
          </span>
        </StoryRow>
        <PaginatedControls
          onPageChange={setPage}
          page={Math.min(page, totalPages)}
          totalPages={totalPages}
        />
      </StoryRow>
    </StoryFrame>
  );
}

export const InteractivePageSize: Story = {
  name: "ERP — Interactive Page Size",
  parameters: { layout: "padded" },
  render: () => <PageSizeInteractiveComponent />,
};

export const ButtonGroupReference: Story = {
  name: "ERP — Pagination vs ButtonGroup",
  parameters: {
    docs: {
      description: {
        story:
          "Use `Pagination` for numbered page navigation in table footers. Use `ButtonGroup` for compact prev/next-only controls in dense toolbars — see Primitives/ButtonGroup.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Numbered pages (Pagination)
          </span>
          <PaginatedControls
            onPageChange={() => undefined}
            page={3}
            totalPages={12}
          />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Compact toolbar (ButtonGroup)
          </span>
          <span className="text-muted-foreground text-xs">
            See ERP — Pagination Controls in Primitives/ButtonGroup
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
