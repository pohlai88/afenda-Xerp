import { KeyRoundIcon } from "lucide-react";
import AuthLines from "@/assets/svg/auth-lines";
import Logo from "@/assets/svg/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalLoginForm,
  getLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import { AuthShellStage } from "./auth-shell-stage.js";
import LoginFormV1 from "./login-form-v1.js";

const BLOCK_ID = "login-page-05" as const;
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
const passkeyMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "passkey"
);
const forgotPasswordMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "forgot-password"
);
const signUpMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "sign-up"
);

export default function LoginPage05() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("login-page-05.content")}
      variant="access"
    >
      <div className="flex w-full items-center justify-center">
        <Card className="relative w-full max-w-md gap-6 overflow-hidden border-white/10 bg-background/86 pt-12 pb-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute top-0 h-52 w-full rounded-t-xl bg-linear-to-t from-transparent to-primary/10" />

          <AuthLines className="pointer-events-none absolute inset-x-0 top-0" />

          <CardHeader className="justify-center gap-6 px-6 text-center">
            <Logo className="justify-center gap-3" />

            <div>
              <CardTitle className="mb-2 text-2xl">Welcome back</CardTitle>
              <CardDescription className="text-base">
                Please enter your details to sign in.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6">
            <div className="mb-6 flex items-center gap-2.5">
              <Button
                aria-label={googleMethod.label}
                className="grow"
                nativeButton={false}
                render={<a href={googleMethod.href} />}
                variant="outline"
              >
                <img
                  alt=""
                  className="size-5"
                  src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png"
                />
              </Button>
              <Button
                aria-label={githubMethod.label}
                className="grow"
                nativeButton={false}
                render={<a href={githubMethod.href} />}
                variant="outline"
              >
                <img
                  alt=""
                  className="size-5"
                  src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-icon.png"
                />
              </Button>
              <Button
                aria-label={passkeyMethod.label}
                className="grow"
                nativeButton={false}
                render={<a href={passkeyMethod.href} />}
                variant="outline"
              >
                <KeyRoundIcon className="size-5" />
              </Button>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-base">or</p>
              <Separator className="flex-1" />
            </div>

            <LoginFormV1 forgotPasswordHref={forgotPasswordMethod.href} />

            <p className="mt-4 text-center text-base text-muted-foreground">
              New on our platform?{" "}
              <a
                className="text-card-foreground hover:underline"
                href={signUpMethod.href}
              >
                {signUpMethod.label}
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthShellStage>
  );
}
