import AdminUserTable from "./components/AdminUserTable";
import PairedUsersView from "./components/PairedUsersView";
import AdminUserListPage from "./AdminUserListPage";
import { useAuth } from "@/hooks/useAuth";

const UserListPage = () => {
  const { appRole, loading, organizationId } = useAuth();

  if (loading && !appRole) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  if (appRole === "super_admin") {
    return <AdminUserListPage />;
  }

  if (appRole === "org_admin") {
    return <AdminUserTable organizationId={organizationId ?? undefined} />;
  }

  return <PairedUsersView />;
};

export default UserListPage;
