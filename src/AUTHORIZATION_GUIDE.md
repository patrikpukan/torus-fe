/\*\*

- AUTHORIZATION SYSTEM - Frontend Documentation
-
- This guide explains how to use role-based access control on the frontend.
-
- ## 3 Role Levels
-
- 1.  **user** - Regular user
- - Can access basic user features
- - Cannot access admin pages
-
- 2.  **org_admin** - Organization administrator
- - Can access admin pages for their organization
- - Can manage users and settings
- - Cannot access global admin pages
-
- 3.  **super_admin** - Super administrator
- - Can access everything, all organizations and all users
- - Full global access
-
- ## How It Works
-
- 1.  When user logs in, AuthProvider fetches `getCurrentUser` query
- 2.  `appRole` and `organizationId` are stored in AuthContext
- 3.  Use `useAuth()` hook to access role information
- 4.  Use `ProtectedRoute` wrapper to protect routes
- 5.  Use conditional rendering with `useAuth()` hook to show/hide UI elements
-
- ## Method 1: Route Protection with ProtectedRoute
-
- Redirect to /access-denied if user doesn't have required role.
-
- ```tsx

  ```
- import { ProtectedRoute } from "@/components/ProtectedRoute";
- import AdminPage from "@/pages/AdminPage";
-
- export function App() {
- return (
-     <Routes>
-       <Route
-         path="/admin"
-         element={
-           <ProtectedRoute allowedRoles={["org_admin", "super_admin"]}>
-             <AdminPage />
-           </ProtectedRoute>
-         }
-       />
-
-       <Route
-         path="/super-admin"
-         element={
-           <ProtectedRoute allowedRoles={["super_admin"]}>
-             <SuperAdminPage />
-           </ProtectedRoute>
-         }
-       />
-     </Routes>
- );
- }
- ```

  ```
-
- ## Method 2: Hook-Based Conditional Rendering
-
- Show/hide UI elements based on user role.
-
- ```tsx

  ```
- import { useAuth } from "@/hooks/useAuth";
-
- export function UserCard({ user }: { user: User }) {
- const { appRole } = useAuth();
-
- return (
-     <div>
-       <h2>{user.name}</h2>
-       {appRole === "org_admin" || appRole === "super_admin" && (
-         <button onClick={() => editUser(user.id)}>Edit</button>
-       )}
-     </div>
- );
- }
- ```

  ```
-
- ## Method 3: Role-Based Conditional Routes (in App.tsx)
-
- Show/hide entire sections based on role.
-
- ```tsx

  ```
- import { useAuth } from "@/hooks/useAuth";
- import { Navigate } from "react-router-dom";
-
- export function Navigation() {
- const { appRole } = useAuth();
-
- return (
-     <nav>
-       <Link to="/home">Home</Link>
-       {(appRole === "org_admin" || appRole === "super_admin") && (
-         <>
-           <Link to="/admin/users">Manage Users</Link>
-           <Link to="/admin/settings">Settings</Link>
-         </>
-       )}
-       {appRole === "super_admin" && (
-         <Link to="/super-admin/organizations">Organizations</Link>
-       )}
-     </nav>
- );
- }
- ```

  ```
-
- ## useAuth() Hook Reference
-
- Access user info and auth functions from anywhere:
-
- ```tsx

  ```
- const {
- appRole, // "user" | "org_admin" | "super_admin" | undefined
- organizationId, // string (org ID) | undefined
- session, // Supabase session
- user, // Supabase user
- loading, // boolean (whether auth is still loading)
- signIn, // (email, password) => Promise<void>
- signInWithGoogle, // () => Promise<void>
- signOut, // () => Promise<void>
- } = useAuth();
- ```

  ```
-
- ## Examples
-
- ### Example 1: Protect a Route
-
- ```tsx

  ```
- // In App.tsx
- <Route
- path="admin/users"
- element={
-     <ProtectedRoute allowedRoles={["org_admin", "super_admin"]}>
-       <UserManagementPage />
-     </ProtectedRoute>
- }
- />
- ```

  ```
-
- When a user without org_admin or super_admin role tries to access /admin/users,
- they are redirected to /access-denied page.
-
- ### Example 2: Show Edit Button Only for Admins
-
- ```tsx

  ```
- import { useAuth } from "@/hooks/useAuth";
-
- export function UserProfile({ user }: { user: User }) {
- const { appRole, organizationId } = useAuth();
- const isAdmin = appRole === "org_admin" || appRole === "super_admin";
-
- return (
-     <div>
-       <h1>{user.name}</h1>
-       {isAdmin && (
-         <button onClick={() => editUser(user.id)}>Edit User</button>
-       )}
-     </div>
- );
- }
- ```

  ```
-
- ### Example 3: Check for Specific Role
-
- ```tsx

  ```
- import { useAuth } from "@/hooks/useAuth";
-
- export function AdminPanel() {
- const { appRole, loading } = useAuth();
-
- if (loading) return <Spinner />;
-
- if (appRole === "super_admin") {
-     return <SuperAdminPanel />;
- }
-
- if (appRole === "org_admin") {
-     return <OrgAdminPanel />;
- }
-
- return <RegularUserPanel />;
- }
- ```

  ```
-
- ### Example 4: Show Navigation Links Based on Role
-
- ```tsx

  ```
- import { useAuth } from "@/hooks/useAuth";
-
- export function Navigation() {
- const { appRole } = useAuth();
- const isSuperAdmin = appRole === "super_admin";
- const isAdmin = appRole === "org_admin" || isSuperAdmin;
-
- return (
-     <nav>
-       <Link to="/home">Home</Link>
-       {isAdmin && <Link to="/admin/users">Users</Link>}
-       {isAdmin && <Link to="/admin/settings">Settings</Link>}
-       {isSuperAdmin && <Link to="/system/organizations">Organizations</Link>}
-     </nav>
- );
- }
- ```

  ```
-
- ## AccessDeniedPage
-
- When a user is redirected for insufficient permissions, they see the AccessDenied page at `/access-denied`.
- This page provides clear messaging and navigation options.
-
- You can customize it at: `src/pages/AccessDeniedPage.tsx`
-
- ## Important Notes
-
- - Always load role information from the server via `useGetCurrentUserQuery`
- - Don't rely only on JWT claims - they may be outdated
- - Always validate permissions on the backend too (never trust client-side checks)
- - `ProtectedRoute` checks happen after `loading` is false
- - If `loading` is true, `ProtectedRoute` shows nothing (no flash)
    \*/
