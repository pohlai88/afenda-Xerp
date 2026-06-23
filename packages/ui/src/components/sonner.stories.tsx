import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import {
  simulateCsvExport,
  simulateLedgerPost,
  TOAST_TYPE_TRIGGERS,
  ToastTriggerButton,
  ToastTriggerRow,
} from "./_storybook/sonner-story.compositions";
import type { ToasterProps } from "./sonner";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { governedStateOnly, type RenderStory } from "./_storybook/story-types";
import { Toaster } from "./sonner";
import { GOVERNED_STATES } from "@afenda/ui/governance";

const meta = {
  title: "Primitives/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Sonner toaster for transient ERP feedback — save confirmations, import progress, approval outcomes, and sync errors. Mount once at app root. Use `toast()` for ephemeral messages; use `Alert` for persistent inline notices; use `Dialog` for blocking decisions.",
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals["theme"] === "dark" ? "dark" : "light";
      const toaster = (context.parameters["toaster"] ?? {}) as {
        readonly closeButton?: boolean;
        readonly disable?: boolean;
        readonly expand?: boolean;
        readonly position?:
          | "top-left"
          | "top-right"
          | "bottom-left"
          | "bottom-right"
          | "top-center"
          | "bottom-center";
      };
      const toasterProps = (context.parameters["toasterProps"] ??
        {}) as ToasterProps;

      if (toaster.disable) {
        return <Story />;
      }

      return (
        <ThemeProvider attribute="class" forcedTheme={theme}>
          <div className="bg-background text-foreground">
            <Story />
            <Toaster
              {...toasterProps}
              {...(toaster.closeButton
                ? { closeButton: toaster.closeButton }
                : {})}
              {...(toaster.expand ? { expand: toaster.expand } : {})}
              {...(toaster.position ? { position: toaster.position } : {})}
            />
          </div>
        </ThemeProvider>
      );
    },
  ],
} satisfies Meta;

export default meta;
type Story = RenderStory<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ToastTriggerButton
      label="Show toast"
      onClick={() => toast("Settings saved")}
    />
  ),
};

export const Success: Story = {
  name: "Toast — Success",
  render: () => (
    <ToastTriggerButton
      label="Record saved"
      onClick={() => toast.success("Customer record updated")}
    />
  ),
};

export const ToastError: Story = {
  name: "Toast — Error",
  render: () => (
    <ToastTriggerButton
      label="Show error"
      onClick={() => toast.error("Payment gateway unreachable")}
    />
  ),
};

export const Warning: Story = {
  name: "Toast — Warning",
  render: () => (
    <ToastTriggerButton
      label="Show warning"
      onClick={() => toast.warning("3 duplicate rows skipped during import")}
    />
  ),
};

export const Info: Story = {
  name: "Toast — Info",
  render: () => (
    <ToastTriggerButton
      label="Show info"
      onClick={() => toast.info("Maintenance window starts at 02:00 UTC")}
    />
  ),
};

export const Loading: Story = {
  name: "Toast — Loading",
  render: () => (
    <ToastTriggerButton
      label="Show loading"
      onClick={() => {
        const id = toast.loading("Syncing bank transactions…");
        window.setTimeout(() => {
          toast.success("142 transactions imported", { id });
        }, 2500);
      }}
    />
  ),
};

export const WithDescription: Story = {
  name: "Toast — With Description",
  render: () => (
    <ToastTriggerButton
      label="Approval submitted"
      onClick={() =>
        toast.success("Expense report submitted", {
          description: "EXP-2026-0412 routed to Finance queue",
        })
      }
    />
  ),
};

export const WithAction: Story = {
  name: "Toast — With Action",
  render: () => (
    <ToastTriggerButton
      label="PO approved"
      onClick={() =>
        toast("Purchase order approved", {
          action: {
            label: "View PO",
            onClick: () => toast.info("Opening PO-8842…"),
          },
        })
      }
    />
  ),
};

export const WithActionAndDescription: Story = {
  name: "Toast — Action + Description",
  render: () => (
    <ToastTriggerButton
      label="Payment failed"
      onClick={() =>
        toast.error("Card charge declined", {
          description: "INV-2026-0031 — insufficient funds",
          action: {
            label: "Retry",
            onClick: () => toast.loading("Retrying payment…"),
          },
        })
      }
    />
  ),
};

