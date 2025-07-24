// src/pages/TeacherStudentsPage.tsx

import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Pagination,
  Box,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import axiosInstance from "../api/axios.interceptor";
import { API_ENDPOINTS } from "../api/api.constants";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  date_of_admission: string;
  roll_number: string;
  student_class: string;
}

const TeacherStudentsPage = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.TEACHER_STUDENTS);

        const studentsList = Array.isArray(response.data)
          ? response.data
          : response.data.students || response.data.assigned_students || [];

        setStudents(studentsList);
      } catch (error) {
        console.error("Failed to fetch assigned students", error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [token]);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Stack spacing={3} p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Assigned Students</Typography>
      </Box>

      {currentStudents.length > 0 ? (
        currentStudents.map((student) => (
          <Card key={student.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">
                {student.first_name} {student.last_name}
              </Typography>
              <Typography>Email: {student.email}</Typography>
              <Typography>Phone: {student.phone}</Typography>
              <Typography>Date of Birth: {student.date_of_birth}</Typography>
              <Typography>Date of Admission: {student.date_of_admission}</Typography>
              <Typography>Roll Number: {student.roll_number}</Typography>
              <Typography>Class: {student.student_class}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No students assigned yet.</Typography>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      )}
    </Stack>
  );
};

export default TeacherStudentsPage;
