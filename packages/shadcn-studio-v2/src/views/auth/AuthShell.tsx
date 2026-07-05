// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { cn } from "../../lib/cn";

export interface AuthShellProps extends ComponentProps<"section"> {
  readonly description?: string;
  readonly footer?: string;
  readonly title: string;
}

const AUTH_SHELL_BASE_CLASS =
  "mx-auto flex min-h-svh w-full max-w-md items-center justify-center bg-background px-6 py-12 text-foreground";

export function authShellClassName({
  className,
}: Pick<AuthShellProps, "className"> = {}): string {
  return cn(AUTH_SHELL_BASE_CLASS, className);
}

export function AuthShell({
  children,
  className,
  description,
  footer,
  title,
  ...props
}: AuthShellProps) {
  return (
    <section
      {...props}
      className={authShellClassName({ className })}
      data-slot="auth-shell"
    >
      <div className="w-full" data-slot="auth-shell-card">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer ? <CardFooter>{footer}</CardFooter> : null}
        </Card>
      </div>
    </section>
  );
}
