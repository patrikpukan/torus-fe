import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/home/HomePage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/login/LoginPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProfileEditPage from "../pages/profile/ProfileEditPage";
import PairingsRoute from "../pages/pairings/PairingsRoute";
import RegisterOrgPage from "../pages/register-org/RegisterOrgPage";
import RegisterPage from "../pages/register/RegisterPage";
import ResetPasswordPage from "../pages/reset-password/ResetPasswordPage";
import ConfirmResetPasswordPage from "../pages/reset-password/ConfirmResetPasswordPage";
import AuthCallbackPage from "../pages/auth/AuthCallbackPage";
import UserDetailPage from "../pages/user-list/UserDetailPage";
import UserListPage from "../pages/user-list/UserListPage";
import OrganizationListPage from "../pages/organization-list/OrganizationListPage";
import OrganizationDetailPage from "../pages/organization-list/OrganizationDetailPage";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import BaseLayout from "./layouts/BaseLayout";
import { Toaster } from "@/components/ui/toaster";
import { AlgorithmSettingsPage } from "@/features/pairing-algorithm/pages/AlgorithmSettingsPage";
import InviteManagementPage from "@/pages/invite-management/InviteManagementPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Role shortcuts for route protection
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
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
                  <HomePage />
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
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
