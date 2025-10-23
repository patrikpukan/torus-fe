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
import { Handshake, Home, LogIn, LogOut, User, Users } from "lucide-react";
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
import { useAuth } from "@/features/auth/context/AuthProvider";

const BaseLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userDisplayName = (() => {
    if (!user) {
      return "Signed out";
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
        typeof part === "string" && part.trim().length > 0,
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

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar collapsible="icon">
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
                {navConfig.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.path}>
                        {item.path === "/home" && <Home />}
                        {item.path === "/pairings" && <Handshake />}
                        {item.path === "/profile" && <User />}
                        {item.path === "/user-list" && <Users />}
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
          <div className="px-2 py-1.5 text-xs text-sidebar-foreground/70">
            {sidebarOpen && (
              <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                <div className="max-w-10">
                  <Avatar>
                    <AvatarImage src={user?.user_metadata?.avatar_url ?? ""} />
                    <AvatarFallback>
                      {user?.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {userDisplayName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email ?? ""}
                  </span>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="max-w-10">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url ?? ""} />
                  <AvatarFallback>
                    {user?.email?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-background px-3">
          <SidebarTrigger />
          <div className="ml-auto" />
        </div>
        <div className="container mx-auto flex-1 p-4">
          <Outlet />
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
