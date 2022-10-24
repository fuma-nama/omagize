import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { HSeparator } from 'components/separator/Separator';
import { NavLink } from 'react-router-dom';
import { useAuthColors } from 'variables/colors';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FirebaseAuth, Keys } from '@omagize/api';
import PasswordInput from 'components/fields/PasswordInput';
import { SignUpOptions, useVerifySignUp } from 'utils/APIUtils';
import Group from '../components/VerifyGroup';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

type Options = {
  username: string;
  email: string;
  password: string;
};

export default function SignUp() {
  // Chakra color mode
  const {
    textColorPrimary: textColor,
    textColorSecondary,
    textColorDetails,
    textColorBrand,
  } = useAuthColors();

  const [options, setOptions] = useState<Options>({
    username: '',
    email: '',
    password: '',
  });

  function update(options: Partial<Options>) {
    setOptions((prev) => ({ ...prev, ...options }));
  }

  const client = useQueryClient();
  const mutation = useMutation(
    (options: SignUpOptions) =>
      FirebaseAuth.signup(options.email, options.password),
    {
      onSuccess(data) {
        return client.setQueryData(Keys.login, data);
      },
    }
  );
  const signUp = useVerifySignUp(mutation.mutate);

  return (
    <DefaultAuth illustrationBackground={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        px={{ base: '25px', md: '0px' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign Up
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter username, email and password to create your Account!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <GoogleSignInButton />
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              or
            </Text>
            <HSeparator />
          </Flex>
          <FormControl isInvalid={mutation.isError}>
            <Group title="Username" error={signUp.issues.username}>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="Henry"
                fontWeight="500"
                size="lg"
                value={options.username}
                onChange={(e) => update({ username: e.target.value })}
              />
            </Group>
            <Group title="Email" error={signUp.issues.email}>
              <Input
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
            <FormControl display="flex" alignItems="center" mb="24px">
              <Checkbox
                id="remember-login"
                colorScheme="brandScheme"
                me="10px"
              />
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
            <FormErrorMessage>{mutation.error?.toString()}</FormErrorMessage>
            <Button
              isLoading={mutation.isLoading}
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
              <NavLink to="/auth/sign-up">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Login
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
