import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { logAuditEvent } from "./audit";
import { disableLocalPreviewAuth } from "./local-preview-auth";

// Firestore (`firebase/firestore` + `db`) is dynamically imported inside each
// function that needs it, so the large firestore SDK never lands in the eager
// login bundle — it loads only when an auth flow actually reads/writes user docs.

const googleProvider = new GoogleAuthProvider();

// Admin emails - these accounts automatically get admin role on sign-in
const ADMIN_EMAILS = [
  "jeremyswisher13@gmail.com",
  "jeremyswisher@gmail.com",
  "jswisher@mednet.ucla.edu",
];

async function finishGoogleSignIn(user: User) {
  const isAdmin = ADMIN_EMAILS.some(
    (email) => user.email?.toLowerCase() === email.toLowerCase()
  );

  const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
  const { db } = await import("./db");

  // Create or update user document in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // New user - create profile (non-admins start with no role; they pick on first login)
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: isAdmin ? "admin" : null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    });
  } else {
    // Existing user - update last login (and promote to admin if in admin list)
    const updates: Record<string, unknown> = { lastLoginAt: serverTimestamp(), lastActive: serverTimestamp() };
    if (isAdmin && userSnap.data().role !== "admin") {
      updates.role = "admin";
    }
    await setDoc(userRef, updates, { merge: true });
  }

  await logAuditEvent(user.uid, user.email || "", "login", {});
  const finalRole = isAdmin ? "admin" : (userSnap.exists() ? userSnap.data()?.role || null : null);
  return { user, role: finalRole };
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return finishGoogleSignIn(result.user);
}

export async function signInWithGoogleRedirect() {
  await signInWithRedirect(auth, googleProvider);
}

export async function completeGoogleRedirectSignIn() {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return finishGoogleSignIn(result.user);
}

export async function signOutUser() {
  const user = auth.currentUser;
  if (user) {
    await logAuditEvent(user.uid, user.email || "", "logout", {});
  }
  sessionStorage.removeItem("adminPreviewRole");
  disableLocalPreviewAuth(sessionStorage);
  return firebaseSignOut(auth);
}

// Check and promote admin on every auth state change (covers page reloads, not just sign-in)
export async function ensureAdminRole(user: { uid: string; email: string | null }) {
  const isAdmin = ADMIN_EMAILS.some(
    (email) => user.email?.toLowerCase() === email.toLowerCase()
  );
  if (!isAdmin) return;

  const { doc, getDoc, setDoc } = await import("firebase/firestore");
  const { db } = await import("./db");
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists() && userSnap.data().role !== "admin") {
    await setDoc(userRef, { role: "admin" }, { merge: true });
  }
}

export async function getUserRole(uid: string): Promise<string | null> {
  const { doc, getDoc } = await import("firebase/firestore");
  const { db } = await import("./db");
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().role || null;
  }
  return null;
}

export interface UserProfile {
  role: string | null;
  /** Training specialty — drives surgical-correlate defaults. */
  specialty: "sports-med" | "ortho" | null;
  /** Whether to show surgical / arthroscopy correlates (defaults from specialty). */
  showSurgical: boolean;
}

/** Reads role + specialty + the surgical-correlate preference in one doc read. */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  const { doc, getDoc } = await import("firebase/firestore");
  const { db } = await import("./db");
  const userSnap = await getDoc(doc(db, "users", uid));
  if (userSnap.exists()) {
    const d = userSnap.data();
    return {
      role: d.role || null,
      specialty: d.specialty ?? null,
      showSurgical: d.showSurgical ?? false,
    };
  }
  return { role: null, specialty: null, showSurgical: false };
}
