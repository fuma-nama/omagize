import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  signInWithEmailAndPassword,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  IdTokenResult,
} from 'firebase/auth';
import { firebase } from './firebase';
import { authorize, signup } from '../AccountAPI';
import { onSignin } from '../query';

const googleProvider = new GoogleAuthProvider();

export const FirebaseAuth = {
  async signup(email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      await this.handleSignIn(res);
    } catch (err) {
      console.error(err);
    }
  },
  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      await this.handleSignIn(res);
    } catch (err) {
      console.error(err);
    }
  },
  async signInWithGoogle() {
    console.log(firebase.auth.currentUser);
    console.log('sign in with google');
    try {
      const res = await signInWithPopup(firebase.auth, googleProvider);
      await this.handleSignIn(res);
    } catch (err) {
      console.error(err);
    }
  },

  async handleSignIn(res: UserCredential) {
    const token = await res.user.getIdTokenResult();
    const isNew = getAdditionalUserInfo(res).isNewUser;
    let payload;

    if (isNew || !this.userCreated(token)) {
      console.log('sign up');
      payload = await signup();
    } else payload = await authorize();

    onSignin(payload);
  },
  userCreated(token: IdTokenResult): boolean {
    return token.claims['userId'] != null;
  },
};
