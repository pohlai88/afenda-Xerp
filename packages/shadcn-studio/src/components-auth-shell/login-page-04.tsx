import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GithubIcon from "@/components-assets/icon-github.js";
import GoogleIcon from "@/components-assets/icon-google.js";
import LogoIcon from "@/components-assets/icon-logo.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalLoginForm,
  getLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
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
    <div
      {...blockSlotDomMarkerProps("login-page-04.content")}
      className="h-dvh lg:grid lg:grid-cols-2"
    >
      <div
        {...blockSlotDomMarkerProps("login.branding")}
        className="flex flex-col items-center justify-between gap-12 bg-primary p-10 max-lg:hidden xl:p-16"
      >
        <div className="text-primary-foreground">
          <h1
            {...blockSlotDomMarkerProps("login.branding.title")}
            className="mb-6 font-bold text-3xl"
          >
            Sign in to Afenda ERP
          </h1>
          <p
            {...blockSlotDomMarkerProps("login.branding.lead")}
            className="text-xl"
          >
            Access your governed operator workspace.
          </p>
        </div>

        <div className="flex max-h-118 items-center justify-center rounded-xl border-12 border-card bg-card p-2">
          <img
            alt="Afenda ERP workspace preview"
            className="size-full rounded-xl object-contain"
            src={AUTH_ENTRY_PREVIEW_SRC}
          />
        </div>

        <div className="flex items-center gap-3 text-primary-foreground">
          <LogoIcon className="size-10" variant="brand" />
          <span className="font-semibold text-lg tracking-tight">Afenda</span>
        </div>
      </div>

      <div className="flex h-full flex-col items-center justify-center py-10 sm:px-5">
        <div className="flex w-full max-w-lg flex-col gap-6 p-6">
          <div className="space-y-3 text-center">
            <h2
              {...blockSlotDomMarkerProps("login.form.title")}
              className="font-semibold text-2xl md:text-3xl lg:text-4xl"
            >
              Welcome back
            </h2>
            <p
              {...blockSlotDomMarkerProps("login.form.subtitle")}
              className="text-muted-foreground"
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

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p>Or</p>
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

            <p className="text-center text-muted-foreground">
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
      </div>
    </div>
  );
}
