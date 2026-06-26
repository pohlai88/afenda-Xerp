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

export interface AuthInviteEmailProps {
  readonly name: string;
  readonly url: string;
}

export function AuthInviteEmail({
  name,
  url,
}: AuthInviteEmailProps): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>You are invited to Afenda ERP</Preview>
      <Body>
        <Container>
          <Section>
            <Text>Hello {name},</Text>
            <Text>
              You have been invited to join Afenda ERP. Accept your invitation
              using the link below.
            </Text>
            <Button href={url}>Accept invitation</Button>
            <Text>
              If you did not expect this invitation, you can ignore this
              message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

AuthInviteEmail.PreviewProps = {
  name: "Test User",
  url: "https://erp.example.com/sign-up?invitationToken=abc",
} satisfies AuthInviteEmailProps;
