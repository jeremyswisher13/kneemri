import { lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppLayout from "@/components/layout/AppLayout";
import FellowLayout from "@/components/layout/FellowLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";

// Route pages are code-split: each is fetched on demand the first time its
// route is visited, keeping the initial login/dashboard bundle small. The
// Suspense boundary lives inside FellowLayout/AdminLayout (around <Outlet/>),
// so the sidebar stays put and only the content area shows a loader.
const HomePage = lazy(() => import("@/pages/HomePage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ModulesPage = lazy(() => import("@/pages/ModulesPage"));
const ModulePage = lazy(() => import("@/pages/ModulePage"));
const SearchPatternPage = lazy(() => import("@/pages/SearchPatternPage"));
const CasesPage = lazy(() => import("@/pages/CasesPage"));
const CasePage = lazy(() => import("@/pages/CasePage"));
const PreAssessmentPage = lazy(() => import("@/pages/PreAssessmentPage"));
const PreQuizPage = lazy(() => import("@/pages/PreQuizPage"));
const PreSurveyPage = lazy(() => import("@/pages/PreSurveyPage"));
const PostAssessmentPage = lazy(() => import("@/pages/PostAssessmentPage"));
const PostQuizPage = lazy(() => import("@/pages/PostQuizPage"));
const PostSurveyPage = lazy(() => import("@/pages/PostSurveyPage"));
const ProgressPage = lazy(() => import("@/pages/ProgressPage"));
const CertificatePage = lazy(() => import("@/pages/CertificatePage"));
const ReferencePage = lazy(() => import("@/pages/ReferencePage"));
const ReviewPage = lazy(() => import("@/pages/ReviewPage"));
const NormalKneeMriPage = lazy(() => import("@/pages/NormalKneeMriPage"));
const NormalShoulderMriPage = lazy(() => import("@/pages/NormalShoulderMriPage"));
const NormalHipMriPage = lazy(() => import("@/pages/NormalHipMriPage"));
const NormalElbowMriPage = lazy(() => import("@/pages/NormalElbowMriPage"));
const LearningPathsPage = lazy(() => import("@/pages/LearningPathsPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage"));
const AdminMedicalQaPage = lazy(() => import("@/pages/AdminMedicalQaPage"));

function LegacyRedirect({ to, param }: { to: string; param?: string }) {
  const params = useParams<Record<string, string | undefined>>();
  const location = useLocation();
  const suffix = param && params[param] ? `/${encodeURIComponent(params[param])}` : "";
  return <Navigate to={`${to}${suffix}${location.search}${location.hash}`} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/login" element={<LoginPage />} />

            {/* Fellow routes */}
            <Route element={<ProtectedRoute />}>
              {/* Course-picker landing — standalone (AppLayout chrome, no course sidebar). */}
              <Route index element={<HomePage />} />
              <Route element={<FellowLayout />}>
                <Route path="courses/:courseId" element={<DashboardPage />} />
                <Route path="courses/:courseId/modules" element={<ModulesPage />} />
                <Route path="courses/:courseId/modules/:moduleId" element={<ModulePage />} />
                <Route path="courses/:courseId/search-pattern" element={<SearchPatternPage />} />
                <Route path="courses/:courseId/cases" element={<CasesPage />} />
                <Route path="courses/:courseId/cases/:caseId" element={<CasePage />} />
                <Route path="courses/:courseId/progress" element={<ProgressPage />} />
                <Route path="courses/:courseId/pre-assessment" element={<PreAssessmentPage />} />
                <Route path="courses/:courseId/pre-assessment/quiz" element={<PreQuizPage />} />
                <Route path="courses/:courseId/pre-assessment/survey" element={<PreSurveyPage />} />
                <Route path="courses/:courseId/post-assessment" element={<PostAssessmentPage />} />
                <Route path="courses/:courseId/post-assessment/quiz" element={<PostQuizPage />} />
                <Route path="courses/:courseId/post-assessment/survey" element={<PostSurveyPage />} />
                <Route path="courses/:courseId/certificate" element={<CertificatePage />} />
                <Route path="courses/:courseId/reference" element={<ReferencePage />} />
                <Route path="courses/:courseId/review" element={<ReviewPage />} />
                <Route path="courses/:courseId/learning-paths" element={<LearningPathsPage />} />
                <Route path="courses/:courseId/normal-knee-mri" element={<NormalKneeMriPage />} />
                <Route path="courses/:courseId/normal-shoulder-mri" element={<NormalShoulderMriPage />} />
                <Route path="courses/:courseId/normal-hip-mri" element={<NormalHipMriPage />} />
                <Route path="courses/:courseId/normal-elbow-mri" element={<NormalElbowMriPage />} />
                <Route path="modules" element={<LegacyRedirect to="/courses/knee-mri/modules" />} />
                <Route path="modules/:moduleId" element={<LegacyRedirect to="/courses/knee-mri/modules" param="moduleId" />} />
                <Route path="search-pattern" element={<LegacyRedirect to="/courses/knee-mri/search-pattern" />} />
                <Route path="cases" element={<LegacyRedirect to="/courses/knee-mri/cases" />} />
                <Route path="cases/:caseId" element={<LegacyRedirect to="/courses/knee-mri/cases" param="caseId" />} />
                <Route path="pre-assessment" element={<LegacyRedirect to="/courses/knee-mri/pre-assessment" />} />
                <Route path="pre-assessment/quiz" element={<LegacyRedirect to="/courses/knee-mri/pre-assessment/quiz" />} />
                <Route path="pre-assessment/survey" element={<LegacyRedirect to="/courses/knee-mri/pre-assessment/survey" />} />
                <Route path="post-assessment" element={<LegacyRedirect to="/courses/knee-mri/post-assessment" />} />
                <Route path="post-assessment/quiz" element={<LegacyRedirect to="/courses/knee-mri/post-assessment/quiz" />} />
                <Route path="post-assessment/survey" element={<LegacyRedirect to="/courses/knee-mri/post-assessment/survey" />} />
                <Route path="progress" element={<LegacyRedirect to="/courses/knee-mri/progress" />} />
                <Route path="certificate" element={<LegacyRedirect to="/courses/knee-mri/certificate" />} />
                <Route path="reference" element={<LegacyRedirect to="/courses/knee-mri/reference" />} />
                <Route path="review" element={<LegacyRedirect to="/courses/knee-mri/review" />} />
                <Route path="normal-knee-mri" element={<LegacyRedirect to="/courses/knee-mri/normal-knee-mri" />} />
                <Route path="normal-shoulder-mri" element={<LegacyRedirect to="/courses/shoulder-mri/normal-shoulder-mri" />} />
                <Route path="normal-hip-mri" element={<LegacyRedirect to="/courses/hip-mri/normal-hip-mri" />} />
                <Route path="normal-elbow-mri" element={<LegacyRedirect to="/courses/elbow-mri/normal-elbow-mri" />} />
                <Route path="learning-paths" element={<LegacyRedirect to="/courses/knee-mri/learning-paths" />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/medical-qa" element={<AdminMedicalQaPage />} />
                <Route path="admin/settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}
