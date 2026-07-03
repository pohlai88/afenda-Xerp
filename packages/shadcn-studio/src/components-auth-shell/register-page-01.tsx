import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GithubIcon from "@/components-assets/icon-github.js";
import GoogleIcon from "@/components-assets/icon-google.js";
import LogoIcon from "@/components-assets/icon-logo.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import {
  assertCanonicalRegisterForm,
  getRegisterPageManifest,
  getRequiredLoginMethod,
} from "./auth-shell-method-manifest.js";
import RegisterFormV1 from "./register-form-v1.js";

const BLOCK_ID = "register-page-01" as const;
const REGISTER_PAGE_MANIFEST = getRegisterPageManifest(BLOCK_ID);
assertCanonicalRegisterForm(REGISTER_PAGE_MANIFEST.blockId);

const googleMethod = getRequiredLoginMethod(
  REGISTER_PAGE_MANIFEST.blockId,
  "google"
);
const githubMethod = getRequiredLoginMethod(
  REGISTER_PAGE_MANIFEST.blockId,
  "github"
);
const passkeyMethod = getRequiredLoginMethod(
  REGISTER_PAGE_MANIFEST.blockId,
  "passkey"
);
const ssoMethod = getRequiredLoginMethod(REGISTER_PAGE_MANIFEST.blockId, "sso");
const signInMethod = getRequiredLoginMethod(
  REGISTER_PAGE_MANIFEST.blockId,
  "sign-in"
);
const backToWebsiteMethod = getRequiredLoginMethod(
  REGISTER_PAGE_MANIFEST.blockId,
  "back-to-website"
);

export default function RegisterPage01() {
  return (
    <main
      {...blockSlotDomMarkerProps("register-page-01.content")}
      className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(26rem,34rem)] lg:px-0 lg:py-0"
    >
      <section
        {...blockSlotDomMarkerProps("register.branding")}
        className="flex flex-col justify-between gap-10 rounded-lg bg-primary p-8 text-primary-foreground lg:min-h-dvh lg:rounded-none lg:p-14 xl:p-16"
      >
        <div className="flex items-center gap-3">
          <LogoIcon className="size-10" variant="brand" />
          <span className="font-semibold text-lg tracking-tight">Afenda</span>
        </div>

        <div className="max-w-2xl space-y-5">
          <p
            {...blockSlotDomMarkerProps("register.branding.eyebrow")}
            className="font-medium text-primary-foreground/75 text-sm uppercase tracking-[0.18em]"
          >
            Invitation onboarding
          </p>
          <h1
            {...blockSlotDomMarkerProps("register.branding.title")}
            className="font-semibold text-3xl tracking-normal md:text-5xl"
          >
            Create your Afenda ERP account
          </h1>
          <p
            {...blockSlotDomMarkerProps("register.branding.lead")}
            className="max-w-xl text-lg text-primary-foreground/80"
          >
            Use your approved workspace invitation to join a governed operator
            environment.
          </p>
        </div>

        <div className="grid gap-3 text-primary-foreground/80 text-sm sm:grid-cols-3">
          <span>Verified identity</span>
          <span>Workspace approval</span>
          <span>Audit-ready access</span>
        </div>
      </section>

      <section className="flex items-center justify-center py-8 lg:min-h-dvh lg:px-8">
        <Card className="w-full max-w-lg gap-6 border-0 py-0 shadow-none lg:border lg:py-6 lg:shadow-sm">
          <CardHeader className="gap-3 px-0 lg:px-6">
            <CardTitle
              {...blockSlotDomMarkerProps("register.form.title")}
              className="font-semibold text-2xl"
            >
              Accept your invitation
            </CardTitle>
            <CardDescription
              {...blockSlotDomMarkerProps("register.form.subtitle")}
              className="text-base"
            >
              Create credentials for the workspace your team approved.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 px-0 lg:px-6">
            <div aria-hidden="true" className="sr-only">
              <span {...blockSlotDomMarkerProps("register.name")} />
              <span {...blockSlotDomMarkerProps("register.email")} />
              <span {...blockSlotDomMarkerProps("register.password")} />
              <span {...blockSlotDomMarkerProps("register.confirmPassword")} />
              <span {...blockSlotDomMarkerProps("register.invitationCode")} />
              <span {...blockSlotDomMarkerProps("register.submit")} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                nativeButton={false}
                render={<a href={googleMethod.href} />}
                variant="outline"
              >
                <GoogleIcon className="size-4" variant="brand" />
                {googleMethod.label}
              </Button>
              <Button
                nativeButton={false}
                render={<a href={githubMethod.href} />}
                variant="outline"
              >
                <GithubIcon className="size-4" variant="brand" />
                {githubMethod.label}
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                nativeButton={false}
                render={<a href={ssoMethod.href} />}
                variant="secondary"
              >
                {ssoMethod.label}
              </Button>
              <Button
                nativeButton={false}
                render={<a href={passkeyMethod.href} />}
                variant="secondary"
              >
                {passkeyMethod.label}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-muted-foreground text-sm">
                or create credentials
              </p>
              <Separator className="flex-1" />
            </div>

            <RegisterFormV1 />

            <div className="space-y-2 text-center text-muted-foreground text-sm">
              <p>
                Already have access?{" "}
                <a
                  className="text-foreground hover:underline"
                  href={signInMethod.href}
                >
                  Sign in
                </a>
              </p>
              <a
                className="inline-flex text-foreground hover:underline"
                href={backToWebsiteMethod.href}
              >
                {backToWebsiteMethod.label}
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
