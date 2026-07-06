import {
  Button,
  type DataTableSurfaceColumn,
  type DataTableSurfaceRow,
  type FormSurfaceField,
  Input,
  type SettingsSurfaceSection,
  Switch,
} from "@afenda/shadcn-studio-v2";

export const v2SampleTableColumns = [
  { id: "name", header: "Name" },
  { id: "role", header: "Role", align: "center" as const },
  { id: "status", header: "Status", align: "end" as const },
] satisfies readonly DataTableSurfaceColumn[];

export const v2SampleTableRows = [
  {
    id: "row-1",
    cells: {
      name: "Alex Chen",
      role: "Operator",
      status: "Active",
    },
  },
  {
    id: "row-2",
    cells: {
      name: "Jordan Lee",
      role: "Reviewer",
      status: "Pending",
    },
  },
] satisfies readonly DataTableSurfaceRow[];

export const v2SampleFormFields = [
  {
    id: "display-name",
    label: "Display name",
    control: <Input defaultValue="Afenda Operator" id="display-name" />,
    description: "Shown on workspace surfaces.",
  },
  {
    id: "email",
    label: "Email",
    control: (
      <Input defaultValue="operator@afenda.test" id="email" type="email" />
    ),
    required: true,
  },
] satisfies readonly FormSurfaceField[];

export const v2SampleSettingsSections = [
  {
    id: "appearance",
    title: "Appearance",
    description: "Theme and density preferences.",
    items: [
      {
        id: "dark-mode",
        label: "Dark mode",
        description: "Use dark color mode for operator surfaces.",
        control: <Switch aria-label="Dark mode" defaultChecked />,
      },
      {
        id: "compact-density",
        label: "Compact density",
        description: "Reduce vertical spacing in tables and forms.",
        control: <Switch aria-label="Compact density" />,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    items: [
      {
        id: "approval-alerts",
        label: "Approval alerts",
        description: "Notify when approvals require action.",
        control: <Switch aria-label="Approval alerts" defaultChecked />,
      },
    ],
  },
] satisfies readonly SettingsSurfaceSection[];

export const v2SampleFormActions = (
  <>
    <Button type="button">Save changes</Button>
    <Button type="button" variant="outline">
      Cancel
    </Button>
  </>
);

export const v2SampleAuthActions = (
  <>
    <Button type="button">Sign in</Button>
    <Button type="button" variant="outline">
      Use SSO
    </Button>
  </>
);

export const v2SamplePageContent = (
  <p className="text-muted-foreground text-sm">
    Operator workspace content renders inside PageSurface when state is ready.
  </p>
);

export const v2SamplePageToolbar = (
  <Button size="sm" type="button" variant="outline">
    Export
  </Button>
);
