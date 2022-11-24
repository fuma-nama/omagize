import { firebase } from './firebase/firebase';
import { callDefault, callReturn } from './utils/core';
import { RawSelfUser } from './UserAPI';
import { LoginPayload } from './types/account';
import { FirebaseAuth } from './firebase';
export type Reset = 'reset';

export type RawLoginPayload = {
  user: RawSelfUser;
};

/**
 * Notice that it will return false if email is not verified
 */
export function loggedIn(): boolean {
  const user = firebase.auth.currentUser;

  return user != null && user.emailVerified;
}

export async function deleteAccount() {
  await callDefault('/user', {
    method: 'DELETE',
    errorOnFail: true,
  });
  await FirebaseAuth.deleteAccount();
}

/**
 *
 * @returns LoginPayload, null if not logged in
 */
export async function authorize(): Promise<LoginPayload | null> {
  if (!loggedIn()) {
    return null;
  }
  const result = await callReturn<RawLoginPayload | null>('/auth', {
    method: 'POST',
    allowed: {
      401: () => null,
    },
  });

  if (result == null) return null;

  await firebase.auth.currentUser.getIdToken(true); //take sure token is updated
  return LoginPayload(result);
}

/**
 * Must be called after login to firebase
 */
export async function signup(username: string): Promise<LoginPayload> {
  const res = await callReturn<RawLoginPayload>('/signup', {
    method: 'POST',
    body: JSON.stringify({
      name: username,
    }),
    errorOnFail: true,
  });

  await firebase.auth.currentUser.getIdToken(true); //take sure token is updated
  return LoginPayload(res);
}
