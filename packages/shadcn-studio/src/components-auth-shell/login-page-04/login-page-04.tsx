import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoginForm from "@/components-auth-shell/login-page-04/login-form";
import { blockSlotDomMarkerProps } from "../../meta-contracts/block-slot-dom-marker.contract.js";

const Login = () => {
  return (
    <div className="h-dvh lg:grid lg:grid-cols-2">
      {/* Dashboard Preview */}
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

        <div className="flex max-h-118 items-center justify-center rounded-xl border-12 border-card bg-card">
          <img
            alt="dashboard"
            className="size-full rounded-xl object-contain dark:hidden"
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1.png"
          />
          <img
            alt="dashboard"
            className="hidden size-full rounded-xl object-contain dark:inline-block"
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1-dark.png"
          />
        </div>

        <div className="flex gap-2 rounded-full bg-white/20 px-3 py-2">
          <a
            className="flex size-9 items-center justify-center rounded-full bg-white"
            href="#"
          >
            <img
              alt="TailwindCSS Logo"
              className="w-7"
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/tailwind-logo.png"
            />
          </a>
          <a
            className="flex size-9 items-center justify-center rounded-full bg-white"
            href="#"
          >
            <img
              alt="Next.js Logo"
              className="w-5.5"
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/nextjs-logo.png"
            />
          </a>
          <a
            className="flex size-9 items-center justify-center rounded-full bg-white"
            href="#"
          >
            <img
              alt="Shadcn Logo"
              className="w-5.5"
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/shadcn-logo.png"
            />
          </a>
        </div>
      </div>

      {/* Login Form */}
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

          {/* Quick Login Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              className="grow"
              nativeButton={false}
              render={<a href="#" />}
              variant="outline"
            >
              Login with Google
            </Button>
            <Button
              className="grow"
              nativeButton={false}
              render={<a href="#" />}
              variant="outline"
            >
              Login with Facebook
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p>Or</p>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-4">
            {/* Form */}
            <LoginForm />

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

export default Login;
