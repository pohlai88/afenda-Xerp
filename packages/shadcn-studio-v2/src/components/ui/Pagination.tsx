import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./button";

export interface PaginationProps extends ComponentProps<"nav"> {}
export interface PaginationContentProps extends ComponentProps<"ul"> {}
export interface PaginationItemProps extends ComponentProps<"li"> {}
export interface PaginationLinkProps extends ComponentProps<"a"> {
  readonly size?: "default" | "icon";
}
export interface PaginationLinkCurrentProps extends PaginationLinkProps {}
export interface PaginationPreviousProps extends PaginationLinkProps {}
export interface PaginationNextProps extends PaginationLinkProps {}
export interface PaginationEllipsisProps extends ComponentProps<"span"> {}

const PAGINATION_BASE_CLASS = "mx-auto flex w-full justify-center";
const PAGINATION_CONTENT_CLASS = "flex flex-row items-center gap-1";
const PAGINATION_ELLIPSIS_CLASS = "flex size-9 items-center justify-center";

export function paginationClassName({
  className,
}: Pick<PaginationProps, "className"> = {}): string {
  return cn(PAGINATION_BASE_CLASS, className);
}

export function paginationContentClassName({
  className,
}: Pick<PaginationContentProps, "className"> = {}): string {
  return cn(PAGINATION_CONTENT_CLASS, className);
}

export function paginationLinkClassName({
  className,
  size = "icon",
}: Pick<PaginationLinkProps, "className" | "size"> = {}): string {
  return buttonClassName({
    className: cn(size === "default" ? "gap-1 px-2.5" : "", className),
    size,
    variant: "ghost",
  });
}

export function paginationLinkCurrentClassName({
  className,
  size = "icon",
}: Pick<PaginationLinkCurrentProps, "className" | "size"> = {}): string {
  return buttonClassName({
    className: cn(size === "default" ? "gap-1 px-2.5" : "", className),
    size,
    variant: "outline",
  });
}

export function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      {...props}
      aria-label={props["aria-label"] ?? "Pagination"}
      className={paginationClassName({ className })}
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
      className={paginationContentClassName({ className })}
      data-slot="pagination-content"
    />
  );
}

export function PaginationItem({ ...props }: PaginationItemProps) {
  return <li {...props} data-slot="pagination-item" />;
}

export function PaginationLink({
  className,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      {...props}
      className={paginationLinkClassName({ className, size })}
      data-slot="pagination-link"
    />
  );
}

export function PaginationLinkCurrent({
  className,
  size = "icon",
  ...props
}: PaginationLinkCurrentProps) {
  return (
    <a
      {...props}
      aria-current="page"
      className={paginationLinkCurrentClassName({ className, size })}
      data-slot="pagination-link-current"
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
      <ChevronLeftIcon aria-hidden="true" className="size-4" />
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
      <ChevronRightIcon aria-hidden="true" className="size-4" />
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
      className={cn(PAGINATION_ELLIPSIS_CLASS, className)}
      data-slot="pagination-ellipsis"
    >
      <MoreHorizontalIcon aria-hidden="true" className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
