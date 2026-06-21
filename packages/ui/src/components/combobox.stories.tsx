import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Building2Icon,
  GlobeIcon,
  HashIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./combobox";
import { Label } from "./label";
import { Separator } from "./separator";

// ─── Types & data ────────────────────────────────────────────────────────────

interface LabeledOption {
  readonly label: string;
  readonly value: string;
}

type VendorOption = LabeledOption & {
  readonly code: string;
  readonly region: string;
};

interface EmployeeOption {
  readonly dept: string;
  readonly id: string;
  readonly initials: string;
  readonly label: string;
}

interface SkuOption {
  readonly id: string;
  readonly label: string;
  readonly sku: string;
  readonly stock: number;
}

interface GroupedVendor {
  readonly items: readonly VendorOption[];
  readonly value: string;
}

const VENDORS: readonly VendorOption[] = [
  {
    value: "vnd-88421",
    label: "Acme Supplies Ltd.",
    code: "VND-88421",
    region: "US",
  },
  {
    value: "vnd-55210",
    label: "Metro Logistics",
    code: "VND-55210",
    region: "US",
  },
  {
    value: "vnd-33108",
    label: "TechServe Inc.",
    code: "VND-33108",
    region: "US",
  },
  {
    value: "vnd-90214",
    label: "Global Parts Ltd.",
    code: "VND-90214",
    region: "UK",
  },
  {
    value: "vnd-77103",
    label: "Pacific Components",
    code: "VND-77103",
    region: "SG",
  },
  {
    value: "vnd-64092",
    label: "Nordic Industrial",
    code: "VND-64092",
    region: "EU",
  },
];

const EMPLOYEES: readonly EmployeeOption[] = [
  { id: "emp-1024", label: "Jane Doe", dept: "Finance", initials: "JD" },
  { id: "emp-2048", label: "Alex Brown", dept: "Operations", initials: "AB" },
  { id: "emp-3072", label: "Sam Chen", dept: "HR", initials: "SC" },
  { id: "emp-4096", label: "Maria Kim", dept: "Executive", initials: "MK" },
  { id: "emp-5120", label: "David Park", dept: "Engineering", initials: "DP" },
];

const COST_CENTERS: readonly LabeledOption[] = [
  { value: "cc-100", label: "100 — Corporate overhead" },
  { value: "cc-210", label: "210 — Manufacturing ops" },
  { value: "cc-320", label: "320 — Sales & marketing" },
  { value: "cc-430", label: "430 — R&D engineering" },
  { value: "cc-540", label: "540 — Facilities management" },
];

const CURRENCIES: readonly LabeledOption[] = [
  { value: "usd", label: "USD — US Dollar" },
  { value: "eur", label: "EUR — Euro" },
  { value: "gbp", label: "GBP — British Pound" },
  { value: "jpy", label: "JPY — Japanese Yen" },
  { value: "sgd", label: "SGD — Singapore Dollar" },
];

const COUNTRIES: readonly LabeledOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "gb", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
  { value: "sg", label: "Singapore" },
  { value: "au", label: "Australia" },
];

const PROJECT_CODES: readonly LabeledOption[] = [
  { value: "prj-erp-rollout", label: "PRJ-2026-01 — ERP rollout phase 2" },
  { value: "prj-facility", label: "PRJ-2025-18 — East campus expansion" },
  { value: "prj-compliance", label: "PRJ-2026-04 — SOX automation" },
  { value: "prj-migration", label: "PRJ-2025-22 — Data center migration" },
];

const EXPENSE_TAGS = [
  { id: "travel", value: "Travel" },
  { id: "meals", value: "Meals & entertainment" },
  { id: "software", value: "Software subscriptions" },
  { id: "contractors", value: "Contractors" },
  { id: "office", value: "Office supplies" },
] as const;

const APPROVAL_ROUTES = [
  { id: "dept-head", value: "Department head" },
  { id: "finance", value: "Finance reviewer" },
  { id: "cfo", value: "CFO sign-off" },
  { id: "legal", value: "Legal review" },
] as const;

