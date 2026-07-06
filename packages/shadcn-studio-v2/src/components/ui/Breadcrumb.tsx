// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.

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
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5",
        className
      )}
      data-slot="breadcrumb-list"
    />
  );
}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      {...props}
      className={cn("inline-flex items-center gap-1.5", className)}
      data-slot="breadcrumb-item"
    />
  );
}

export function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      {...props}
      className={cn("transition-colors hover:text-foreground", className)}
      data-slot="breadcrumb-link"
    />
  );
}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      {...props}
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
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
      className={cn("[&>svg]:size-3.5", className)}
      data-slot="breadcrumb-separator"
      role="presentation"
    >
      {children ?? <ChevronRightIcon />}
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
      className={cn("flex size-9 items-center justify-center", className)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
