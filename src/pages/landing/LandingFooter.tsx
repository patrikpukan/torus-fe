import { Link, useNavigate } from "react-router-dom";
import { useBrand } from "@/branding";

export const LandingFooter = () => {
  const navigate = useNavigate();
  const { Logo, productName, companyName } = useBrand();

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8">
              <Logo />
            </div>
            <span className="font-heading text-lg font-bold">
              {productName}
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            {productName} pairs colleagues for meaningful 1:1s — building a
            stronger workplace culture with smart pairing.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Let&apos;s talk
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </button>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
