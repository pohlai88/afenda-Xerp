import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 flex-col gap-2", className)}
      data-slot="message-group"
      {...props}
    />
  );
}

type MessageProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div"> & { align?: "start" | "end" }
>;

function Message({ className, align = "start", ...props }: MessageProps) {
  return (
    <div
      {...props}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
        className
      )}
      data-align={align}
      data-slot="message"
    />
  );
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
        className
      )}
      data-slot="message-avatar"
      {...props}
    />
  );
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "wrap-break-word flex w-full min-w-0 flex-col gap-2.5 group-data-[align=end]/message:*:data-slot:self-end",
        className
      )}
      data-slot="message-content"
      {...props}
    />
  );
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0",
        className
      )}
      data-slot="message-header"
      {...props}
    />
  );
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className
      )}
      data-slot="message-footer"
      {...props}
    />
  );
}

export type { MessageSlot } from "./message.contract.js";
export type { MessageProps };
export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
};