export const PromiseToast: Story = {
  name: "Toast — Promise",
  render: () => (
    <ToastTriggerButton
      label="Post journal entry"
      onClick={() =>
        toast.promise(simulateLedgerPost(), {
          loading: "Posting journal entry…",
          success: (data) => `${data.entryId} posted successfully`,
          error: "Posting failed — fiscal period is locked",
        })
      }
    />
  ),
};

export const DismissAll: Story = {
  name: "Toast — Dismiss All",
  render: () => (
    <StoryStack gap="sm">
      <ToastTriggerRow
        triggers={[
          {
            id: "spawn",
            label: "Spawn 3 toasts",
            onClick: () => {
              toast.info("Sync started");
              toast.success("Invoice INV-1001 emailed");
              toast.warning("2 records need review");
            },
          },
          {
            id: "dismiss",
            label: "Dismiss all",
            onClick: () => toast.dismiss(),
          },
        ]}
      />
    </StoryStack>
  ),
};

export const CloseButton: Story = {
  name: "Toaster — Close Button",
  parameters: { toaster: { closeButton: true } },
  render: () => (
    <ToastTriggerButton
      label="Show closable toast"
      onClick={() =>
        toast("Draft auto-saved", {
          description: "Last saved 30 seconds ago",
        })
      }
    />
  ),
};

export const ExpandedStack: Story = {
  name: "Toaster — Expanded Stack",
  parameters: { toaster: { expand: true } },
  render: () => (
    <ToastTriggerButton
      label="Show notification batch"
      onClick={() => {
        toast.success("Payroll run complete");
        toast.info("3 approvals pending");
        toast.warning("Bank feed delayed 12 minutes");
      }}
    />
  ),
};

export const MatrixAllTypes: Story = {
  name: "Governance — Toast Types",
  parameters: { layout: "padded" },
  render: () => <ToastTriggerRow triggers={TOAST_TYPE_TRIGGERS} />,
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    toasterProps: {
      "data-component": "Override",
      "data-recipe": "override",
      "data-slot": "override",
      "data-state": "fake",
      state: "ready",
    } as ToasterProps,
    docs: {
      description: {
        story:
          "Consumer `data-*` props cannot override governed Toaster root attributes.",
      },
    },
  },
  render: () => (
    <ToastTriggerButton
      label="Show governed toast"
      onClick={() => toast.success("Payment recorded")}
    />
  ),
};

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded", toaster: { disable: true } },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="md">
          <ThemeProvider attribute="class" forcedTheme="light">
            <StoryRow align="start" gap="md">
              <StoryCaption width="sm">{state}</StoryCaption>
              <StoryStack className="min-w-0 flex-1" gap="sm">
                <ToastTriggerButton
                  label={`Trigger (${state})`}
                  onClick={() => toast.info(`Toast while state=${state}`)}
                />
                <Toaster state={state} />
              </StoryStack>
            </StoryRow>
          </ThemeProvider>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Root role emits `data-slot="toaster"`. Icon slots emit `toaster-{severity}-icon` via governed slot keys.',
      },
    },
  },
  render: () => (
    <StoryStack gap="sm">
      <p className="font-mono text-muted-foreground text-xs">
        root → toaster · success → toaster-success-icon · info →
        toaster-info-icon · warning → toaster-warning-icon · error →
        toaster-error-icon · loading → toaster-loading-icon
      </p>
      <ToastTriggerRow triggers={TOAST_TYPE_TRIGGERS} />
    </StoryStack>
  ),
};

export const GovernancePlayground: Story = {
  name: "Governance — Playground",
  parameters: { layout: "padded", toaster: { disable: true } },
  argTypes: {
    state: { control: "select", options: [...GOVERNED_STATES] },
  },
  args: {
    state: "ready",
  },
  render: (args) => (
    <StoryFrame width="md">
      <ThemeProvider attribute="class" forcedTheme="light">
        <StoryStack gap="sm">
          <ToastTriggerButton
            label={`Show toast (state=${args.state})`}
            onClick={() => toast.info(`Governed state=${args.state}`)}
          />
          <Toaster {...governedStateOnly(args)} />
        </StoryStack>
      </ThemeProvider>
    </StoryFrame>
  ),
};