const SKUS: readonly SkuOption[] = [
  { id: "sku-1", label: "M8 bolt kit", sku: "FAST-M8-500", stock: 1240 },
  { id: "sku-2", label: "Industrial lubricant", sku: "CHEM-LUB-20", stock: 86 },
  { id: "sku-3", label: "Safety gloves (L)", sku: "SAFE-GLV-L", stock: 420 },
  { id: "sku-4", label: "Server rack shelf", sku: "IT-RACK-42U", stock: 12 },
  { id: "sku-5", label: "Label printer ribbon", sku: "OFF-LBL-RIB", stock: 0 },
];

function groupVendorsByRegion(
  vendors: readonly VendorOption[]
): GroupedVendor[] {
  const buckets = new Map<string, VendorOption[]>();
  for (const vendor of vendors) {
    const list = buckets.get(vendor.region) ?? [];
    list.push(vendor);
    buckets.set(vendor.region, list);
  }
  return ["US", "UK", "SG", "EU"].map((region) => ({
    value: region,
    items: buckets.get(region) ?? [],
  }));
}

const GROUPED_VENDORS = groupVendorsByRegion(VENDORS);

const TIMEZONES = Intl.supportedValuesOf("timeZone").map((tz) => ({
  value: tz,
  label: tz.replaceAll("_", " "),
}));

function objectEquality(a: unknown, b: unknown): boolean {
  if (
    typeof a === "object" &&
    a !== null &&
    "id" in a &&
    typeof b === "object" &&
    b !== null &&
    "id" in b
  ) {
    return (a as { id: string }).id === (b as { id: string }).id;
  }
  return false;
}

function labeledEquality(a: LabeledOption, b: LabeledOption): boolean {
  return a.value === b.value;
}

// ─── Story helpers ───────────────────────────────────────────────────────────

