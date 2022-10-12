import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
// Assets
import illustration from 'assets/img/auth/auth.png';
import { FcGoogle } from 'react-icons/fc';
import { useAuthColors } from 'variables/colors';
import PasswordInput from 'components/fields/PasswordInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, LoginKey } from '../../../api/AccountAPI';
import VerifyGroup from '../components/VerifyGroup';

type Options = {
  email: string;
  password: string;
};

function SignIn() {
  // Chakra color mode
  const {
    textColorPrimary: textColor,
    textColorSecondary,
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

  const client = useQueryClient();
  const mutation = useMutation((options: Options) => login(options), {
    onSuccess(data) {
      return client.setQueryData(LoginKey, data);
    },
  });

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
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
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
          <Button fontSize="sm" mb="26px" py="25px" fontWeight="500">
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Sign up with Google
          </Button>
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              or
            </Text>
            <HSeparator />
          </Flex>
          <VerifyGroup
            title="Email"
            error={mutation.isError && 'Wrong Email or Password'}
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
            error={mutation.isError && 'Wrong Email or Password'}
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
            isLoading={mutation.isLoading}
            onClick={() => mutation.mutate(options)}
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
              <NavLink to="/auth/signup">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
