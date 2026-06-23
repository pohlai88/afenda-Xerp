import type {
  FieldOrientation,
  GovernedFormControlProps,
  SlotRole,
} from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import * as React from "react";
import { Separator } from "./separator";

const FIELD_RECIPE_NAME = "form-control" as const;

/**
 * Maps Field subcomponent names to design-system SlotRole vocabulary.
 * Do not invent slot names outside the primitive registry.
 */
const FIELD_SLOT_ROLES = {
  set: "header",
  legend: "label",
  group: "body",
  content: "content",
  label: "control",
  description: "state",
  separator: "footer",
  error: "actions",
} as const satisfies Record<
  | "set"
  | "legend"
  | "group"
  | "content"
  | "label"
  | "description"
  | "separator"
  | "error",
  SlotRole
>;

type FieldSlotKeyName = keyof typeof FIELD_SLOT_ROLES;

type FieldSlotKey =
  | "title"
  | "separatorLine"
  | "separatorContent"
  | "errorList";

function resolveFieldGovernance(input: {
  readonly slot?: SlotRole;
  readonly slotKey?: FieldSlotKey;
  readonly className?: string | undefined;
}) {
  return resolvePrimitiveGovernance({
    componentName: "Field",
    recipeName: FIELD_RECIPE_NAME,
    ...input,
  });
}

interface GovernedClassNameProps {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

export interface FieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedFormControlProps,
    GovernedClassNameProps {
  readonly orientation?: FieldOrientation;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      className,
      state,
      orientation = "vertical",
      density = "standard",
      size = "md",
      role,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Field",
      recipeName: FIELD_RECIPE_NAME,
      variant: { density, size },
      fieldOrientation: orientation,
      state,
      slot: "root",
      className,
    });

    return (
      <div
        ref={ref}
        {...props}
        data-density={density}
        data-orientation={orientation}
        data-size={size}
        role={role ?? "group"}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Field.displayName = "Field";

interface FieldDivSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedClassNameProps {}

export type FieldContentProps = FieldDivSlotProps;
export type FieldGroupProps = FieldDivSlotProps;
export type FieldTitleProps = FieldDivSlotProps;

interface FieldParagraphSlotProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "className">,
    GovernedClassNameProps {}

export type FieldDescriptionProps = FieldParagraphSlotProps;

interface FieldSetSlotProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "className">,
    GovernedClassNameProps {}

export type FieldSetProps = FieldSetSlotProps;

interface FieldLegendSlotProps
  extends Omit<React.HTMLAttributes<HTMLLegendElement>, "className">,
    GovernedClassNameProps {
  readonly variant?: "legend" | "label";
}

export type FieldLegendProps = FieldLegendSlotProps;

function createFieldDivSlot(displayName: string, slotName: FieldSlotKeyName) {
  const slot = FIELD_SLOT_ROLES[slotName];

  const FieldSlotComponent = React.forwardRef<
    HTMLDivElement,
    FieldDivSlotProps
  >(({ className, ...props }, ref) => {
    const governed = resolveFieldGovernance({
      slot,
      className,
    });

    return (
      <div
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  });

  FieldSlotComponent.displayName = displayName;

  return FieldSlotComponent;
}

const FieldSet = React.forwardRef<HTMLFieldSetElement, FieldSetSlotProps>(
  ({ className, ...props }, ref) => {
    const governed = resolveFieldGovernance({
      slot: FIELD_SLOT_ROLES.set,
      className,
    });

    return (
      <fieldset
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

FieldSet.displayName = "FieldSet";

const FieldLegend = React.forwardRef<HTMLLegendElement, FieldLegendSlotProps>(
  ({ className, variant = "legend", ...props }, ref) => {
    const governed = resolveFieldGovernance({
      slot: FIELD_SLOT_ROLES.legend,
      className,
    });

    return (
      <legend
        ref={ref}
        {...props}
        data-field-legend-variant={variant}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

FieldLegend.displayName = "FieldLegend";

const FieldGroup = createFieldDivSlot("FieldGroup", "group");
const FieldContent = createFieldDivSlot("FieldContent", "content");

const FieldTitle = React.forwardRef<HTMLDivElement, FieldDivSlotProps>(
  ({ className, ...props }, ref) => {
    const governed = resolveFieldGovernance({
      slotKey: "title",
      className,
    });

    return (
      <div
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

FieldTitle.displayName = "FieldTitle";

export type FieldLabelProps = FieldLabelPropsInternal;

interface FieldLabelPropsInternal
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "className">,
    GovernedClassNameProps {}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => {
    const governed = resolveFieldGovernance({
      slot: FIELD_SLOT_ROLES.label,
      className,
    });

    return (
      <label
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

FieldLabel.displayName = "FieldLabel";

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolveFieldGovernance({
    slot: FIELD_SLOT_ROLES.description,
    className,
  });

  return (
    <p
      ref={ref}
      {...props}
      {...governed.dataAttributes}
      className={cn(governed.className)}
    />
  );
});

FieldDescription.displayName = "FieldDescription";

export interface FieldSeparatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedClassNameProps {
  readonly children?: React.ReactNode;
}

const FieldSeparator = React.forwardRef<HTMLDivElement, FieldSeparatorProps>(
  ({ children, className, ...props }, ref) => {
    const governed = resolveFieldGovernance({
      slot: FIELD_SLOT_ROLES.separator,
      className,
    });

    const separatorLine = resolveFieldGovernance({
      slotKey: "separatorLine",
    });

    const separatorContent = resolveFieldGovernance({
      slotKey: "separatorContent",
    });

    return (
      <div
        ref={ref}
        {...props}
        data-content={children ? "true" : "false"}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      >
        <span
          {...separatorLine.dataAttributes}
          className={cn(separatorLine.className)}
        >
          <Separator />
        </span>
        {children ? (
          <span
            {...separatorContent.dataAttributes}
            className={cn(separatorContent.className)}
          >
            {children}
          </span>
        ) : null}
      </div>
    );
  }
);

FieldSeparator.displayName = "FieldSeparator";

interface FieldErrorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedClassNameProps {
  readonly errors?: readonly ({ readonly message?: string } | undefined)[];
}

export type { FieldErrorProps };

function getUniqueErrorMessages(
  errors: FieldErrorProps["errors"]
): readonly string[] {
  if (!errors?.length) {
    return [];
  }

  return Array.from(
    new Set(
      errors
        .map((error) => error?.message?.trim())
        .filter((message): message is string => Boolean(message))
    )
  );
}

const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, children, errors, ...props }, ref) => {
    const messages = getUniqueErrorMessages(errors);

    if (!children && messages.length === 0) {
      return null;
    }

    const governed = resolveFieldGovernance({
      slot: FIELD_SLOT_ROLES.error,
      className,
    });

    const errorList = resolveFieldGovernance({
      slotKey: "errorList",
    });

    const content =
      children ??
      (messages.length === 1 ? (
        messages[0]
      ) : (
        <ul {...errorList.dataAttributes} className={cn(errorList.className)}>
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ));

    return (
      <div
        ref={ref}
        {...props}
        role="alert"
        {...governed.dataAttributes}
        className={cn(governed.className)}
      >
        {content}
      </div>
    );
  }
);

FieldError.displayName = "FieldError";

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
