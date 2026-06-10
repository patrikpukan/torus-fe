export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="acme-g" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Two interlocking rounded squares: "connection" mark */}
      <rect
        x="22"
        y="22"
        width="104"
        height="104"
        rx="28"
        fill="url(#acme-g)"
      />
      <rect
        x="74"
        y="74"
        width="104"
        height="104"
        rx="28"
        fill="url(#acme-g)"
        opacity="0.55"
      />
      <circle cx="100" cy="100" r="18" fill="#ffffff" />
    </svg>
  );
};
