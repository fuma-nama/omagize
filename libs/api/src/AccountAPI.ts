import { firebase } from './firebase/firebase';
import { callReturn } from './utils/core';
import { RawSelfUser } from './UserAPI';
import { LoginPayload } from './mappers/Auth';
export type Reset = 'reset';

export type RawLoginPayload = {
  account: RawAccount;
  user: RawSelfUser;
  token: string;
};

export type RawAccount = {
  email: string;
};

/**
 * Notice that it will return false if email is not verified
 */
export function loggedIn(): boolean {
  const user = firebase.auth.currentUser;

  return user != null && user.emailVerified;
}

/**
 *
 * @returns LoginPayload, null if not logged in
 */
export async function authorize(): Promise<LoginPayload | null> {
  if (!loggedIn()) {
    return null;
  }

  return await callReturn<RawLoginPayload | null>('/auth', {
    method: 'POST',
    allowed: {
      401: () => null,
    },
  }).then((res) => (res == null ? null : LoginPayload(res)));
}

/**
 * Must be called after login to firebase
 */
export async function signup(username: string): Promise<LoginPayload> {
  return await callReturn<RawLoginPayload>('/signup', {
    method: 'POST',
    body: JSON.stringify({
      name: username,
    }),
    errorOnFail: true,
  }).then((res) => LoginPayload(res));
}
