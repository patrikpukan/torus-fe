import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/home/HomePage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/login/LoginPage";
import ProfilePage from "../pages/profile/ProfilePage";
import PairingsRoute from "../pages/pairings/PairingsRoute";
import RegisterOrgPage from "../pages/register-org/RegisterOrgPage";
import RegisterPage from "../pages/register/RegisterPage";
import ResetPasswordPage from "../pages/reset-password/ResetPasswordPage";
import UserDetailPage from "../pages/user-list/UserDetailPage";
import UserListPage from "../pages/user-list/UserListPage";
import BaseLayout from "./layouts/BaseLayout";

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
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="register-org" element={<RegisterOrgPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="user-list" element={<UserListPage />} />
            <Route path="user-list/:email" element={<UserDetailPage />} />
            <Route path="pairings">
              <Route index element={<PairingsRoute />} />
              <Route path=":id" element={<PairingsRoute />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
