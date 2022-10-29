import { useState } from 'react';
// Chakra imports
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
} from '@chakra-ui/react';
// Custom components
import { HSeparator } from 'components/separator/Separator';
import { useAuthColors } from 'variables/colors';
import PasswordInput from 'components/fields/PasswordInput';
import VerifyGroup from '../components/VerifyGroup';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

import { AuthForm } from '../components/AuthForm';
import { AuthPage } from '..';

type Options = {
  email: string;
  password: string;
};

export function SignInForm(props: {
  signin: (options: Options) => void;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  setPage: (page: AuthPage) => void;
}) {
  // Chakra color mode
  const {
    textColorPrimary: textColor,
    textColorDetails,
    textColorBrand,
  } = useAuthColors();

  const [options, setOptions] = useState<Options>({
    email: '',
    password: '',
  });

  function update(options: Partial<Options>) {
    setOptions((prev) => ({ ...prev, ...options }));
  }

  return (
    <AuthForm
      title="Sign In"
      description="Enter your email and password to sign in!"
    >
      <GoogleSignInButton />
      <Flex align="center" mb="25px">
        <HSeparator />
        <Text color="gray.400" mx="14px">
          or
        </Text>
        <HSeparator />
      </Flex>
      <VerifyGroup
        title="Email"
        error={props.isError && 'Wrong Email or Password'}
      >
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
      </VerifyGroup>
      <VerifyGroup
        title="Password"
        error={props.isError && 'Wrong Email or Password'}
      >
        <PasswordInput
          input={{
            placeholder: 'Must longer than 8 characters',
            value: options.password,
            onChange: (e) => update({ password: e.target.value }),
          }}
        />
      </VerifyGroup>
      <FormControl display="flex" alignItems="center" mb="24px">
        <Checkbox id="remember-login" colorScheme="brandScheme" me="10px" />
        <FormLabel
          htmlFor="remember-login"
          mb="0"
          fontWeight="normal"
          color={textColor}
          fontSize="sm"
        >
          Keep me logged in
        </FormLabel>
      </FormControl>
      <Button
        isLoading={props.isLoading}
        onClick={() => props.signin(options)}
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="100%"
        h="50"
        mb="24px"
      >
        Login
      </Button>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        maxW="100%"
        mt="0px"
      >
        <Text color={textColorDetails} fontWeight="400" fontSize="14px">
          Not registered yet?
          <Link
            color={textColorBrand}
            ms="5px"
            fontWeight="500"
            onClick={() => props.setPage(AuthPage.SignUp)}
          >
            Create an Account
          </Link>
        </Text>
      </Flex>
    </AuthForm>
  );
}
