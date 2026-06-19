export const PROHIBITED_CLASSNAME_PATTERNS = [
  "bg-",
  "text-",
  "border-",
  "shadow",
  "rounded",
  "ring-",
  "animate-",
  "duration-",
  "ease-",
  "opacity-",
] as const;

export const ALLOWED_LAYOUT_CLASSNAME_PATTERNS = [
  "grid",
  "flex",
  "block",
  "inline",
  "hidden",
  "contents",
  "col-",
  "row-",
  "items-",
  "justify-",
  "self-",
  "place-",
  "order-",
  "w-",
  "h-",
  "min-",
  "max-",
  "overflow-",
] as const;

export interface ClassNamePolicyContract {
  readonly allowedLayoutPatterns: readonly string[];
  readonly allowedPurpose: "layout-only";
  readonly prohibitedPatterns: readonly string[];
  readonly violationMessage: string;
}
