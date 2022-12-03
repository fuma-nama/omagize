import { Button, ButtonGroup, Center, Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';

export function VerifyMailAuto({
  user,
  send,
  isLoading,
}: {
  user: User | null;
  send: (user: User) => void;
  isLoading: boolean;
}) {
  return (
    <VerifyMail
      email={user?.email}
      resend={() => send(user)}
      isResending={isLoading}
      changeEmail={() => {
        console.log('Not implemented');
      }}
    />
  );
}

export function VerifyMail({
  email,
  resend,
  isResending,
}: {
  email: string;
  resend: () => void;
  isResending: boolean;
  changeEmail: () => void;
}) {
  return (
    <AuthForm
      title="Verify Email"
      description={
        <>
          We have just sent your an email <b>{email}</b>
          <br />
          Please check the email to continue
        </>
      }
    >
      <ButtonGroup>
        <Button variant="brand" onClick={resend} isLoading={isResending}>
          Resend Email
        </Button>
        <Button>Change Email</Button>
      </ButtonGroup>
    </AuthForm>
  );
}

/**
 * client must re-login to the account
 */
export function EmailVerifiedHandle() {
  const navigate = useNavigate();

  return (
    <Center h="full">
      <Flex direction="column">
        <AuthForm title="Email Verified" description="Your account email has been verified">
          <ButtonGroup>
            <Button onClick={() => navigate('/auth/signin')} variant="brand">
              Login to Your Account
            </Button>
          </ButtonGroup>
        </AuthForm>
      </Flex>
    </Center>
  );
}
