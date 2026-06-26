import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactElement } from "react";

export interface AuthVerifyEmailProps {
  readonly name: string;
  readonly url: string;
}

export function AuthVerifyEmail({
  name,
  url,
}: AuthVerifyEmailProps): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Verify your Afenda ERP email</Preview>
      <Body>
        <Container>
          <Section>
            <Text>Hello {name},</Text>
            <Text>Please verify your email address.</Text>
            <Button href={url}>Verify email</Button>
            <Text>
              If you did not create an account, you can ignore this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

AuthVerifyEmail.PreviewProps = {
  name: "Test User",
  url: "https://erp.example.com/api/auth/verify-email?token=abc",
} satisfies AuthVerifyEmailProps;
