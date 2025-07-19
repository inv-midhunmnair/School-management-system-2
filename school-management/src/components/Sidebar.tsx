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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import UploadFileIcon from "@mui/icons-material/UploadFile"; // ✅ Import icon for CSV
import { useAuth } from "../auth/AuthContext";
import type { JSX } from "react/jsx-runtime";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const commonItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  ];

  const adminItems = [
    { label: "Register Teacher", path: "/register-teacher", icon: <PersonAddIcon /> },
    { label: "Register Student", path: "/register-student", icon: <SchoolIcon /> },
    { label: "Teachers", path: "/teachers", icon: <GroupIcon /> },
    { label: "Students", path: "/students", icon: <SchoolIcon /> },
    { label: "Import Students", path: "/import-students", icon: <UploadFileIcon /> }, // ✅ Added CSV Import here
  ];

  const teacherItems = [
    { label: "My Profile", path: "/teacher/profile", icon: <AccountCircleIcon /> },
    { label: "Students", path: "/teacher/students", icon: <GroupIcon /> },
  ];

  const studentItems = [
    { label: "My Profile", path: "/student/profile", icon: <AccountCircleIcon /> },
    { label: "My Teacher", path: "/student/teacher", icon: <SupervisorAccountIcon /> },
  ];

  let roleItems: { label: string; path: string; icon: JSX.Element }[] = [];
  if (role === "admin") roleItems = adminItems;
  else if (role === "teacher") roleItems = teacherItems;
  else if (role === "student") roleItems = studentItems;

  const menuItems = [...commonItems, ...roleItems];

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
          🏫 School Panel
        </Typography>
      </Toolbar>
      <Divider sx={{ backgroundColor: "#ffffff33" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{ "&:hover": { backgroundColor: "#1565c0" } }}
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