export const PositionVariants: Story = {
  name: "Matrix — Positions",
  parameters: { layout: "padded" },
  render: () => (
    <ToastTriggerRow
      triggers={[
        {
          id: "tr",
          label: "Top right",
          onClick: () => toast.info("Top right", { position: "top-right" }),
        },
        {
          id: "tc",
          label: "Top center",
          onClick: () => toast.info("Top center", { position: "top-center" }),
        },
        {
          id: "br",
          label: "Bottom right",
          onClick: () =>
            toast.info("Bottom right", { position: "bottom-right" }),
        },
        {
          id: "bc",
          label: "Bottom center",
          onClick: () =>
            toast.info("Bottom center", { position: "bottom-center" }),
        },
      ]}
    />
  ),
};

// ─── ERP single-action patterns ────────────────────────────────────────────

export const RecordSaved: Story = {
  name: "ERP — Record Saved",
  render: () => (
    <ToastTriggerButton
      label="Save customer"
      onClick={() =>
        toast.success("Customer saved", {
          description: "Northwind Traders — account CUS-1048",
          action: {
            label: "View record",
            onClick: () => toast.info("Opening CUS-1048…"),
          },
        })
      }
    />
  ),
};

export const PaymentFailed: Story = {
  name: "ERP — Payment Failed",
  render: () => (
    <ToastTriggerButton
      label="Charge card"
      onClick={() =>
        toast.error("Payment declined", {
          description: "Stripe error: card_declined — INV-2026-0031",
          action: {
            label: "Update card",
            onClick: () => toast.info("Opening payment method form…"),
          },
        })
      }
    />
  ),
};

export const ImportInProgress: Story = {
  name: "ERP — Import In Progress",
  render: () => (
    <ToastTriggerButton
      label="Import employees"
      onClick={() =>
        toast.promise(simulateCsvExport(), {
          loading: "Importing employee CSV…",
          success: (data) => `${data.rows} records imported`,
          error: "Import failed — invalid column mapping",
        })
      }
    />
  ),
};

export const ApprovalSubmitted: Story = {
  name: "ERP — Approval Submitted",
  render: () => (
    <ToastTriggerButton
      label="Submit for approval"
      onClick={() =>
        toast.success("Submitted for approval", {
          description: "PO-8842 — $12,450.00 routed to Dana Scully",
        })
      }
    />
  ),
};

export const SyncConflict: Story = {
  name: "ERP — Sync Conflict",
  render: () => (
    <ToastTriggerButton
      label="Simulate conflict"
      onClick={() =>
        toast.warning("Sync conflict detected", {
          description: "SKU-4421 quantity differs between WMS and ledger",
          action: {
            label: "Resolve",
            onClick: () => toast.info("Opening reconciliation view…"),
          },
        })
      }
    />
  ),
};

export const SessionExpiring: Story = {
  name: "ERP — Session Expiring",
  render: () => (
    <ToastTriggerButton
      label="Warn session"
      onClick={() =>
        toast.warning("Session expiring soon", {
          description: "You will be signed out in 5 minutes due to inactivity",
          duration: 10_000,
        })
      }
    />
  ),
};

export const ExportComplete: Story = {
  name: "ERP — Export Complete",
  render: () => (
    <ToastTriggerButton
      label="Export GL trial balance"
      onClick={() =>
        toast.success("Export ready", {
          description: "trial_balance_fy2026_q2.xlsx — 4.2 MB",
          action: {
            label: "Download",
            onClick: () => toast.info("Download started…"),
          },
        })
      }
    />
  ),
};

export const PermissionDenied: Story = {
  name: "ERP — Permission Denied",
  render: () => (
    <ToastTriggerButton
      label="Post without role"
      onClick={() =>
        toast.error("Permission denied", {
          description: "Posting journal entries requires Finance Admin role",
        })
      }
    />
  ),
};

export const AutoSaveFailed: Story = {
  name: "ERP — Auto-Save Failed",
  render: () => (
    <ToastTriggerButton
      label="Simulate auto-save error"
      onClick={() =>
        toast.error("Auto-save failed", {
          description: "Draft invoice could not sync — check your connection",
          action: {
            label: "Retry",
            onClick: () => toast.loading("Retrying save…"),
          },
        })
      }
    />
  ),
};

export const DuplicateSkipped: Story = {
  name: "ERP — Duplicate Skipped",
  render: () => (
    <ToastTriggerButton
      label="Import with duplicates"
      onClick={() =>
        toast.warning("3 duplicates skipped", {
          description:
            "Employee IDs already exist — see import log for details",
        })
      }
    />
  ),
};

