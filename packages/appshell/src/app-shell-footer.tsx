import FacebookIcon from "./assets/svg/facebook-icon";
import InstagramIcon from "./assets/svg/instagram-icon";
import LinkedinIcon from "./assets/svg/linkedin-icon";
import TwitterIcon from "./assets/svg/twitter-icon";

export function AppShellFooter() {
  return (
    <footer>
      <div className="text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 max-sm:flex-col sm:gap-6 sm:px-6">
        <p className="text-sm text-balance max-sm:text-center">
          {`©${new Date().getFullYear()}`}{" "}
          <a className="text-primary" href="https://afenda.io">
            Afenda ERP
          </a>
          , Enterprise operations platform
        </p>
        <div className="flex items-center gap-5">
          <a aria-label="Facebook" href="#">
            <FacebookIcon className="size-4" />
          </a>
          <a aria-label="Instagram" href="#">
            <InstagramIcon className="size-4" />
          </a>
          <a aria-label="LinkedIn" href="#">
            <LinkedinIcon className="size-4" />
          </a>
          <a aria-label="Twitter" href="#">
            <TwitterIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
