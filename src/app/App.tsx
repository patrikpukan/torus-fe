import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { AlgorithmSettingsPage } from "@/features/pairing-algorithm/pages/AlgorithmSettingsPage";
import { useAuth } from "@/hooks/useAuth";
import InviteManagementPage from "@/pages/invite-management/InviteManagementPage";
import MaintainerHomePage from "@/pages/maintainer-home/MaintainerHomePage";
import ReportsPage from "@/pages/reports/ReportsPage";
import ReportDetailPage from "@/pages/reports/ReportDetailPage";
import StatisticsPage from "@/pages/statistics/StatisticsPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import AuthCallbackPage from "../pages/auth/AuthCallbackPage";
import HomePage from "../pages/home/HomePage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/login/LoginPage";
import OrganizationDetailPage from "../pages/organization-list/OrganizationDetailPage";
import OrganizationListPage from "../pages/organization-list/OrganizationListPage";
import PairingsRoute from "../pages/pairings/PairingsRoute";
import ProfileEditPage from "../pages/profile/ProfileEditPage";
import ProfilePage from "../pages/profile/ProfilePage";
import RegisterOrgPage from "../pages/register-org/RegisterOrgPage";
import RegisterPage from "../pages/register/RegisterPage";
import ConfirmResetPasswordPage from "../pages/reset-password/ConfirmResetPasswordPage";
import ResetPasswordPage from "../pages/reset-password/ResetPasswordPage";
import UserDetailPage from "../pages/user-list/UserDetailPage";
import UserListPage from "../pages/user-list/UserListPage";
import BaseLayout from "./layouts/BaseLayout";

const AUTHENTICATED_ROLES = ["user", "org_admin", "super_admin"] as const;
const ADMIN_ROLES = ["org_admin", "super_admin"] as const;

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d47a1",
    },
    secondary: {
      main: "#00bcd4",
    },
  },
});

const HomeRoute = () => {
  const { appRole } = useAuth();

  if (appRole === "org_admin") {
    return <MaintainerHomePage />;
  }

  return <HomePage />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
              path="/reset-password/confirm"
              element={<ConfirmResetPasswordPage />}
            />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="/" element={<BaseLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route
                path="register-org"
                element={
                  <ProtectedRoute allowedRoles={["super_admin"]}>
                    <RegisterOrgPage />
                  </ProtectedRoute>
                }
              />
              <Route path="reset-password" element={<ResetPasswordPage />} />
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
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
