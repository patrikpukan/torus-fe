import LoginForm from "../../features/auth/components/LoginForm";
import { AuthLayout } from "../../features/auth/components/AuthLayout";

const LoginPage = () => (
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
);

export default LoginPage;
