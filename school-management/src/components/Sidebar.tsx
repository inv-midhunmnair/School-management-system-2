import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Register Teacher", path: "/register-teacher", icon: <PersonAddIcon /> },
    { label: "Register Student", path: "/register-student", icon: <SchoolIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#005A9C",
          color: "#fff",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          🏫 Admin Panel
        </Typography>
      </Toolbar>
      <Divider sx={{ backgroundColor: "#ffffff33" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
