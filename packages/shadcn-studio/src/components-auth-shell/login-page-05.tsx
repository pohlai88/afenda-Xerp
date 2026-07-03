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
import { blockSlotDomMarkerProps } from "../../../meta-contracts/block-slot-dom-marker.contract.js";
import LoginForm from "./login-form-05";

const Login = () => (
  <div
    {...blockSlotDomMarkerProps("login-page-05.content")}
    className="flex h-auto min-h-screen items-center justify-center bg-muted px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24"
  >
    <Card className="relative w-full max-w-md gap-6 overflow-hidden pt-12 pb-6">
      <div className="pointer-events-none absolute top-0 h-52 w-full rounded-t-xl bg-linear-to-t from-transparent to-primary/10" />

      <AuthLines className="pointer-events-none absolute inset-x-0 top-0" />

      <CardHeader className="justify-center gap-6 px-6 text-center">
        <Logo className="justify-center gap-3" />

        <div>
          <CardTitle className="mb-2 text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Please enter your details to sign in
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="mb-6 flex items-center gap-2.5">
          <Button
            className="grow"
            nativeButton={false}
            render={<a href="#" />}
            variant="outline"
          >
            <img
              alt="google icon"
              className="size-5"
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png"
            />
          </Button>
          <Button
            className="grow"
            nativeButton={false}
            render={<a href="#" />}
            variant="outline"
          >
            <img
              alt="facebook icon"
              className="size-5"
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/facebook-icon.png"
            />
          </Button>
          <Button
            className="grow"
            nativeButton={false}
            render={<a href="#" />}
            variant="outline"
          >
            <img
              alt="github icon"
              className="size-5 dark:invert"
              src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-icon.png"
            />
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <Separator className="flex-1" />
          <p className="text-base">or</p>
          <Separator className="flex-1" />
        </div>

        <LoginForm />

        <p className="mt-4 text-center text-base text-muted-foreground">
          New on our platform?{" "}
          <a className="text-card-foreground hover:underline" href="#">
            Create an account
          </a>
        </p>
      </CardContent>
    </Card>
  </div>
);

export default Login;
