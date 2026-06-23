import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import { Button } from "../button";
import { Toaster } from "../sonner";
import { StoryRow } from "./story-frame";

export interface ToastTrigger {
  readonly id: string;
  readonly label: string;
  readonly onClick: () => void;
}

export function ToastTriggerButton({
  label,
  onClick,
}: {
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <Button emphasis="outline" intent="secondary" onClick={onClick} size="sm">
      {label}
    </Button>
  );
}

export function ToastTriggerRow({
  triggers,
}: {
  readonly triggers: readonly ToastTrigger[];
}) {
  return (
    <StoryRow gap="sm" wrap>
      {triggers.map(({ id, label, onClick }) => (
        <ToastTriggerButton key={id} label={label} onClick={onClick} />
      ))}
    </StoryRow>
  );
}

export function simulateLedgerPost(): Promise<{ entryId: string }> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() > 0.35) {
        resolve({ entryId: "JE-20481" });
      } else {
        reject(new Error("Period locked"));
      }
    }, 1800);
  });
}

export function simulateCsvExport(): Promise<{ rows: number }> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ rows: 248 }), 2200);
  });
}

export function ToasterStoryShell({
  children,
  toasterProps,
  theme = "light",
}: {
  readonly children: ReactNode;
  readonly toasterProps?: React.ComponentProps<typeof Toaster>;
  readonly theme?: "dark" | "light";
}) {
  return (
    <ThemeProvider attribute="class" forcedTheme={theme}>
      <div className="bg-background text-foreground">
        {children}
        <Toaster {...toasterProps} />
      </div>
    </ThemeProvider>
  );
}

export const TOAST_TYPE_TRIGGERS: readonly ToastTrigger[] = [
  {
    id: "default",
    label: "Default",
    onClick: () => toast("Notification"),
  },
  {
    id: "success",
    label: "Success",
    onClick: () => toast.success("Saved"),
  },
  { id: "error", label: "Error", onClick: () => toast.error("Failed") },
  {
    id: "warning",
    label: "Warning",
    onClick: () => toast.warning("Review"),
  },
  { id: "info", label: "Info", onClick: () => toast.info("Scheduled") },
  {
    id: "loading",
    label: "Loading",
    onClick: () => toast.loading("Processing…"),
  },
];
