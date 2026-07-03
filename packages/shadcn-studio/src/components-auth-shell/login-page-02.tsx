import { ChevronLeftIcon } from "lucide-react";
import AuthFullBackgroundShape from "@/assets/svg/auth-full-background-shape";
import Logo from "@/assets/svg/logo";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalLoginForm,
  getLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import LoginFormV1 from "./login-form-v1.js";

const BLOCK_ID = "login-page-02" as const;
const LOGIN_PAGE_MANIFEST = getLoginPageManifest(BLOCK_ID);
assertCanonicalLoginForm(LOGIN_PAGE_MANIFEST.blockId);

const backMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "back-to-website"
);
const googleMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "google"
);
const githubMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "github"
);
const passkeyMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "passkey"
);
const ssoMethod = getRequiredLoginMethod(LOGIN_PAGE_MANIFEST.blockId, "sso");
const forgotPasswordMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "forgot-password"
);
const signUpMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "sign-up"
);

export default function LoginPage02() {
  return (
    <div
      {...blockSlotDomMarkerProps("login-page-02.content")}
      className="h-dvh lg:grid lg:grid-cols-6"
    >
      <div className="max-lg:hidden lg:col-span-3 xl:col-span-4">
        <div className="relative z-1 flex h-full items-center justify-center bg-muted px-6">
          <div className="relative shrink rounded-[20px] p-2.5 outline-2 outline-border -outline-offset-2px">
            <img
              alt="Afenda ERP workspace preview"
              className="max-h-111 w-full rounded-lg object-contain dark:hidden"
              src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1.png"
            />
            <img
              alt="Afenda ERP workspace preview"
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

      <div className="flex h-full flex-col items-center justify-center py-10 sm:px-5 lg:col-span-3 xl:col-span-2">
        <div className="w-full max-w-md px-6">
          <a
            className="group mb-12 flex items-center gap-2 text-muted-foreground sm:mb-16 lg:mb-24"
            href={backMethod.href}
          >
            <ChevronLeftIcon className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>{backMethod.label}</span>
          </a>

          <div className="flex flex-col gap-6">
            <Logo className="gap-3" />

            <div>
              <h2 className="mb-2 font-semibold text-2xl">
                Sign in to Afenda ERP
              </h2>
              <p className="text-muted-foreground">
                Access your governed operator workspace.
              </p>
            </div>

            <p className="text-muted-foreground">
              Continue with{" "}
              <a
                className="text-foreground hover:underline"
                href={passkeyMethod.href}
              >
                {passkeyMethod.label}
              </a>
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Button
                className="grow"
                nativeButton={false}
                render={<a href={ssoMethod.href} />}
                variant="outline"
              >
                {ssoMethod.label}
              </Button>
              <Button
                className="grow"
                nativeButton={false}
                render={<a href={githubMethod.href} />}
                variant="outline"
              >
                {githubMethod.label}
              </Button>
            </div>

            <LoginFormV1 forgotPasswordHref={forgotPasswordMethod.href} />

            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                New on our platform?{" "}
                <a
                  className="text-foreground hover:underline"
                  href={signUpMethod.href}
                >
                  {signUpMethod.label}
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
                render={<a href={googleMethod.href} />}
                variant="ghost"
              >
                {googleMethod.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
