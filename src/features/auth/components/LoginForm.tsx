import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { NavLink, Link as RouterLink } from "react-router-dom";

const LoginForm = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" textAlign="center">
          Log in
        </Typography>

        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography
              component="label"
              htmlFor="login-username-email"
              variant="body2"
              fontWeight={600}
            >
              Email:
            </Typography>
            <TextField
              id="login-username-email"
              name="username"
              autoComplete="username"
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography
              component="label"
              htmlFor="login-password"
              variant="body2"
              fontWeight={600}
            >
              Password
            </Typography>
            <TextField
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              fullWidth
            />
          </Stack>

          <Box sx={{display: "flex", flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant="body2">
              Forgot password?
            </Typography>
            <Link
              component={RouterLink}
              to="/reset-password"
              variant="body2"
              textAlign="center"
              sx={{ ml: 1 }}
            >
              Click here
            </Link>
          </Box>
        </Stack>

        <Stack spacing={1}>
          <Button variant="contained" color="primary" fullWidth component={NavLink} to="/">
            Log in
          </Button>
          <Button variant="outlined" color="primary" fullWidth>
            Log in with Google Account
          </Button>
          <Button variant="outlined" color="primary" fullWidth component={NavLink} to="/register">
            Register via invite code
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default LoginForm;
