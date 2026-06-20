"use client";

import { useMemo } from "react";

import { cn } from "@afenda/ui/lib/utils";
import { Label } from "@afenda/ui/components/label";
import { Separator } from "@afenda/ui/components/separator";
import type { FieldOrientation, GovernedFormControlProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "header",
    className,
  });

  return (
    <fieldset {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "label",
    className,
  });

  return (
    <legend
      {...governed.dataAttributes}
      data-variant={variant}
      className={cn(governed.className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "body",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

export interface FieldProps
  extends Omit<React.ComponentProps<"div">, "className">,
    GovernedFormControlProps {
  readonly className?: string;
  readonly state?: string;
  readonly orientation?: FieldOrientation;
}

function Field({
  className,
  state,
  orientation = "vertical",
  density = "standard",
  size = "md",
  ...props
}: FieldProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    recipeName: "form-control",
    variant: { density, size },
    fieldOrientation: orientation,
    state,
    slot: "root",
    className,
  });

  return (
    <div
      {...governed.dataAttributes}
      role="group"
      data-orientation={orientation}
      className={cn(governed.className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "content",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "control",
    className,
  });

  return (
    <Label {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slotKey: "title",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "state",
    className,
  });

  return (
    <p {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "footer",
    className,
  });

  return (
    <div
      {...governed.dataAttributes}
      data-content={!!children}
      className={cn(governed.className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (() => {
        const separatorContent = resolvePrimitiveGovernance({
          componentName: "Field",
          slotKey: "separatorContent",
        });

        return (
          <span
            {...separatorContent.dataAttributes}
            className={cn(separatorContent.className)}
          >
            {children}
          </span>
        );
      })() : null}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    const errorList = resolvePrimitiveGovernance({
      componentName: "Field",
      slotKey: "errorList",
    });

    return (
      <ul {...errorList.dataAttributes} className={cn(errorList.className)}>
        {uniqueErrors.map(
          (error, index) =>
            error?.message ? <li key={index}>{error.message}</li> : null
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  const governed = resolvePrimitiveGovernance({
    componentName: "Field",
    slot: "actions",
    className,
  });

  return (
    <div role="alert" {...governed.dataAttributes} className={cn(governed.className)} {...props}>
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
