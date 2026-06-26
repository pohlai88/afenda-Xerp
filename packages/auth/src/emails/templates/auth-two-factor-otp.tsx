import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactElement } from "react";

export interface AuthTwoFactorOtpEmailProps {
  readonly name: string;
  readonly otp: string;
}

export function AuthTwoFactorOtpEmail({
  name,
  otp,
}: AuthTwoFactorOtpEmailProps): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Your Afenda ERP sign-in code</Preview>
      <Body>
        <Container>
          <Section>
            <Text>Hello {name},</Text>
            <Text>Use this code to finish signing in to Afenda ERP:</Text>
            <Text>{otp}</Text>
            <Text>
              If you did not attempt to sign in, you can ignore this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

AuthTwoFactorOtpEmail.PreviewProps = {
  name: "Test User",
  otp: "123456",
} satisfies AuthTwoFactorOtpEmailProps;
