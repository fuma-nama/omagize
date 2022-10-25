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

export function loggedIn(): boolean {
  return firebase.auth.currentUser != null;
}

export async function authorize(): Promise<LoginPayload | null> {
  if (firebase.auth.currentUser == null) {
    return null;
  }

  return await callReturn<RawLoginPayload | null>('/auth', {
    method: 'POST',
    allowed: {
      401: () => null,
    },
  }).then((res) => (res == null ? null : LoginPayload(res)));
}

export async function logout() {
  await firebase.auth.signOut();
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
