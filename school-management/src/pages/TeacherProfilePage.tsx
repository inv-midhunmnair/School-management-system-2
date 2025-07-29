import { useEffect, useState } from "react";
import axiosInstance from "../api/axios.interceptor";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { API_ENDPOINTS } from "../api/api.constants";

const TeacherProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    axiosInstance
      .get(API_ENDPOINTS.TEACHER_PROFILE)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  if (!profile)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" mt={2}>
            {profile.first_name} {profile.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.subject_specialization}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography color="text.secondary">Email:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.email}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">Phone:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.phone}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">Employee ID:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.employee_id}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">Date of Joining:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.date_of_joining}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">Status:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.status}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TeacherProfilePage;
