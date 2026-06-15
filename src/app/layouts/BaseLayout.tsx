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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  matchPath,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { navConfig } from "../nav-config";
import { useBrand } from "@/branding";
import { cn } from "@/lib/utils";

import { useAuth } from "@/hooks/useAuth";
import { formatUserDisplayName } from "@/lib/userDisplay";
import { normalizeAssetUrl } from "@/lib/assetUrl";
import { RatingModal } from "@/features/ratings/components/RatingModal";
import { useRatingModalTrigger } from "@/features/ratings/hooks/useRatingModalTrigger";

const BaseLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, appRole, currentUserData } = useAuth();
  const { meeting, isOpen, onClose, onSuccess } = useRatingModalTrigger();
  const { Logo, LogoText, companyName } = useBrand();

  const filteredNavConfig = navConfig.filter((item) => {
    // Check role restriction
    if (!item.roles) return true; // No role restriction
    return item.roles.includes(appRole || "");
  });

  const userDisplayName = useMemo(
    () =>
      formatUserDisplayName({ dbUser: currentUserData, supabaseUser: user }),
    [currentUserData, user]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  }, [navigate, signOut]);

  const isNavItemActive = useCallback(
    (path: string) => {
      const exactMatch = matchPath({ path, end: true }, location.pathname);
      const nestedMatch = matchPath({ path: `${path}/*` }, location.pathname);
      return Boolean(exactMatch || nestedMatch);
    },
    [location.pathname]
  );

  const dbUser = currentUserData;
  const profileImageUrl =
    normalizeAssetUrl(dbUser?.profileImageUrl) ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    "";
  const userRole = dbUser?.role || appRole || "";
  const userOrganization = dbUser?.organization?.name || "";
  const currentSection =
    filteredNavConfig.find((item) => isNavItemActive(item.path))?.label ?? "";

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
              <div className="w-full max-w-8 h-8 hidden group-data-[collapsible=icon]:block ">
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
                    <SidebarMenuButton
                      asChild
                      isActive={isNavItemActive(item.path)}
                    >
                      <NavLink to={item.path}>
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          {user ? (
            <div className="flex items-center gap-2 p-1.5">
              <NavLink
                to="/profile"
                aria-label="Open your profile"
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-md p-1.5 text-left transition hover:bg-sidebar-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  !sidebarOpen && "flex-none"
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={profileImageUrl} />
                  <AvatarFallback>
                    {user?.email?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-sidebar-foreground">
                      {userDisplayName}
                    </span>
                    {userRole && (
                      <span className="truncate text-xs capitalize text-sidebar-foreground/60">
                        {userRole.replace(/_/g, " ")}
                      </span>
                    )}
                    {userOrganization && (
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {userOrganization}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
              {sidebarOpen && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  aria-label="Log out"
                  title="Log out"
                  className="shrink-0 rounded-md p-2 text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : null}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          {currentSection && (
            <span className="font-heading text-sm font-semibold tracking-tight">
              {currentSection}
            </span>
          )}
          {userOrganization && (
            <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">
              {userOrganization}
            </span>
          )}
        </div>
        <div className="container mx-auto flex-1 p-4 md:p-6">
          <Outlet />
        </div>
        <footer className="mt-auto border-t bg-muted/30">
          <div className="container mx-auto py-3 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </div>
        </footer>
      </SidebarInset>
      <RatingModal
        meeting={meeting}
        open={isOpen}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </SidebarProvider>
  );
};

export default BaseLayout;
