import type { ReactNode } from "react";
import {
  Home,
  Handshake,
  User,
  Users,
  Settings2,
  Building,
  Wrench,
  Mail,
  BarChart3,
} from "lucide-react";
export type NavItem = {
  label: string;
  path: string;
  roles?: string[]; // If undefined, visible to all
  icon?: ReactNode;
};

export const navConfig: NavItem[] = [
  // Accessible by all authenticated users
  {
    label: "Home",
    path: "/home",
    roles: ["user", "org_admin", "super_admin"],
    icon: <Home />,
  },
  {
    label: "Pairings",
    path: "/pairings",
    roles: ["user"],
    icon: <Handshake />,
  },
  {
    label: "Profile",
    path: "/profile",
    roles: ["user", "org_admin", "super_admin"],
    icon: <User />,
  },
  {
    label: "Users",
    path: "/user-list",
    roles: ["user"],
    icon: <Users />,
  },
  {
    label: "User Management",
    path: "/user-list",
    roles: ["org_admin", "super_admin"],
    icon: <Users />,
  },

  // Admin+ only
  {
    label: "Algorithm Settings",
    path: "/algorithm-settings",
    roles: ["org_admin"],
    icon: <Settings2 />,
  },
  {
    label: "Invite Management",
    path: "/invite-management",
    roles: ["org_admin"],
    icon: <Mail />,
  },
  {
    label: "Statistics",
    path: "/statistics",
    roles: ["org_admin", "super_admin"],
    icon: <BarChart3 />,
  },
  {
    label: "My Organization",
    path: "/my-org",
    roles: ["org_admin"],
    icon: <Building />,
  },

  // Super Admin+ only
  {
    label: "Register Organization",
    path: "/register-org",
    roles: ["super_admin"],
    icon: <Building />,
  },
  {
    label: "Organizations Management",
    path: "/organization-list",
    roles: ["super_admin"],
    icon: <Wrench />,
  },

  // Only for non-authenticated users (shown in auth pages)
];
