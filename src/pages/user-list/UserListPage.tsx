import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { userList } from "../../mocks/userList";
import type { UserProfile } from "../../types/User";

const UserListPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">
          User Directory
        </Typography>

        <Stack spacing={2}>
          {userList.map((user: UserProfile) => (
            <Paper key={user.email} sx={{ p: 2 }} elevation={1}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">
                    {user.name} {user.surname}
                  </Typography>
                  <Typography color="text.secondary">
                    {user.organization}
                  </Typography>
                  <Typography color="text.secondary">
                    Pairing Status: {user.pairingStatus}
                  </Typography>
                </Stack>

                <Button variant="outlined" size="small">
                  View Profile
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

export default UserListPage;