export const InvoiceEmailed: Story = {
  name: "ERP — Invoice Emailed",
  render: () => (
    <ToastTriggerButton
      label="Email invoice"
      onClick={() =>
        toast.success("Invoice emailed", {
          description: "INV-2026-0044 sent to accounts@acme.example",
        })
      }
    />
  ),
};

export const BankFeedDelayed: Story = {
  name: "ERP — Bank Feed Delayed",
  render: () => (
    <ToastTriggerButton
      label="Simulate feed delay"
      onClick={() =>
        toast.info("Bank feed delayed", {
          description: "Chase Business — last sync 12 minutes ago",
        })
      }
    />
  ),
};

// ─── ERP composite patterns ──────────────────────────────────────────────────

export const OperationFeedbackPanel: Story = {
  name: "ERP — Operation Feedback Panel",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      <span className="font-medium text-sm">Common ERP operations</span>
      <ToastTriggerRow
        triggers={[
          {
            id: "save",
            label: "Save",
            onClick: () => toast.success("Changes saved"),
          },
          {
            id: "submit",
            label: "Submit",
            onClick: () => toast.success("Submitted for approval"),
          },
          {
            id: "delete",
            label: "Delete",
            onClick: () => toast.error("Cannot delete — record has dependents"),
          },
          {
            id: "export",
            label: "Export",
            onClick: () =>
              toast.promise(simulateCsvExport(), {
                loading: "Preparing export…",
                success: (data) => `Export ready — ${data.rows} rows`,
                error: "Export failed",
              }),
          },
          {
            id: "sync",
            label: "Sync",
            onClick: () => {
              const id = toast.loading("Syncing with external ERP…");
              window.setTimeout(() => {
                toast.success("Sync complete", { id });
              }, 2000);
            },
          },
        ]}
      />
    </StoryStack>
  ),
};

export const ApprovalWorkflowToasts: Story = {
  name: "ERP — Approval Workflow",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      <span className="font-medium text-sm">Approval workflow events</span>
      <ToastTriggerRow
        triggers={[
          {
            id: "submitted",
            label: "Submitted",
            onClick: () =>
              toast.success("Expense submitted", {
                description: "EXP-0412 — $342.18",
              }),
          },
          {
            id: "approved",
            label: "Approved",
            onClick: () =>
              toast.success("Expense approved", {
                description: "Posted to GL account 6200",
              }),
          },
          {
            id: "rejected",
            label: "Rejected",
            onClick: () =>
              toast.error("Expense rejected", {
                description: "Missing receipt attachment",
                action: {
                  label: "Edit",
                  onClick: () => toast.info("Opening expense form…"),
                },
              }),
          },
          {
            id: "escalated",
            label: "Escalated",
            onClick: () =>
              toast.warning("Escalated to CFO", {
                description: "Amount exceeds $5,000 threshold",
              }),
          },
        ]}
      />
    </StoryStack>
  ),
};

export const DataImportToasts: Story = {
  name: "ERP — Data Import",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      <span className="font-medium text-sm">Import pipeline feedback</span>
      <ToastTriggerRow
        triggers={[
          {
            id: "validating",
            label: "Validating",
            onClick: () => toast.loading("Validating CSV structure…"),
          },
          {
            id: "partial",
            label: "Partial success",
            onClick: () =>
              toast.warning("Import partially complete", {
                description: "245 of 248 rows imported — 3 validation errors",
                action: {
                  label: "View log",
                  onClick: () => toast.info("Opening import log…"),
                },
              }),
          },
          {
            id: "complete",
            label: "Complete",
            onClick: () =>
              toast.success("Import complete", {
                description: "248 employee records synced",
              }),
          },
          {
            id: "failed",
            label: "Failed",
            onClick: () =>
              toast.error("Import failed", {
                description: "Required column EMPLOYEE_ID missing",
              }),
          },
        ]}
      />
    </StoryStack>
  ),
};

