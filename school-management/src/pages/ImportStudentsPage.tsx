import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  TextField,
  Stack,
} from "@mui/material";
import axiosInstance from "../api/axios.interceptor";
import { API_ENDPOINTS } from "../api/api.constants";

const ImportStudentsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.STUDENT_IMPORTS,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { success, errors } = response.data;

      let formattedErrors = "";
      if (Array.isArray(errors) && errors.length > 0) {
        formattedErrors = errors
          .map((err: string) => {
            const match = err.match(/Row (\d+): '([^']+)'/);
            if (match) {
              const [, row, field] = match;
              const fieldLabel = field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
              return `❌ Error on Row ${row}: ${fieldLabel} is missing or invalid.`;
            }
            return `❌ ${err}`;
          })
          .join("\n");
      }

      if (formattedErrors) {
        setSuccess(`${success || "Some students imported successfully."}`);
        setError(formattedErrors);
      } else {
        setSuccess(success || "Students imported successfully!");
        setError(null);
      }

      setFile(null);
    } catch (err: any) {
      console.error(err);
      const raw = err.response?.data?.error || "Failed to import students";
      setError(`❌ ${raw}`);
    }
  };

  return (
    <Box
      p={2}
      mt={-16}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" textAlign="center" mb={2}>
          📥 Import Students from CSV
        </Typography>

        <Stack spacing={2}>
          <Button
            component="label"
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            {file ? `✅ Selected: ${file.name}` : "📁 Choose CSV File"}
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileChange}
            />
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file}
            sx={{ textTransform: "none" }}
          >
            Upload & Import
          </Button>
        </Stack>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ whiteSpace: "pre-line" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportStudentsPage;
