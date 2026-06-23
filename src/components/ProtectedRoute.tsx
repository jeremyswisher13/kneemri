import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RoleSelection from "@/components/ui/RoleSelection";
import SpecialtySelection from "@/components/ui/SpecialtySelection";
import PageLoader from "@/components/ui/PageLoader";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  children?: React.ReactNode;
}

export default function ProtectedRoute({ requireAdmin = false, children }: ProtectedRouteProps) {
  const { user, role, specialty, loading, setRole, setSpecialty, setShowSurgical } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader fullHeight label="Loading your course access..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
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
