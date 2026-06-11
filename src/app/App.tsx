import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import MaintainerHomePage from "@/pages/maintainer-home/MaintainerHomePage";
import ReportsPage from "@/pages/reports/ReportsPage";
import ReportDetailPage from "@/pages/reports/ReportDetailPage";
import DepartmentManagementPage from "@/pages/department-management/DepartmentManagementPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import AuthCallbackPage from "../pages/auth/AuthCallbackPage";
import HomePage from "../pages/home/HomePage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/login/LoginPage";
import ContactPage from "../pages/contact/ContactPage";
import OrganizationDetailPage from "../pages/organization-list/OrganizationDetailPage";
import OrganizationListPage from "../pages/organization-list/OrganizationListPage";
import RegisterOrgPage from "../pages/register-org/RegisterOrgPage";
import RegisterPage from "../pages/register/RegisterPage";
import AdminHomePage from "../pages/admin-home/AdminHomePage";
import ConfirmResetPasswordPage from "../pages/reset-password/ConfirmResetPasswordPage";
import ResetPasswordPage from "../pages/reset-password/ResetPasswordPage";
import UserDetailPage from "../pages/user-list/UserDetailPage";
import UserListPage from "../pages/user-list/UserListPage";
import BaseLayout from "./layouts/BaseLayout";

// Lazy-load the heaviest routes (calendar + QR libraries) so they don't bloat
// the initial bundle; they load on demand when the route is visited.
const PairingsRoute = lazy(() => import("../pages/pairings/PairingsRoute"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const ProfileEditPage = lazy(() => import("../pages/profile/ProfileEditPage"));
const StatisticsPage = lazy(() => import("@/pages/statistics/StatisticsPage"));
const InviteManagementPage = lazy(
  () => import("@/pages/invite-management/InviteManagementPage")
);
const AlgorithmSettingsPage = lazy(() =>
  import("@/features/pairing-algorithm/pages/AlgorithmSettingsPage").then(
    (m) => ({ default: m.AlgorithmSettingsPage })
  )
);

const AUTHENTICATED_ROLES = ["user", "org_admin", "super_admin"] as const;
const ADMIN_ROLES = ["org_admin", "super_admin"] as const;

const HomeRoute = () => {
  const { appRole } = useAuth();

  if (appRole === "org_admin") {
    return <MaintainerHomePage />;
  }

  if (appRole === "super_admin") {
    return <AdminHomePage />;
  }

  return <HomePage />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          }
        >
          <Routes>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/reset-password/confirm"
            element={<ConfirmResetPasswordPage />}
          />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Auth screens render full-screen (own AuthLayout), no app chrome */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<BaseLayout />}>
            <Route
              path="register-org"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <RegisterOrgPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="home"
              element={
                <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                  <HomeRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile-edit"
              element={
                <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                  <ProfileEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="user-list"
              element={
                <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                  <UserListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="user-list/:id"
              element={
                <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                  <UserDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="organization-list"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <OrganizationListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="org-detail/:id"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <OrganizationDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-org"
              element={
                <ProtectedRoute allowedRoles={["org_admin"]}>
                  <OrganizationDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="pairings"
              element={
                <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                  <PairingsRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="pairings/:id"
              element={
                <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                  <PairingsRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="algorithm-settings"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <AlgorithmSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="invite-management"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <InviteManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="department-management"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <DepartmentManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="statistics"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <StatisticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports/:id"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <ReportDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="maintainer"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <MaintainerHomePage />
                </ProtectedRoute>
              }
            />
          </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
