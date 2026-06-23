// Firestore is dynamically imported inside the function so the firestore SDK is
// kept out of the eager/login bundle — audit writes only happen on user actions.
export async function logAuditEvent(
  userId: string,
  userEmail: string,
  action: string,
  details: Record<string, unknown>
) {
  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    const { db } = await import("./db");
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
