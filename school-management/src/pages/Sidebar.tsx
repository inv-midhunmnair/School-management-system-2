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
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GradeIcon from "@mui/icons-material/Grade";
import { useAuth } from "../auth/AuthContext";
import type { JSX } from "react/jsx-runtime";

const drawerWidth = 200;

const Sidebar = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const commonItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  ];

  const adminItems = [
    {
      label: "Add Teacher",
      path: "/register-teacher",
      icon: <PersonAddIcon />,
    },
    {
      label: "Add Student",
      path: "/register-student",
      icon: <SchoolIcon />,
    },
    { label: "Teachers", path: "/teachers", icon: <GroupIcon /> },
    { label: "Students", path: "/students", icon: <SchoolIcon /> },
    {
      label: "Import Students",
      path: "/import-students",
      icon: <UploadFileIcon />,
    },
  ];

  const teacherItems = [
    {
      label: "My Profile",
      path: "/teacher/profile",
      icon: <AccountCircleIcon />,
    },
    { label: "Students", path: "/teacher/students", icon: <GroupIcon /> },
    {
      label: "Create Exam",
      path: "/teacher/create-exam",
      icon: <UploadFileIcon />,
    },
  ];

  const studentItems = [
    {
      label: "My Profile",
      path: "/student/profile",
      icon: <AccountCircleIcon />,
    },
    {
      label: "My Teacher",
      path: "/student/teacher",
      icon: <SupervisorAccountIcon />,
    },
    { label: "My Exams", path: "/exams/student/exams", icon: <SchoolIcon /> },
    { label: "My Scores", path: "/student/scores", icon: <GradeIcon /> },
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
          backgroundColor: "#0A1929", // Deep blue-black
          color: "#fff",
          paddingX: 1,
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 2 }}></Toolbar>

      <Divider sx={{ backgroundColor: "#0A1929", marginBottom: 1 }} />

      <Box sx={{ px: 1 }}>
        <Typography variant="caption" sx={{ color: "#90caf9", pl: 2 }}>
          Navigation
        </Typography>
      </Box>

      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2, mt: 2, textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#90caf9" }}>
          Logged in as: <strong>{role?.toUpperCase()}</strong>
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
