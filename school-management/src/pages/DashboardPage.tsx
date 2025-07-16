import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={4} alignItems="center" mt={5}>
      <Typography variant="h4">Admin Dashboard</Typography>

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
    </Stack>
  );
};

export default DashboardPage;
