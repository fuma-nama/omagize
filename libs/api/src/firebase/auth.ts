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
  sendPasswordResetEmail,
  User,
  updateEmail,
  updatePassword,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from 'firebase/auth';
import { firebase } from './firebase';
import { authorize, signup } from '../AccountAPI';
import { onSignin } from '../query';
import { orgin } from '../utils/core';

export function initFirebase() {
  //setup listeners
}

const googleProvider = new GoogleAuthProvider();

const Reauthentricate = {
  async withGoogle() {
    return await reauthenticateWithPopup(firebase.auth.currentUser, googleProvider);
  },
  async withPassword(password: string) {
    const user = firebase.auth.currentUser;

    return await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email, password)
    );
  },
};

export const FirebaseAuth = {
  reauth: Reauthentricate,
  async init() {
    await setPersistence(firebase.auth, browserLocalPersistence);
  },
  async sendVerifyEmail(user: User) {
    await sendEmailVerification(user, {
      url: `${orgin}/auth/verified`,
    });
  },
  async resetPassword(email: string) {
    await sendPasswordResetEmail(firebase.auth, email);
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
  async logout() {
    return await firebase.auth.signOut();
  },
  async deleteAccount() {
    await deleteUser(firebase.auth.currentUser);
  },
  async handleSignIn() {
    await onSignin(await authorize());
  },
  async changeEmail(newEmail: string) {
    await updateEmail(firebase.auth.currentUser, newEmail);
  },
  async changePassword(newPassword: string) {
    await updatePassword(firebase.auth.currentUser, newPassword);
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
