import type { GovernedComboboxProps } from "@afenda/ui/governance";
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
} from "../combobox";

// ─── Types & data ────────────────────────────────────────────────────────────

export interface LabeledOption {
  readonly label: string;
  readonly value: string;
}

export type VendorOption = LabeledOption & {
  readonly code: string;
  readonly region: string;
};

export interface EmployeeOption {
  readonly dept: string;
  readonly id: string;
  readonly initials: string;
  readonly label: string;
}

export interface SkuOption {
  readonly id: string;
  readonly label: string;
  readonly sku: string;
  readonly stock: number;
}

export interface GroupedVendor {
  readonly items: readonly VendorOption[];
  readonly value: string;
}

export const VENDORS: readonly VendorOption[] = [
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

export const EMPLOYEES: readonly EmployeeOption[] = [
  { id: "emp-1024", label: "Jane Doe", dept: "Finance", initials: "JD" },
  { id: "emp-2048", label: "Alex Brown", dept: "Operations", initials: "AB" },
  { id: "emp-3072", label: "Sam Chen", dept: "HR", initials: "SC" },
  { id: "emp-4096", label: "Maria Kim", dept: "Executive", initials: "MK" },
  { id: "emp-5120", label: "David Park", dept: "Engineering", initials: "DP" },
];

export const COST_CENTERS: readonly LabeledOption[] = [
  { value: "cc-100", label: "100 — Corporate overhead" },
  { value: "cc-210", label: "210 — Manufacturing ops" },
  { value: "cc-320", label: "320 — Sales & marketing" },
  { value: "cc-430", label: "430 — R&D engineering" },
  { value: "cc-540", label: "540 — Facilities management" },
];

export const CURRENCIES: readonly LabeledOption[] = [
  { value: "usd", label: "USD — US Dollar" },
  { value: "eur", label: "EUR — Euro" },
  { value: "gbp", label: "GBP — British Pound" },
  { value: "jpy", label: "JPY — Japanese Yen" },
  { value: "sgd", label: "SGD — Singapore Dollar" },
];

export const COUNTRIES: readonly LabeledOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "gb", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
  { value: "sg", label: "Singapore" },
  { value: "au", label: "Australia" },
];

export const PROJECT_CODES: readonly LabeledOption[] = [
  { value: "prj-erp-rollout", label: "PRJ-2026-01 — ERP rollout phase 2" },
  { value: "prj-facility", label: "PRJ-2025-18 — East campus expansion" },
  { value: "prj-compliance", label: "PRJ-2026-04 — SOX automation" },
  { value: "prj-migration", label: "PRJ-2025-22 — Data center migration" },
];

export const EXPENSE_TAGS = [
  { id: "travel", value: "Travel" },
  { id: "meals", value: "Meals & entertainment" },
  { id: "software", value: "Software subscriptions" },
  { id: "contractors", value: "Contractors" },
  { id: "office", value: "Office supplies" },
] as const;

export const APPROVAL_ROUTES = [
  { id: "dept-head", value: "Department head" },
  { id: "finance", value: "Finance reviewer" },
  { id: "cfo", value: "CFO sign-off" },
  { id: "legal", value: "Legal review" },
] as const;

export const SKUS: readonly SkuOption[] = [
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

export const GROUPED_VENDORS = groupVendorsByRegion(VENDORS);

export const TIMEZONES = Intl.supportedValuesOf("timeZone").map((tz) => ({
  value: tz,
  label: tz.replaceAll("_", " "),
}));

export function objectEquality(a: unknown, b: unknown): boolean {
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

export function labeledEquality(a: LabeledOption, b: LabeledOption): boolean {
  return a.value === b.value;
}

// ─── Story helpers ───────────────────────────────────────────────────────────

export function SingleCombobox<T extends LabeledOption>({
  items,
  id,
  placeholder,
  emptyMessage = "No results found.",
  defaultValue,
  showClear = false,
  disabled,
  state,
}: {
  readonly items: readonly T[];
  readonly id?: string;
  readonly placeholder: string;
  readonly emptyMessage?: string;
  readonly defaultValue?: T | null;
  readonly showClear?: boolean;
  readonly disabled?: boolean;
  readonly state?: GovernedComboboxProps["state"];
}) {
  return (
    <Combobox
      defaultValue={defaultValue ?? null}
      disabled={disabled}
      isItemEqualToValue={labeledEquality}
      items={items}
    >
      <ComboboxInput id={id} placeholder={placeholder} showClear={showClear} />
      <ComboboxContent {...(state === undefined ? {} : { state })}>
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

export function MultiChipCombobox<T extends { id: string; value: string }>({
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

export function GroupedVendorCombobox() {
  return (
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
                    {vendor.label}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
