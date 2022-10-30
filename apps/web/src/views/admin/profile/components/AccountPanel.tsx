import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  HStack,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Account,
  FirebaseAuth,
  useLoginQuery,
  deleteAccount,
} from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import CustomCard from 'components/card/Card';
import PasswordInput from 'components/fields/PasswordInput';
import ReAuthentricateModal, {
  ReauthTarget,
} from 'components/modals/auth/ReAuthenticateModal';
import { useResetPasswordModal } from 'components/modals/auth/ResetPasswordModal';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { parseErrorMessage } from 'utils/APIUtils';
import { useColors } from 'variables/colors';

export default function AccountPanel() {
  const { account } = useLoginQuery().data;
  const [reauth, setReauth] = useState<ReauthTarget>();
  const { textColorPrimary } = useColors();

  return (
    <CustomCard>
      <ReAuthentricateModal target={reauth} onClose={() => setReauth(null)} />
      <Text color={textColorPrimary} fontSize="2xl" fontWeight="600">
        Account Settings
      </Text>
      <Flex direction="column" gap={2} mt={2}>
        <Email account={account} setTarget={setReauth} />
        <Pasword setTarget={setReauth} />
        <Footer setTarget={setReauth} />
      </Flex>
    </CustomCard>
  );
}

function Footer({ setTarget }: { setTarget: (target: ReauthTarget) => void }) {
  const logout = useMutation(() => FirebaseAuth.logout());
  const deleteMutation = useMutation(() => deleteAccount());
  const onDelete = () => {
    setTarget({
      message: 'You must be verified to Delete your Account',
      onDone: () => deleteMutation.mutate(),
    });
  };

  return (
    <ButtonGroup mt={8}>
      <Button
        color="red.400"
        isLoading={logout.isLoading}
        onClick={() => logout.mutate()}
      >
        Logout
      </Button>
      <Button
        variant="danger"
        isLoading={deleteMutation.isLoading}
        onClick={onDelete}
      >
        Delete Account
      </Button>
    </ButtonGroup>
  );
}

function Pasword({ setTarget }: { setTarget: (target: ReauthTarget) => void }) {
  const [password, setPassword] = useState<string>('');
  const mutation = useMutation((pw: string) => FirebaseAuth.changePassword(pw));
  const resetPassword = useResetPasswordModal();

  const onChange = () => {
    setTarget({
      message: 'You must verify to change your Password',
      onDone: () => mutation.mutate(password),
    });
  };

  return (
    <Block text="Password" isInvalid={mutation.isError}>
      {resetPassword.modal}
      <PasswordInput
        input={{
          placeholder: 'New Passowrd',
          variant: 'focus',
          value: password,
          onChange: (e) => setPassword(e.target.value),
        }}
      />
      <ButtonGroup mt={2}>
        <Button
          variant="brand"
          isLoading={mutation.isLoading}
          onClick={onChange}
        >
          Update Password
        </Button>
        <Button
          isLoading={resetPassword.mutation.isLoading}
          onClick={resetPassword.resetCurrentUser}
        >
          Reset
        </Button>
      </ButtonGroup>
      <FormErrorMessage>
        {mutation.error instanceof FirebaseError &&
          parseErrorMessage(
            mutation.error as FirebaseError,
            'Failed to change password'
          )}
      </FormErrorMessage>
    </Block>
  );
}

function Email({
  account,
  setTarget,
}: {
  account: Account;
  setTarget: (target: ReauthTarget) => void;
}) {
  const [email, setEmail] = useState<string>(account.email);
  const emailMutation = useMutation((email: string) =>
    FirebaseAuth.changeEmail(email)
  );

  const onChangeMail = () => {
    setTarget({
      message: 'You must verify to change your email',
      onDone: () => emailMutation.mutate(email),
    });
  };

  return (
    <Block text="Email" isInvalid={emailMutation.isError}>
      <HStack>
        <Input
          variant="focus"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          isLoading={emailMutation.isLoading}
          onClick={onChangeMail}
          variant="brand"
        >
          Update
        </Button>
      </HStack>
      <FormErrorMessage>
        {emailMutation.error instanceof FirebaseError &&
          parseErrorMessage(
            emailMutation.error as FirebaseError,
            'Failed to change email'
          )}
      </FormErrorMessage>
    </Block>
  );
}

function Block({ text, ...props }: { text: string } & FormControlProps) {
  const { textColorDetails } = useColors();
  const bg = useColorModeValue('secondaryGray.300', 'navy.700');

  return (
    <CustomCard bg={bg}>
      <Text color={textColorDetails} fontWeight="500" mb={2}>
        {text}
      </Text>
      <FormControl {...props}>{props?.children}</FormControl>
    </CustomCard>
  );
}
