import type { DeveloperAuthFixture } from "@/lib/auth/auth-fixtures";

const FIELD_LABELS = {
  code: "One-time passcode",
  email: "Email address",
  "invite-code": "Invitation reference",
  passkey: "Passkey assertion",
  password: "Password",
  "recovery-code": "Recovery code",
  sso: "Identity provider",
  totp: "Verification code",
} as const;

export interface AuthIngressSurfaceProps {
  readonly data: DeveloperAuthFixture;
}

export function AuthIngressSurface({ data }: AuthIngressSurfaceProps) {
  return (
    <main
      aria-label={data.title}
      className="min-h-dvh bg-[radial-gradient(circle_at_top,#16131f_0%,#08080b_48%,#030303_100%)] text-neutral-100"
      data-auth-ingress-lane={data.lane}
      data-auth-ingress-path={data.path}
      data-auth-ingress-state="ready"
      data-auth-ingress-surface={data.surfaceId}
    >
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(26rem,34rem)] lg:px-10">
        <section className="flex min-h-[20rem] flex-col justify-between border-border/40 border-b pb-8 lg:min-h-full lg:border-r lg:border-b-0 lg:pr-10 lg:pb-0">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-[0.65rem] text-neutral-400 uppercase tracking-[0.35em]">
              <span
                aria-hidden="true"
                className="inline-flex size-2 rounded-full bg-violet-400"
              />
              Developer auth ingress
            </div>
            <div className="space-y-3">
              <p className="text-[0.68rem] text-neutral-500 uppercase tracking-[0.32em]">
                {data.surfaceId}
              </p>
              <h1 className="max-w-3xl font-semibold text-4xl tracking-tight lg:text-6xl">
                {data.title}
              </h1>
              <p className="max-w-2xl text-base text-neutral-300 leading-8 lg:text-lg">
                {data.description}
              </p>
            </div>
          </div>
          <dl className="grid gap-4 text-neutral-400 text-sm sm:grid-cols-3">
            <div className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.28em]">
                Lane
              </dt>
              <dd>{data.lane}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.28em]">
                Path
              </dt>
              <dd>{data.path}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.28em]">
                Fields
              </dt>
              <dd>{data.fields.length}</dd>
            </div>
          </dl>
        </section>
        <section className="flex items-center lg:justify-end">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.68rem] text-neutral-500 uppercase tracking-[0.32em]">
                  Fixture surface
                </p>
                <p className="mt-2 font-medium text-neutral-100">
                  {data.title}
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] text-neutral-400 uppercase tracking-[0.28em]">
                ready
              </span>
            </div>
            <div className="space-y-4">
              {data.fields.map((field) => (
                <div className="space-y-2" key={field}>
                  <p className="text-neutral-300 text-sm">
                    {FIELD_LABELS[field]}
                  </p>
                  <div className="h-12 rounded-xl border border-white/10 bg-white/5 px-4" />
                </div>
              ))}
              {data.fields.length === 0 ? (
                <div className="rounded-xl border border-white/10 border-dashed bg-white/5 px-4 py-5 text-neutral-400 text-sm">
                  This route is a message state with no interactive inputs.
                </div>
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 font-medium text-black text-sm"
                type="button"
              >
                {data.ctaLabel}
              </button>
              <span className="text-neutral-500 text-sm">
                Route-lab fixture only. No auth runtime is attached.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
