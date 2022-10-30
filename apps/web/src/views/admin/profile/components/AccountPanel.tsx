import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Account, FirebaseAuth, useLoginQuery } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import CustomCard from 'components/card/Card';
import ReAuthentricateModal, {
  ReauthTarget,
} from 'components/modals/auth/ReAuthenticateModal';
import { FirebaseError } from 'firebase/app';
import { ReactNode, useState } from 'react';
import { parseErrorMessage } from 'utils/APIUtils';
import { useColors } from 'variables/colors';

export default function AccountPanel(props: {}) {
  const { account } = useLoginQuery().data;

  return (
    <CustomCard>
      <Text fontSize="2xl" fontWeight="600">
        Account Settings
      </Text>
      <Flex direction="column" gap={2} mt={2}>
        <Email account={account} />
        <Block text="Password">
          <ButtonGroup>
            <Button variant="brand">Forgot</Button>
            <Button>Reset</Button>
          </ButtonGroup>
        </Block>
      </Flex>
    </CustomCard>
  );
}

function Email({ account }: { account: Account }) {
  const [reauth, setReauth] = useState<ReauthTarget>();
  const [email, setEmail] = useState<string>(account.email);

  const emailMutation = useMutation((email: string) =>
    FirebaseAuth.changeEmail(email)
  );

  const onChangeMail = () => {
    setReauth({
      onDone: () => emailMutation.mutate(email),
    });
  };

  return (
    <Block text="Email">
      <ReAuthentricateModal
        target={reauth}
        onClose={() => setReauth(null)}
        message="You must verify to change your email"
      />
      <FormControl isInvalid={emailMutation.isError}>
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
      </FormControl>
    </Block>
  );
}

function Block({ text, children }: { text: string; children: ReactNode }) {
  const { textColorSecondary } = useColors();
  const bg = useColorModeValue('white', 'navy.700');

  return (
    <CustomCard bg={bg} my={2}>
      <Text color={textColorSecondary} fontWeight="500" mb={2}>
        {text}
      </Text>
      {children}
    </CustomCard>
  );
}
