export type NavItem = {
  label: string;
  path: string;
};

export const navConfig: NavItem[] = [
  { label: "Home", path: "/home" },
  { label: "Profile", path: "/profile" },
  { label: "User List", path: "/user-list" },
  { label: "Register Organization", path: "/register-org" },
];
