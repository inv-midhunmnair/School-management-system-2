import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Pagination,
  Stack,
} from "@mui/material";
import axiosInstance from "../api/axios.interceptor";
import { useAuth } from "../auth/AuthContext";

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employee_id: string;
  subject_specialization: string;
}

const StudentTeacherPage = () => {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 5;

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axiosInstance.get("/student/teacher", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Handle both single object or array response
        const data = response.data;
        const teacherList = Array.isArray(data) ? data : data ? [data] : [];
        setTeachers(teacherList);
      } catch (error) {
        console.error("Failed to fetch teacher:", error);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [token]);

  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = teachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(teachers.length / teachersPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assigned Teacher
      </Typography>

      <Stack spacing={2}>
        {currentTeachers.length > 0 ? (
          currentTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent>
                <Typography variant="h6">
                  Name: {teacher.first_name} {teacher.last_name}
                </Typography>
                <Typography>Email: {teacher.email}</Typography>
                <Typography>Phone: {teacher.phone}</Typography>
                <Typography>Employee ID: {teacher.employee_id}</Typography>
                <Typography>Subject: {teacher.subject_specialization}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No teacher assigned yet.</Typography>
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
    </Container>
  );
};

export default StudentTeacherPage;
