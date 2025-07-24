import { useEffect, useState } from "react";
import axiosInstance from "../api/axios.interceptor";
import { Box, Typography, Paper } from "@mui/material";
import { API_ENDPOINTS } from "../api/api.constants";

const TeacherProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    axiosInstance.get(API_ENDPOINTS.TEACHER_PROFILE)
      .then(res => setProfile(res.data))
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Your Profile</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Name: {profile.first_name} {profile.last_name}</Typography>
        <Typography>Email: {profile.email}</Typography>
        <Typography>Phone: {profile.phone}</Typography>
        <Typography>Employee ID: {profile.employee_id}</Typography>
        <Typography>Subject: {profile.subject_specialization}</Typography>
        <Typography>Date of Joining: {profile.date_of_joining}</Typography>
        <Typography>Status: {profile.status}</Typography>
      </Paper>
    </Box>
  );
};

export default TeacherProfilePage;
