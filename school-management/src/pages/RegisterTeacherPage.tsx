// src/pages/RegisterTeacherPage.tsx
import { useState } from "react";
import { registerTeacher } from "../api/auth.api";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Alert,
} from "@mui/material";

const RegisterTeacherPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    employee_id: "",
    subject_specialization: "",
    date_of_joining: "",
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
      role: "teacher",
      status: "active",
    };

    try {
      await registerTeacher(payload);
      setMessage("Teacher registered successfully!");
      setFormData({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        employee_id: "",
        subject_specialization: "",
        date_of_joining: "",
      });
    } catch (err: any) {
      setError("Registration failed. Please check your input.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Register Teacher
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} mt={1}>
          {[
            ["username", "Username"],
            ["password", "Password"],
            ["first_name", "First Name"],
            ["last_name", "Last Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["employee_id", "Employee ID"],
            ["subject_specialization", "Subject"],
            ["date_of_joining", "Date of Joining"],
          ].map(([name, label]) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
              size="small"
                name={name}
                label={label}
                type={name === "password" ? "password" : name === "date_of_joining" ? "date" : "text"}
                value={(formData as any)[name]}
                onChange={handleChange}
                fullWidth
                InputLabelProps={name === "date_of_joining" ? { shrink: true } : {}}
                required
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Register Teacher
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RegisterTeacherPage;
