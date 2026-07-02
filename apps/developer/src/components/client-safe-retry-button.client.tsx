"use client";

interface ClientSafeRetryButtonProps {
  readonly label?: string;
  readonly onClick: () => void;
}

/** Error boundaries must not import @afenda/shadcn-studio barrel (node:fs leak). */
export function ClientSafeRetryButton({
  label = "Try again",
  onClick,
}: ClientSafeRetryButtonProps) {
  return (
    <button
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
