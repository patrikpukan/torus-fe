import UserListItem from "./components/UserListItem";

import { userList } from "../../mocks/userList";
import type { UserProfile } from "../../types/User";

const UserListPage = () => {
  return (
    <div className="container py-4">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          User Directory
        </h1>

        <div className="space-y-2">
          {userList.map((user: UserProfile) => (
            <UserListItem key={user.email} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
