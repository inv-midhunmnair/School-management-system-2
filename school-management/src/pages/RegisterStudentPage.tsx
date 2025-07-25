import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { registerStudent } from "../api/auth.api";

const RegisterStudentPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    roll_number: "",
    student_class: "",
    date_of_birth: "",
    admission_date: "",
    assigned_teacher: "",
    admission_number: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...formData,
      role: "student",
      status: "active",
    };

    try {
      await registerStudent(payload);
      setMessage("Student registered successfully!");
      setFormData({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        roll_number: "",
        student_class: "",
        date_of_birth: "",
        admission_date: "",
        assigned_teacher: "",
        admission_number: "",
      });
    } catch (err) {
      setError("Registration failed. Please check the input.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Register Student
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {[
            ["username", "Username"],
            ["password", "Password"],
            ["first_name", "First Name"],
            ["last_name", "Last Name"],
            ["email", "Email"],
            ["phone", "Phone Number"],
            ["roll_number", "Roll Number"],
            ["student_class", "Class"],
            ["admission_number", "Admission Number"],
            ["assigned_teacher", "Assigned Teacher ID"],
            ["date_of_birth", "Date of Birth"],
            ["admission_date", "Admission Date"],
          ].map(([name, label]) => (
            <Grid item xs={12} sm={6} key={name}>
             <TextField
              size="small"
              name={name}
              label={label}
              type={
                name === "password"
                  ? "password"
                  : name.includes("date")
                  ? "date"
                  : "text"
              }
  value={(formData as any)[name]}
  onChange={handleChange}
  fullWidth
  slotProps={{
    inputLabel: name.includes("date") ? { shrink: true } : {}
  }}
  required
/>

            </Grid>
          ))}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Register Student
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RegisterStudentPage;
