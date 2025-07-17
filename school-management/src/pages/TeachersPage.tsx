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

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [count, setCount] = useState(0); // total number of pages

  const fetchTeachers = async (pageNumber: number) => {
    try {
      const res = await axiosInstance.get(`/admin/teachers/?page=${pageNumber}`);
      setTeachers(res.data.results);
      setCount(Math.ceil(res.data.count / 10)); // Assuming page size is 10
    } catch (err) {
      console.error("❌ Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Teacher List</Typography>
      <Paper>
        <List>
          {teachers.map((teacher: any) => (
            <ListItem key={teacher.id} alignItems="flex-start">
              <ListItemText
                primary={`${teacher.first_name} ${teacher.last_name}`}
                secondary={
                  <>
                    <div>Email: {teacher.email}</div>
                    <div>Phone: {teacher.phone}</div>
                    <div>Employee ID: {teacher.employee_id}</div>
                    <div>Subject: {teacher.subject_specialization}</div>
                    <div>Joined: {teacher.date_of_joining}</div>
                    <div>Status: {teacher.status}</div>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Pagination Controls */}
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

export default TeachersPage;
