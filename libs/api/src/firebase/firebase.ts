// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAW7fliV4qolbK3sz7HoC39F8tCFUpG8x4',
  authDomain: 'omagize.firebaseapp.com',
  projectId: 'omagize',
  storageBucket: 'omagize.appspot.com',
  messagingSenderId: '574993847563',
  appId: '1:574993847563:web:4e084d7a455c867bc6fe0e',
  measurementId: 'G-2EGJTYDJQD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const firebase = { app, auth };
