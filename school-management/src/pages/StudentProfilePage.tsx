// src/pages/StudentProfilePage.tsx

import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Stack } from "@mui/material";
import axiosInstance from "../api/axios.interceptor";
import { useAuth } from "../auth/AuthContext";

interface StudentProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  admission_date: string;
  roll_number: string;
  student_class: string;
}

const StudentProfilePage = () => {
  const { token } = useAuth();
  const [student, setStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await axiosInstance.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(response.data);
      } catch (error) {
        console.error("Failed to fetch student profile", error);
      }
    };

    fetchStudentProfile();
  }, [token]);

  if (!student) {
    return <Typography>Loading your profile...</Typography>;
  }

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
