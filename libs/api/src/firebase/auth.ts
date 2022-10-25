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
} from 'firebase/auth';
import { firebase } from './firebase';
import { authorize, signup } from '../AccountAPI';
import { onSignin } from '../query';

const googleProvider = new GoogleAuthProvider();

export const FirebaseAuth = {
  async init() {
    await setPersistence(firebase.auth, browserLocalPersistence);
  },
  async signup(username: string, email: string, password: string) {
    const res = await createUserWithEmailAndPassword(
      firebase.auth,
      email,
      password
    );
    await this.handleSignUp(res, username);
  },
  async signInWithEmailAndPassword(email: string, password: string) {
    await signInWithEmailAndPassword(firebase.auth, email, password);
    await this.handleSignIn();
  },
  async signInWithGoogle() {
    const res = await signInWithPopup(firebase.auth, googleProvider);
    await this.handleSignUp(res, res.user.displayName);
  },
  async handleSignIn() {
    onSignin(await authorize());
  },
  async handleSignUp(res: UserCredential, username: string) {
    const token = await res.user.getIdTokenResult();
    const isNew = getAdditionalUserInfo(res).isNewUser;
    let payload;

    if (isNew || !this.userCreated(token)) {
      payload = await signup(username);
    } else payload = await authorize();

    onSignin(payload);
  },
  userCreated(token: IdTokenResult): boolean {
    return token.claims['userId'] != null;
  },
};
