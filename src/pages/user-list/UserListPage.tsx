import AdminUserTable from "./components/AdminUserTable";
import PairedUsersView from "./components/PairedUsersView";
import { useAuth } from "@/hooks/useAuth";

const UserListPage = () => {
  const { appRole, loading } = useAuth();

  if (loading && !appRole) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  const isAdmin = appRole === "org_admin" || appRole === "super_admin";

  return isAdmin ? <AdminUserTable /> : <PairedUsersView />;
};

export default UserListPage;
