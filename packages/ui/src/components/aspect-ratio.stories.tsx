import React from "react";
import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FileTextIcon,
  MapPinIcon,
  PackageIcon,
  PlayIcon,
  UserIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { StoryFrame, StoryInset, StoryRow, StoryStack } from "./_storybook/story-frame";
import { AspectRatio } from "./aspect-ratio";
import { Badge } from "./badge";
import { Button } from "./button";

// ─── Helpers ───────────────────────────────────────────────────────────────

function RatioPlaceholder({
  label,
  icon: Icon,
}: {
  readonly label: string;
  readonly icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted">
      {Icon ? (
        <Icon aria-hidden="true" className="size-8 text-muted-foreground/50" />
      ) : null}
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
}

function MediaImage({ alt, src }: { readonly alt: string; readonly src: string }) {
  return (
    <img
      alt={alt}
      className="h-full w-full rounded-lg object-cover"
      loading="lazy"
      src={src}
    />
  );
}

// ─── AspectRatio ───────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed media container that preserves aspect ratio for ERP thumbnails, document previews, attachment cards, and dashboard widgets. Pass `ratio` as a width/height fraction (e.g. `16 / 9`, `1`, `3 / 4`). Child content should fill with `h-full w-full`.",
      },
    },
  },
  argTypes: {
    ratio: {
      control: { type: "number", min: 0.1, max: 3, step: 0.1 },
      description: "Width ÷ height aspect ratio",
      table: { defaultValue: { summary: "1" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
      table: { category: "Governance" },
    },
  },
  args: {
    ratio: 16 / 9,
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic ratios ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="lg">
      <AspectRatio {...args}>
        <RatioPlaceholder label="16:9 media preview" />
      </AspectRatio>
    </StoryFrame>
  ),
};

export const Square: Story = {
  name: "AspectRatio — 1:1 Square",
  args: { ratio: 1 },
  render: (args) => (
    <StoryFrame width="sm">
      <AspectRatio {...args}>
        <RatioPlaceholder label="1:1 square thumbnail" />
      </AspectRatio>
    </StoryFrame>
  ),
};

export const Portrait: Story = {
  name: "AspectRatio — 3:4 Portrait",
  args: { ratio: 3 / 4 },
  render: (args) => (
    <StoryFrame width="sm">
      <AspectRatio {...args}>
        <RatioPlaceholder label="3:4 portrait photo" />
      </AspectRatio>
    </StoryFrame>
  ),
};

export const WideBanner: Story = {
  name: "AspectRatio — 21:9 Banner",
  args: { ratio: 21 / 9 },
  render: (args) => (
    <StoryFrame width="xl">
      <AspectRatio {...args}>
        <RatioPlaceholder label="21:9 dashboard banner" />
      </AspectRatio>
    </StoryFrame>
  ),
};

export const DocumentA4: Story = {
  name: "AspectRatio — A4 Document",
  args: { ratio: 1 / Math.SQRT2 },
  render: (args) => (
    <StoryFrame width="md">
      <AspectRatio {...args}>
        <RatioPlaceholder icon={FileTextIcon} label="A4 document preview" />
      </AspectRatio>
    </StoryFrame>
  ),
};

export const RatioComparison: Story = {
  name: "AspectRatio — Common Ratios",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="start" gap="md" wrap>
      {(
        [
          { ratio: 1, label: "1:1", width: "sm" as const },
          { ratio: 4 / 3, label: "4:3", width: "sm" as const },
          { ratio: 16 / 9, label: "16:9", width: "md" as const },
          { ratio: 21 / 9, label: "21:9", width: "lg" as const },
        ] as const
      ).map(({ ratio, label, width }) => (
        <StoryFrame key={label} width={width}>
          <StoryStack gap="xs">
            <span className="font-medium text-sm">{label}</span>
            <AspectRatio ratio={ratio}>
              <RatioPlaceholder label={label} />
            </AspectRatio>
          </StoryStack>
        </StoryFrame>
      ))}
    </StoryRow>
  ),
};

export const GovernedStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="md">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <AspectRatio ratio={16 / 9} state={state}>
            <RatioPlaceholder label={`Governed state: ${state}`} />
          </AspectRatio>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const ProductCatalogCard: Story = {
  name: "ERP — Product Catalog Card",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryInset overflow="hidden">
        <AspectRatio ratio={1}>
          <MediaImage
            alt="Ergonomic office chair — black"
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80"
          />
        </AspectRatio>
        <StoryStack gap="xs" padding="md">
          <StoryRow align="center" justify="between">
            <span className="font-medium text-sm">SKU-4401</span>
            <Badge emphasis="soft" size="sm" tone="success">
              In Stock
            </Badge>
          </StoryRow>
          <span className="text-muted-foreground text-sm">
            Ergonomic Office Chair — Black
          </span>
          <StoryRow align="center" justify="between">
            <span className="font-semibold tabular-nums text-sm">$189.00</span>
            <Button emphasis="outline" intent="secondary" size="sm">
              View
            </Button>
          </StoryRow>
        </StoryStack>
      </StoryInset>
    </StoryFrame>
  ),
};

export const InvoiceAttachmentPreview: Story = {
  name: "ERP — Invoice Attachment Preview",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryInset padding="md">
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between">
            <StoryStack gap="xs">
              <span className="font-medium text-sm">INV-2026-0142_scan.pdf</span>
              <span className="text-muted-foreground text-xs">
                Uploaded Jun 21, 2026 ·{" "}
                <span className="tabular-nums">1.2 MB</span>
              </span>
            </StoryStack>
            <Badge emphasis="soft" size="sm" tone="info">
              Pending Review
            </Badge>
          </StoryRow>
          <AspectRatio ratio={1 / Math.SQRT2}>
            <RatioPlaceholder icon={FileTextIcon} label="Page 1 of 3" />
          </AspectRatio>
          <StoryRow gap="sm">
            <Button emphasis="outline" intent="secondary" size="sm">
              Download
            </Button>
            <Button emphasis="solid" intent="primary" size="sm">
              Approve
            </Button>
          </StoryRow>
        </StoryStack>
      </StoryInset>
    </StoryFrame>
  ),
};

