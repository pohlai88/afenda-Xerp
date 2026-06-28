import Error02Illustration from "@/assets/svg/error-02-illustration";

import { Button } from "@/components/ui/button";

const ErrorPage02 = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-8 py-8 sm:py-16 lg:py-24">
    <Error02Illustration className="h-[clamp(300px,50vh,500px)] max-sm:h-75" />

    <div className="text-center">
      <h3 className="mb-6 font-semibold text-5xl">Oops!</h3>
      <h4 className="mb-1.5 font-semibold text-3xl">Something went wrong</h4>
      <p className="mb-6">
        The page you&apos;re looking for isn&apos;t found, we suggest you back
        to home.
      </p>
      <Button asChild className="rounded-lg text-base" size="lg">
        <a href="#">Back to home page</a>
      </Button>
    </div>
  </div>
);

export default ErrorPage02;
