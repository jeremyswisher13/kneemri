import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function logAuditEvent(
  userId: string,
  userEmail: string,
  action: string,
  details: Record<string, unknown>
) {
  try {
    await addDoc(collection(db, "auditLog"), {
      userId,
      userEmail,
      action,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
