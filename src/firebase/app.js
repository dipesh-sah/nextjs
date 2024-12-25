import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyDKL9i-_F-boWpBT_E9wHhsMDigNM425B8",
  authDomain: "psewa-nextjs.firebaseapp.com",
  projectId: "psewa-nextjs",
  storageBucket: "psewa-nextjs.firebasestorage.app",
  messagingSenderId: "757535552014",
  appId: "1:757535552014:web:3be2e4703f52d46c08c25f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
export { app, db, auth }