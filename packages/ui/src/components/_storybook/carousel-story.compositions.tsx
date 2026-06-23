import { useEffect, useState, type ReactNode } from "react";
import { AspectRatio } from "../aspect-ratio";
import { Badge } from "../badge";
import { Card, CardContent } from "../card";
import {
  type CarouselApi,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel";
import { StoryFrame, StoryRow, StoryStack } from "./story-frame";

// ─── Sample data ───────────────────────────────────────────────────────────

export const KPI_SLIDES = [
  {
    id: "revenue",
    label: "Revenue MTD",
    value: "$842,500",
    delta: "+12.4%",
    trend: "up" as const,
    progress: 78,
  },
  {
    id: "orders",
    label: "Open Orders",
    value: "1,284",
    delta: "+3.2%",
    trend: "up" as const,
    progress: 62,
  },
  {
    id: "inventory",
    label: "Stock Alerts",
    value: "47",
    delta: "-8.1%",
    trend: "down" as const,
    progress: 34,
  },
  {
    id: "overdue",
    label: "Overdue Invoices",
    value: "23",
    delta: "+2",
    trend: "down" as const,
    progress: 91,
  },
] as const;

export const PRODUCT_IMAGES = [
  {
    id: "sku-4412",
    name: "Industrial Fasteners Kit",
    sku: "SKU-4412",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
  },
  {
    id: "sku-8821",
    name: "Precision Bearings Set",
    sku: "SKU-8821",
    src: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop",
  },
  {
    id: "sku-3309",
    name: "Hydraulic Pump Assembly",
    sku: "SKU-3309",
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop",
  },
] as const;

export const ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Q3 Fiscal Close",
    body: "Finance team: submit accruals by June 28. GL lock begins July 1.",
    tone: "warning" as const,
  },
  {
    id: "ann-2",
    title: "New Procurement Policy",
    body: "POs above $10,000 require dual approval effective immediately.",
    tone: "info" as const,
  },
  {
    id: "ann-3",
    title: "System Maintenance",
    body: "ERP read-only window: Saturday 02:00–06:00 UTC.",
    tone: "neutral" as const,
  },
] as const;

export const TRAINING_MODULES = [
  {
    id: "mod-1",
    title: "Purchase Order Workflow",
    duration: "12 min",
    progress: 100,
  },
  {
    id: "mod-2",
    title: "Inventory Cycle Counts",
    duration: "18 min",
    progress: 45,
  },
  {
    id: "mod-3",
    title: "SOX Compliance Basics",
    duration: "25 min",
    progress: 0,
  },
] as const;

export const ACTIVITY = [
  {
    id: "a1",
    actor: "Jane Doe",
    initials: "JD",
    action: "Approved purchase order PO-2026-1184",
    time: "2 min ago",
  },
  {
    id: "a2",
    actor: "Alex Brown",
    initials: "AB",
    action: "Added line item — Industrial fasteners (×500)",
    time: "18 min ago",
  },
  {
    id: "a3",
    actor: "Sam Chen",
    initials: "SC",
    action: "Closed inventory variance ticket #INV-4421",
    time: "1 hr ago",
  },
] as const;

export const INVOICE_ATTACHMENTS = [
  { id: "att-1", name: "PO-2026-1184.pdf", pages: 3 },
  { id: "att-2", name: "Delivery-Receipt-8842.pdf", pages: 1 },
  { id: "att-3", name: "Vendor-Quote-FastCo.pdf", pages: 5 },
] as const;

export const DEPARTMENTS = [
  {
    id: "dept-1",
    name: "Finance",
    head: "Maria Kim",
    initials: "MK",
    openItems: 12,
  },
  {
    id: "dept-2",
    name: "Operations",
    head: "Alex Brown",
    initials: "AB",
    openItems: 28,
  },
  {
    id: "dept-3",
    name: "Procurement",
    head: "Jane Doe",
    initials: "JD",
    openItems: 7,
  },
] as const;

export const PO_LINE_ITEMS = [
  {
    id: "line-1",
    description: "Industrial fasteners (×500)",
    qty: 500,
    unit: "$0.42",
  },
  {
    id: "line-2",
    description: "Stainless steel bolts M8 (×200)",
    qty: 200,
    unit: "$1.15",
  },
  {
    id: "line-3",
    description: "Safety gloves — bulk pack",
    qty: 50,
    unit: "$8.90",
  },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

export function CarouselFrame({
  children,
  width = "sm",
}: {
  readonly children: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <StoryFrame width={width}>
      <StoryStack paddingX="lg">{children}</StoryStack>
    </StoryFrame>
  );
}

export function InsetCarouselControls() {
  return (
    <>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </>
  );
}

export function NumberedSlideCard({ index }: { readonly index: number }) {
  return (
    <CarouselItem>
      <StoryStack padding="xs">
        <Card>
          <CardContent>
            <div className="flex aspect-square items-center justify-center">
              <span className="font-semibold text-4xl tabular-nums">{index + 1}</span>
            </div>
          </CardContent>
        </Card>
      </StoryStack>
    </CarouselItem>
  );
}

export function SlideIndicators({
  count,
  api,
}: {
  readonly count: number;
  readonly api: CarouselApi | undefined;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <StoryRow align="center" gap="xs" justify="center">
      {Array.from({ length: count }, (_, index) => (
        <button
          aria-current={current === index ? "true" : undefined}
          aria-label={`Go to slide ${index + 1}`}
          className={
            current === index
              ? "size-2 rounded-full bg-primary"
              : "size-2 rounded-full bg-muted-foreground/30"
          }
          key={`dot-${index}`}
          onClick={() => api?.scrollTo(index)}
          type="button"
        />
      ))}
    </StoryRow>
  );
}

export function ProductImageSlide({
  alt,
  name,
  sku,
  src,
}: {
  readonly alt: string;
  readonly name: string;
  readonly sku: string;
  readonly src: string;
}) {
  return (
    <CarouselItem>
      <StoryStack gap="sm" padding="xs">
        <AspectRatio ratio={4 / 3}>
          <img
            alt={alt}
            className="h-full w-full rounded-lg object-cover"
            loading="lazy"
            src={src}
          />
        </AspectRatio>
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-muted-foreground text-xs">{sku}</span>
          </StoryStack>
          <Badge emphasis="soft" size="sm" tone="info">
            In Stock
          </Badge>
        </StoryRow>
      </StoryStack>
    </CarouselItem>
  );
}
