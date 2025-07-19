import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Input,
} from '@mui/material';
import axiosInstance from '../api/axios.interceptor';

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
    setError('Please select a CSV file first');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosInstance.post('/admin/import/students/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { success, errors } = response.data;

    // Format backend error messages
    let formattedErrors = '';
    if (Array.isArray(errors) && errors.length > 0) {
      formattedErrors = errors
        .map((err: string) => {
          const match = err.match(/Row (\d+): '([^']+)'/);
          if (match) {
            const [, row, field] = match;
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            return `❌ Error on Row ${row}: ${fieldLabel} is missing or invalid.`;
          }
          return `❌ ${err}`;
        })
        .join('\n');
    }

    if (formattedErrors) {
      setSuccess(`${success || 'Some students imported successfully.'}`);
      setError(formattedErrors);
    } else {
      setSuccess(success || 'Students imported successfully!');
      setError(null);
    }

    setFile(null);
  } catch (err: any) {
    console.error(err);
    const raw = err.response?.data?.error || 'Failed to import students';
    setError(`❌ ${raw}`);
  }
};

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Import Students via CSV
      </Typography>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 500 }}>
        <Input
          type="file"
          inputProps={{ accept: '.csv' }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleUpload}
          disabled={!file}
        >
          Upload CSV
        </Button>
      </Paper>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ whiteSpace: 'pre-line' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportStudentsPage;