export const WarehouseItemPhoto: Story = {
  name: "ERP — Warehouse Item Photo",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <PackageIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="font-medium text-sm">PO-LI-002 · Standing Desk</span>
        </StoryRow>
        <AspectRatio ratio={4 / 3}>
          <MediaImage
            alt="Standing desk walnut finish in warehouse bay A"
            src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80"
          />
        </AspectRatio>
        <StoryRow align="center" justify="between">
          <span className="text-muted-foreground text-xs">
            Warehouse A · Bay 12 · Qty{" "}
            <span className="tabular-nums">6</span>
          </span>
          <Badge emphasis="soft" size="sm" tone="neutral">
            Received
          </Badge>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmployeeProfilePhoto: Story = {
  name: "ERP — Employee Profile Photo",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="sm">
        <AspectRatio ratio={3 / 4}>
          <MediaImage
            alt="Jane Doe employee profile photo"
            src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
          />
        </AspectRatio>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Jane Doe</span>
          <span className="text-muted-foreground text-xs">
            EMP-00142 · Engineering
          </span>
        </StoryStack>
        <Button emphasis="outline" intent="secondary" size="sm">
          <UserIcon />
          View Profile
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const TrainingVideoThumbnail: Story = {
  name: "ERP — Training Video Thumbnail",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <AspectRatio ratio={16 / 9}>
          <div className="relative h-full w-full">
            <MediaImage
              alt="Expense report submission training video"
              src="https://images.unsplash.com/photo-1524178232363-1fb2b75573dd?w=800&q=80"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
              <div className="flex size-12 items-center justify-center rounded-full bg-background/90">
                <PlayIcon aria-hidden="true" className="size-5" />
              </div>
            </div>
          </div>
        </AspectRatio>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            How to Submit an Expense Report
          </span>
          <StoryRow align="center" gap="sm">
            <Badge emphasis="soft" size="sm" tone="info">
              HR · 12 min
            </Badge>
            <span className="text-muted-foreground text-xs">
              Required for all new hires
            </span>
          </StoryRow>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const LocationMapPreview: Story = {
  name: "ERP — Delivery Location Map",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <MapPinIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="font-medium text-sm">
            Delivery Address — PO-8821
          </span>
        </StoryRow>
        <AspectRatio ratio={16 / 9}>
          <MediaImage
            alt="Map preview of delivery location in Singapore"
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80"
          />
        </AspectRatio>
        <span className="text-muted-foreground text-xs">
          12 Marina Boulevard, Singapore 018982
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PurchaseOrderGrid: Story = {
  name: "ERP — PO Line Item Thumbnails",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="md">
        <span className="font-medium text-sm">PO-8821 · Line Items</span>
        <StoryRow align="start" gap="md" wrap>
          {(
            [
              {
                sku: "SKU-4401",
                label: "Office Chair",
                src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80",
              },
              {
                sku: "SKU-8820",
                label: "Standing Desk",
                src: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&q=80",
              },
              {
                sku: "SKU-1190",
                label: "Monitor Arm",
                src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80",
              },
            ] as const
          ).map(({ sku, label, src }) => (
            <StoryFrame key={sku} width="sm">
              <StoryStack gap="xs">
                <AspectRatio ratio={1}>
                  <MediaImage alt={`${label} product photo`} src={src} />
                </AspectRatio>
                <span className="font-medium text-xs">{sku}</span>
                <span className="text-muted-foreground text-xs">{label}</span>
              </StoryStack>
            </StoryFrame>
          ))}
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const AssetRegisterPhoto: Story = {
  name: "ERP — Fixed Asset Photo",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryInset padding="md">
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between">
            <StoryStack gap="xs">
              <span className="font-medium text-sm">FA-2026-0088</span>
              <span className="text-muted-foreground text-xs">
                Dell PowerEdge R750 · Server Room B
              </span>
            </StoryStack>
            <Badge emphasis="soft" size="sm" tone="success">
              Active
            </Badge>
          </StoryRow>
          <AspectRatio ratio={16 / 9}>
            <MediaImage
              alt="Dell PowerEdge server rack in server room"
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80"
            />
          </AspectRatio>
          <StoryRow align="center" justify="between">
            <span className="text-muted-foreground text-xs">
              Book value:{" "}
              <span className="tabular-nums">$18,400.00</span>
            </span>
            <Button emphasis="ghost" intent="secondary" size="sm">
              View Asset
            </Button>
          </StoryRow>
        </StoryStack>
      </StoryInset>
    </StoryFrame>
  ),
};

export const DashboardWidgetChart: Story = {
  name: "ERP — Dashboard Widget Area",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryInset padding="md">
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between">
            <span className="font-medium text-sm">Revenue — Q2 2026</span>
            <Badge emphasis="soft" size="sm" tone="success">
              <span className="tabular-nums">+12.4%</span>
            </Badge>
          </StoryRow>
          <AspectRatio ratio={16 / 9}>
            <RatioPlaceholder label="Chart area · 16:9 widget slot" />
          </AspectRatio>
          <StoryRow align="center" justify="between">
            <span className="text-muted-foreground text-xs">
              Last updated 09:14 today
            </span>
            <Button emphasis="ghost" intent="secondary" size="sm">
              View Report
            </Button>
          </StoryRow>
        </StoryStack>
      </StoryInset>
    </StoryFrame>
  ),
};
