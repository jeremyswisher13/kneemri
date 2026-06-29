/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, authPersistenceReady } from "@/lib/firebase";
import { getUserProfile, ensureAdminRole } from "@/lib/auth";
import { createLocalPreviewUser, isLocalPreviewSession } from "@/lib/local-preview-auth";

type Specialty = "sports-med" | "ortho" | null;

interface AuthContextType {
  user: User | null;
  role: string | null;
  specialty: Specialty;
  showSurgical: boolean;
  loading: boolean;
  refreshRole: () => Promise<void>;
  setRole: (role: string) => void;
  setSpecialty: (specialty: Specialty) => void;
  setShowSurgical: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  specialty: null,
  showSurgical: false,
  loading: true,
  refreshRole: async () => {},
  setRole: () => {},
  setSpecialty: () => {},
  setShowSurgical: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    isLocalPreviewSession() ? createLocalPreviewUser() : null,
  );
  const [role, setRole] = useState<string | null>(() =>
    isLocalPreviewSession() ? "fellow" : null,
  );
  const [specialty, setSpecialty] = useState<Specialty>(() =>
    isLocalPreviewSession() ? "sports-med" : null,
  );
  const [showSurgical, setShowSurgical] = useState(false);
  const [loading, setLoading] = useState(() => !isLocalPreviewSession());

  const refreshRole = async () => {
    if (isLocalPreviewSession()) {
      setUser(createLocalPreviewUser());
      setRole("fellow");
      setSpecialty("sports-med");
      setShowSurgical(false);
      return;
    }

    // Use auth.currentUser directly to avoid stale closure over user state
    const currentUser = auth.currentUser;
    if (currentUser) {
      const p = await getUserProfile(currentUser.uid);
      setRole(p.role);
      setSpecialty(p.specialty);
      setShowSurgical(p.showSurgical);
    }
  };

  useEffect(() => {
    // A fresh page load exits any admin "preview as fellow/resident" mode, so the
    // resolved role and the UI (banner, Admin Panel link, useIsAdminView) agree.
    sessionStorage.removeItem("adminPreviewRole");

    if (isLocalPreviewSession()) {
      return () => {};
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    authPersistenceReady.finally(() => {
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (cancelled) return;
        setUser(firebaseUser);
        if (firebaseUser) {
          try {
            // Ensure admin role is set in Firestore if email is in admin list
            await ensureAdminRole(firebaseUser);
            const p = await getUserProfile(firebaseUser.uid);
            if (cancelled) return;
            setRole(p.role);
            setSpecialty(p.specialty);
            setShowSurgical(p.showSurgical);
          } catch (err) {
            if (cancelled) return;
            console.error("Failed to load user profile:", err);
            setRole(null);
            setSpecialty(null);
            setShowSurgical(false);
          }
        } else {
          setRole(null);
          setSpecialty(null);
          setShowSurgical(false);
        }
        setLoading(false);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, specialty, showSurgical, loading, refreshRole, setRole, setSpecialty, setShowSurgical }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