function SingleCombobox<T extends LabeledOption>({
  items,
  id,
  placeholder,
  emptyMessage = "No results found.",
  defaultValue,
  showClear = false,
  disabled,
}: {
  readonly items: readonly T[];
  readonly id?: string;
  readonly placeholder: string;
  readonly emptyMessage?: string;
  readonly defaultValue?: T | null;
  readonly showClear?: boolean;
  readonly disabled?: boolean;
}) {
  return (
    <Combobox
      defaultValue={defaultValue ?? null}
      disabled={disabled}
      isItemEqualToValue={labeledEquality}
      items={items}
    >
      <ComboboxInput id={id} placeholder={placeholder} showClear={showClear} />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function MultiChipCombobox<T extends { id: string; value: string }>({
  items,
  id,
  placeholder,
  emptyMessage = "No results found.",
  defaultValue = [],
}: {
  readonly items: readonly T[];
  readonly id?: string;
  readonly placeholder: string;
  readonly emptyMessage?: string;
  readonly defaultValue?: readonly T[];
}) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      defaultValue={[...defaultValue]}
      isItemEqualToValue={objectEquality}
      items={items}
      multiple
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(selected: T[]) => (
            <>
              {selected.map((item) => (
                <ComboboxChip key={item.id}>{item.value}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                id={id}
                placeholder={selected.length > 0 ? "" : placeholder}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem key={item.id} value={item}>
              {item.value}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

// ─── Combobox ────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Base UI Combobox for ERP searchable selects: vendors, assignees, SKUs, cost centers, and multi-select tags. Prefer combobox over `Select` when lists exceed ~10 items or users need type-ahead filtering. Compose with `ComboboxInput`, `ComboboxContent`, `ComboboxList`, `ComboboxItem`, and chip primitives for multi-select.",
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic variants ────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="md">
      <SingleCombobox items={VENDORS} placeholder="Search vendors…" />
    </StoryFrame>
  ),
};

export const WithLabel: Story = {
  name: "Combobox — With Label",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="cb-vendor">Vendor</Label>
        <SingleCombobox
          id="cb-vendor"
          items={VENDORS}
          placeholder="Search vendors…"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const WithClear: Story = {
  name: "Combobox — With Clear",
  render: () => (
    <StoryFrame width="md">
      <SingleCombobox
        defaultValue={VENDORS.at(0) ?? null}
        items={VENDORS}
        placeholder="Search vendors…"
        showClear
      />
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  name: "State — Disabled",
  render: () => (
    <StoryFrame width="md">
      <SingleCombobox
        disabled
        items={VENDORS}
        placeholder="Vendor selection locked"
      />
    </StoryFrame>
  ),
};

export const EmptyResults: Story = {
  name: "Combobox — Empty Results",
  render: () => (
    <StoryFrame width="md">
      <Combobox items={[]}>
        <ComboboxInput placeholder="Search archived vendors…" />
        <ComboboxContent>
          <ComboboxEmpty>No archived vendors match your search.</ComboboxEmpty>
          <ComboboxList>
            {(item: LabeledOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </StoryFrame>
  ),
};

export const GroupedOptions: Story = {
  name: "Combobox — Grouped Options",
  render: () => (
    <StoryFrame width="md">
      <Combobox isItemEqualToValue={labeledEquality} items={GROUPED_VENDORS}>
        <ComboboxInput placeholder="Search by vendor or region…" />
        <ComboboxContent>
          <ComboboxEmpty>No vendors found.</ComboboxEmpty>
          <ComboboxList>
            {(group: GroupedVendor) => (
              <ComboboxGroup items={group.items} key={group.value}>
                <ComboboxLabel>{group.value} region</ComboboxLabel>
                <ComboboxCollection>
                  {(vendor: VendorOption) => (
                    <ComboboxItem key={vendor.value} value={vendor}>
                      <StoryStack gap="xs">
                        <span className="text-sm">{vendor.label}</span>
                        <span className="font-mono text-muted-foreground text-xs">
                          {vendor.code}
                        </span>
                      </StoryStack>
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Pair `Label` with `ComboboxInput id`. Chip removes expose `aria-label`. List items use combobox option semantics from Base UI.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="cb-a11y-cost">Cost center</Label>
        <SingleCombobox
          id="cb-a11y-cost"
          items={COST_CENTERS}
          placeholder="Search cost centers…"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ────────────────────────────────────────────────

export const VendorSelector: Story = {
  name: "ERP — Vendor Selector",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-vendor">Vendor</Label>
        <SingleCombobox
          id="erp-vendor"
          items={VENDORS}
          placeholder="Search vendor name or code…"
          showClear
        />
        <span className="text-muted-foreground text-xs">
          Type to filter 1,200+ vendor records
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmployeeAssigneePicker: Story = {
  name: "ERP — Employee Assignee Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-assignee">Assign to</Label>
        <Combobox isItemEqualToValue={objectEquality} items={EMPLOYEES}>
          <ComboboxInput
            id="erp-assignee"
            placeholder="Search employees…"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>No employees found.</ComboboxEmpty>
            <ComboboxList>
              {(employee: EmployeeOption) => (
                <ComboboxItem key={employee.id} value={employee}>
                  <StoryRow align="center" gap="md">
                    <Avatar size="sm">
                      <AvatarFallback>{employee.initials}</AvatarFallback>
                    </Avatar>
                    <StoryStack gap="xs">
                      <span className="font-medium text-sm">
                        {employee.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {employee.dept}
                      </span>
                    </StoryStack>
                  </StoryRow>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </StoryStack>
    </StoryFrame>
  ),
};

export const CustomerAccountPicker: Story = {
  name: "ERP — Customer Account Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-customer">Customer account</Label>
        <Combobox
          isItemEqualToValue={labeledEquality}
          items={[
            { value: "cust-1001", label: "Northwind Traders — CUST-1001" },
            { value: "cust-1002", label: "Summit Healthcare — CUST-1002" },
            { value: "cust-1003", label: "Blue Ocean Logistics — CUST-1003" },
            { value: "cust-1004", label: "Sterling Manufacturing — CUST-1004" },
          ]}
        >
          <ComboboxInput
            id="erp-customer"
            placeholder="Search customer name or ID…"
          />
          <ComboboxContent>
            <ComboboxEmpty>No customer accounts found.</ComboboxEmpty>
            <ComboboxList>
              {(item: LabeledOption) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </StoryStack>
    </StoryFrame>
  ),
};

export const CostCenterPicker: Story = {
  name: "ERP — Cost Center Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-cost-center">Cost center</Label>
        <SingleCombobox
          id="erp-cost-center"
          items={COST_CENTERS}
          placeholder="Search GL cost center…"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const CurrencySelector: Story = {
  name: "ERP — Currency Selector",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="erp-currency">Invoice currency</Label>
        <SingleCombobox
          defaultValue={CURRENCIES.at(0) ?? null}
          id="erp-currency"
          items={CURRENCIES}
          placeholder="Select currency…"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const CountrySelector: Story = {
  name: "ERP — Country Selector",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="erp-country">Ship-to country</Label>
        <Combobox isItemEqualToValue={labeledEquality} items={COUNTRIES}>
          <ComboboxInput
            id="erp-country"
            placeholder="Search countries…"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>No countries found.</ComboboxEmpty>
            <ComboboxList>
              {(country: LabeledOption) => (
                <ComboboxItem key={country.value} value={country}>
                  <StoryRow align="center" gap="sm">
                    <GlobeIcon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    {country.label}
                  </StoryRow>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ProjectCodeSearch: Story = {
  name: "ERP — Project Code Search",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="xs">
        <Label htmlFor="erp-project">Project code</Label>
        <Combobox isItemEqualToValue={labeledEquality} items={PROJECT_CODES}>
          <ComboboxInput
            id="erp-project"
            placeholder="Search active projects…"
          />
          <ComboboxContent>
            <ComboboxEmpty>No active projects found.</ComboboxEmpty>
            <ComboboxList>
              {(project: LabeledOption) => (
                <ComboboxItem key={project.value} value={project}>
                  <StoryRow align="center" gap="sm">
                    <HashIcon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    {project.label}
                  </StoryRow>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </StoryStack>
    </StoryFrame>
  ),
};

export const InventorySkuSearch: Story = {
  name: "ERP — Inventory SKU Search",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="xs">
        <Label htmlFor="erp-sku">Inventory item</Label>
        <Combobox isItemEqualToValue={objectEquality} items={SKUS}>
          <ComboboxInput
            id="erp-sku"
            placeholder="Search SKU or description…"
          />
          <ComboboxContent>
            <ComboboxEmpty>No inventory items found.</ComboboxEmpty>
            <ComboboxList>
              {(sku: SkuOption) => (
                <ComboboxItem
                  disabled={sku.stock === 0}
                  key={sku.id}
                  value={sku}
                >
                  <StoryRow align="center" justify="between">
                    <StoryStack gap="xs">
                      <span className="font-medium text-sm">{sku.label}</span>
                      <span className="font-mono text-muted-foreground text-xs">
                        {sku.sku}
                      </span>
                    </StoryStack>
                    <Badge
                      emphasis="soft"
                      size="sm"
                      tone={
                        sku.stock === 0
                          ? "danger"
                          : sku.stock < 50
                            ? "warning"
                            : "success"
                      }
                    >
                      {sku.stock === 0
                        ? "Out of stock"
                        : `${sku.stock} in stock`}
                    </Badge>
                  </StoryRow>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ExpenseTagMultiSelect: Story = {
  name: "ERP — Expense Tag Multi-Select",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-tags">Expense tags</Label>
        <MultiChipCombobox
          defaultValue={[EXPENSE_TAGS[0], EXPENSE_TAGS[2]]}
          id="erp-tags"
          items={EXPENSE_TAGS}
          placeholder="Add expense tags…"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ApprovalRouteMultiSelect: Story = {
  name: "ERP — Approval Route Multi-Select",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-approval-route">Approval route</Label>
        <MultiChipCombobox
          defaultValue={[APPROVAL_ROUTES[0], APPROVAL_ROUTES[1]]}
          id="erp-approval-route"
          items={APPROVAL_ROUTES}
          placeholder="Add approval steps…"
        />
        <span className="text-muted-foreground text-xs">
          Route applies to PO-2026-1184 workflow template
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const TimezonePicker: Story = {
  name: "ERP — Timezone Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-timezone">Reporting timezone</Label>
        <SingleCombobox
          id="erp-timezone"
          items={TIMEZONES}
          placeholder="Search timezones…"
        />
        <span className="text-muted-foreground text-xs">
          {TIMEZONES.length} zones — type to filter long lists
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const FilterBarComboboxRow: Story = {
  name: "ERP — Filter Bar Combobox Row",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow gap="md" wrap>
        <StoryStack gap="xs">
          <Label htmlFor="filter-vendor">Vendor</Label>
          <SingleCombobox
            id="filter-vendor"
            items={VENDORS}
            placeholder="All vendors…"
          />
        </StoryStack>
        <StoryStack gap="xs">
          <Label htmlFor="filter-assignee">Assignee</Label>
          <Combobox isItemEqualToValue={objectEquality} items={EMPLOYEES}>
            <ComboboxInput id="filter-assignee" placeholder="Anyone…" />
            <ComboboxContent>
              <ComboboxEmpty>No assignees found.</ComboboxEmpty>
              <ComboboxList>
                {(employee: EmployeeOption) => (
                  <ComboboxItem key={employee.id} value={employee}>
                    <StoryRow align="center" gap="sm">
                      <UserIcon
                        aria-hidden="true"
                        className="size-4 text-muted-foreground"
                      />
                      {employee.label}
                    </StoryRow>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </StoryStack>
        <StoryStack gap="xs">
          <Label htmlFor="filter-cost">Cost center</Label>
          <SingleCombobox
            id="filter-cost"
            items={COST_CENTERS}
            placeholder="All centers…"
          />
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const RecordLinkingCombobox: Story = {
  name: "ERP — Record Linking Combobox",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <Label htmlFor="erp-link-po">Link purchase order</Label>
          <Combobox
            isItemEqualToValue={labeledEquality}
            items={[
              {
                value: "po-1184",
                label: "PO-2026-1184 — Industrial fasteners",
              },
              {
                value: "po-1185",
                label: "PO-2026-1185 — Server rack components",
              },
              { value: "po-1186", label: "PO-2026-1186 — Office consumables" },
            ]}
          >
            <ComboboxInput id="erp-link-po" placeholder="Search open POs…" />
            <ComboboxContent>
              <ComboboxEmpty>No matching purchase orders.</ComboboxEmpty>
              <ComboboxList>
                {(item: LabeledOption) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </StoryStack>
        <Separator />
        <StoryRow align="center" gap="sm">
          <Building2Icon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="text-muted-foreground text-sm">
            Linking attaches receiving report RR-2026-042 to the selected PO
          </span>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const LocationSitePicker: Story = {
  name: "ERP — Location Site Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-site">Site / warehouse</Label>
        <Combobox
          isItemEqualToValue={labeledEquality}
          items={[
            { value: "wh-east", label: "WH-East — Columbus, OH" },
            { value: "wh-west", label: "WH-West — Portland, OR" },
            { value: "wh-central", label: "WH-Central — Dallas, TX" },
            { value: "wh-intl", label: "WH-Intl — Singapore hub" },
          ]}
        >
          <ComboboxInput id="erp-site" placeholder="Search sites…" />
          <ComboboxContent>
            <ComboboxEmpty>No sites found.</ComboboxEmpty>
            <ComboboxList>
              {(site: LabeledOption) => (
                <ComboboxItem key={site.value} value={site}>
                  <StoryRow align="center" gap="sm">
                    <MapPinIcon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    {site.label}
                  </StoryRow>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </StoryStack>
    </StoryFrame>
  ),
};
