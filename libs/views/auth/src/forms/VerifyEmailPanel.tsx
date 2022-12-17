import { Button, ButtonGroup, Center, Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';

export function VerifyEmailPanel({
  user,
  send,
  isLoading,
}: {
  user: User | null;
  send: (user: User) => void;
  isLoading: boolean;
}) {
  return (
    <AuthForm
      title="Verify Email"
      description={
        <>
          We have just sent your an email <b>{user?.email}</b>
          <br />
          Please check the email to continue
        </>
      }
    >
      <ButtonGroup>
        <Button variant="brand" onClick={() => send(user)} isLoading={isLoading}>
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
