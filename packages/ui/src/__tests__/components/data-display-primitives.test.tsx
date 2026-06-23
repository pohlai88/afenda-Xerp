import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { type ComponentProps, createRef, forwardRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
  DataTable,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Progress,
  ScrollArea,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

interface SampleRow {
  readonly id: string;
  readonly name: string;
}

const SAMPLE_COLUMNS: ColumnDef<SampleRow>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];

const SampleDataTable = forwardRef<
  HTMLDivElement,
  {
    readonly data: SampleRow[];
    readonly emptyMessage?: string;
  } & Omit<ComponentProps<typeof DataTable>, "table">
>(function SampleDataTable({ data, emptyMessage, ...props }, ref) {
  const table = useReactTable({
    columns: SAMPLE_COLUMNS,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      ref={ref}
      table={table}
      {...props}
      {...(emptyMessage === undefined ? {} : { emptyMessage })}
    />
  );
});

describe("data display primitive governance", () => {
  describe("ScrollArea", () => {
    it("renders root and viewport with governed data-slots", () => {
      render(
        <ScrollArea data-testid="scroll-root">
          <div>Scrollable content</div>
        </ScrollArea>
      );

      const root = screen.getByTestId("scroll-root");
      expectGovernedPrimitive(root, {
        component: "ScrollArea",
        slot: "scroll-area",
        recipe: "form-control",
      });
      expect(
        root.querySelector('[data-slot="scroll-area-viewport"]')
      ).toBeTruthy();
    });

    it("keeps governed data attributes authoritative on root", () => {
      render(
        <ScrollArea
          data-component="Override"
          data-slot="override"
          data-testid="scroll-root"
        >
          Content
        </ScrollArea>
      );

      expectGovernedDataAuthority(screen.getByTestId("scroll-root"), {
        "data-component": "ScrollArea",
        "data-recipe": "form-control",
        "data-slot": "scroll-area",
        "data-state": "ready",
      });
    });
  });

  describe("Empty", () => {
    it("renders governed empty-state slots", () => {
      render(
        <Empty data-testid="empty-root">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <span aria-hidden="true">Icon</span>
            </EmptyMedia>
            <EmptyTitle>No records</EmptyTitle>
            <EmptyDescription>Try adjusting your filters.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );

      expect(screen.getByTestId("empty-root")).toHaveAttribute(
        "data-slot",
        "empty"
      );
      expect(screen.getByText("No records")).toHaveAttribute(
        "data-slot",
        "empty-title"
      );
      expect(screen.getByText("Try adjusting your filters.")).toHaveAttribute(
        "data-slot",
        "empty-description"
      );
      expect(
        screen.getByText("Icon").closest('[data-slot="empty-icon"]')
      ).toBeTruthy();
    });
  });

  describe("Progress", () => {
    it("renders root and indicator with governed data-slots", () => {
      render(<Progress data-testid="progress-root" value={42} />);

      const root = screen.getByTestId("progress-root");
      expectGovernedPrimitive(root, {
        component: "Progress",
        slot: "progress",
        recipe: "form-control",
      });
      expect(
        root.querySelector('[data-slot="progress-indicator"]')
      ).toBeTruthy();
    });

    it("drives indicator position via CSS custom property", () => {
      render(<Progress data-testid="progress-root" value={75} />);

      const indicator = screen
        .getByTestId("progress-root")
        .querySelector('[data-slot="progress-indicator"]');

      expect(indicator).toHaveStyle({ "--progress-value": "75" });
    });
  });

  describe("Chart", () => {
    it("renders ChartContainer with governed data-slot", () => {
      render(
        <ChartContainer
          config={{
            revenue: { label: "Revenue", color: "var(--primary)" },
          }}
          data-testid="chart-root"
        >
          <div aria-hidden="true">Chart body</div>
        </ChartContainer>
      );

      expectGovernedPrimitive(screen.getByTestId("chart-root"), {
        component: "Chart",
        slot: "chart",
        recipe: "surface",
      });
    });

    it("keeps governed data attributes authoritative on ChartContainer", () => {
      render(
        <ChartContainer
          config={{ revenue: { label: "Revenue", color: "var(--primary)" } }}
          data-component="Override"
          data-slot="override"
          data-testid="chart-root"
        >
          <div aria-hidden="true">Chart body</div>
        </ChartContainer>
      );

      expectGovernedDataAuthority(screen.getByTestId("chart-root"), {
        "data-component": "Chart",
        "data-recipe": "surface",
        "data-slot": "chart",
        "data-state": "ready",
      });
    });

    it("exposes displayName on chart subcomponents", () => {
      expect(ChartContainer.displayName).toBe("ChartContainer");
      expect(ChartTooltipContent.displayName).toBe("ChartTooltipContent");
      expect(ChartLegendContent.displayName).toBe("ChartLegendContent");
    });
  });

  describe("Carousel", () => {
    it("exposes carousel region semantics and item slots", () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      expect(screen.getByRole("region")).toHaveAttribute(
        "data-slot",
        "carousel"
      );
      expect(screen.getByText("Slide 1")).toHaveAttribute(
        "data-slot",
        "carousel-item"
      );
    });

    it("forwards ref to carousel root", () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <Carousel ref={ref}>
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("DataTable", () => {
    it("renders governed root and native table cells", () => {
      render(
        <SampleDataTable
          data={[
            { id: "1", name: "Alpha" },
            { id: "2", name: "Beta" },
          ]}
        />
      );

      const root = screen
        .getByRole("table")
        .closest('[data-slot="data-table"]');
      expect(root).toBeTruthy();
      expect(screen.getByText("Alpha").closest("td")).toHaveAttribute(
        "data-slot",
        "table-cell"
      );
    });

    it("renders empty state with governed empty-cell slot", () => {
      render(<SampleDataTable data={[]} emptyMessage="No matching records." />);

      const emptyCell = screen.getByText("No matching records.");
      expect(emptyCell).toHaveAttribute("data-slot", "data-table-empty-cell");
      expect(emptyCell).toHaveAttribute("role", "status");
      expect(emptyCell.closest("td")).toHaveAttribute(
        "data-slot",
        "table-cell"
      );
    });

    it("forwards ref to DataTable root wrapper", () => {
      const ref = createRef<HTMLDivElement>();

      render(<SampleDataTable data={[{ id: "1", name: "Alpha" }]} ref={ref} />);

      expect(ref.current).toHaveAttribute("data-slot", "data-table");
    });

    it("keeps governed data attributes authoritative on DataTable root", () => {
      render(
        <SampleDataTable
          data={[{ id: "1", name: "Alpha" }]}
          data-component="Override"
          data-slot="override"
          data-state="fake"
        />
      );

      const root = screen
        .getByRole("table")
        .closest('[data-slot="data-table"]');
      expect(root).toBeTruthy();
      expectGovernedDataAuthority(root as HTMLElement, {
        "data-component": "DataTable",
        "data-recipe": "table",
        "data-slot": "data-table",
        "data-state": "ready",
      });
    });

    it("exposes displayName on DataTable", () => {
      expect(
        (DataTable as typeof DataTable & { displayName: string }).displayName
      ).toBe("DataTable");
    });
  });
});
