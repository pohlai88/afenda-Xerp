import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Button } from "./button";
import { Kbd, KbdGroup } from "./kbd";

// ─── Helpers ───────────────────────────────────────────────────────────────

function ShortcutCombo({ keys }: { readonly keys: readonly string[] }) {
  return (
    <KbdGroup>
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </KbdGroup>
  );
}

function ShortcutRow({
  action,
  keys,
}: {
  readonly action: string;
  readonly keys: readonly string[];
}) {
  return (
    <StoryRow justify="between" paddingX="lg" paddingY="sm">
      <span className="text-sm">{action}</span>
      <ShortcutCombo keys={keys} />
    </StoryRow>
  );
}

function ShortcutSection({
  section,
  shortcuts,
}: {
  readonly section: string;
  readonly shortcuts: ReadonlyArray<{
    readonly action: string;
    readonly keys: readonly string[];
  }>;
}) {
  return (
    <StoryStack>
      <StoryStack className="bg-muted/20" paddingX="lg" paddingY="sm">
        <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
          {section}
        </span>
      </StoryStack>
      {shortcuts.map(({ action, keys }) => (
        <ShortcutRow action={action} key={action} keys={keys} />
      ))}
    </StoryStack>
  );
}

function ShortcutPanel({
  title,
  sections,
}: {
  readonly title: string;
  readonly sections: ReadonlyArray<{
    readonly section: string;
    readonly shortcuts: ReadonlyArray<{
      readonly action: string;
      readonly keys: readonly string[];
    }>;
  }>;
}) {
  return (
    <StoryFrame width="lg">
      <div className="overflow-hidden rounded-md border border-border">
        <StoryStack
          className="border-border border-b bg-muted/30"
          paddingX="lg"
          paddingY="md"
        >
          <h3 className="font-semibold text-sm">{title}</h3>
        </StoryStack>
        <div className="divide-y divide-border">
          {sections.map(({ section, shortcuts }) => (
            <ShortcutSection
              key={section}
              section={section}
              shortcuts={shortcuts}
            />
          ))}
        </div>
      </div>
    </StoryFrame>
  );
}

function InlineShortcutHint({
  label,
  keys,
}: {
  readonly label: string;
  readonly keys: readonly string[];
}) {
  return (
    <StoryRow
      className="rounded-md border border-border"
      justify="between"
      paddingX="md"
      paddingY="sm"
    >
      <span className="text-sm">{label}</span>
      <ShortcutCombo keys={keys} />
    </StoryRow>
  );
}

// ─── Kbd ───────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed keyboard key display for ERP shortcut hints, command palettes, menu items, and contextual help. Compose combos with `KbdGroup`. Pair with `CommandShortcut` in command menus where appropriate.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <Kbd>⌘</Kbd>,
};

export const SingleKeys: Story = {
  name: "Kbd — Single Keys",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm" wrap>
      {[
        "⌘",
        "Ctrl",
        "⇧",
        "Shift",
        "⌥",
        "Alt",
        "⌃",
        "⌫",
        "Del",
        "⏎",
        "Enter",
        "⎋",
        "Esc",
        "Tab",
        "↑",
        "↓",
        "←",
        "→",
        "Space",
      ].map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </StoryRow>
  ),
};

