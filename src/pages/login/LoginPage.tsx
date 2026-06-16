import { Link } from "react-router-dom";
import LoginForm from "../../features/auth/components/LoginForm";
import { useBrand } from "@/branding";

const LoginPage = () => {
  const { Logo, productName } = useBrand();

  return (
    <div className="bg-atmosphere flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/"
          aria-label={`Back to ${productName} home`}
          className="mb-8 flex items-center justify-center gap-2 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="h-9 w-9">
            <Logo />
          </div>
          <span className="font-heading text-lg font-bold">{productName}</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
