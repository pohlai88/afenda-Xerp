export interface CommandFilterOption {
  readonly label: string;
  readonly value: string;
}

export interface CommandFilterCheckItem {
  readonly count: number;
  readonly id: string;
  readonly label: string;
}

export const COMMAND_FILTER_CATEGORY_OPTIONS: readonly CommandFilterOption[] = [
  { value: "all", label: "All" },
  { value: "foundation-modules", label: "Foundation modules" },
  { value: "erp-surfaces", label: "ERP surfaces" },
];

export const COMMAND_FILTER_SORT_OPTIONS: readonly CommandFilterOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "most-used", label: "Most used" },
  { value: "recently-updated", label: "Recently updated" },
  { value: "alphabetical", label: "Alphabetical" },
];

export const COMMAND_FILTER_TIME_OPTIONS: readonly CommandFilterOption[] = [
  { value: "all-time", label: "All time" },
  { value: "last-week", label: "Last week" },
  { value: "last-month", label: "Last month" },
  { value: "last-quarter", label: "Last quarter" },
  { value: "last-year", label: "Last year" },
];

export const COMMAND_FILTER_FOUNDATION_MODULES: readonly CommandFilterCheckItem[] =
  [
    { id: "appshell", label: "AppShell authority", count: 12 },
    { id: "execution", label: "Execution spine", count: 8 },
    { id: "metadata-ui", label: "Metadata renderers", count: 14 },
    { id: "permissions", label: "Permission registry", count: 6 },
    { id: "outbox", label: "Outbox foundation", count: 5 },
    { id: "context", label: "Operating context", count: 9 },
    { id: "system-admin", label: "System admin plane", count: 7 },
    { id: "workspace", label: "Workspace dashboard", count: 11 },
  ];

export const COMMAND_FILTER_ERP_SURFACES: readonly CommandFilterCheckItem[] = [
  { id: "procurement", label: "Procurement", count: 24 },
  { id: "inventory", label: "Inventory", count: 18 },
  { id: "finance", label: "Finance (pre-core)", count: 16 },
  { id: "hr", label: "Human resources", count: 10 },
  { id: "projects", label: "Projects", count: 13 },
];

export const COMMAND_FILTER_DIALOG_TITLE = "Search and filter modules";
export const COMMAND_FILTER_DIALOG_DESCRIPTION =
  "Filter foundation modules and ERP surfaces by category, sort order, and time range.";
