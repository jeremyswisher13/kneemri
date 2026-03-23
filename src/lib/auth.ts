import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { logAuditEvent } from "./audit";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Create or update user document in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // New user - create profile with default "fellow" role
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: "fellow",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  } else {
    // Existing user - update last login
    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
  }

  await logAuditEvent(user.uid, user.email || "", "login", {});
  return user;
}

export async function signOutUser() {
  const user = auth.currentUser;
  if (user) {
    await logAuditEvent(user.uid, user.email || "", "logout", {});
  }
  return firebaseSignOut(auth);
}

export async function getUserRole(uid: string): Promise<string> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().role || "fellow";
  }
  return "fellow";
}
