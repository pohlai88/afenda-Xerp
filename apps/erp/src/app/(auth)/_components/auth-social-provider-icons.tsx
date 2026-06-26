import type { SignInSocialProviderId } from "@afenda/auth/client";

function AuthProviderIconFrame({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <span aria-hidden="true" className="erp-auth-form__social-icon">
      {children}
    </span>
  );
}

export function AuthGoogleIcon() {
  return (
    <AuthProviderIconFrame>
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.6 12.2273C21.6 11.5182 21.5364 10.8364 21.4182 10.1818H12V14.05H17.3818C17.15 15.3 16.4455 16.3591 15.3864 17.0682V19.5773H18.6182C20.5091 17.8364 21.6 15.2727 21.6 12.2273Z"
          fill="#4285F4"
        />
        <path
          d="M12 22C14.7 22 16.9636 21.1045 18.6182 19.5773L15.3864 17.0682C14.4909 17.6682 13.3455 18.0227 12 18.0227C9.39545 18.0227 7.19091 16.2636 6.40455 13.9H3.06364V16.4909C4.70909 19.7591 8.09091 22 12 22Z"
          fill="#34A853"
        />
        <path
          d="M6.40455 13.9C6.20455 13.3 6.09091 12.6591 6.09091 12C6.09091 11.3409 6.20455 10.7 6.40455 10.1V7.50909H3.06364C2.38636 8.85909 2 10.3864 2 12C2 13.6136 2.38636 15.1409 3.06364 16.4909L6.40455 13.9Z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.97727C13.4682 5.97727 14.7864 6.48182 15.8227 7.47273L18.6909 4.60455C16.9591 2.99091 14.6955 2 12 2C8.09091 2 4.70909 4.24091 3.06364 7.50909L6.40455 10.1C7.19091 7.73636 9.39545 5.97727 12 5.97727Z"
          fill="#EA4335"
        />
      </svg>
    </AuthProviderIconFrame>
  );
}

export function AuthGithubIcon() {
  return (
    <AuthProviderIconFrame>
      <svg
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    </AuthProviderIconFrame>
  );
}

export function AuthPasskeyIcon() {
  return (
    <AuthProviderIconFrame>
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M7 11v1a5 5 0 0 0 10 0v-1" />
        <path d="M12 17v4" />
        <path d="M8 21h8" />
      </svg>
    </AuthProviderIconFrame>
  );
}

const SOCIAL_PROVIDER_ICONS: Record<
  SignInSocialProviderId,
  () => React.ReactElement
> = {
  google: AuthGoogleIcon,
  github: AuthGithubIcon,
};

export function AuthSocialProviderIcon({
  providerId,
}: {
  readonly providerId: SignInSocialProviderId;
}) {
  const Icon = SOCIAL_PROVIDER_ICONS[providerId];
  return <Icon />;
}
