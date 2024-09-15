import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get, onValue, update, remove } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDW-PaVWSGkFw4Nv9sDEqdNY8N8w0rfQT8",
  authDomain: "projeto-de-bloco-180ed.firebaseapp.com",
  projectId: "projeto-de-bloco-180ed",
  storageBucket: "projeto-de-bloco-180ed.appspot.com",
  messagingSenderId: "184039587678",
  appId: "1:184039587678:web:3530cc9c546be570d759cf",
  measurementId: "G-986D04BTP2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth, signInWithEmailAndPassword, sendPasswordResetEmail, ref, set, push, get, onValue, update, remove };