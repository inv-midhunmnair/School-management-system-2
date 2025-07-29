// src/pages/StudentProfilePage.tsx

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

const StudentProfilePage = () => {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    axiosInstance
      .get(API_ENDPOINTS.STUDENT_PROFILE)
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Failed to load student profile", err));
  }, []);

  if (!student)
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
            {student.first_name} {student.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Roll No: {student.roll_number}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography color="text.secondary">Email:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{student.email}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">Phone:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{student.phone}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">DOB:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{student.dob}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">Admission Date:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{student.admission_date}</Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography color="text.secondary">Class:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{student.student_class}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default StudentProfilePage;
