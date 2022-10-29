import { Box, Collapse } from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { SignUpForm } from './signup';
import { firebase, FirebaseAuth } from '@omagize/api';
import { SignUpOptions } from 'utils/APIUtils';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { VerifyMailAuto } from './signup/verify';
import { SignInForm } from './signIn';
import { User } from 'firebase/auth';
import ResetPasswordForm from './signIn/ResetPassword';

export type SignInOptions = {
  email: string;
  password: string;
};
export enum AuthPage {
  SignUp,
  SignIn,
  VerifyEmail,
  ResetPassword,
}
export default function SignIn() {
  const [page, setPage] = useState<AuthPage>(AuthPage.SignIn);

  const sendVerifyEmail = useMutation(
    (user: User = firebase.auth.currentUser) =>
      FirebaseAuth.sendVerifyEmail(user)
  );

  const signin = useMutation(
    (options: SignInOptions) =>
      FirebaseAuth.signInWithEmailAndPassword(options.email, options.password),
    {
      async onSuccess(data) {
        FirebaseAuth.handleSignIn();
      },
    }
  );

  //Sign up a new account
  //if success, authorize the account in omagize server
  //if email is not verified, send a verify email
  const signup = useMutation(
    (options: SignUpOptions) =>
      FirebaseAuth.signup(options.email, options.password),
    {
      async onSuccess(data, options) {
        const user = data.user;

        await FirebaseAuth.handleSignUp(data, options.username);

        if (!user.emailVerified) {
          await sendVerifyEmail.mutateAsync(user);
          setPage(AuthPage.VerifyEmail);
        }
      },
    }
  );

  return (
    <DefaultAuth illustrationBackground={illustration}>
      <Box
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        px={{ base: '25px', md: '0px' }}
      >
        <Collapse in={page === AuthPage.SignUp}>
          <SignUpForm
            signup={signup.mutate}
            isLoading={signup.isLoading}
            isError={signup.isError}
            error={signup.error?.toString()}
            setPage={setPage}
          />
        </Collapse>
        <Collapse in={page === AuthPage.VerifyEmail}>
          <VerifyMailAuto
            user={firebase.auth.currentUser}
            isLoading={sendVerifyEmail.isLoading}
            send={(user) => sendVerifyEmail.mutate(user)}
          />
        </Collapse>
        <Collapse in={page === AuthPage.SignIn}>
          <SignInForm
            signin={signin.mutate}
            isLoading={signin.isLoading}
            isError={signin.isError}
            error={signin.error?.toString()}
            setPage={setPage}
          />
        </Collapse>
        <Collapse in={page === AuthPage.ResetPassword}>
          <ResetPasswordForm setPage={setPage} />
        </Collapse>
      </Box>
    </DefaultAuth>
  );
}
