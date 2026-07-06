import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface BreadcrumbProps extends ComponentProps<"nav"> {}
export interface BreadcrumbListProps extends ComponentProps<"ol"> {}
export interface BreadcrumbItemProps extends ComponentProps<"li"> {}
export interface BreadcrumbLinkProps extends ComponentProps<"a"> {}
export interface BreadcrumbPageProps extends ComponentProps<"span"> {}
export interface BreadcrumbSeparatorProps extends ComponentProps<"li"> {}
export interface BreadcrumbEllipsisProps extends ComponentProps<"span"> {}

const BREADCRUMB_LIST_CLASS =
  "flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5";
const BREADCRUMB_ITEM_CLASS = "inline-flex items-center gap-1.5";
const BREADCRUMB_LINK_CLASS =
  "rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const BREADCRUMB_PAGE_CLASS = "font-normal text-foreground";
const BREADCRUMB_SEPARATOR_CLASS = "[&>svg]:size-3.5";
const BREADCRUMB_ELLIPSIS_CLASS = "flex size-9 items-center justify-center";

export function breadcrumbListClassName({
  className,
}: Pick<BreadcrumbListProps, "className"> = {}): string {
  return cn(BREADCRUMB_LIST_CLASS, className);
}

export function breadcrumbItemClassName({
  className,
}: Pick<BreadcrumbItemProps, "className"> = {}): string {
  return cn(BREADCRUMB_ITEM_CLASS, className);
}

export function breadcrumbLinkClassName({
  className,
}: Pick<BreadcrumbLinkProps, "className"> = {}): string {
  return cn(BREADCRUMB_LINK_CLASS, className);
}

export function breadcrumbPageClassName({
  className,
}: Pick<BreadcrumbPageProps, "className"> = {}): string {
  return cn(BREADCRUMB_PAGE_CLASS, className);
}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav
      {...props}
      aria-label={props["aria-label"] ?? "Breadcrumb"}
      className={cn(className)}
      data-slot="breadcrumb"
    />
  );
}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      {...props}
      className={breadcrumbListClassName({ className })}
      data-slot="breadcrumb-list"
    />
  );
}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      {...props}
      className={breadcrumbItemClassName({ className })}
      data-slot="breadcrumb-item"
    />
  );
}

export function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      {...props}
      className={breadcrumbLinkClassName({ className })}
      data-slot="breadcrumb-link"
    />
  );
}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      {...props}
      aria-current="page"
      className={breadcrumbPageClassName({ className })}
      data-slot="breadcrumb-page"
    />
  );
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      {...props}
      aria-hidden="true"
      className={cn(BREADCRUMB_SEPARATOR_CLASS, className)}
      data-slot="breadcrumb-separator"
      role="presentation"
    >
      {children ?? <ChevronRightIcon aria-hidden="true" />}
    </li>
  );
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: BreadcrumbEllipsisProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(BREADCRUMB_ELLIPSIS_CLASS, className)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
    >
      <MoreHorizontalIcon aria-hidden="true" className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
