import { getFirestore } from "firebase/firestore";
import app from "./firebase";

// Firestore lives in its own module so firebase/firestore (the largest piece of
// the Firebase SDK) is only pulled into chunks that actually read/write data —
// never the login screen.
export const db = getFirestore(app);
