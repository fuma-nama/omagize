import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Link,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { HSeparator } from 'components/separator/Separator';
import { useAuthColors } from 'variables/colors';
import PasswordInput from 'components/fields/PasswordInput';
import { SignUpOptions, useVerifySignUp } from 'utils/APIUtils';
import Group from '../components/VerifyGroup';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { AuthForm } from '../components/AuthForm';
import { AuthPage } from '..';

export function SignUpForm(props: {
  signup: (options: SignUpOptions) => void;
  isLoading: boolean;
  isError: boolean;
  error: string;
  setPage: (page: AuthPage) => void;
}) {
  // Chakra color mode
  const { textColorDetails, textColorBrand } = useAuthColors();

  const [options, setOptions] = useState<SignUpOptions>({
    username: '',
    email: '',
    password: '',
  });

  function update(options: Partial<SignUpOptions>) {
    setOptions((prev) => ({ ...prev, ...options }));
  }

  const signUp = useVerifySignUp(props.signup);

  return (
    <AuthForm
      title="Sign Up"
      description="Enter username, email and password to create your Account!"
    >
      <GoogleSignInButton />
      <Flex align="center" mb="25px">
        <HSeparator />
        <Text color="gray.400" mx="14px">
          or
        </Text>
        <HSeparator />
      </Flex>
      <FormControl isInvalid={props.isError}>
        <Group title="Username" error={signUp.issues.username}>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            placeholder="Henry"
            fontWeight="500"
            size="lg"
            value={options.username}
            onChange={(e) => update({ username: e.target.value })}
          />
        </Group>
        <Group title="Email" error={signUp.issues.email}>
          <Input
            id="email"
            isRequired={true}
            variant="auth"
            fontSize="sm"
            type="email"
            placeholder="your@email.com"
            fontWeight="500"
            size="lg"
            value={options.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </Group>
        <Group title="Password" error={signUp.issues.password}>
          <PasswordInput
            input={{
              placeholder: 'Must longer than 8 characters',
              value: options.password,
              onChange: (e) => update({ password: e.target.value }),
            }}
          />
        </Group>
        <FormErrorMessage>{props.error}</FormErrorMessage>
        <Button
          isLoading={props.isLoading}
          onClick={() => signUp.mutate(options)}
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mb="24px"
        >
          Sign Up
        </Button>
      </FormControl>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        maxW="100%"
        mt="0px"
      >
        <Text color={textColorDetails} fontWeight="400" fontSize="14px">
          Already have an Account?
          <Link
            color={textColorBrand}
            ms="5px"
            fontWeight="500"
            onClick={() => props.setPage(AuthPage.SignIn)}
          >
            Login
          </Link>
        </Text>
      </Flex>
    </AuthForm>
  );
}
