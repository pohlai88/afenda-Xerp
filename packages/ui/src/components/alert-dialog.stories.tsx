import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BanIcon,
  FileXIcon,
  LockIcon,
  ShieldAlertIcon,
  Trash2Icon,
  UserMinusIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { type ComponentType, type ComponentProps } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";

// ─── Helpers ───────────────────────────────────────────────────────────────

function AlertDialogMediaIcon({
  icon: Icon,
}: {
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <AlertDialogMedia>
      <Icon aria-hidden="true" />
    </AlertDialogMedia>
  );
}

function ConfirmTrigger({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <AlertDialogTrigger asChild>
      <Button {...props}>{children}</Button>
    </AlertDialogTrigger>
  );
}

// ─── AlertDialog ───────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed modal for irreversible or high-stakes ERP confirmations. Blocks interaction until the user explicitly confirms or cancels. Use `Dialog` for editable forms and detail views; reserve `AlertDialog` for delete, void, post, revoke, and discard flows. Supports `size` (`default` · `sm`) and an optional `AlertDialogMedia` icon slot.",
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic variants ────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="solid" intent="destructive">
        <Trash2Icon />
        Delete Record
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The record and all associated data
            will be permanently removed from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            <Trash2Icon />
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const WithMedia: Story = {
  name: "AlertDialog — With Media Icon",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="soft" intent="destructive">
        <Trash2Icon />
        Delete Invoice
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={Trash2Icon} />
          <AlertDialogTitle>Delete invoice INV-2026-0142?</AlertDialogTitle>
          <AlertDialogDescription>
            Invoice INV-2026-0142 ($12,450.00) and its line items will be
            permanently deleted. Linked payment records will remain for audit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Keep Invoice
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            Delete Invoice
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const SmallSize: Story = {
  name: "AlertDialog — Small Size",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="outline" intent="destructive" size="sm">
        Remove Line Item
      </ConfirmTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove line item?</AlertDialogTitle>
          <AlertDialogDescription>
            SKU-4401 will be removed from this purchase order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="secondary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const OpenByDefault: Story = {
  name: "AlertDialog — Open (Canvas Preview)",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={AlertTriangleIcon} />
          <AlertDialogTitle>Unsaved changes detected</AlertDialogTitle>
          <AlertDialogDescription>
            Your edits to Purchase Order PO-8821 have not been saved. Choose
            whether to keep editing or discard changes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="primary">
            Keep Editing
          </AlertDialogCancel>
          <AlertDialogAction emphasis="ghost" intent="destructive">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const ButtonVariants: Story = {
  name: "AlertDialog — Button Emphasis Matrix",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      <StoryRow align="start" gap="sm" wrap>
        <AlertDialog>
          <ConfirmTrigger emphasis="solid" intent="destructive" size="sm">
            Solid Destructive
          </ConfirmTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Solid destructive action</AlertDialogTitle>
              <AlertDialogDescription>
                Primary confirm with solid destructive emphasis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel emphasis="ghost" intent="secondary">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction emphasis="solid" intent="destructive">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <ConfirmTrigger emphasis="soft" intent="destructive" size="sm">
            Soft Destructive
          </ConfirmTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Soft destructive action</AlertDialogTitle>
              <AlertDialogDescription>
                Secondary trigger with soft destructive emphasis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel emphasis="outline" intent="secondary">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction emphasis="soft" intent="destructive">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <ConfirmTrigger emphasis="outline" intent="secondary" size="sm">
            Outline Cancel Flow
          </ConfirmTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Discard draft?</AlertDialogTitle>
              <AlertDialogDescription>
                Cancel uses outline; confirm uses ghost destructive.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel emphasis="outline" intent="primary">
                Keep Editing
              </AlertDialogCancel>
              <AlertDialogAction emphasis="ghost" intent="destructive">
                Discard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StoryRow>
    </StoryStack>
  ),
};

export const MediaToneVariants: Story = {
  name: "AlertDialog — Media Icon Variants",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="start" gap="sm" wrap>
      {(
        [
          {
            id: "danger",
            icon: Trash2Icon,
            label: "Delete",
            title: "Delete supplier?",
            body: "All linked contracts will be archived.",
          },
          {
            id: "warning",
            icon: AlertTriangleIcon,
            label: "Override",
            title: "Override approval limit?",
            body: "This exceeds the $5,000 department threshold.",
          },
          {
            id: "security",
            icon: ShieldAlertIcon,
            label: "Revoke",
            title: "Revoke API access?",
            body: "Integrations using this key will stop immediately.",
          },
          {
            id: "lock",
            icon: LockIcon,
            label: "Lock Period",
            title: "Lock accounting period?",
            body: "No further postings will be allowed for March 2026.",
          },
        ] as const
      ).map(({ id, icon, label, title, body }) => (
        <AlertDialog key={id}>
          <ConfirmTrigger emphasis="outline" intent="secondary" size="sm">
            {label}
          </ConfirmTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMediaIcon icon={icon} />
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{body}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction emphasis="solid" intent="destructive">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </StoryRow>
  ),
};

// ─── ERP destructive confirmations ────────────────────────────────────────

export const BulkDeleteConfirm: Story = {
  name: "ERP — Bulk Delete Confirmation",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="soft" intent="destructive" size="sm">
        <Trash2Icon />
        Delete 12 Records
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={AlertTriangleIcon} />
          <AlertDialogTitle>Delete 12 invoice records?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to permanently delete{" "}
            <strong>12 invoice records</strong> totalling{" "}
            <strong>$48,250.00</strong>. This action is irreversible and cannot
            be recovered from backup within 30 days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Keep Records
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            <Trash2Icon />
            Delete All 12
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DiscardChanges: Story = {
  name: "ERP — Discard Changes Confirmation",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="ghost" intent="secondary">
        <XIcon />
        Cancel Edit
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have made changes to Purchase Order PO-8821 that have not been
            saved. Closing now will discard all edits including 3 new line
            items.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="primary">
            Keep Editing
          </AlertDialogCancel>
          <AlertDialogAction emphasis="ghost" intent="destructive">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DeactivateAccount: Story = {
  name: "ERP — Deactivate User Account",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="outline" intent="destructive" size="sm">
        <UserMinusIcon />
        Deactivate Account
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={UserMinusIcon} />
          <AlertDialogTitle>Deactivate user account?</AlertDialogTitle>
          <AlertDialogDescription>
            Jane Doe (EMP-00142) will lose access to all modules immediately.
            Active sessions will be terminated. An administrator can reactivate
            the account at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const VoidInvoice: Story = {
  name: "ERP — Void Posted Invoice",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="solid" intent="destructive">
        <FileXIcon />
        Void Invoice
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={FileXIcon} />
          <AlertDialogTitle>Void invoice INV-2026-0098?</AlertDialogTitle>
          <AlertDialogDescription>
            This invoice has been posted to the general ledger. Voiding will
            create a reversing journal entry of <strong>-$18,750.00</strong>{" "}
            and notify the accounts payable team.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Keep Invoice
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            Void Invoice
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const CancelPurchaseOrder: Story = {
  name: "ERP — Cancel Purchase Order",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="soft" intent="destructive">
        Cancel PO
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={BanIcon} />
          <AlertDialogTitle>Cancel purchase order PO-8821?</AlertDialogTitle>
          <AlertDialogDescription>
            PO-8821 ($5,949.00 · 3 line items) will be cancelled. The supplier
            will be notified and any partial receipts must be reversed before
            cancellation completes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="secondary">
            Keep Order
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            Cancel Purchase Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const PostJournalEntry: Story = {
  name: "ERP — Post Journal Entry",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="solid" intent="primary">
        Post Entry
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={LockIcon} />
          <AlertDialogTitle>Post journal entry JE-2026-0312?</AlertDialogTitle>
          <AlertDialogDescription>
            Posting is final for period March 2026. Debits and credits totalling{" "}
            <strong>$142,800.00</strong> will be written to the general ledger.
            Only a reversing entry can undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Review Again
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="primary">
            Post Entry
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const RevokeApiKey: Story = {
  name: "ERP — Revoke Integration Key",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="outline" intent="destructive" size="sm">
        <ShieldAlertIcon />
        Revoke Key
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={ShieldAlertIcon} />
          <AlertDialogTitle>Revoke API key &quot;Warehouse Sync&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            The warehouse integration will stop receiving inventory updates
            immediately. 4 scheduled sync jobs are in progress and will fail.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Keep Key Active
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            Revoke Key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const ApproveBudgetOverride: Story = {
  name: "ERP — Approve Budget Override",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="solid" intent="primary">
        Approve Override
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={AlertTriangleIcon} />
          <AlertDialogTitle>Approve budget override?</AlertDialogTitle>
          <AlertDialogDescription>
            Requisition REQ-4410 exceeds the Engineering department budget by{" "}
            <strong>$12,400.00</strong>. Your approval will be logged in the
            audit trail and notify Finance leadership.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="secondary">
            Reject
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="primary">
            Approve Override
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const GdprDataDeletion: Story = {
  name: "ERP — GDPR Data Deletion Request",
  render: () => (
    <StoryFrame width="md">
      <AlertDialog>
        <ConfirmTrigger emphasis="solid" intent="destructive">
          Process Deletion
        </ConfirmTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMediaIcon icon={AlertCircleIcon} />
            <AlertDialogTitle>Process GDPR deletion request?</AlertDialogTitle>
            <AlertDialogDescription>
              All personal data for request <strong>DSR-2026-0088</strong> will
              be permanently erased across HR, Finance, and CRM modules within
              72 hours. Legal hold records are excluded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel emphasis="ghost" intent="secondary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction emphasis="solid" intent="destructive">
              Begin Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StoryFrame>
  ),
};

export const WorkflowFinalApproval: Story = {
  name: "ERP — Workflow Final Approval",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="solid" intent="primary">
        Final Approve
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit final approval for PO-8821?</AlertDialogTitle>
          <AlertDialogDescription>
            <StoryStack gap="sm">
              <span>
                This is the final approval step. The purchase order will be
                sent to Acme Supplies and cannot be edited afterward.
              </span>
              <StoryRow align="center" gap="sm">
                <Badge emphasis="soft" tone="warning">
                  Pending CFO
                </Badge>
                <span className="text-muted-foreground text-sm">
                  Total: $5,949.00 · 3 items
                </span>
              </StoryRow>
            </StoryStack>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Return to Review
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="primary">
            Submit Final Approval
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const TypedDeleteConfirmation: Story = {
  name: "ERP — Typed Delete Confirmation",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="solid" intent="destructive">
        <Trash2Icon />
        Delete Vendor
      </ConfirmTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={Trash2Icon} />
          <AlertDialogTitle>Delete vendor Acme Supplies?</AlertDialogTitle>
          <AlertDialogDescription>
            <StoryStack gap="sm">
              <span>
                This permanently removes the vendor, 142 linked purchase orders,
                and 28 active contracts. Type <strong>DELETE</strong> to
                confirm.
              </span>
              <StoryStack gap="xs">
                <Label htmlFor="confirm-delete">Confirmation</Label>
                <Input
                  autoComplete="off"
                  id="confirm-delete"
                  placeholder="Type DELETE"
                />
              </StoryStack>
            </StoryStack>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="ghost" intent="secondary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="destructive">
            Delete Vendor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const SessionLockConfirm: Story = {
  name: "ERP — Lock Accounting Period",
  render: () => (
    <AlertDialog>
      <ConfirmTrigger emphasis="outline" intent="secondary">
        <LockIcon />
        Lock Period
      </ConfirmTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMediaIcon icon={LockIcon} />
          <AlertDialogTitle>Lock March 2026?</AlertDialogTitle>
          <AlertDialogDescription>
            Users will not be able to post or edit transactions in this period.
            Only system administrators can unlock it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel emphasis="outline" intent="secondary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction emphasis="solid" intent="primary">
            Lock Period
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// ─── Cross-surface pairing ────────────────────────────────────────────────

export const DialogPairActions: Story = {
  name: "ERP — Dialog + AlertDialog Pair",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Dialog>
        <DialogTrigger asChild>
          <Button emphasis="solid" intent="primary">
            <UserPlusIcon />
            Add Employee
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter employee information.</DialogDescription>
          </DialogHeader>
          <StoryStack gap="sm">
            <Input placeholder="Full name" />
            <Input placeholder="Work email" type="email" />
          </StoryStack>
          <DialogFooter>
            <Button emphasis="solid" intent="primary">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <ConfirmTrigger emphasis="solid" intent="destructive">
          <Trash2Icon />
          Delete
        </ConfirmTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The employee record and audit history will
              be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction emphasis="solid" intent="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StoryRow>
  ),
};
