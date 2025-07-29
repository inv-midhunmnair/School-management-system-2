import { useEffect, useState } from "react";
import axiosInstance from "../api/axios.interceptor";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Pagination,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  roll_number: string;
  student_class: string;
  date_of_birth: string;
  admission_date: string;
  status: string;
  assigned_teacher: string | null;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});

  const fetchStudents = async (pageNumber: number) => {
    try {
      const res = await axiosInstance.get(
        `/admin/students/?page=${pageNumber}`
      );
      setStudents(res.data.results);
      setCount(Math.ceil(res.data.count / 3));
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      alert("Failed to load students.");
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
  };

  const handleClose = () => {
    setEditingStudent(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingStudent) return;

    try {
      await axiosInstance.put(
        `/admin/students/${editingStudent.id}/`,
        formData
      );
      alert("Student updated successfully.");
      fetchStudents(page);
      handleClose();
    } catch (err) {
      console.error("❌ Failed to update student:", err);
      alert("Failed to update student.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Student Directory
      </Typography>

      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card elevation={3}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" color="primary">
                    {student.first_name} {student.last_name}
                  </Typography>
                  <Tooltip title="Edit Student">
                    <IconButton
                      onClick={() => handleEdit(student)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

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
                  <strong>DOB:</strong> {student.date_of_birth}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Admission:</strong> {student.admission_date}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Status:</strong> {student.status}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Teacher:</strong>{" "}
                  {student.assigned_teacher || "Not Assigned"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={count}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Edit Modal */}
      <Dialog
        open={Boolean(editingStudent)}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                value={formData.first_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                value={formData.last_name || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="roll_number"
                label="Roll Number"
                fullWidth
                value={formData.roll_number || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="student_class"
                label="Class"
                fullWidth
                value={formData.student_class || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date_of_birth || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="admission_date"
                label="Admission Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.admission_date || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="status"
                label="Status"
                fullWidth
                value={formData.status || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="assigned_teacher"
                label="Assigned Teacher"
                fullWidth
                value={formData.assigned_teacher || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
