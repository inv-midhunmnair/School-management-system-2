// src/pages/StudentProfilePage.tsx
import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Stack } from "@mui/material";
import axiosInstance from "../api/axios.interceptor";
import { API_ENDPOINTS } from "../api/api.constants";

const StudentProfilePage = () => {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    axiosInstance.get(API_ENDPOINTS.STUDENT_PROFILE)
      .then(res => setStudent(res.data))
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  if (!student) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={2} p={4}>
      <Typography variant="h5">My Profile</Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography>Name: {student.first_name} {student.last_name}</Typography>
          <Typography>Email: {student.email}</Typography>
          <Typography>Phone: {student.phone}</Typography>
          <Typography>DOB: {student.dob}</Typography>
          <Typography>Admission Date: {student.admission_date}</Typography>
          <Typography>Roll Number: {student.roll_number}</Typography>
          <Typography>Class: {student.student_class}</Typography>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default StudentProfilePage;
