import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Pagination,
  Divider,
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
  const studentsPerPage = 6;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.TEACHER_STUDENTS
        );
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
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Assigned Students
      </Typography>

      <Grid container spacing={3}>
        {currentStudents.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {student.first_name} {student.last_name}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>Email:</strong> {student.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Phone:</strong> {student.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Roll No:</strong> {student.roll_number}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Class:</strong> {student.student_class}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Date of Birth:</strong> {student.date_of_birth}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Admission Date:</strong> {student.date_of_admission}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default TeacherStudentsPage;
