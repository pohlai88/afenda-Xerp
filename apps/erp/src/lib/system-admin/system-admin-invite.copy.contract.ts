export const SYSTEM_ADMIN_INVITE_DIALOG_TITLE = "Invite user" as const;

export const SYSTEM_ADMIN_INVITE_DIALOG_DESCRIPTION =
  "Send a company-scoped invite with a governed role assignment." as const;

export const SYSTEM_ADMIN_INVITE_TRIGGER_LABEL = "Invite user" as const;

export const SYSTEM_ADMIN_INVITE_STEP_LABELS = {
  confirm: "Confirm invite",
  identity: "Identity",
  role: "Role",
} as const satisfies Record<"identity" | "role" | "confirm", string>;

export const SYSTEM_ADMIN_INVITE_IDENTITY_SECTION = {
  description: "Enter the invited user's display name and email address.",
  title: "User identity",
} as const;

export const SYSTEM_ADMIN_INVITE_ROLE_SECTION = {
  description: "Choose the company role granted when the invite is accepted.",
  title: "Assign role",
} as const;

export const SYSTEM_ADMIN_INVITE_CONFIRM_SECTION = {
  description: "Review the invite details before submission.",
  title: "Confirm invite",
} as const;

export const SYSTEM_ADMIN_INVITE_FIELD_LABELS = {
  displayName: "Display name",
  email: "Email address",
  role: "Role",
} as const;

export const SYSTEM_ADMIN_INVITE_NAV_LABELS = {
  back: "Back",
  next: "Continue",
  submit: "Send invite",
  submitting: "Sending invite…",
} as const;

export const SYSTEM_ADMIN_INVITE_SUCCESS_MESSAGE =
  "Invite submitted. The user will appear in the directory after provisioning completes." as const;

export const SYSTEM_ADMIN_INVITE_FAILURE_MESSAGE =
  "Unable to submit the invite. Verify the details and try again." as const;
