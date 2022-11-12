import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import { useState } from 'react';
import { OmagizeError, APIErrorCode } from '@omagize/api';

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

export function parseError(
  error: OmagizeError | FirebaseError | any,
  def?: string
): string | null {
  if (error == null) return null;
  if (error instanceof OmagizeError) return parseOmagizeError(error, def);
  if (error instanceof FirebaseError) return parseFirebaseError(error, def);

  return def || error?.toString();
}

export function parseOmagizeError(error: OmagizeError, def?: string): string {
  switch (error.code) {
    case APIErrorCode.EmailAlreadyUsed:
      return 'Email already Exists';
    case APIErrorCode.GroupAlreadyJoined:
      return 'Group already joined';
    case APIErrorCode.GroupNotExist:
      return "Group doesn't exist";
    case (APIErrorCode.Client, APIErrorCode.MissingParam):
      return 'Unknown client-side error';
    case APIErrorCode.InternalError:
      return 'Server Internal Error';
    case APIErrorCode.InvalidEmail:
      return 'Invalid Email';
    case APIErrorCode.InvalidInviteCode:
      return 'Invalid or expired invite code';
    case APIErrorCode.MemberNotExist:
      return "Member doesn't exist";
    case APIErrorCode.UserNotExist:
      return "User doesn't exist";
    case APIErrorCode.WeakPassword:
      return 'This password is too weak';
    case APIErrorCode.WrongPassword:
      return 'Wrong password';
    case APIErrorCode.FriendRequestNotExist:
      return "Friend Request doesn't exist";
    case APIErrorCode.FriendRequestAlreadyExist:
      return 'Friend Request already exists';
    default:
      return def;
  }
}

export function parseFirebaseError(error: FirebaseError, def?: string): string {
  switch (error.code) {
    case AuthErrorCodes.INVALID_EMAIL:
      return 'Invalid Email format';
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'Email already exists';
    case AuthErrorCodes.WEAK_PASSWORD:
      return 'Password is too weak';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Wrong Password';
    case AuthErrorCodes.USER_MISMATCH:
      return "User Email doesn't match";
    case AuthErrorCodes.INTERNAL_ERROR:
      return 'Unknown Error';
    default:
      return def ?? error.message;
  }
}
