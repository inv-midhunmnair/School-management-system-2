import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Sidebar from "./Sidebar";

const drawerWidth = 240;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Topbar */}
        <AppBar
         position="fixed"
         sx={{
         zIndex: (theme) => theme.zIndex.drawer + 1, 
         ml: `${drawerWidth}px`,                      
         width: `calc(100% - ${drawerWidth}px)`,      
         backgroundColor: "#004687",
  }}
>

          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">School Management System</Typography>
            <Button
              color="inherit"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 8, p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
