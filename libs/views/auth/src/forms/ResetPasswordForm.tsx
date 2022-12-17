import { ArrowLeftIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { FirebaseAuth } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthPage } from '..';
import { AuthForm } from '../components/AuthForm';

export function ResetPasswordForm(props: { setPage: (page: AuthPage) => void }) {
  const [sent, setSent] = useState<string | null>(null);

  return (
    <AuthForm
      title="Reset Password"
      description="We will send you an email for resetting the password"
    >
      <ResetPanel
        sent={sent}
        setSent={(email) => setSent(email)}
        back={() => props.setPage(AuthPage.SignIn)}
      />
    </AuthForm>
  );
}

function ResetPanel({
  sent,
  setSent,
  back,
}: {
  sent?: string;
  setSent: (email: string) => void;
  back: () => void;
}) {
  const [email, setEmail] = useState<string>('');
  const mutation = useMutation((email: string) => FirebaseAuth.resetPassword(email), {
    onSuccess(_, email: string) {
      return setSent(email);
    },
  });

  return (
    <>
      <FormControl isInvalid={mutation.isError}>
        <FormLabel htmlFor="email-reset">Your Email</FormLabel>
        <Input
          fontSize="sm"
          id="email-reset"
          variant="auth"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {sent && (
          <Text color="green.400">
            We had sent the email to <b>{sent}</b>
          </Text>
        )}
        <FormErrorMessage>Failed to send Email</FormErrorMessage>
      </FormControl>

      <ButtonGroup mt={8}>
        <Button leftIcon={<ArrowLeftIcon />} onClick={back}>
          Back
        </Button>
        <Button
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate(email)}
          variant="brand"
        >
          {sent === email ? 'Resend Email' : 'Reset Password'}
        </Button>
      </ButtonGroup>
    </>
  );
}
