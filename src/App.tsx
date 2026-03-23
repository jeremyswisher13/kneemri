import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import FellowLayout from "@/components/layout/FellowLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ModulesPage from "@/pages/ModulesPage";
import ModulePage from "@/pages/ModulePage";
import SearchPatternPage from "@/pages/SearchPatternPage";
import CasesPage from "@/pages/CasesPage";
import CasePage from "@/pages/CasePage";
import PreAssessmentPage from "@/pages/PreAssessmentPage";
import PreQuizPage from "@/pages/PreQuizPage";
import PreSurveyPage from "@/pages/PreSurveyPage";
import PostAssessmentPage from "@/pages/PostAssessmentPage";
import PostQuizPage from "@/pages/PostQuizPage";
import PostSurveyPage from "@/pages/PostSurveyPage";
import ProgressPage from "@/pages/ProgressPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/login" element={<LoginPage />} />

            {/* Fellow routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<FellowLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="modules" element={<ModulesPage />} />
                <Route path="modules/:moduleId" element={<ModulePage />} />
                <Route path="search-pattern" element={<SearchPatternPage />} />
                <Route path="cases" element={<CasesPage />} />
                <Route path="cases/:caseId" element={<CasePage />} />
                <Route path="pre-assessment" element={<PreAssessmentPage />} />
                <Route path="pre-assessment/quiz" element={<PreQuizPage />} />
                <Route path="pre-assessment/survey" element={<PreSurveyPage />} />
                <Route path="post-assessment" element={<PostAssessmentPage />} />
                <Route path="post-assessment/quiz" element={<PostQuizPage />} />
                <Route path="post-assessment/survey" element={<PostSurveyPage />} />
                <Route path="progress" element={<ProgressPage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