export const FinanceModuleToasts: Story = {
  name: "ERP — Finance Module",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      <span className="font-medium text-sm">Finance operations</span>
      <ToastTriggerRow
        triggers={[
          {
            id: "journal",
            label: "Post journal",
            onClick: () =>
              toast.promise(simulateLedgerPost(), {
                loading: "Posting journal entry…",
                success: (data) => `${data.entryId} posted`,
                error: "Period locked — cannot post",
              }),
          },
          {
            id: "reconcile",
            label: "Reconcile",
            onClick: () =>
              toast.success("Bank reconciliation saved", {
                description: "Chase Business — Jun 2026 statement",
              }),
          },
          {
            id: "period",
            label: "Close period",
            onClick: () =>
              toast.warning("Period close blocked", {
                description: "4 unposted journal entries remain in May 2026",
              }),
          },
          {
            id: "payment",
            label: "Record payment",
            onClick: () =>
              toast.success("Payment recorded", {
                description: "$4,850.00 applied to INV-2026-0031",
              }),
          },
        ]}
      />
    </StoryStack>
  ),
};

export const WarehouseToasts: Story = {
  name: "ERP — Warehouse Operations",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      <span className="font-medium text-sm">Warehouse floor feedback</span>
      <ToastTriggerRow
        triggers={[
          {
            id: "pick",
            label: "Pick confirmed",
            onClick: () =>
              toast.success("Pick list confirmed", {
                description: "PL-9921 — 12 lines picked",
              }),
          },
          {
            id: "short",
            label: "Short pick",
            onClick: () =>
              toast.warning("Short pick recorded", {
                description: "SKU-8842 — 3 of 10 units available",
              }),
          },
          {
            id: "ship",
            label: "Ship confirm",
            onClick: () =>
              toast.success("Shipment confirmed", {
                description: "SO-7712 — tracking 1Z999AA10123456784",
              }),
          },
          {
            id: "adjust",
            label: "Adjustment blocked",
            onClick: () =>
              toast.error("Adjustment blocked", {
                description: "Negative stock not allowed for SKU-4421",
              }),
          },
        ]}
      />
    </StoryStack>
  ),
};

// ─── Guidance ──────────────────────────────────────────────────────────────

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Toasts are announced via live regions. Pair messages with severity icons (not color alone). Keep titles concise; put record IDs and amounts in `description`. Provide actions for recoverable errors (Retry, View log).",
      },
    },
  },
  render: () => (
    <StoryStack gap="sm">
      <span className="text-muted-foreground text-xs">
        Trigger a success toast with title + description semantics
      </span>
      <ToastTriggerButton
        label="Accessible success toast"
        onClick={() =>
          toast.success("Payment recorded", {
            description: "$4,850.00 applied to INV-2026-0031",
          })
        }
      />
    </StoryStack>
  ),
};

export const ToasterVsAlert: Story = {
  name: "ERP — Toaster vs Alert",
  parameters: {
    docs: {
      description: {
        story:
          "Toaster: transient feedback after an action (saved, emailed, failed). Alert: persistent inline notice on the page (policy warnings, validation summaries). Do not rely on toasts alone for critical blocking information.",
      },
    },
  },
  render: () => (
    <StoryStack gap="md">
      <StoryStack gap="xs">
        <span className="font-medium text-sm">
          Toaster — transient feedback
        </span>
        <ToastTriggerButton
          label="Show save confirmation"
          onClick={() => toast.success("Vendor updated")}
        />
      </StoryStack>
      <StoryStack gap="xs">
        <span className="font-medium text-sm">
          Alert — persistent inline notice
        </span>
        <span className="text-muted-foreground text-xs">
          See Primitives/Alert for import warnings, compliance banners, and form
          errors
        </span>
      </StoryStack>
    </StoryStack>
  ),
};

export const ToasterVsDialog: Story = {
  name: "ERP — Toaster vs Dialog",
  parameters: {
    docs: {
      description: {
        story:
          "Toaster: non-blocking status after background operations. Dialog: blocking confirmation or destructive actions (void invoice, delete record, period close).",
      },
    },
  },
  render: () => (
    <StoryStack gap="md">
      <StoryStack gap="xs">
        <span className="font-medium text-sm">Toaster — background result</span>
        <ToastTriggerButton
          label="Export finished"
          onClick={() => toast.success("Export ready to download")}
        />
      </StoryStack>
      <StoryStack gap="xs">
        <span className="font-medium text-sm">Dialog — blocking decision</span>
        <span className="text-muted-foreground text-xs">
          See Primitives/Dialog for void invoice, delete record, and period
          close flows
        </span>
      </StoryStack>
    </StoryStack>
  ),
};
