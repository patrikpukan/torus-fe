import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogIn, LogOut } from "lucide-react";
import { useCallback, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { navConfig } from "../nav-config";
import { Logo } from "./Logo";
import { LogoText } from "./LogoText";

import { useAuth } from "@/hooks/useAuth";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";

const BaseLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, signOut, appRole } = useAuth();
  const { data: currentUserData } = useGetCurrentUserQuery();

  const filteredNavConfig = navConfig.filter((item) => {
    // Check role restriction
    if (!item.roles) return true; // No role restriction
    return item.roles.includes(appRole || "");
  });

  const userDisplayName = (() => {
    if (!user) {
      return "Signed out";
    }

    const dbUser = currentUserData?.getCurrentUser;
    if (dbUser?.firstName || dbUser?.lastName) {
      const parts = [dbUser?.firstName, dbUser?.lastName].filter(
        (part): part is string =>
          typeof part === "string" && part.trim().length > 0
      );
      if (parts.length > 0) {
        return parts.join(" ");
      }
    }

    const fullName = user.user_metadata?.full_name;
    if (typeof fullName === "string" && fullName.trim().length > 0) {
      return fullName;
    }

    const parts = [
      user.user_metadata?.first_name,
      user.user_metadata?.last_name,
    ].filter(
      (part): part is string =>
        typeof part === "string" && part.trim().length > 0
    );

    if (parts.length > 0) {
      return parts.join(" ");
    }

    return user.email ?? "Signed out";
  })();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  }, [navigate, signOut]);

  const apiBaseFromGraphQL = (() => {
    const gql = import.meta.env.VITE_GRAPHQL_API as string | undefined;
    if (!gql) return undefined;
    try {
      const u = new URL(gql);
      if (u.pathname.endsWith("/graphql")) {
        u.pathname = u.pathname.replace(/\/graphql$/, "");
      }
      return u.toString().replace(/\/$/, "");
    } catch {
      return undefined;
    }
  })();

  const normalizeUrl = (src?: string | null): string => {
    if (!src) return "";
    if (/^blob:/i.test(src)) return ""; // stale local preview; ignore
    if (/^https?:\/\//i.test(src)) return src;
    const base =
      (import.meta.env.VITE_API_BASE as string | undefined) ??
      apiBaseFromGraphQL;
    if (!base) return src;
    if (src.startsWith("/")) return `${base}${src}`;
    return `${base}/${src}`;
  };

  const dbUser = currentUserData?.getCurrentUser;
  const profileImageUrl =
    normalizeUrl(dbUser?.profileImageUrl) ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    "";
  const userRole = dbUser?.role || appRole || "";
  const userOrganization = dbUser?.organization?.name || "";

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar className="text-foreground" collapsible="icon">
        <SidebarHeader>
          <NavLink to="/" className="flex items-center gap-2 px-2 py-1.5 ">
            {sidebarOpen && (
              <div className="w-full group-data-[collapsible=icon]:hidden">
                <LogoText />
              </div>
            )}
            {!sidebarOpen && (
              <div className="w-full max-w-10 hidden group-data-[collapsible=icon]:block ">
                <Logo />
              </div>
            )}
          </NavLink>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {/* <SidebarGroupLabel>Main</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavConfig.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.path}>
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarSeparator />
                <SidebarMenuItem>
                  {user ? (
                    <SidebarMenuButton onClick={handleSignOut}>
                      <LogOut />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to="/login">
                        <LogIn />
                        <span>Login</span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          {user ? (
            <div className="px-2 py-1.5 text-xs text-sidebar-foreground/70">
              {sidebarOpen && (
                <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                  <div className="max-w-10">
                    <Avatar>
                      <AvatarImage src={profileImageUrl} />
                      <AvatarFallback>
                        {user?.email?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{userDisplayName}</span>
                    {userRole && (
                      <span className="text-xs text-muted-foreground capitalize">
                        {userRole.replace(/_/g, " ")}
                      </span>
                    )}
                    {userOrganization && (
                      <span className="text-xs text-muted-foreground">
                        {userOrganization}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {!sidebarOpen && (
                <div className="max-w-10">
                  <Avatar>
                    <AvatarImage src={profileImageUrl} />
                    <AvatarFallback>
                      {user?.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ) : null}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b px-3 bg-muted/40">
          <SidebarTrigger />
          <div className="ml-auto" />
        </div>
        <div className="container mx-auto flex-1 p-4">
          <div className="rounded-xl bg-muted/35 text-card-foreground border border-border shadow-sm p-6 min-h-[80vh]">
            <Outlet />
          </div>
        </div>
        <footer className="mt-auto border-t bg-muted/30">
          <div className="container mx-auto py-3 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Torus. All rights reserved.
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BaseLayout;
