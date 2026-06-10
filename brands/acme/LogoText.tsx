import { Logo } from "./Logo";

export const LogoText = () => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        maxHeight: "2.5rem",
      }}
    >
      <span style={{ width: "2rem", height: "2rem", flexShrink: 0 }}>
        <Logo />
      </span>
      <span
        className="font-heading"
        style={{
          fontSize: "1.35rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "hsl(var(--sidebar-foreground))",
          whiteSpace: "nowrap",
        }}
      >
        Acme Connect
      </span>
    </span>
  );
};
