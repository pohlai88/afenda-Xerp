import LogoIcon from "../../components-assets/icon-logo.js";
import { AuthAccessFormFields } from "../auth-access-form-fields.js";

const AUTH_ENTRY_PREVIEW_SRC = "/auth/auth-entry-preview.png";

/** P5 — full-bleed brand imagery with bottom-anchored credential sheet. */
export function P5ImmersiveBrand() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-zinc-900">
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover opacity-90"
        src={AUTH_ENTRY_PREVIEW_SRC}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/20"
      />

      <div className="relative z-10 flex min-h-[42vh] flex-col justify-end px-8 pt-16 pb-32 sm:px-12 lg:px-16">
        <p className="font-medium text-[0.68rem] text-white/70 uppercase tracking-[0.36em]">
          Afenda ERP
        </p>
        <h1 className="mt-4 max-w-3xl font-semibold text-4xl text-white tracking-tight sm:text-5xl">
          Governed ingress for operators who ship with proof.
        </h1>
        <div className="mt-6 flex items-center gap-3 text-white/90">
          <LogoIcon className="size-9" variant="brand" />
          <span className="font-medium text-lg">
            Enterprise workspace access
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-[2rem] border-white/10 border-t bg-background/95 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">Sign in</h2>
            <p className="text-muted-foreground text-sm">
              Continue to your operator workspace.
            </p>
          </div>
          <AuthAccessFormFields />
        </div>
      </div>
    </div>
  );
}
