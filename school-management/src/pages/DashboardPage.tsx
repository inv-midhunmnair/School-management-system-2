import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const getWelcomeMessage = () => {
    if (role === "admin") return "Welcome, Admin";
    if (role === "teacher") return "Welcome, Teacher";
    if (role === "student") return "Welcome, Student";
  };

  return (
    <Stack spacing={4} alignItems="center" mt={5}>
      <Typography variant="h4">{getWelcomeMessage()}</Typography>

      {role === "admin" && (
        <Stack direction="row" spacing={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/register-teacher")}
          >
            Register Teacher
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/register-student")}
          >
            Register Student
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default DashboardPage;
