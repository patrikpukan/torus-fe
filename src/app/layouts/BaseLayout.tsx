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
import { Home, LogIn, User, Users } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { navConfig } from "../nav-config";
import { Logo } from "./Logo";
import { LogoText } from "./LogoText";

const BaseLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
              <div className="w-full hidden group-data-[collapsible=icon]:block ">
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
                        {item.path === "/profile" && <User />}
                        {item.path === "/user-list" && <Users />}
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarSeparator />
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/login">
                      <LogIn />
                      <span>Login</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          <div className="px-2 py-1.5 text-xs text-sidebar-foreground/70">
            © {new Date().getFullYear()} Torus
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
