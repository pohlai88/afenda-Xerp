export type PresentationLoginPattern =
  | "swiss-noir"
  | "verdant-milk-noir"
  | "verdant-portal-noir"
  | "swiss-noir-operator-rail";

/** Auth Pattern Lab registry IDs for primary login candidates. */
export type AuthPatternLoginId =
  | "swiss-noir-verification-gate"
  | "verdant-milk-identity-vault"
  | "verdant-centered-portal"
  | "swiss-noir-operator-rail";

/** Maps registry pattern IDs to login contract slugs (SSOT for agents + tests). */
export const AUTH_PATTERN_TO_LOGIN_PATTERN = {
  "swiss-noir-verification-gate": "swiss-noir",
  "verdant-milk-identity-vault": "verdant-milk-noir",
  "verdant-centered-portal": "verdant-portal-noir",
  "swiss-noir-operator-rail": "swiss-noir-operator-rail",
} as const satisfies Record<AuthPatternLoginId, PresentationLoginPattern>;

export const LOGIN_PATTERN_TO_AUTH_PATTERN = {
  "swiss-noir": "swiss-noir-verification-gate",
  "verdant-milk-noir": "verdant-milk-identity-vault",
  "verdant-portal-noir": "verdant-centered-portal",
  "swiss-noir-operator-rail": "swiss-noir-operator-rail",
} as const satisfies Record<PresentationLoginPattern, AuthPatternLoginId>;

export type PresentationLoginGovernanceLine = {
  readonly key: string;
  readonly label: string;
  readonly value: string;
};

export type PresentationLoginTelemetryRow = {
  readonly key: string;
  readonly metric: string;
  readonly reading: string;
  readonly status: "nominal" | "watch";
};

/** Quiet editorial copy — no proof strip, no policy paragraphs. */
export type PresentationLoginCopy = {
  readonly eyebrow: string;
  readonly titleMuted: string;
  readonly titlePrimary: string;
  readonly verticalMark: string;
  readonly systemLine: string;
  readonly statusLabel: string;
  readonly panelLabel?: string;
  readonly panelTitle: string;
  readonly emailLabel: string;
  readonly passwordLabel: string;
  readonly emailPlaceholder: string;
  readonly passwordPlaceholder: string;
  readonly submitLabel: string;
  readonly recoveryLabel: string;
  readonly footerMark?: string;
  readonly readoutLabel?: string;
  readonly readoutTitle?: string;
  readonly readoutStatusLabel?: string;
  readonly governanceLines?: readonly PresentationLoginGovernanceLine[];
  readonly telemetryRows?: readonly PresentationLoginTelemetryRow[];
};

export const presentationLoginCopy = {
  "swiss-noir": {
    eyebrow: "Afenda",
    titleMuted: "Sign",
    titlePrimary: "In",
    verticalMark: "verify access",
    systemLine: "@afenda · sign in chamber",
    statusLabel: "access",
    panelLabel: "Verification gate",
    panelTitle: "Continue when you are ready.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@company.com",
    passwordPlaceholder: "••••••••••••",
    submitLabel: "Sign in",
    recoveryLabel: "Forgot password?",
    footerMark: "sign in · afenda",
  },
  "verdant-milk-noir": {
    eyebrow: "Afenda",
    titleMuted: "Performance",
    titlePrimary: "Access",
    verticalMark: "operator identity",
    systemLine: "@afenda · identity vault",
    statusLabel: "sealed",
    panelLabel: "Identity vault",
    panelTitle: "Present credentials when ready.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@company.com",
    passwordPlaceholder: "••••••••••••",
    submitLabel: "Sign in",
    recoveryLabel: "Forgot password?",
    footerMark: "identity · afenda",
  },
  "verdant-portal-noir": {
    eyebrow: "Afenda",
    titleMuted: "Performance",
    titlePrimary: "Portal",
    verticalMark: "center access",
    systemLine: "@afenda · access portal",
    statusLabel: "ready",
    panelLabel: "Access portal",
    panelTitle: "Step through when credentials are set.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@company.com",
    passwordPlaceholder: "••••••••••••",
    submitLabel: "Sign in",
    recoveryLabel: "Forgot password?",
    footerMark: "portal · afenda",
  },
  "swiss-noir-operator-rail": {
    eyebrow: "Afenda",
    titleMuted: "Operator",
    titlePrimary: "Rail",
    verticalMark: "access rail",
    systemLine: "@afenda · operator ingress",
    statusLabel: "armed",
    panelLabel: "Access rail",
    panelTitle: "Authenticate when credentials are set.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@company.com",
    passwordPlaceholder: "••••••••••••",
    submitLabel: "Sign in",
    recoveryLabel: "Forgot password?",
    readoutLabel: "System readout",
    readoutTitle: "Ingress governance panel",
    readoutStatusLabel: "armed",
    governanceLines: [
      {
        key: "tenant",
        label: "Tenant context",
        value: "governed · prod surface",
      },
      { key: "policy", label: "Policy bundle", value: "erp-operator · sealed" },
      { key: "session", label: "Session mode", value: "governed · mfa-ready" },
      {
        key: "audit",
        label: "Audit stream",
        value: "enabled · correlation pass-through",
      },
    ],
    telemetryRows: [
      {
        key: "ingress",
        metric: "INGRESS_GATE",
        reading: "armed",
        status: "watch",
      },
      {
        key: "rbac",
        metric: "RBAC_RESOLVE",
        reading: "ready",
        status: "nominal",
      },
      {
        key: "audit",
        metric: "AUDIT_STREAM",
        reading: "live",
        status: "nominal",
      },
    ],
  },
} as const satisfies Record<PresentationLoginPattern, PresentationLoginCopy>;

export const loginFormClassName = "mt-8 grid gap-4" as const;

export const loginFieldClassName = "grid gap-2" as const;

export const swissLoginInputClassName =
  "h-12 rounded-md border border-input bg-background/40 px-4 text-sm text-foreground shadow-sm transition outline-none placeholder:text-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/25" as const;

export const swissLoginLabelClassName =
  "lab-noir-mono text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground" as const;

export const swissLoginSubmitClassName =
  "mt-2 h-12 rounded-md bg-primary px-4 lab-noir-mono text-[0.68rem] uppercase tracking-[0.22em] text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" as const;

export const swissLoginRecoveryClassName =
  "lab-noir-mono text-left text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" as const;

export const verdantLoginInputClassName =
  "h-12 rounded-xl border border-afenda-hairline bg-background/35 px-4 text-sm text-milk shadow-sm transition outline-none placeholder:text-milk-muted/50 focus:border-afenda-gold focus:ring-2 focus:ring-afenda-gold/20" as const;

export const verdantLoginLabelClassName =
  "font-lab-mono text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground" as const;

export const verdantLoginSubmitClassName =
  "mt-2 h-12 rounded-xl bg-primary px-4 font-lab-mono text-[0.68rem] uppercase tracking-[0.22em] text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" as const;

export const verdantLoginRecoveryClassName =
  "font-lab-mono text-left text-[0.6rem] uppercase tracking-[0.22em] text-milk-muted underline-offset-4 hover:text-milk hover:underline" as const;
