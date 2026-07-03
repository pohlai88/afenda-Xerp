import GithubIcon from "@/components-assets/icon-github.js";
import GoogleIcon from "@/components-assets/icon-google.js";
import LogoIcon from "@/components-assets/icon-logo.js";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoginPage04Form from "./login-page-04-form.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";

/** ERP ingress preview — served from apps/erp/public/auth/ in production. */
const AUTH_ENTRY_PREVIEW_SRC = "/auth/auth-entry-preview.png";

const LoginPage04 = () => {
  return (
    <div className="h-dvh lg:grid lg:grid-cols-2">
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
              render={<a href="#" />}
              variant="outline"
            >
              <GoogleIcon className="size-4" variant="brand" />
              Login with Google
            </Button>
            <Button
              className="grow"
              nativeButton={false}
              render={<a href="#" />}
              variant="outline"
            >
              <GithubIcon className="size-4" variant="brand" />
              Login with GitHub
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p>Or</p>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-4">
            <LoginPage04Form />

            <p className="text-center text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <a className="text-foreground hover:underline" href="#">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage04;
