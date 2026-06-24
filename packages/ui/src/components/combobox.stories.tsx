import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2Icon,
  GlobeIcon,
  HashIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import {
  APPROVAL_ROUTES,
  COST_CENTERS,
  COUNTRIES,
  EMPLOYEES,
  EXPENSE_TAGS,
  GROUPED_VENDORS,
  type GroupedVendor,
  type LabeledOption,
  MultiChipCombobox,
  PROJECT_CODES,
  SingleCombobox,
  SKUS,
  type SkuOption,
  TIMEZONES,
  VENDORS,
  CURRENCIES,
  labeledEquality,
  objectEquality,
  type EmployeeOption,
  type VendorOption,
} from "./_storybook/combobox-story.compositions";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "./combobox";
import { Label } from "./label";
import { Separator } from "./separator";

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

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          "Consumer `data-*` props cannot override governed combobox item attributes.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Combobox
        defaultOpen
        isItemEqualToValue={labeledEquality}
        items={VENDORS}
      >
        <ComboboxInput placeholder="Search vendors…" showTrigger={false} />
        <ComboboxContent>
          <ComboboxEmpty>No vendors found.</ComboboxEmpty>
          <ComboboxList>
            {(item: LabeledOption) => (
              <ComboboxItem
                data-component="Override"
                data-recipe="override"
                data-slot="override"
                key={item.value}
                value={item}
              >
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </StoryFrame>
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
          <StoryFrame width="md">
            <SingleCombobox
              items={COST_CENTERS}
              placeholder={`Cost center (${state})…`}
              state={state}
            />
          </StoryFrame>
        </StoryRow>
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

export const VendorSelector: Story = {
  name: "ERP — Vendor Selector",
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
                      {sku.stock === 0 ? (
                        "Out of stock"
                      ) : (
                        <span className="tabular-nums">
                          {sku.stock} in stock
                        </span>
                      )}
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
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <Label htmlFor="erp-timezone">Reporting timezone</Label>
        <SingleCombobox
          id="erp-timezone"
          items={TIMEZONES}
          placeholder="Search timezones…"
        />
        <span className="text-muted-foreground text-xs tabular-nums">
          {TIMEZONES.length} zones — type to filter long lists
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const FilterBarComboboxRow: Story = {
  name: "ERP — Filter Bar Combobox Row",
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
