// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import { type ComponentProps, useId } from "react";
import { cn } from "../../lib/cn";

export interface IconMarkProps extends ComponentProps<"svg"> {
  readonly label?: string;
}

export function IconMark({
  className,
  label = "Afenda",
  ...props
}: IconMarkProps) {
  const titleId = useId();
  const labelledBy = props["aria-labelledby"] ?? titleId;

  return (
    <svg
      {...props}
      aria-labelledby={labelledBy}
      className={cn("size-8 text-primary", className)}
      data-slot="icon-mark"
      fill="none"
      role="img"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{label}</title>
      <rect
        className="fill-primary/10 stroke-current"
        height="26"
        rx="8"
        width="26"
        x="3"
        y="3"
      />
      <path
        className="stroke-current"
        d="M10 22L16 9l6 13M12.5 17.5h7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}
