import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RoleSelection from "@/components/ui/RoleSelection";
import SpecialtySelection from "@/components/ui/SpecialtySelection";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  children?: React.ReactNode;
}

export default function ProtectedRoute({ requireAdmin = false, children }: ProtectedRouteProps) {
  const { user, role, specialty, loading, setRole, setSpecialty, setShowSurgical } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Show role selection for authenticated users with no role set
  if (!role) {
    return (
      <RoleSelection
        onSelectRole={async (selectedRole) => {
          const { setUserRole } = await import("@/lib/firestore");
          await setUserRole(user.uid, selectedRole);
          setRole(selectedRole);
        }}
      />
    );
  }

  // Then the specialty (a separate axis) — learners only; admins skip it, and so
  // does an admin previewing as a fellow/resident (they have no specialty set).
  const isAdminPreview =
    typeof window !== "undefined" && !!sessionStorage.getItem("adminPreviewRole");
  if (role !== "admin" && !specialty && !isAdminPreview) {
    return (
      <SpecialtySelection
        onSelect={async (selected) => {
          const { setUserSpecialty } = await import("@/lib/firestore");
          await setUserSpecialty(user.uid, selected);
          setSpecialty(selected);
          setShowSurgical(selected === "ortho");
        }}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
