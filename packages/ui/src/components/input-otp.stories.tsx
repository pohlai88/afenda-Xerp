import type { Meta, StoryObj } from "@storybook/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from "lucide-react";
import React, { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Button } from "./button";
import { Field, FieldDescription, FieldLabel } from "./field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";
import { Label } from "./label";

// ─── Helpers ───────────────────────────────────────────────────────────────

function OtpSlots({
  length,
  separatorAt,
}: {
  readonly length: number;
  readonly separatorAt?: number;
}) {
  const indices = Array.from({ length }, (_, index) => index);

  if (separatorAt === undefined) {
    return (
      <InputOTPGroup>
        {indices.map((index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
    );
  }

  const first = indices.slice(0, separatorAt);
  const second = indices.slice(separatorAt);

  return (
    <>
      <InputOTPGroup>
        {first.map((index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {second.map((index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
    </>
  );
}

function SixDigitOtp({
  disabled,
  onChange,
  onComplete,
  value,
}: {
  readonly disabled?: boolean;
  readonly onChange?: (value: string) => void;
  readonly onComplete?: (value: string) => void;
  readonly value?: string;
}) {
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      {...(disabled === undefined ? {} : { disabled })}
      {...(onChange ? { onChange } : {})}
      {...(onComplete ? { onComplete } : {})}
      {...(value === undefined ? {} : { value })}
    >
      <OtpSlots length={6} />
    </InputOTP>
  );
}

function MfaVerifyComponent() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleComplete = (code: string) => {
    setStatus(code === "123456" ? "success" : "error");
  };

  return (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <Label htmlFor="mfa-otp">Authentication code</Label>
          <SixDigitOtp
            onChange={(next) => {
              setValue(next);
              if (status === "error") {
                setStatus("idle");
              }
            }}
            onComplete={handleComplete}
            value={value}
          />
          <FieldDescription>
            Enter the 6-digit code from your authenticator app.
          </FieldDescription>
        </StoryStack>
        {status === "error" ? (
          <span className="text-destructive text-sm">
            Invalid code. Try 123456 in this demo.
          </span>
        ) : null}
        {status === "success" ? (
          <span className="text-sm text-success">
            Verified — session unlocked.
          </span>
        ) : null}
        <StoryRow gap="sm">
          <Button
            disabled={value.length < 6}
            emphasis="solid"
            intent="primary"
            onClick={() => handleComplete(value)}
            size="sm"
          >
            Verify
          </Button>
          <Button emphasis="ghost" intent="secondary" size="sm">
            Use backup code
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── InputOTP ──────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/InputOTP",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed one-time code input for ERP MFA, email/SMS verification, payment confirmation, and admin approval flows. Built on `input-otp` with slotted digit cells, optional separators, and paste support.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="sm">
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <OtpSlots length={6} />
      </InputOTP>
    </StoryFrame>
  ),
};

export const WithSeparator: Story = {
  name: "InputOTP — With Separator",
  render: () => (
    <StoryFrame width="sm">
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <OtpSlots length={6} separatorAt={3} />
      </InputOTP>
    </StoryFrame>
  ),
};

export const FourDigitPin: Story = {
  name: "InputOTP — Four Digit PIN",
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="xs">
        <Label htmlFor="pin-otp">PIN</Label>
        <InputOTP id="pin-otp" maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={4} />
        </InputOTP>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Pair with a visible `Label` and helper text. Digits are keyboard-operable; paste fills all slots. Use `pattern` to restrict input to digits.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <Field>
        <FieldLabel htmlFor="a11y-otp">Verification code</FieldLabel>
        <InputOTP id="a11y-otp" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} separatorAt={3} />
        </InputOTP>
        <FieldDescription>
          We sent a code to jane.doe@company.com. Expires in 10 minutes.
        </FieldDescription>
      </Field>
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  name: "InputOTP — Disabled",
  render: () => (
    <StoryFrame width="sm">
      <InputOTP
        disabled
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value="482910"
      >
        <OtpSlots length={6} />
      </InputOTP>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const MfaVerification: Story = {
  name: "ERP — MFA Verification",
  parameters: { layout: "padded" },
  render: () => <MfaVerifyComponent />,
};

export const EmailVerification: Story = {
  name: "ERP — Email Verification Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <StoryRow align="center" gap="sm">
            <MailIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-medium text-sm">Verify your email</span>
          </StoryRow>
          <FieldDescription>
            Enter the code sent to jane.doe@company.com to activate SSO login.
          </FieldDescription>
        </StoryStack>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} separatorAt={3} />
        </InputOTP>
        <Button emphasis="ghost" intent="secondary" size="sm">
          Resend code
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SmsLoginCode: Story = {
  name: "ERP — SMS Login Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <StoryRow align="center" gap="sm">
            <SmartphoneIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-medium text-sm">SMS verification</span>
          </StoryRow>
          <FieldDescription>
            Code sent to +1 (555) 010-2048. Standard messaging rates may apply.
          </FieldDescription>
        </StoryStack>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} />
        </InputOTP>
        <span className="text-muted-foreground text-xs">
          Resend available in 42 seconds
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const PaymentConfirmation: Story = {
  name: "ERP — Payment Confirmation Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Confirm wire transfer</span>
          <FieldDescription>
            Enter the 6-digit approval code from your banking token to post
            payment BATCH-2026-06-18 for $24,850.
          </FieldDescription>
        </StoryStack>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} separatorAt={3} />
        </InputOTP>
        <Button emphasis="solid" intent="primary" size="sm">
          Authorize payment
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const AdminApprovalCode: Story = {
  name: "ERP — Admin Approval Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <StoryRow align="center" gap="sm">
            <ShieldCheckIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-medium text-sm">Elevated action</span>
          </StoryRow>
          <FieldDescription>
            Posting journal entry JE-2026-0892 requires a second-factor code
            from a finance administrator.
          </FieldDescription>
        </StoryStack>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} />
        </InputOTP>
      </StoryStack>
    </StoryFrame>
  ),
};

export const DevicePairing: Story = {
  name: "ERP — Device Pairing Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <FieldDescription>
          Enter the pairing code shown on warehouse scanner WH-SCAN-04.
        </FieldDescription>
        <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={8} separatorAt={4} />
        </InputOTP>
        <Button emphasis="solid" intent="primary" size="sm">
          Pair device
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SessionUnlock: Story = {
  name: "ERP — Session Unlock Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <StoryRow align="center" gap="sm">
          <LockIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="font-medium text-sm">Session locked</span>
        </StoryRow>
        <FieldDescription>
          Idle timeout reached. Enter your 6-digit unlock PIN to continue
          working on PO-2026-1184.
        </FieldDescription>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} />
        </InputOTP>
        <Button emphasis="solid" intent="primary" size="sm">
          Unlock session
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const BackupRecoveryCode: Story = {
  name: "ERP — Backup Recovery Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <FieldDescription>
          Enter one unused backup code from your account recovery sheet. Codes
          are single-use.
        </FieldDescription>
        <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={8} separatorAt={4} />
        </InputOTP>
        <Button emphasis="outline" intent="secondary" size="sm">
          Verify backup code
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmployeeClockPin: Story = {
  name: "ERP — Employee Clock PIN",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <Field>
          <FieldLabel htmlFor="clock-pin">Clock-in PIN</FieldLabel>
          <InputOTP id="clock-pin" maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
            <OtpSlots length={4} />
          </InputOTP>
          <FieldDescription>
            EMP-1024 · Jane Doe · Manufacturing shift
          </FieldDescription>
        </Field>
        <Button emphasis="solid" intent="primary" size="sm">
          Clock in
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const VendorPortalInvite: Story = {
  name: "ERP — Vendor Portal Invite Code",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <FieldDescription>
          Acme Supplies Ltd. — enter the invite code from the vendor onboarding
          email to link your account.
        </FieldDescription>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} separatorAt={3} />
        </InputOTP>
        <Button emphasis="solid" intent="primary" size="sm">
          Activate vendor access
        </Button>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ExpenseApprovalToken: Story = {
  name: "ERP — Expense Approval Token",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <FieldDescription>
          Manager approval for EXP-2026-042 ($1,240). Enter the token from the
          approval email.
        </FieldDescription>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <OtpSlots length={6} />
        </InputOTP>
      </StoryStack>
    </StoryFrame>
  ),
};

export const OtpLengthMatrix: Story = {
  name: "Matrix — Common OTP Lengths",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      {(
        [
          { label: "4-digit PIN", length: 4 },
          { label: "6-digit MFA", length: 6, separatorAt: 3 },
          { label: "8-digit pairing", length: 8, separatorAt: 4 },
        ] as const
      ).map((row) => (
        <StoryFrame key={row.label} width="md">
          <StoryStack gap="xs">
            <span className="text-muted-foreground text-xs">{row.label}</span>
            <InputOTP maxLength={row.length} pattern={REGEXP_ONLY_DIGITS}>
              <OtpSlots
                length={row.length}
                {...("separatorAt" in row && row.separatorAt !== undefined
                  ? { separatorAt: row.separatorAt }
                  : {})}
              />
            </InputOTP>
          </StoryStack>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const InputOtpVsPassword: Story = {
  name: "ERP — OTP vs Password Field",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Use `InputOTP` for short, single-use codes with per-digit UX. Use password `Input` or `InputGroup` for reusable credentials.",
      },
    },
  },
  render: () => (
    <StoryFrame width="sm">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            OTP — one-time verification
          </span>
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
            <OtpSlots length={6} separatorAt={3} />
          </InputOTP>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Password — reusable secret
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Input or InputGroup for password fields
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
