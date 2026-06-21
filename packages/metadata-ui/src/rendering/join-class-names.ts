/**
 * Joins CSS class name fragments into a single string, omitting falsy values.
 *
 * Returns undefined when every argument is falsy so consumers can omit the
 * className attribute entirely (important for exactOptionalPropertyTypes).
 */
export function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string | undefined {
  const classNames = values.filter(
    (value): value is string => typeof value === "string" && value.length > 0
  );

  return classNames.length > 0 ? classNames.join(" ") : undefined;
}
