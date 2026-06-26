export type AuthFormStateName =
  | "idle"
  | "submitting"
  | "success"
  | "invalid"
  | "error"
  | "forbidden"
  | "expired";

export interface AuthFormContextValue {
  readonly actions: {
    readonly reset: () => void;
  };
  readonly state: AuthFormStateName;
}
