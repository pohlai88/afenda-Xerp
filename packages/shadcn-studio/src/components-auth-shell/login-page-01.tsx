import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components-assets/logo.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalLoginForm,
  getLoginPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import { AuthShellStage } from "./auth-shell-stage.js";
import LoginFormV1 from "./login-form-v1.js";

const BLOCK_ID = "login-page-01" as const;
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
const ssoMethod = getRequiredLoginMethod(LOGIN_PAGE_MANIFEST.blockId, "sso");
const forgotPasswordMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "forgot-password"
);
const signUpMethod = getRequiredLoginMethod(
  LOGIN_PAGE_MANIFEST.blockId,
  "sign-up"
);

export default function LoginPage01() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("login-page-01.content")}
      variant="access"
    >
      <div className="flex w-full items-center justify-center">
        <Card className="z-1 w-full max-w-lg gap-6 border-white/10 bg-background/86 py-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <CardHeader className="gap-6 px-6">
            <Logo className="gap-3" />

            <div>
              <CardTitle className="mb-2 font-semibold text-2xl">
                Sign in to Afenda ERP
              </CardTitle>
              <CardDescription className="text-base">
                Access your governed operator workspace.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6">
            <p className="mb-6 text-base text-muted-foreground">
              Continue with{" "}
              <a
                className="text-card-foreground hover:underline"
                href={passkeyMethod.href}
              >
                {passkeyMethod.label}
              </a>
            </p>

            <div className="mb-6 flex flex-wrap gap-4 sm:gap-6">
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

            <div className="space-y-4">
              <LoginFormV1 forgotPasswordHref={forgotPasswordMethod.href} />

              <p className="text-center text-base text-muted-foreground">
                New on our platform?{" "}
                <a
                  className="text-card-foreground hover:underline"
                  href={signUpMethod.href}
                >
                  {signUpMethod.label}
                </a>
              </p>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <p className="text-base">or</p>
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
          </CardContent>
        </Card>
      </div>
    </AuthShellStage>
  );
}
