import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  FileTextIcon,
  PackageIcon,
  PlayIcon,
  TrendingUpIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { AspectRatio } from "./aspect-ratio";
import { Avatar, AvatarFallback } from "./avatar";
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
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import { Progress } from "./progress";
import { Separator } from "./separator";

// ─── Sample data ───────────────────────────────────────────────────────────

const KPI_SLIDES = [
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

const PRODUCT_IMAGES = [
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

const ANNOUNCEMENTS = [
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

const TRAINING_MODULES = [
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

const ACTIVITY = [
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

const INVOICE_ATTACHMENTS = [
  { id: "att-1", name: "PO-2026-1184.pdf", pages: 3 },
  { id: "att-2", name: "Delivery-Receipt-8842.pdf", pages: 1 },
  { id: "att-3", name: "Vendor-Quote-FastCo.pdf", pages: 5 },
] as const;

const DEPARTMENTS = [
  { id: "dept-1", name: "Finance", head: "Maria Kim", initials: "MK", openItems: 12 },
  { id: "dept-2", name: "Operations", head: "Alex Brown", initials: "AB", openItems: 28 },
  { id: "dept-3", name: "Procurement", head: "Jane Doe", initials: "JD", openItems: 7 },
] as const;

const PO_LINE_ITEMS = [
  { id: "line-1", description: "Industrial fasteners (×500)", qty: 500, unit: "$0.42" },
  { id: "line-2", description: "Stainless steel bolts M8 (×200)", qty: 200, unit: "$1.15" },
  { id: "line-3", description: "Safety gloves — bulk pack", qty: 50, unit: "$8.90" },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function CarouselFrame({
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

function InsetCarouselControls() {
  return (
    <>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </>
  );
}

function NumberedSlideCard({ index }: { readonly index: number }) {
  return (
    <CarouselItem>
      <StoryStack padding="xs">
        <Card>
          <CardContent>
            <div className="flex aspect-square items-center justify-center">
              <span className="font-semibold text-4xl">{index + 1}</span>
            </div>
          </CardContent>
        </Card>
      </StoryStack>
    </CarouselItem>
  );
}

function SlideIndicators({
  count,
  api,
}: {
  readonly count: number;
  readonly api: CarouselApi | undefined;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

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

function ProductImageSlide({
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

// ─── Carousel ──────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Embla carousel for ERP media galleries, KPI cards, announcements, training modules, and document previews. Supports horizontal/vertical orientation, loop/options via `opts`, and programmatic control via `setApi` + `CarouselApi`.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Scroll axis for the carousel track",
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <CarouselFrame>
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 5 }, (_, index) => (
            <NumberedSlideCard index={index} key={`slide-${index}`} />
          ))}
        </CarouselContent>
        <InsetCarouselControls />
      </Carousel>
    </CarouselFrame>
  ),
};

export const VerticalOrientation: Story = {
  name: "Carousel — Vertical",
  render: () => (
    <CarouselFrame width="sm">
      <StoryStack className="h-96">
        <Carousel className="h-full" orientation="vertical">
          <CarouselContent>
            {Array.from({ length: 5 }, (_, index) => (
              <NumberedSlideCard index={index} key={`v-slide-${index}`} />
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const LoopEnabled: Story = {
  name: "Carousel — Loop",
  render: () => (
    <CarouselFrame>
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {Array.from({ length: 5 }, (_, index) => (
            <NumberedSlideCard index={index} key={`loop-slide-${index}`} />
          ))}
        </CarouselContent>
        <InsetCarouselControls />
      </Carousel>
    </CarouselFrame>
  ),
};

export const PartialSlides: Story = {
  name: "Carousel — Partial Slides",
  render: () => (
    <CarouselFrame width="md">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {Array.from({ length: 6 }, (_, index) => (
            <CarouselItem className="basis-1/2" key={`partial-${index}`}>
              <StoryStack padding="xs">
                <Card density="compact">
                  <CardHeader>
                    <CardTitle>Item {index + 1}</CardTitle>
                    <CardDescription>Partial-width slide</CardDescription>
                  </CardHeader>
                </Card>
              </StoryStack>
            </CarouselItem>
          ))}
        </CarouselContent>
        <InsetCarouselControls />
      </Carousel>
    </CarouselFrame>
  ),
};

export const WithSlideIndicators: Story = {
  name: "Carousel — Slide Indicators",
  render: () => {
    const [api, setApi] = useState<CarouselApi>();

    return (
      <CarouselFrame>
        <StoryStack gap="sm">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {Array.from({ length: 5 }, (_, index) => (
                <NumberedSlideCard index={index} key={`ind-slide-${index}`} />
              ))}
            </CarouselContent>
            <InsetCarouselControls />
          </Carousel>
          <SlideIndicators api={api} count={5} />
        </StoryStack>
      </CarouselFrame>
    );
  },
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const ProductImageGallery: Story = {
  name: "ERP — Product Image Gallery",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Product Media</span>
            <span className="text-muted-foreground text-xs">
              PO-2026-1184 · 3 images
            </span>
          </StoryStack>
          <PackageIcon aria-hidden="true" className="size-4 text-muted-foreground" />
        </StoryRow>
        <Carousel>
          <CarouselContent>
            {PRODUCT_IMAGES.map((product) => (
              <ProductImageSlide
                alt={product.name}
                key={product.id}
                name={product.name}
                sku={product.sku}
                src={product.src}
              />
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const KpiMetricsDashboard: Story = {
  name: "ERP — KPI Metrics Carousel",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">Executive Dashboard</span>
          <Badge emphasis="soft" size="sm" tone="success">
            Live
          </Badge>
        </StoryRow>
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {KPI_SLIDES.map((kpi) => (
              <CarouselItem key={kpi.id}>
                <StoryStack padding="xs">
                  <Card density="compact">
                    <CardHeader>
                      <CardDescription>{kpi.label}</CardDescription>
                      <CardTitle>{kpi.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StoryStack gap="sm">
                        <StoryRow align="center" gap="xs">
                          {kpi.trend === "up" ? (
                            <ArrowUpIcon
                              aria-hidden="true"
                              className="size-4 text-success"
                            />
                          ) : (
                            <ArrowDownIcon
                              aria-hidden="true"
                              className="size-4 text-danger"
                            />
                          )}
                          <span className="text-muted-foreground text-xs">
                            {kpi.delta} vs last month
                          </span>
                        </StoryRow>
                        <Progress value={kpi.progress} />
                      </StoryStack>
                    </CardContent>
                  </Card>
                </StoryStack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const CompanyAnnouncements: Story = {
  name: "ERP — Company Announcements",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <BellIcon aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">Company Announcements</span>
        </StoryRow>
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {ANNOUNCEMENTS.map((item) => (
              <CarouselItem key={item.id}>
                <StoryStack padding="xs">
                  <Card>
                    <CardHeader>
                      <StoryRow align="center" justify="between">
                        <CardTitle>{item.title}</CardTitle>
                        <Badge
                          emphasis="soft"
                          size="sm"
                          tone={
                            item.tone === "warning"
                              ? "warning"
                              : item.tone === "info"
                                ? "info"
                                : "neutral"
                          }
                        >
                          {item.tone === "warning"
                            ? "Action Required"
                            : item.tone === "info"
                              ? "Policy"
                              : "Notice"}
                        </Badge>
                      </StoryRow>
                      <CardDescription>{item.body}</CardDescription>
                    </CardHeader>
                  </Card>
                </StoryStack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const TrainingModules: Story = {
  name: "ERP — Training Modules",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">Onboarding · Required Modules</span>
        <Carousel>
          <CarouselContent>
            {TRAINING_MODULES.map((module) => (
              <CarouselItem key={module.id}>
                <StoryStack padding="xs">
                  <Card density="compact">
                    <CardHeader>
                      <StoryRow align="center" gap="sm">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <PlayIcon
                            aria-hidden="true"
                            className="size-4 text-muted-foreground"
                          />
                        </div>
                        <StoryStack gap="xs">
                          <CardTitle>{module.title}</CardTitle>
                          <CardDescription>{module.duration}</CardDescription>
                        </StoryStack>
                      </StoryRow>
                    </CardHeader>
                    <CardContent>
                      <StoryStack gap="xs">
                        <StoryRow align="center" justify="between">
                          <span className="text-muted-foreground text-xs">
                            Progress
                          </span>
                          <span className="text-xs">{module.progress}%</span>
                        </StoryRow>
                        <Progress value={module.progress} />
                      </StoryStack>
                    </CardContent>
                    <CardFooter>
                      <Button emphasis="outline" intent="secondary" size="sm">
                        {module.progress === 100 ? "Review" : "Continue"}
                      </Button>
                    </CardFooter>
                  </Card>
                </StoryStack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const ActivityFeed: Story = {
  name: "ERP — Activity Feed",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">Recent Activity</span>
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {ACTIVITY.map((item) => (
              <CarouselItem className="basis-4/5" key={item.id}>
                <StoryStack padding="xs">
                  <Card density="compact">
                    <CardContent>
                      <StoryRow align="start" gap="sm">
                        <Avatar size="sm">
                          <AvatarFallback>{item.initials}</AvatarFallback>
                        </Avatar>
                        <StoryStack gap="xs">
                          <span className="font-medium text-sm">{item.actor}</span>
                          <span className="text-muted-foreground text-xs">
                            {item.action}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {item.time}
                          </span>
                        </StoryStack>
                      </StoryRow>
                    </CardContent>
                  </Card>
                </StoryStack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const InvoiceAttachments: Story = {
  name: "ERP — Invoice Attachments",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Attachments</span>
            <span className="text-muted-foreground text-xs">
              INV-2026-0142 · 3 files
            </span>
          </StoryStack>
          <FileTextIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
        </StoryRow>
        <Carousel>
          <CarouselContent>
            {INVOICE_ATTACHMENTS.map((file) => (
              <CarouselItem key={file.id}>
                <StoryStack padding="xs">
                  <Card>
                    <CardHeader>
                      <StoryRow align="center" gap="sm">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                          <FileTextIcon
                            aria-hidden="true"
                            className="size-6 text-muted-foreground"
                          />
                        </div>
                        <StoryStack gap="xs">
                          <CardTitle>{file.name}</CardTitle>
                          <CardDescription>
                            {file.pages} page{file.pages > 1 ? "s" : ""}
                          </CardDescription>
                        </StoryStack>
                      </StoryRow>
                    </CardHeader>
                    <CardFooter>
                      <Button emphasis="outline" intent="secondary" size="sm">
                        Preview
                      </Button>
                      <Button emphasis="ghost" intent="secondary" size="sm">
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                </StoryStack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const DepartmentSpotlight: Story = {
  name: "ERP — Department Spotlight",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <UserIcon aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">Department Overview</span>
        </StoryRow>
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {DEPARTMENTS.map((dept) => (
              <CarouselItem key={dept.id}>
                <StoryStack padding="xs">
                  <Card>
                    <CardHeader>
                      <StoryRow align="center" gap="sm">
                        <Avatar>
                          <AvatarFallback>{dept.initials}</AvatarFallback>
                        </Avatar>
                        <StoryStack gap="xs">
                          <CardTitle>{dept.name}</CardTitle>
                          <CardDescription>
                            Head: {dept.head}
                          </CardDescription>
                        </StoryStack>
                      </StoryRow>
                    </CardHeader>
                    <CardContent>
                      <StoryRow align="center" justify="between">
                        <span className="text-muted-foreground text-sm">
                          Open action items
                        </span>
                        <Badge emphasis="soft" size="sm" tone="warning">
                          {dept.openItems}
                        </Badge>
                      </StoryRow>
                    </CardContent>
                    <CardFooter>
                      <Button emphasis="outline" intent="secondary" size="sm">
                        View Department
                      </Button>
                    </CardFooter>
                  </Card>
                </StoryStack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const PurchaseOrderLineItems: Story = {
  name: "ERP — PO Line Items",
  parameters: { layout: "padded" },
  render: () => (
    <CarouselFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">PO-2026-1184</span>
            <span className="text-muted-foreground text-xs">
              Line items · swipe to review
            </span>
          </StoryStack>
          <TrendingUpIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
        </StoryRow>
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {PO_LINE_ITEMS.map((line, index) => (
              <CarouselItem className="basis-4/5" key={line.id}>
                <StoryStack padding="xs">
                  <Card density="compact">
                    <CardHeader>
                      <StoryRow align="center" justify="between">
                        <CardTitle>Line {index + 1}</CardTitle>
                        <Badge emphasis="soft" size="sm" tone="neutral">
                          {line.qty} units
                        </Badge>
                      </StoryRow>
                      <CardDescription>{line.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <StoryRow align="center" justify="between">
                        <span className="text-muted-foreground text-sm">
                          Unit price
                        </span>
                        <span className="font-medium text-sm">{line.unit}</span>
                      </StoryRow>
                    </CardContent>
                  </Card>
                </StoryStack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <InsetCarouselControls />
        </Carousel>
        <Separator />
        <StoryRow align="center" justify="between">
          <span className="text-muted-foreground text-sm">Estimated total</span>
          <span className="font-semibold text-sm">$1,055.00</span>
        </StoryRow>
      </StoryStack>
    </CarouselFrame>
  ),
};

export const WarehouseLocationPhotos: Story = {
  name: "ERP — Warehouse Location Photos",
  parameters: { layout: "padded" },
  render: () => {
    const locations = [
      { id: "wh-a1", zone: "Zone A · Rack 12", label: "Fasteners aisle" },
      { id: "wh-b3", zone: "Zone B · Rack 03", label: "Heavy machinery" },
      { id: "wh-c7", zone: "Zone C · Rack 07", label: "Cold storage" },
    ] as const;

    return (
      <CarouselFrame width="md">
        <StoryStack gap="sm">
          <StoryRow align="center" gap="sm">
            <TruckIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-medium text-sm">Warehouse Locations</span>
          </StoryRow>
          <Carousel>
            <CarouselContent>
              {locations.map((loc) => (
                <CarouselItem key={loc.id}>
                  <StoryStack gap="sm" padding="xs">
                    <AspectRatio ratio={16 / 9}>
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted">
                        <PackageIcon
                          aria-hidden="true"
                          className="size-8 text-muted-foreground/50"
                        />
                        <span className="text-muted-foreground text-sm">
                          {loc.label}
                        </span>
                      </div>
                    </AspectRatio>
                    <StoryRow align="center" justify="between">
                      <span className="font-medium text-sm">{loc.zone}</span>
                      <Badge emphasis="soft" size="sm" tone="success">
                        Verified
                      </Badge>
                    </StoryRow>
                  </StoryStack>
                </CarouselItem>
              ))}
            </CarouselContent>
            <InsetCarouselControls />
          </Carousel>
        </StoryStack>
      </CarouselFrame>
    );
  },
};
