/**
 * Client-safe error UI surface — no governance registry or node:fs dependencies.
 * Use in Next.js error boundaries and public error routes.
 */

export { Button, buttonVariants, type ButtonProps } from "../components-ui/button.js";
export {
  DotGrid,
  type DotGridProps,
} from "../components-ui/bg-dot-grid.js";
export {
  MorphingText,
  type MorphingTextProps,
} from "../components-layouts/morphing-text.js";
export {
  ErrorPageShell,
  ErrorPageShellBlock,
  type ErrorPageShellProps,
} from "../components-layouts/error-page-shell.js";
export {
  assertErrorPageCopyWire,
  ERROR_PAGE_COPY_REGISTRY,
  ERROR_PAGE_SHELL_BLOCK_ID,
  ERROR_PAGE_VARIANTS,
  type ErrorPageCopyWire,
  type ErrorPageVariant,
} from "../components-layouts/error-page-shell.contract.js";
