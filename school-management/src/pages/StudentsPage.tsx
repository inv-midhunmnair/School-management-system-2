import { useEffect, useState } from "react";
import axiosInstance from "../api/axios.interceptor";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from "@mui/material";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [count, setCount] = useState(0); // total pages

  const fetchStudents = async (pageNumber: number) => {
    try {
      const res = await axiosInstance.get(`/admin/students/?page=${pageNumber}`);
      setStudents(res.data.results);
      setCount(Math.ceil(res.data.count / 3)); // Assuming page size is 10
    } catch (err) {
      console.error("❌ Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Student List</Typography>
      <Paper>
        <List>
          {students.map((student: any) => (
            <ListItem key={student.id} alignItems="flex-start">
              <ListItemText
                primary={`${student.first_name} ${student.last_name}`}
                secondary={
                  <>
                    <div>Email: {student.email}</div>
                    <div>Phone: {student.phone}</div>
                    <div>Roll No: {student.roll_number}</div>
                    <div>Class: {student.student_class}</div>
                    <div>DOB: {student.date_of_birth}</div>
                    <div>Admission Date: {student.admission_date}</div>
                    <div>Status: {student.status}</div>
                    <div>Assigned Teacher: {student.assigned_teacher || "Not Assigned"}</div>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Pagination Component */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={count}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default StudentsPage;
