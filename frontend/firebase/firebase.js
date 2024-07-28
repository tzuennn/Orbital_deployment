import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyAEofu98DGbh2hwkS2uhQrWdCPkdfiddyw",
  authDomain: "orbital-5f0b8.firebaseapp.com",
  projectId: "orbital-5f0b8",
  storageBucket: "orbital-5f0b8.appspot.com",
  messagingSenderId: "898174488432",
  appId: "1:898174488432:web:fce01576596dc248fc09b5",
  measurementId: "G-G0DPSDJK85"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, provider, storage};

