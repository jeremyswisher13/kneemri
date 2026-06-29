import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

// Only firebase/app + firebase/auth load here. Auth is needed immediately (login),
// so this module is in the eager graph (AuthContext imports it). Firestore and
// Functions are intentionally split into ./db and ./functions so the large
// firestore/functions SDK chunks stay OUT of the login/first-paint critical path.
const firebaseConfig = {
  apiKey: "AIzaSyDgVvN7YjfxGdUei7M5kUuB73xQYBynzNk",
  authDomain: "ucla-knee-mri.firebaseapp.com",
  projectId: "ucla-knee-mri",
  storageBucket: "ucla-knee-mri.firebasestorage.app",
  messagingSenderId: "547055123449",
  appId: "1:547055123449:web:6a29607c6bf6fd41749b28",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const authPersistenceReady = setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Firebase auth persistence unavailable; using the browser default.", err);
});
export default app;
