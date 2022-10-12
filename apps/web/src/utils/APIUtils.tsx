import { useState } from 'react';

export type SignUpOptions = {
  username: string;
  email: string;
  password: string;
};

export type SignUpIssues = {
  username?: string;
  email?: string;
  password?: string;
};

export function verifySignUp({
  username,
  email,
  password,
}: SignUpOptions): SignUpIssues {
  const errors: SignUpIssues = {};

  if (username.length === 0) errors.username = 'Name cannot be Blank';
  if (!validEmail(email)) errors.email = 'Invalid Email';
  if (password.length < 8)
    errors.password = 'Password cannot less than 8 characters';

  return errors;
}

export function useVerifySignUp(mutate: (options: SignUpOptions) => void) {
  const [issues, setIssues] = useState<SignUpIssues>({});

  return {
    issues,
    hasIssues: Object.entries(issues).length === 0,
    mutate(options: SignUpOptions) {
      const result = verifySignUp(options);
      setIssues(result);

      if (Object.entries(result).length === 0) {
        mutate(options);
      }
    },
  };
}

export function validEmail(email: string): boolean {
  const format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return !!email.match(format);
}
