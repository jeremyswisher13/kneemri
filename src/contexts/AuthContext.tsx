/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, ensureAdminRole } from "@/lib/auth";

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
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<Specialty>(null);
  const [showSurgical, setShowSurgical] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshRole = async () => {
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Ensure admin role is set in Firestore if email is in admin list
          await ensureAdminRole(firebaseUser);
          const p = await getUserProfile(firebaseUser.uid);
          setRole(p.role);
          setSpecialty(p.specialty);
          setShowSurgical(p.showSurgical);
        } catch (err) {
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
    return unsubscribe;
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
