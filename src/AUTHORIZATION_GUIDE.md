# Authorization System (Frontend)

Role-based access control is driven by the current user record returned from the backend.

## Roles

- `user` – basic user features, no admin access
- `org_admin` – admin pages for their organization (manage users/settings)
- `super_admin` – full global access across organizations

## Data flow

1. After sign-in, `AuthProvider` runs the `getCurrentUser` query.
2. `appRole` and `organizationId` are stored in `AuthContext`.
3. Use `useAuth()` to read `appRole`/`organizationId`.
4. Use `ProtectedRoute` to gate routes; use conditional rendering for UI elements.

## Protect a route

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminPage from "@/pages/AdminPage";

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["org_admin", "super_admin"]}>
      <AdminPage />
    </ProtectedRoute>
  }
/>;
```

## Conditionally render UI

```tsx
import { useAuth } from "@/hooks/useAuth";

export function UserCard({ user }: { user: User }) {
  const { appRole } = useAuth();
  const isAdmin = appRole === "org_admin" || appRole === "super_admin";

  return (
    <div>
      <h2>{user.name}</h2>
      {isAdmin && <button onClick={() => editUser(user.id)}>Edit</button>}
    </div>
  );
}
```

## Role-based navigation

```tsx
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const { appRole } = useAuth();
  const isSuperAdmin = appRole === "super_admin";
  const isAdmin = isSuperAdmin || appRole === "org_admin";

  return (
    <nav>
      <Link to="/home">Home</Link>
      {isAdmin && <Link to="/admin/users">Users</Link>}
      {isAdmin && <Link to="/admin/settings">Settings</Link>}
      {isSuperAdmin && <Link to="/system/organizations">Organizations</Link>}
    </nav>
  );
}
```

## Notes

- Always read role info from the backend (`useGetCurrentUserQuery`), not only JWT claims.
- Backend authorization still applies; frontend checks are for UX only.
- `ProtectedRoute` waits until `loading` is false before redirecting to `/access-denied`.
