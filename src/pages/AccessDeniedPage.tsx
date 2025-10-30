import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
        textAlign="center"
      >
        <LockIcon sx={{ fontSize: 80, color: "error.main" }} />
        <Typography variant="h1" component="h1" sx={{ fontSize: "3rem" }}>
          403
        </Typography>
        <Typography variant="h5" component="h2">
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          You do not have permission to access this page. If you believe this is
          an error, please contact your administrator.
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go to Home
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
