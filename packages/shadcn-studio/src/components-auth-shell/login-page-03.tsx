import Logo from "@/assets/svg/logo";
import LogoVector from "@/assets/svg/logo-vector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalLoginForm,
  getLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import LoginFormV1 from "./login-form-v1.js";

const BLOCK_ID = "login-page-03" as const;
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

const avatars = [
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "OS",
    name: "Olivia Sparks",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    fallback: "HL",
    name: "Howard Lloyd",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    fallback: "HR",
    name: "Hallie Richards",
  },
] as const;

export default function LoginPage03() {
  return (
    <div
      {...blockSlotDomMarkerProps("login-page-03.content")}
      className="h-dvh lg:grid lg:grid-cols-2"
    >
      <div className="flex h-full items-center justify-center space-y-6 sm:px-6 md:px-8">
        <div className="flex w-full flex-col gap-6 p-6 sm:max-w-lg">
          <Logo className="gap-3" />

          <div>
            <h2 className="mb-2 font-semibold text-2xl">Welcome back</h2>
            <p className="text-muted-foreground">
              Select a trusted method to continue.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Button
              className="grow"
              nativeButton={false}
              render={<a href={googleMethod.href} />}
              variant="outline"
            >
              {googleMethod.label}
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

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p>Or continue with email</p>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-4">
            <LoginFormV1 forgotPasswordHref={forgotPasswordMethod.href} />
            <p className="text-center text-muted-foreground">
              New on our platform?{" "}
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

      <div className="h-screen bg-muted p-5 max-lg:hidden">
        <Card className="relative h-full justify-between overflow-hidden border-none bg-primary py-8">
          <CardHeader className="gap-6 px-8">
            <CardTitle className="font-bold text-4xl text-primary-foreground xl:text-5xl/15.5">
              Secure access for governed workspaces
            </CardTitle>
            <p className="text-primary-foreground text-xl">
              Continue into Afenda with an approved identity method and a clear
              operator trail.
            </p>
          </CardHeader>

          <LogoVector className="pointer-events-none absolute bottom-30 -left-50 size-130 text-secondary/10" />

          <CardContent className="relative z-1 mx-8 h-62 overflow-hidden rounded-2xl px-0">
            <svg
              className="pointer-events-none absolute right-0 -z-1 select-none"
              fill="none"
              height="249"
              viewBox="0 0 1094 249"
              width="1094"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.263672 16.8809C0.263672 8.0443 7.42712 0.880859 16.2637 0.880859H786.394H999.115C1012.37 0.880859 1023.12 11.626 1023.12 24.8808L1023.12 47.3809C1023.12 60.6357 1033.86 71.3809 1047.12 71.3809H1069.6C1082.85 71.3809 1093.6 82.126 1093.6 95.3809L1093.6 232.881C1093.6 241.717 1086.43 248.881 1077.6 248.881H16.2637C7.42716 248.881 0.263672 241.717 0.263672 232.881V16.8809Z"
                fill="var(--card)"
              />
            </svg>

            <div className="absolute top-0 right-0 flex size-15 items-center justify-center rounded-2xl bg-card">
              <LogoVector className="size-15" />
            </div>

            <div className="flex flex-col gap-5 p-6">
              <p className="line-clamp-2 pr-12 font-bold text-3xl">
                Identity first. Workspace second.
              </p>
              <p className="line-clamp-2 text-lg">
                Auth remains predictable; the page owns the brand theatre.
              </p>

              <div className="flex -space-x-4 self-end">
                {avatars.map((avatar) => (
                  <Avatar
                    className="size-12 ring-2 ring-background"
                    key={avatar.name}
                  >
                    <AvatarImage alt={avatar.name} src={avatar.src} />
                    <AvatarFallback className="text-xs">
                      {avatar.fallback}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <Avatar className="size-12 ring-2 ring-background">
                  <AvatarFallback className="text-xs">+3695</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
