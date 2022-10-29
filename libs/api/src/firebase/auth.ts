import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  signInWithEmailAndPassword,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  IdTokenResult,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { firebase } from './firebase';
import { authorize, signup } from '../AccountAPI';
import { onSignin } from '../query';
import { orgin } from '../utils/core';

const googleProvider = new GoogleAuthProvider();

export const FirebaseAuth = {
  async init() {
    await setPersistence(firebase.auth, browserLocalPersistence);
  },
  async sendVerifyEmail(user: User) {
    await sendEmailVerification(user, {
      url: `${orgin}/auth/verified`,
    });
  },
  async signup(email: string, password: string) {
    return await createUserWithEmailAndPassword(firebase.auth, email, password);
  },
  async signInWithEmailAndPassword(email: string, password: string) {
    return await signInWithEmailAndPassword(firebase.auth, email, password);
  },
  async signInWithGoogle() {
    const res = await signInWithPopup(firebase.auth, googleProvider);
    return await this.handleSignUp(res, res.user.displayName);
  },
  async handleSignIn() {
    await onSignin(await authorize());
  },
  async handleSignUp(res: UserCredential, username: string) {
    const token = await res.user.getIdTokenResult();
    const isNew = getAdditionalUserInfo(res).isNewUser;
    let payload;

    if (isNew || !this.userCreated(token)) {
      payload = await signup(username);
    } else {
      payload = await authorize();
    }

    if (res.user.emailVerified) {
      await onSignin(payload);
    }
  },
  userCreated(token: IdTokenResult): boolean {
    return token.claims['userId'] != null;
  },
};
