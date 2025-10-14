import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, NavLink } from "react-router-dom";

import { navConfig } from "../nav-config";
import logo from "../../assets/torus_logo.png";

const BaseLayout = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <AppBar position="static">
        <Container>
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box
              component={NavLink}
              to="/"
              sx={{ display: "inline-flex", alignItems: "center", mr: 2 }}
            >
              <Box
                component="img"
                src={logo}
                alt="Torus Logo"
                sx={{
                  height: 35,
                  backgroundColor: "white",
                  borderRadius: "4px",
                  px: 1.5,
                  py: 0.5,
                }}
              />
            </Box>
            <Box component="nav" display="flex" gap={2}>
              {navConfig.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={NavLink}
                  to={item.path}
                  sx={{
                    "&.active": {
                      borderBottom: "2px solid currentColor",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="outlined"
                color="inherit"
                component={NavLink}
                to="/login"
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{ mt: "auto", py: 2, backgroundColor: "grey.100" }}
      >
        <Container>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © {new Date().getFullYear()} Torus. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default BaseLayout;
