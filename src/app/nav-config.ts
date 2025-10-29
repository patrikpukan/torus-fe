export type NavItem = {
  label: string;
  path: string;
  roles?: string[]; // If undefined, visible to all
};

export const navConfig: NavItem[] = [
  // Accessible by all authenticated users
  {
    label: "Home",
    path: "/home",
    roles: ["user", "org_admin", "super_admin"],
  },
  {
    label: "Pairings",
    path: "/pairings",
    roles: ["user", "org_admin", "super_admin"],
  },
  {
    label: "Profile",
    path: "/profile",
    roles: ["user", "org_admin", "super_admin"],
  },
  {
    label: "Users",
    path: "/user-list",
    roles: ["user", "org_admin", "super_admin"],
  },

  // Admin only
  {
    label: "User Management",
    path: "/user-management",
    roles: ["org_admin", "super_admin"],
  },
  {
    label: "Algorithm Settings",
    path: "/algorithm-settings",
    roles: ["org_admin", "super_admin"],
  },

  // Super Admin only
  {
    label: "Register Organization",
    path: "/register-org",
    roles: ["super_admin"],
  },

  // Only for non-authenticated users (shown in auth pages)
];
