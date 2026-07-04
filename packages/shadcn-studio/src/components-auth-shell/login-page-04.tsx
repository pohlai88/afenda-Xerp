import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GithubIcon from "../components-assets/icon-github.js";
import GoogleIcon from "../components-assets/icon-google.js";
import LogoIcon from "../components-assets/icon-logo.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalLoginForm,
  getLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import { AuthShellStage } from "./auth-shell-stage.js";
import LoginFormV1 from "./login-form-v1.js";

const BLOCK_ID = "login-page-04" as const;
const LOGIN_PAGE_MANIFEST = getLoginPageManifest(BLOCK_ID);
assertCanonicalLoginForm(LOGIN_PAGE_MANIFEST.blockId);

const googleMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "google"
);
const githubMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "github"
);
const forgotPasswordMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "forgot-password"
);
const signUpMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "sign-up"
);

/** ERP ingress preview — served from apps/erp/public/auth/ in production. */
const AUTH_ENTRY_PREVIEW_SRC = "/auth/auth-entry-preview.png";

export default function LoginPage04() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("login-page-04.content")}
      variant="access"
    >
      <div className="relative min-h-[calc(100dvh-2rem)] w-full overflow-hidden rounded-[32px] border border-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <img
          alt="Afenda ERP workspace preview"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-24"
          src={AUTH_ENTRY_PREVIEW_SRC}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/12 via-black/48 to-black/80" />

        <div className="relative z-10 grid min-h-[calc(100dvh-2rem)] items-stretch gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(24rem,30rem)] lg:gap-8 lg:p-8">
          <section
            {...blockSlotDomMarkerProps("login.branding")}
            className="flex min-h-[16rem] flex-col justify-between rounded-[28px] border border-white/10 bg-black/30 p-6 backdrop-blur-xl lg:p-8"
          >
            <div className="space-y-5 text-primary-foreground">
              <div className="flex items-center gap-3">
                <LogoIcon className="size-8" variant="brand" />
                <span className="font-semibold text-base tracking-tight">
                  Afenda
                </span>
              </div>
              <p className="text-primary/85 text-xs uppercase tracking-[0.24em]">
                Lynx convergence ingress
              </p>
              <h1
                {...blockSlotDomMarkerProps("login.branding.title")}
                className="max-w-xl font-semibold text-4xl leading-[0.95] tracking-tight xl:text-5xl"
              >
                Marketing signal meets operator access.
              </h1>
              <p
                {...blockSlotDomMarkerProps("login.branding.lead")}
                className="max-w-xl text-base text-primary-foreground/80 leading-7"
              >
                The Lynx field carries product story while the chamber keeps
                credential entry canonical, governed, and production-ready.
              </p>
            </div>

            <div className="grid gap-3 pt-6 text-primary-foreground/75 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/24 p-3">
                <p className="text-[0.64rem] text-primary/80 uppercase tracking-[0.2em]">
                  Promise
                </p>
                <p className="mt-2">
                  Fast onboarding with no credential drift.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/24 p-3">
                <p className="text-[0.64rem] text-primary/80 uppercase tracking-[0.2em]">
                  Trust
                </p>
                <p className="mt-2">
                  Consistent auth method map across all lanes.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/24 p-3">
                <p className="text-[0.64rem] text-primary/80 uppercase tracking-[0.2em]">
                  Outcome
                </p>
                <p className="mt-2">One surface for campaign and conversion.</p>
              </div>
            </div>
          </section>

          <aside className="flex items-center justify-center">
            <div className="w-full rounded-[28px] border border-white/14 bg-background/80 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.58)] backdrop-blur-2xl sm:p-7">
              <div className="mb-6 space-y-2 text-center">
                <h2
                  {...blockSlotDomMarkerProps("login.form.title")}
                  className="font-semibold text-2xl"
                >
                  Sign in to Afenda ERP
                </h2>
                <p
                  {...blockSlotDomMarkerProps("login.form.subtitle")}
                  className="text-muted-foreground text-sm"
                >
                  Use your workspace credentials to continue.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="grow"
                  nativeButton={false}
                  render={<a href={googleMethod.href} />}
                  variant="outline"
                >
                  <GoogleIcon className="size-4" variant="brand" />
                  {googleMethod.label}
                </Button>
                <Button
                  className="grow"
                  nativeButton={false}
                  render={<a href={githubMethod.href} />}
                  variant="outline"
                >
                  <GithubIcon className="size-4" variant="brand" />
                  {githubMethod.label}
                </Button>
              </div>

              <div className="my-6 flex items-center gap-4">
                <Separator className="flex-1" />
                <p className="text-muted-foreground text-sm">Or</p>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-4">
                <div aria-hidden="true" className="sr-only">
                  <span {...blockSlotDomMarkerProps("login.email")} />
                  <span {...blockSlotDomMarkerProps("login.password")} />
                  <span {...blockSlotDomMarkerProps("login.password.help")} />
                  <span {...blockSlotDomMarkerProps("login.submit")} />
                </div>

                <LoginFormV1 forgotPasswordHref={forgotPasswordMethod.href} />

                <p className="text-center text-muted-foreground text-sm">
                  Don&apos;t have an account yet?{" "}
                  <a
                    className="text-foreground hover:underline"
                    href={signUpMethod.href}
                  >
                    {signUpMethod.label}
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AuthShellStage>
  );
}
