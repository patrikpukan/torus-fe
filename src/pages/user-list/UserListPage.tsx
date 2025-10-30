import UserListItem from "./components/UserListItem";
import { useUsersQuery } from "@/features/users/api/useUsersQuery";

const UserListPage = () => {
  const { data, loading, error } = useUsersQuery();
  const users = data?.users ?? [];

  return (
    <div className="container">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight mb-8">Users</h1>

        {loading && (
          <div className="rounded border border-muted-foreground/20 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Loading users…
          </div>
        )}

        {error && (
          <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load users: {error.message}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="rounded border border-muted-foreground/20 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            No users found.
          </div>
        )}

        <div className="space-y-2">
          {users.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
