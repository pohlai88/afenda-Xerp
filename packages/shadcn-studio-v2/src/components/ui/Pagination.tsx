// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./Button";

export interface PaginationProps extends ComponentProps<"nav"> {}
export interface PaginationContentProps extends ComponentProps<"ul"> {}
export interface PaginationItemProps extends ComponentProps<"li"> {}
export interface PaginationLinkProps extends ComponentProps<"a"> {
  readonly isActive?: boolean;
  readonly size?: "default" | "icon";
}
export interface PaginationPreviousProps extends PaginationLinkProps {}
export interface PaginationNextProps extends PaginationLinkProps {}
export interface PaginationEllipsisProps extends ComponentProps<"span"> {}

export function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      {...props}
      aria-label={props["aria-label"] ?? "Pagination"}
      className={cn("mx-auto flex w-full justify-center", className)}
      data-slot="pagination"
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: PaginationContentProps) {
  return (
    <ul
      {...props}
      className={cn("flex flex-row items-center gap-1", className)}
      data-slot="pagination-content"
    />
  );
}

export function PaginationItem({ ...props }: PaginationItemProps) {
  return <li {...props} data-slot="pagination-item" />;
}

export function PaginationLink({
  className,
  isActive = false,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      {...props}
      aria-current={isActive ? "page" : undefined}
      className={buttonClassName({
        className: cn(size === "default" ? "gap-1 px-2.5" : "", className),
        size,
        variant: isActive ? "outline" : "ghost",
      })}
      data-slot="pagination-link"
    />
  );
}

export function PaginationPrevious({
  className,
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      {...props}
      className={cn("gap-1 pl-2.5", className)}
      size="default"
    >
      <ChevronLeftIcon className="size-4" />
      <span>Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({ className, ...props }: PaginationNextProps) {
  return (
    <PaginationLink
      {...props}
      className={cn("gap-1 pr-2.5", className)}
      size="default"
    >
      <span>Next</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      data-slot="pagination-ellipsis"
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
