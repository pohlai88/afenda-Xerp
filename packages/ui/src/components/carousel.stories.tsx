import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
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
import React, { useState } from "react";
import {
  ACTIVITY,
  ANNOUNCEMENTS,
  CarouselFrame,
  DEPARTMENTS,
  INVOICE_ATTACHMENTS,
  InsetCarouselControls,
  KPI_SLIDES,
  NumberedSlideCard,
  PO_LINE_ITEMS,
  PRODUCT_IMAGES,
  ProductImageSlide,
  SlideIndicators,
  TRAINING_MODULES,
} from "./_storybook/carousel-story.compositions";
import { StoryCaption, StoryRow, StoryStack } from "./_storybook/story-frame";
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
      table: { defaultValue: { summary: "horizontal" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <CarouselFrame>
      <Carousel aria-label="Numbered slides">
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
        <Carousel
          aria-label="Vertical numbered slides"
          className="h-full"
          orientation="vertical"
        >
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
      <Carousel aria-label="Looping numbered slides" opts={{ loop: true }}>
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
      <Carousel aria-label="Partial-width slides" opts={{ align: "start" }}>
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
          <Carousel aria-label="Slides with dot indicators" setApi={setApi}>
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
          <PackageIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
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
                      <CardTitle>
                        <span className="tabular-nums">{kpi.value}</span>
                      </CardTitle>
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
                          <span className="text-muted-foreground text-xs tabular-nums">
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
          <BellIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
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
        <span className="font-medium text-sm">
          Onboarding · Required Modules
        </span>
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
                          <span className="font-medium text-sm">
                            {item.actor}
                          </span>
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
          <UserIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
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
                          <CardDescription>Head: {dept.head}</CardDescription>
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

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-orientation="vertical"` and `data-slot="override"` — governed props must win. Inspect the root element to confirm.',
      },
    },
  },
  render: () => (
    <CarouselFrame>
      <Carousel
        aria-label="Governed carousel"
        data-orientation="vertical"
        data-slot="override"
        orientation="horizontal"
      >
        <CarouselContent>
          <NumberedSlideCard index={0} />
        </CarouselContent>
        <InsetCarouselControls />
      </Carousel>
    </CarouselFrame>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryRow align="center" gap="md" key={state}>
          <StoryCaption>{state}</StoryCaption>
          <Carousel aria-label={`Carousel state ${state}`} state={state}>
            <CarouselContent>
              <NumberedSlideCard index={0} />
              <NumberedSlideCard index={1} />
            </CarouselContent>
            <InsetCarouselControls />
          </Carousel>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Carousel root uses `role="region"` and `aria-roledescription="carousel"`. Provide `aria-label` on the root. Slides use `aria-roledescription="slide"`. Arrow keys scroll horizontally; vertical carousels use ArrowUp/ArrowDown.',
      },
    },
  },
  render: () => (
    <CarouselFrame width="md">
      <Carousel aria-label="Featured purchase orders">
        <CarouselContent>
          <NumberedSlideCard index={0} />
          <NumberedSlideCard index={1} />
          <NumberedSlideCard index={2} />
        </CarouselContent>
        <InsetCarouselControls />
      </Carousel>
    </CarouselFrame>
  ),
};
