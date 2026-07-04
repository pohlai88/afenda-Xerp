import { AuthSegmentShell } from "./_components/auth-segment-shell";

export default function AuthLoading() {
  return (
    <AuthSegmentShell>
      <main className="flex min-h-dvh items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-xl border bg-card/80 p-8 text-center">
          <div
            aria-hidden="true"
            className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground"
          />
          <p className="text-muted-foreground text-sm">
            Preparing authentication surface.
          </p>
        </div>
      </main>
    </AuthSegmentShell>
  );
}
