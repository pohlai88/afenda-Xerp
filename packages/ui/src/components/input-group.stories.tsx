import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AtSignIcon,
  BarcodeIcon,
  BuildingIcon,
  CalendarIcon,
  CopyIcon,
  DollarSignIcon,
  EuroIcon,
  EyeIcon,
  EyeOffIcon,
  FilterIcon,
  GlobeIcon,
  HashIcon,
  LockIcon,
  MailIcon,
  PercentIcon,
  PhoneIcon,
  ScanLineIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Label } from "./label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

// ─── Helpers ───────────────────────────────────────────────────────────────

function MutedIcon({
  icon: Icon,
}: {
  readonly icon: ComponentType<{ className?: string }>;
}) {
  return <Icon aria-hidden="true" className="size-4 text-muted-foreground" />;
}

function SearchWithClearComponent({
  placeholder = "Search employees, invoices, records…",
  width = "lg",
}: {
  readonly placeholder?: string;
  readonly width?: "sm" | "md" | "lg" | "xl";
}) {
  const [value, setValue] = useState("");

  return (
    <StoryFrame width={width}>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <MutedIcon icon={SearchIcon} />
        </InputGroupAddon>
        <InputGroupInput
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
        {value ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Clear search"
              onClick={() => setValue("")}
              size="icon-xs"
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </StoryFrame>
  );
}

function PasswordRevealComponent() {
  const [visible, setVisible] = useState(false);

  return (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="ig-pwd">Password</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={LockIcon} />
          </InputGroupAddon>
          <InputGroupInput
            id="ig-pwd"
            placeholder="••••••••"
            type={visible ? "text" : "password"}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
              size="icon-xs"
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── InputGroup ────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed input group for ERP search bars, currency fields, prefixed IDs, and button addons (clear, reveal, copy). Composes `InputGroupInput`, `InputGroupTextarea`, `InputGroupAddon`, `InputGroupText`, and `InputGroupButton`. Addon `align` supports inline and block positions for textarea labels and footers.",
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="md">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <MutedIcon icon={SearchIcon} />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search records…" />
      </InputGroup>
    </StoryFrame>
  ),
};

export const TextPrefix: Story = {
  name: "InputGroup — Text Prefix",
  render: () => (
    <StoryFrame width="sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="your-company.com" />
      </InputGroup>
    </StoryFrame>
  ),
};

export const TextSuffix: Story = {
  name: "InputGroup — Text Suffix",
  render: () => (
    <StoryFrame width="sm">
      <InputGroup>
        <InputGroupInput placeholder="0.00" type="number" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </StoryFrame>
  ),
};

export const TextBoth: Story = {
  name: "InputGroup — Prefix + Suffix",
  render: () => (
    <StoryFrame width="sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" type="number" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.00</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </StoryFrame>
  ),
};

export const IconPrefix: Story = {
  name: "InputGroup — Icon Prefix",
  render: () => (
    <StoryFrame width="md">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <MutedIcon icon={SearchIcon} />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search records…" />
      </InputGroup>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Root has `role=\"group\"`. Pair with a visible `Label` or `aria-label` on the input. Icon-only buttons need `aria-label`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="ig-a11y-search">Search invoices</Label>
        <InputGroup aria-label="Invoice search">
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={SearchIcon} />
          </InputGroupAddon>
          <InputGroupInput
            id="ig-a11y-search"
            placeholder="Invoice number or vendor…"
            type="search"
          />
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAddonAligns: Story = {
  name: "Governance — Addon Alignments",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      <StoryFrame width="md">
        <StoryStack gap="xs">
          <span className="font-mono text-muted-foreground text-xs">
            inline-start / inline-end
          </span>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>PO-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="2026-1184" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </StoryStack>
      </StoryFrame>
      <StoryFrame width="md">
        <StoryStack gap="xs">
          <span className="font-mono text-muted-foreground text-xs">
            block-start / block-end (textarea)
          </span>
          <InputGroup>
            <InputGroupAddon align="block-start">
              <InputGroupText>Approval comment</InputGroupText>
            </InputGroupAddon>
            <InputGroupTextarea
              placeholder="Optional note for audit trail…"
              rows={3}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText>Visible to finance reviewers</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </StoryStack>
      </StoryFrame>
    </StoryStack>
  ),
};

// ─── Interactive addons ────────────────────────────────────────────────────

export const SearchWithClear: Story = {
  name: "ERP — Search with Clear Button",
  render: () => <SearchWithClearComponent />,
};

export const PasswordReveal: Story = {
  name: "ERP — Password Reveal Toggle",
  render: () => <PasswordRevealComponent />,
};

export const CopyRecordId: Story = {
  name: "ERP — Copy Record ID",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="ig-copy-id">Invoice ID</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>INV-2026-</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            defaultValue="0042"
            id="ig-copy-id"
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Copy invoice ID" size="icon-xs">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const GlobalModuleSearch: Story = {
  name: "ERP — Global Module Search",
  parameters: { layout: "padded" },
  render: () => (
    <SearchWithClearComponent
      placeholder="Search employees, invoices, POs, vendors…"
      width="xl"
    />
  ),
};

export const FilterBarSearch: Story = {
  name: "ERP — Filter Bar Search",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="sm" wrap>
        <InputGroup className="max-w-xs">
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={FilterIcon} />
          </InputGroupAddon>
          <InputGroupInput placeholder="Filter invoices…" size="sm" />
        </InputGroup>
        <InputGroup className="max-w-[10rem]">
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={CalendarIcon} />
          </InputGroupAddon>
          <InputGroupInput placeholder="Due date" size="sm" type="date" />
        </InputGroup>
      </StoryRow>
    </StoryFrame>
  ),
};

export const SkuBarcodeSearch: Story = {
  name: "ERP — SKU / Barcode Search",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="ig-sku">Scan or enter SKU</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={BarcodeIcon} />
          </InputGroupAddon>
          <InputGroupInput id="ig-sku" placeholder="FAST-M8-500" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Open scanner" size="icon-sm">
              <ScanLineIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const VendorLookupSearch: Story = {
  name: "ERP — Vendor Lookup Search",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="ig-vendor">Vendor</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={BuildingIcon} />
          </InputGroupAddon>
          <InputGroupInput
            id="ig-vendor"
            placeholder="Search vendor name or tax ID…"
          />
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const CurrencyInput: Story = {
  name: "ERP — Currency Amount Input",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <Label htmlFor="ig-usd">Invoice amount (USD)</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <MutedIcon icon={DollarSignIcon} />
            </InputGroupAddon>
            <InputGroupInput id="ig-usd" placeholder="0.00" type="number" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <Label htmlFor="ig-eur">Payment amount (EUR)</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <MutedIcon icon={EuroIcon} />
            </InputGroupAddon>
            <InputGroupInput id="ig-eur" placeholder="0.00" type="number" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>EUR</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ExchangeRateInput: Story = {
  name: "ERP — Exchange Rate Input",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="ig-fx">FX rate</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>1 USD =</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            defaultValue="0.92"
            id="ig-fx"
            placeholder="0.00"
            type="number"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>EUR</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmailInput: Story = {
  name: "ERP — Email with Domain",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="ig-email">Work email</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={MailIcon} />
          </InputGroupAddon>
          <InputGroupInput id="ig-email" placeholder="username" type="text" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>@company.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const UsernameInput: Story = {
  name: "ERP — Username with Prefix",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="ig-user">Username</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={AtSignIcon} />
          </InputGroupAddon>
          <InputGroupInput id="ig-user" placeholder="username" />
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PhoneWithCountryCode: Story = {
  name: "ERP — Phone with Country Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="ig-phone">Mobile phone</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={PhoneIcon} />
          </InputGroupAddon>
          <InputGroupAddon align="inline-start">
            <InputGroupText>+1</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="ig-phone"
            placeholder="555 000 0000"
            type="tel"
          />
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const RecordIdInput: Story = {
  name: "ERP — Record ID with Prefix",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <Label htmlFor="ig-emp">Employee ID</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>EMP-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="ig-emp" placeholder="00001" type="number" />
          </InputGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <Label htmlFor="ig-inv">Invoice number</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>INV-2026-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="ig-inv" placeholder="0001" type="number" />
          </InputGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <Label htmlFor="ig-ref">Payment reference</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <MutedIcon icon={HashIcon} />
            </InputGroupAddon>
            <InputGroupInput id="ig-ref" placeholder="Bank confirmation #" />
          </InputGroup>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const CostCenterInput: Story = {
  name: "ERP — Cost Center Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="ig-cost">Cost center</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>CC-</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-cost" placeholder="210" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>Manufacturing</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const DiscountInput: Story = {
  name: "ERP — Percentage Discount",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="ig-discount">Line discount</Label>
        <InputGroup>
          <InputGroupInput
            id="ig-discount"
            max="100"
            min="0"
            placeholder="0"
            type="number"
          />
          <InputGroupAddon align="inline-end">
            <MutedIcon icon={PercentIcon} />
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const QuantityWithUnit: Story = {
  name: "ERP — Quantity with Unit",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="ig-qty">Order quantity</Label>
        <InputGroup>
          <InputGroupInput
            defaultValue="500"
            id="ig-qty"
            min="1"
            type="number"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>units</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const TaxIdInput: Story = {
  name: "ERP — Tax ID (EIN)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="ig-tax">Vendor tax ID</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>US-</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-tax" placeholder="12-3456789" />
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const VendorPortalUrl: Story = {
  name: "ERP — Vendor Portal URL",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="xs">
        <Label htmlFor="ig-portal">Vendor portal URL</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MutedIcon icon={GlobeIcon} />
          </InputGroupAddon>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="ig-portal"
            placeholder="vendor.acme-supplies.com/login"
          />
        </InputGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InternalNotesTextarea: Story = {
  name: "ERP — Internal Notes Textarea",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Internal notes — PO-2026-1184</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea
          placeholder="Delivery instructions, budget reference, or approval context…"
          rows={4}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText>Not visible to vendor · Max 2,000 characters</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </StoryFrame>
  ),
};

export const ValidationStates: Story = {
  name: "ERP — Validation States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <Label>Default</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>EMP-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="Employee ID" />
          </InputGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <Label>Error</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>EMP-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-invalid
              placeholder="Invalid employee ID"
              state="error"
            />
          </InputGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <Label>Disabled</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <MutedIcon icon={LockIcon} />
            </InputGroupAddon>
            <InputGroupInput disabled placeholder="Read-only system ID" />
          </InputGroup>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InlinePoLineRow: Story = {
  name: "ERP — Inline PO Line Row",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" gap="sm" wrap>
        <InputGroup className="w-32">
          <InputGroupAddon align="inline-start">
            <InputGroupText>SKU</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="FAST-M8" size="sm" />
        </InputGroup>
        <InputGroup className="min-w-[12rem] flex-1">
          <InputGroupInput placeholder="Description" size="sm" />
        </InputGroup>
        <InputGroup className="w-24">
          <InputGroupInput placeholder="Qty" size="sm" type="number" />
        </InputGroup>
        <InputGroup className="w-28">
          <InputGroupAddon align="inline-start">
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="0.00" size="sm" type="number" />
        </InputGroup>
      </StoryRow>
    </StoryFrame>
  ),
};

export const InputGroupVsPlainInput: Story = {
  name: "ERP — InputGroup vs Plain Input",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Use `InputGroup` when prefix/suffix text, icons, or inline buttons are part of the field. Use plain `Input` for simple labeled fields.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">InputGroup — prefixed amount</span>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="0.00" type="number" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Plain Input — simple text field</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Input for standalone fields
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const AllFormInputGroups: Story = {
  name: "Matrix — Common ERP Input Groups",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {(
          [
            {
              label: "Search",
              prefix: <MutedIcon icon={SearchIcon} />,
              placeholder: "Search records…",
            },
            {
              label: "Amount (USD)",
              prefix: <InputGroupText>$</InputGroupText>,
              placeholder: "0.00",
              suffix: <InputGroupText>USD</InputGroupText>,
            },
            {
              label: "Email",
              prefix: <MutedIcon icon={AtSignIcon} />,
              placeholder: "username",
              suffix: <InputGroupText>@corp.com</InputGroupText>,
            },
            {
              label: "Discount",
              placeholder: "0",
              suffix: <MutedIcon icon={PercentIcon} />,
            },
            {
              label: "Employee ID",
              prefix: <InputGroupText>EMP-</InputGroupText>,
              placeholder: "00001",
            },
            {
              label: "SKU scan",
              prefix: <MutedIcon icon={BarcodeIcon} />,
              placeholder: "FAST-M8-500",
            },
          ] as const
        ).map((row) => (
          <StoryRow align="center" gap="md" key={row.label}>
            <span className="w-28 shrink-0 text-muted-foreground text-xs">
              {row.label}
            </span>
            <InputGroup className="flex-1">
              {"prefix" in row && row.prefix ? (
                <InputGroupAddon align="inline-start">{row.prefix}</InputGroupAddon>
              ) : null}
              <InputGroupInput placeholder={row.placeholder} />
              {"suffix" in row && row.suffix ? (
                <InputGroupAddon align="inline-end">{row.suffix}</InputGroupAddon>
              ) : null}
            </InputGroup>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};
