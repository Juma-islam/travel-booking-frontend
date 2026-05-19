import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUpt9ktwIaEwfw2EVm-nei3B4HJcXlYdU",
  authDomain: "simple-firebase-auth-db032.firebaseapp.com",
  projectId: "simple-firebase-auth-db032",
  storageBucket: "simple-firebase-auth-db032.firebasestorage.app",
  messagingSenderId: "173778392517",
  appId: "1:173778392517:web:d2f828ced67833845e67ac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
