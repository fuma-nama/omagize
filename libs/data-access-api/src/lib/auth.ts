import { signup, authorize } from '@omagize/api';
import { getAdditionalUserInfo, IdTokenResult, UserCredential } from 'firebase/auth';
import { onSignin } from './account';

export async function handleSignIn() {
  await onSignin(await authorize());
}
export async function handleSignUp(res: UserCredential, username: string) {
  const token = await res.user.getIdTokenResult();
  const isNew = getAdditionalUserInfo(res).isNewUser;
  let payload;

  if (isNew || !isUserCreated(token)) {
    payload = await signup(username);
  } else {
    payload = await authorize();
  }

  if (res.user.emailVerified) {
    await onSignin(payload);
  }
}

function isUserCreated(token: IdTokenResult): boolean {
  return token.claims['userId'] != null;
}
