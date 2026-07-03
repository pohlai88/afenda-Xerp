import AuthBackgroundShape from "@/assets/svg/auth-background-shape";
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
import LoginForm from "./login-form-01";

const Login = () => {
  return (
    <div
      {...blockSlotDomMarkerProps("login-page-01.content")}
      className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-1 w-full gap-6 py-6 sm:max-w-lg">
        <CardHeader className="gap-6 px-6">
          <Logo className="gap-3" />

          <div>
            <CardTitle className="mb-2 font-semibold text-2xl">
              Sign in to Shadcn Studio
            </CardTitle>
            <CardDescription className="text-base">
              Ship Faster and Focus on Growth.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6">
          <p className="mb-6 text-base text-muted-foreground">
            Login with{" "}
            <a className="text-card-foreground hover:underline" href="#">
              Magic Link
            </a>
          </p>

          {/* Quick Login Buttons */}
          <div className="mb-6 flex flex-wrap gap-4 sm:gap-6">
            <Button className="grow" variant="outline">
              Login as User
            </Button>
            <Button className="grow" variant="outline">
              Login as Admin
            </Button>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <LoginForm />

            <p className="text-center text-base text-muted-foreground">
              New on our platform?{" "}
              <a className="text-card-foreground hover:underline" href="#">
                Create an account
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
              render={<a href="#" />}
              variant="ghost"
            >
              Sign in with google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