export const KeyGroups: Story = {
  name: "Kbd — Key Combos",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      {[
        { keys: ["⌘", "S"], description: "Save" },
        { keys: ["⌘", "⇧", "S"], description: "Save all" },
        { keys: ["⌘", "Z"], description: "Undo" },
        { keys: ["⌘", "⇧", "Z"], description: "Redo" },
        { keys: ["⌘", "F"], description: "Find" },
        { keys: ["⌘", "K"], description: "Command palette" },
      ].map(({ keys, description }) => (
        <StoryRow align="center" gap="md" key={description}>
          <ShortcutCombo keys={keys} />
          <span className="text-muted-foreground text-sm">{description}</span>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

export const WindowsCombos: Story = {
  name: "Kbd — Windows Combos",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      {[
        { keys: ["Ctrl", "S"], description: "Save record" },
        { keys: ["Ctrl", "Shift", "N"], description: "New purchase order" },
        { keys: ["Ctrl", "F"], description: "Find in module" },
        { keys: ["Ctrl", "K"], description: "Open command palette" },
      ].map(({ keys, description }) => (
        <StoryRow align="center" gap="md" key={description}>
          <ShortcutCombo keys={keys} />
          <span className="text-muted-foreground text-sm">{description}</span>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};

// ─── Governance ────────────────────────────────────────────────────────────

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="sm">
          <span className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </span>
          <StoryRow align="center" gap="sm">
            <Kbd state={state}>⌘</Kbd>
            <Kbd state={state}>K</Kbd>
          </StoryRow>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` on `Kbd` — governed values (`data-slot="kbd"`, `data-component="Kbd"`, `data-recipe="form-control"`) must win in the DOM.',
      },
    },
  },
  render: () => (
    <Kbd
      data-component="Override"
      data-slot="override"
      data-testid="governance-kbd"
    >
      K
    </Kbd>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      <p className="font-mono text-muted-foreground text-xs">
        root → kbd · group → kbd-group
      </p>
      <KbdGroup data-testid="slot-map-group">
        <Kbd data-testid="slot-map-kbd">⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </StoryStack>
  ),
};

export const GovernancePlayground: Story = {
  name: "Governance — Playground",
  parameters: { layout: "padded" },
  argTypes: {
    state: { control: "select", options: [...GOVERNED_STATES] },
  },
  args: {
    state: "ready",
  },
  render: ({ state }) => (
    <StoryRow align="center" gap="sm">
      <Kbd state={state}>⌘</Kbd>
      <Kbd state={state}>⇧</Kbd>
      <Kbd state={state}>K</Kbd>
    </StoryRow>
  ),
};

export const DisabledShortcut: Story = {
  name: "State — Disabled Context",
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">Post journal entry</span>
      <KbdGroup>
        <Kbd state="forbidden">⌘</Kbd>
        <Kbd state="forbidden">⏎</Kbd>
      </KbdGroup>
    </StoryRow>
  ),
};

// ─── ERP shortcut panels ───────────────────────────────────────────────────

export const ErpShortcutPanel: Story = {
  name: "ERP — Keyboard Shortcuts Panel",
  parameters: { layout: "padded" },
  render: () => (
    <ShortcutPanel
      sections={[
        {
          section: "Navigation",
          shortcuts: [
            { keys: ["⌘", "K"], action: "Open command palette" },
            { keys: ["⌘", "B"], action: "Toggle sidebar" },
            { keys: ["⌘", "⇧", "F"], action: "Global search" },
            { keys: ["G", "H"], action: "Go to home" },
          ],
        },
        {
          section: "Records",
          shortcuts: [
            { keys: ["⌘", "N"], action: "New record" },
            { keys: ["⌘", "S"], action: "Save record" },
            { keys: ["⌘", "E"], action: "Edit record" },
            { keys: ["⌘", "⌫"], action: "Delete record" },
          ],
        },
        {
          section: "Table",
          shortcuts: [
            { keys: ["J"], action: "Next row" },
            { keys: ["K"], action: "Previous row" },
            { keys: ["Space"], action: "Select row" },
            { keys: ["⇧", "A"], action: "Select all" },
          ],
        },
      ]}
      title="Keyboard Shortcuts"
    />
  ),
};

export const FinanceModuleShortcuts: Story = {
  name: "ERP — Finance Module Shortcuts",
  parameters: { layout: "padded" },
  render: () => (
    <ShortcutPanel
      sections={[
        {
          section: "General ledger",
          shortcuts: [
            { keys: ["⌘", "⇧", "J"], action: "New journal entry" },
            { keys: ["⌘", "P"], action: "Post entry" },
            { keys: ["⌘", "R"], action: "Reverse entry" },
            { keys: ["⌘", "⇧", "T"], action: "Open trial balance" },
          ],
        },
        {
          section: "Accounts payable",
          shortcuts: [
            { keys: ["⌘", "⇧", "I"], action: "New invoice" },
            { keys: ["⌘", "⇧", "B"], action: "Create payment batch" },
            { keys: ["⌘", "⇧", "A"], action: "Approve selected" },
          ],
        },
      ]}
      title="Finance — Keyboard Shortcuts"
    />
  ),
};

export const ProcurementShortcuts: Story = {
  name: "ERP — Procurement Shortcuts",
  parameters: { layout: "padded" },
  render: () => (
    <ShortcutPanel
      sections={[
        {
          section: "Purchase orders",
          shortcuts: [
            { keys: ["⌘", "⇧", "P"], action: "New purchase order" },
            { keys: ["⌘", "⇧", "R"], action: "Receive goods" },
            { keys: ["⌘", "⇧", "V"], action: "Register vendor" },
          ],
        },
        {
          section: "Requisitions",
          shortcuts: [
            { keys: ["⌘", "⇧", "Q"], action: "New requisition" },
            { keys: ["⌘", "⇧", "C"], action: "Convert to PO" },
          ],
        },
      ]}
      title="Procurement — Keyboard Shortcuts"
    />
  ),
};

export const InventoryShortcuts: Story = {
  name: "ERP — Inventory Shortcuts",
  parameters: { layout: "padded" },
  render: () => (
    <ShortcutPanel
      sections={[
        {
          section: "Stock",
          shortcuts: [
            { keys: ["⌘", "⇧", "A"], action: "Stock adjustment" },
            { keys: ["⌘", "⇧", "L"], action: "Cycle count" },
            { keys: ["⌘", "⇧", "T"], action: "Transfer stock" },
          ],
        },
        {
          section: "Lookup",
          shortcuts: [
            { keys: ["⌘", "⇧", "S"], action: "Scan SKU barcode" },
            { keys: ["⌘", "F"], action: "Filter warehouse" },
          ],
        },
      ]}
      title="Inventory — Keyboard Shortcuts"
    />
  ),
};

export const ApprovalWorkflowShortcuts: Story = {
  name: "ERP — Approval Workflow",
  parameters: { layout: "padded" },
  render: () => (
    <ShortcutPanel
      sections={[
        {
          section: "Inbox actions",
          shortcuts: [
            { keys: ["A"], action: "Approve selected" },
            { keys: ["R"], action: "Reject with comment" },
            { keys: ["D"], action: "Delegate approval" },
            { keys: ["⌘", "⏎"], action: "Submit decision" },
          ],
        },
      ]}
      title="Approvals — Keyboard Shortcuts"
    />
  ),
};

// ─── ERP in-context hints ──────────────────────────────────────────────────

export const InContextHelp: Story = {
  name: "ERP — Shortcut in Context",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <InlineShortcutHint keys={["⌘", "S"]} label="Save changes" />
        <InlineShortcutHint keys={["⌘", "N"]} label="New record" />
        <InlineShortcutHint keys={["⌘", "K"]} label="Command palette" />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ButtonWithShortcut: Story = {
  name: "ERP — Button with Shortcut",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md">
      <Button emphasis="solid" intent="primary" size="sm">
        Save invoice
      </Button>
      <ShortcutCombo keys={["⌘", "S"]} />
    </StoryRow>
  ),
};

export const MenuItemShortcut: Story = {
  name: "ERP — Menu Item Shortcut",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack
        className="rounded-md border border-border"
        gap="xs"
        paddingY="xs"
      >
        {[
          { label: "New purchase order", keys: ["⌘", "⇧", "P"] },
          { label: "New invoice", keys: ["⌘", "⇧", "I"] },
          { label: "Global search", keys: ["⌘", "⇧", "F"] },
        ].map(({ label, keys }) => (
          <StoryRow justify="between" key={label} paddingX="md" paddingY="sm">
            <span className="text-sm">{label}</span>
            <ShortcutCombo keys={keys} />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const CommandPaletteFooter: Story = {
  name: "ERP — Command Palette Footer",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow
        className="rounded-md border border-border bg-muted/30"
        gap="md"
        justify="between"
        paddingX="md"
        paddingY="sm"
        wrap
      >
        <StoryRow align="center" gap="sm" wrap>
          <StoryRow align="center" gap="xs">
            <span className="text-muted-foreground text-xs">Navigate</span>
            <ShortcutCombo keys={["↑", "↓"]} />
          </StoryRow>
          <StoryRow align="center" gap="xs">
            <span className="text-muted-foreground text-xs">Open</span>
            <Kbd>⏎</Kbd>
          </StoryRow>
          <StoryRow align="center" gap="xs">
            <span className="text-muted-foreground text-xs">Close</span>
            <Kbd>Esc</Kbd>
          </StoryRow>
        </StoryRow>
        <StoryRow align="center" gap="xs">
          <span className="text-muted-foreground text-xs">Command palette</span>
          <ShortcutCombo keys={["⌘", "K"]} />
        </StoryRow>
      </StoryRow>
    </StoryFrame>
  ),
};

export const TableNavigationHints: Story = {
  name: "ERP — Table Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <span className="text-muted-foreground text-sm">Move selection</span>
          <ShortcutCombo keys={["J", "K"]} />
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <span className="text-muted-foreground text-sm">Toggle row</span>
          <Kbd>Space</Kbd>
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <span className="text-muted-foreground text-sm">Select all</span>
          <ShortcutCombo keys={["⇧", "A"]} />
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <span className="text-muted-foreground text-sm">Open record</span>
          <Kbd>⏎</Kbd>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SearchShortcutHint: Story = {
  name: "ERP — Search Shortcut",
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">
        Press to search invoices, vendors, and employees
      </span>
      <ShortcutCombo keys={["⌘", "⇧", "F"]} />
    </StoryRow>
  ),
};

export const ExportShortcutHint: Story = {
  name: "ERP — Export Shortcut",
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">Export current list</span>
      <ShortcutCombo keys={["⌘", "⇧", "E"]} />
    </StoryRow>
  ),
};

export const FilterShortcutHint: Story = {
  name: "ERP — Filter Shortcut",
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">Open filter panel</span>
      <ShortcutCombo keys={["⌘", "⇧", "L"]} />
    </StoryRow>
  ),
};

export const FormSubmitShortcut: Story = {
  name: "ERP — Form Submit",
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">Submit for approval</span>
      <ShortcutCombo keys={["⌘", "⏎"]} />
    </StoryRow>
  ),
};

export const JournalEntryShortcuts: Story = {
  name: "ERP — Journal Entry Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <InlineShortcutHint keys={["⌘", "⇧", "J"]} label="New journal line" />
        <InlineShortcutHint keys={["⌘", "P"]} label="Post entry" />
        <InlineShortcutHint keys={["⌘", "R"]} label="Reverse entry" />
        <InlineShortcutHint keys={["⌘", "Z"]} label="Undo last edit" />
      </StoryStack>
    </StoryFrame>
  ),
};

export const RecordActionHints: Story = {
  name: "ERP — Record Action Bar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow
        className="rounded-md border border-border bg-muted/20"
        gap="lg"
        paddingX="md"
        paddingY="sm"
        wrap
      >
        {[
          { label: "Edit", keys: ["⌘", "E"] },
          { label: "Duplicate", keys: ["⌘", "D"] },
          { label: "Archive", keys: ["⌘", "⇧", "A"] },
          { label: "Delete", keys: ["⌘", "⌫"] },
        ].map(({ label, keys }) => (
          <StoryRow align="center" gap="xs" key={label}>
            <span className="text-muted-foreground text-xs">{label}</span>
            <ShortcutCombo keys={keys} />
          </StoryRow>
        ))}
      </StoryRow>
    </StoryFrame>
  ),
};

export const HelpLegend: Story = {
  name: "ERP — Help Dialog Legend",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <span className="font-semibold text-sm">Modifier keys</span>
        <StoryRow align="center" gap="lg" wrap>
          <StoryRow align="center" gap="xs">
            <Kbd>⌘</Kbd>
            <span className="text-muted-foreground text-xs">Command</span>
          </StoryRow>
          <StoryRow align="center" gap="xs">
            <Kbd>⇧</Kbd>
            <span className="text-muted-foreground text-xs">Shift</span>
          </StoryRow>
          <StoryRow align="center" gap="xs">
            <Kbd>⌥</Kbd>
            <span className="text-muted-foreground text-xs">Option</span>
          </StoryRow>
          <StoryRow align="center" gap="xs">
            <Kbd>⌃</Kbd>
            <span className="text-muted-foreground text-xs">Control</span>
          </StoryRow>
        </StoryRow>
        <span className="text-muted-foreground text-xs">
          On Windows, ⌘ maps to Ctrl and ⌥ maps to Alt in shortcut labels.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          'Shortcut hints are visual only — expose the same actions via menus, buttons, and command palette. Use readable key labels; avoid relying on color alone for disabled shortcuts (`state="forbidden"`).',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <Button
            aria-keyshortcuts="Meta+S"
            emphasis="solid"
            intent="primary"
            size="sm"
          >
            Save record
          </Button>
          <ShortcutCombo keys={["⌘", "S"]} />
        </StoryRow>
        <span className="text-muted-foreground text-xs">
          Primary action exposes `aria-keyshortcuts` on the button; `Kbd`
          provides the visible hint for sighted users.
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};
