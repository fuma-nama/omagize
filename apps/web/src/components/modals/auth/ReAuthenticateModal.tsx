import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Button,
  Icon,
  FormControl,
  FormLabel,
  Flex,
  ModalCloseButton,
  HStack,
  FormErrorMessage,
  ModalFooter,
} from '@chakra-ui/react';
import { firebase, FirebaseAuth } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import PasswordInput from 'components/fields/PasswordInput';
import { FirebaseError } from 'firebase/app';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { parseFirebaseError } from 'utils/APIUtils';
import { useColors } from 'variables/colors';

export type ReauthTarget = {
  message: string;
  onDone: () => void;
};
type ProviderProps = { onSuccess: () => void };
export default function ReAuthentricateModal({
  target,
  onClose,
}: {
  onClose: () => void;
  target?: ReauthTarget;
}) {
  const providers = firebase.auth.currentUser.providerData.sort((a) =>
    a.providerId === EmailAuthProvider.PROVIDER_ID ? -1 : 1
  );

  const { textColorSecondary } = useColors();
  const onDone = () => {
    target?.onDone();
    onClose();
  };

  return (
    <Modal isOpen={target != null} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Verify Required</ModalHeader>
        <ModalBody>
          <Text color={textColorSecondary}>{target?.message}</Text>
          <Flex direction="column" gap={4} mt={4}>
            {target != null &&
              providers.map((provider) => {
                const id = provider.providerId;

                switch (id) {
                  case GoogleAuthProvider.PROVIDER_ID:
                    return <Google key={id} onSuccess={onDone} />;
                  case EmailAuthProvider.PROVIDER_ID:
                    return <Email key={id} onSuccess={onDone} />;
                  default:
                    return <></>;
                }
              })}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button w="full" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function Email({ onSuccess }: ProviderProps) {
  const id = 'password';
  const [password, setPassword] = useState<string>('');

  const mutation = useMutation(
    (pw: string) => FirebaseAuth.reauth.withPassword(pw),
    {
      onSuccess,
    }
  );
  return (
    <FormControl isInvalid={mutation.isError}>
      <FormLabel fontSize="lg" fontWeight="600" htmlFor={id}>
        Email and Password
      </FormLabel>
      <HStack>
        <PasswordInput
          input={{
            id,
            placeholder: 'Password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
          }}
        />
        <Button
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate(password)}
          type="submit"
          px={6}
        >
          Submit
        </Button>
      </HStack>
      <FormErrorMessage>
        {mutation.error instanceof FirebaseError &&
          parseFirebaseError(mutation.error as FirebaseError)}
      </FormErrorMessage>
    </FormControl>
  );
}

function Google({ onSuccess }: ProviderProps) {
  const mutation = useMutation(() => FirebaseAuth.reauth.withGoogle(), {
    onSuccess,
  });

  return (
    <FormControl isInvalid={mutation.isError}>
      <FormLabel fontSize="lg" fontWeight="600">
        Google
      </FormLabel>
      <Button
        leftIcon={<Icon as={FcGoogle} />}
        isLoading={mutation.isLoading}
        onClick={() => mutation.mutate()}
      >
        Verify With Google
      </Button>
      <FormErrorMessage>
        {mutation.error instanceof FirebaseError &&
          parseFirebaseError(mutation.error as FirebaseError)}
      </FormErrorMessage>
    </FormControl>
  );
}
