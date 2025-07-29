import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Pagination,
  Divider,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../api/axios.interceptor";
import { API_ENDPOINTS } from "../api/api.constants";

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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 6;

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.STUDENT_TEACHERS
        );
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
  }, []);

  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = teachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(teachers.length / teachersPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Assigned Teachers
      </Typography>

      <Grid container spacing={3}>
        {currentTeachers.length > 0 ? (
          currentTeachers.map((teacher) => (
            <Grid item xs={12} sm={6} md={4} key={teacher.id}>
              <Card elevation={4} sx={{ minHeight: 220 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {teacher.first_name} {teacher.last_name}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                  >
                    <strong>Email:</strong> {teacher.email}
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                  >
                    <strong>Phone:</strong> {teacher.phone}
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                  >
                    <strong>Employee ID:</strong> {teacher.employee_id}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Subject:</strong> {teacher.subject_specialization}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography color="textSecondary" textAlign="center">
              No teacher assigned yet.
            </Typography>
          </Grid>
        )}
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

export default StudentTeacherPage;
