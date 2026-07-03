import { ChevronLeftIcon } from "lucide-react";
import AuthFullBackgroundShape from "@/assets/svg/auth-full-background-shape";
import Logo from "@/assets/svg/logo";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { blockSlotDomMarkerProps } from "../../../meta-contracts/block-slot-dom-marker.contract.js";
import LoginForm from "./login-form-02";

const Login = () => {
  return (
    <div
      {...blockSlotDomMarkerProps("login-page-02.content")}
      className="h-dvh lg:grid lg:grid-cols-6"
    >
      {/* Dashboard Preview */}
      <div className="max-lg:hidden lg:col-span-3 xl:col-span-4">
        <div className="relative z-1 flex h-full items-center justify-center bg-muted px-6">
          <div className="relative shrink rounded-[20px] p-2.5 outline-2 outline-border -outline-offset-2px">
            <img
              alt="Dashboards"
              className="max-h-111 w-full rounded-lg object-contain dark:hidden"
              src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1.png"
            />
            <img
              alt="Dashboards"
              className="hidden max-h-111 w-full rounded-lg object-contain dark:inline-block"
              src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1-dark.png"
            />

            <BorderBeam
              borderWidth={2}
              className="from-destructive via-primary to-transparent"
              duration={8}
              size={100}
            />
          </div>

          <div className="absolute -z-1">
            <AuthFullBackgroundShape />
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex h-full flex-col items-center justify-center py-10 sm:px-5 lg:col-span-3 xl:col-span-2">
        <div className="w-full max-w-md px-6">
          <a
            className="group mb-12 flex items-center gap-2 text-muted-foreground sm:mb-16 lg:mb-24"
            href="#"
          >
            <ChevronLeftIcon className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <p>Back to the website</p>
          </a>

          <div className="flex flex-col gap-6">
            <Logo className="gap-3" />

            <div>
              <h2 className="mb-2 font-semibold text-2xl">
                Sign in to Shadcn Studio
              </h2>
              <p className="text-muted-foreground">
                Ship Faster and Focus on Growth.
              </p>
            </div>

            <p className="text-muted-foreground">
              Login with{" "}
              <a className="text-foreground hover:underline" href="#">
                Magic Link
              </a>
            </p>

            {/* Quick Login Buttons */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Button className="grow" variant="outline">
                Login as User
              </Button>
              <Button className="grow" variant="outline">
                Login as Admin
              </Button>
            </div>

            {/* Form */}
            <LoginForm />

            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                New on our platform?{" "}
                <a className="text-foreground hover:underline" href="#">
                  Create an account
                </a>
              </p>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <p>or</p>
                <Separator className="flex-1" />
              </div>

              <Button
                className="w-full"
                nativeButton={false}
                render={<a href="#" />}
                variant="ghost"
              >
                Sign in with google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
