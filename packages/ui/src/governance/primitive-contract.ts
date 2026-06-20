import type {
  GovernedCardLayoutSize,
  GovernedEmptyMediaVariant,
  GovernedToggleSize,
  GovernedToggleVariant,
} from "./component-props";
import type {
  AccessibilityRequirement,
  GovernedState,
  MotionContract,
  MotionIntent,
  SlotRole,
  VariantSelection,
} from "./design-system";
import type { GovernedRecipeName, GovernedUiComponentName } from "./types";

/** Field layout orientation — structural, not a design-system variant axis. */
export type FieldOrientation = "vertical" | "horizontal" | "responsive";

/** Button presentation mode passed to the button recipe runtime. */
export type ButtonPresentation = "default" | "icon";

/** Serializable input for the governed primitive adapter pipeline. */
export interface PrimitiveGovernanceInput {
  readonly componentName: GovernedUiComponentName;
  readonly recipeName?: GovernedRecipeName | undefined;
  readonly variant?: VariantSelection | undefined;

  /**
   * Button-only presentation override.
   * Ignored by non-button recipes.
   */
  readonly presentation?: ButtonPresentation | undefined;

  /**
   * Field-only structural layout orientation.
   * This is not a design-system variant axis.
   */
  readonly fieldOrientation?: FieldOrientation | undefined;

  /**
   * Card-only structural layout size for group-data slot selectors.
   * Not a design-system recipe variant axis.
   */
  readonly layoutSize?: GovernedCardLayoutSize | undefined;

  readonly state?: string | undefined;
  readonly slot?: string | undefined;

  /**
   * Component-specific implementation slot key.
   *
   * This is separate from governed SlotRole. Use it only when a Radix/shadcn
   * subpart needs a stable class/data-slot mapping that is more specific than
   * the global design-system slot role.
   */
  readonly slotKey?: string | undefined;

  readonly motion?: MotionIntent | undefined;
  readonly className?: string | undefined;

  /** Toggle-only variant override — not a design-system recipe axis. */
  readonly toggleVariant?: GovernedToggleVariant | undefined;

  /** Toggle-only size override — not a design-system recipe axis. */
  readonly toggleSize?: GovernedToggleSize | undefined;

  /** EmptyMedia-only presentation override. */
  readonly emptyMediaVariant?: GovernedEmptyMediaVariant | undefined;
}

/** Normalized output from {@link resolvePrimitiveGovernance}. */
export interface PrimitiveGovernanceResult {
  readonly recipeName: GovernedRecipeName;
  readonly className: string;
  readonly state: GovernedState;
  readonly slot: SlotRole;
  readonly motion: MotionContract;
  readonly accessibility: readonly AccessibilityRequirement[];
  readonly dataAttributes: Readonly<Record<string, string>>;
}

/** Registry entry describing a governed UI primitive contract. */
export interface GovernedPrimitiveDefinition {
  readonly componentName: GovernedUiComponentName;
  readonly recipeName: GovernedRecipeName;
  readonly sourceFile: `src/components/${string}.tsx`;

  readonly defaultState: GovernedState;
  readonly defaultSlot: SlotRole;

  /**
   * Slot roles allowed for this component.
   *
   * A slot can be valid globally but invalid for a specific primitive.
   * Example: "header" may be valid for Card but invalid for Button.
   */
  readonly slots: readonly SlotRole[];

  readonly motion: MotionIntent;
  readonly allowAsChild: boolean;

  /**
   * Form-control presentation mode.
   *
   * - `group`: applies the form-control recipe shell (Field containers).
   * - `leaf`: applies only slot classes (Input, Label, Checkbox, …).
   */
  readonly controlPresentation?: "group" | "leaf" | undefined;

  /**
   * Maps governed slot roles to shadcn-compatible data-slot values.
   */
  readonly dataSlotByRole: Readonly<Partial<Record<SlotRole, string>>>;

  /**
   * Maps governed slot roles to approved structural slot classes.
   *
   * These are implementation classes owned by governance, not consumer className.
   */
  readonly slotClassNames: Readonly<Partial<Record<SlotRole, string>>>;

  /**
   * Optional component-specific class mappings for implementation subparts
   * that do not map cleanly to a global SlotRole.
   */
  readonly slotClassNamesByKey?: Readonly<Record<string, string>>;

  /**
   * Optional component-specific data-slot mappings for implementation subparts
   * that do not map cleanly to a global SlotRole.
   */
  readonly dataSlotByKey?: Readonly<Record<string, string>>;
}
